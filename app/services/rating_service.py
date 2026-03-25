import hashlib
from datetime import datetime, timezone
from uuid import UUID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.backends import default_backend
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession 

from models.ratings import Rating  

class RatingService:
    # 1. توليد المفاتيح (يبقى كما هو)
    def generate_voter_keypair(self) -> tuple[bytes, bytes]:
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend(),
        )
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        )
        public_pem = private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )
        return public_pem, private_pem

    # 2. إنشاء معرف التصويت (يبقى كما هو لضمان عدم تكرار التصويت)
    def build_vote_identity_hash(self, public_key_pem: bytes, prof_id: UUID, salt: str) -> str:
        raw = public_key_pem + str(prof_id).encode() + salt.encode()
        return hashlib.sha256(raw).hexdigest()

    # 3. حساب الـ Hash للكتلة (بدون Nonce)
    def _compute_block_hash(self, prof_id: UUID, rate: float, timestamp: str, 
                             vote_identity_hash: str, previous_hash: str) -> str:
        # هنا دمجنا البيانات الأساسية فقط لإنشاء بصمة فريدة للكتلة
        payload = f"{prof_id}{rate}{timestamp}{vote_identity_hash}{previous_hash}"
        return hashlib.sha256(payload.encode()).hexdigest()

    # 4. التوقيع الرقمي
    def sign_rating(self, private_key_pem: bytes, block_hash: str) -> bytes:
        private_key = serialization.load_pem_private_key(
            private_key_pem, password=None, backend=default_backend()
        )
        return private_key.sign(
            block_hash.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH,
            ),
            hashes.SHA256(),
        )

    # 5. جلب آخر Hash (لربط السلسلة)
    async def get_last_block_hash(self, session: AsyncSession, prof_id: UUID) -> str:
        stmt = (
            select(Rating)
            .filter(Rating.prof_id == prof_id)
            .order_by(Rating.id.desc())
        )
        result = await session.execute(stmt)
        last = result.scalars().first()
        if last is None:
            return hashlib.sha256(f"GENESIS-{prof_id}".encode()).hexdigest()
        return last.block_hash

    # 6. إضافة التقييم (تم تحديثها لإزالة الـ PoW)
    async def add_rating(self,
        session: AsyncSession,
        prof_id: UUID,
        rate: float,
        public_key_pem: bytes,
        private_key_pem: bytes,
        salt: str,
    ) -> Rating:
        if rate < 1.0 or rate > 5.0:
            raise HTTPException(status_code=422, detail="rate must be between 1 and 5")

        vote_identity_hash = self.build_vote_identity_hash(public_key_pem, prof_id, salt)

        # منع التكرار
        stmt = select(Rating).filter(
            Rating.prof_id == prof_id,
            Rating.vote_identity_hash == vote_identity_hash,
        )
        result = await session.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(status_code=422, detail="Duplicate vote detected.")

        # ربط السلسلة
        previous_hash = await self.get_last_block_hash(session, prof_id)
        now = datetime.now(timezone.utc)
        timestamp_str = now.isoformat()

        # حساب الـ Hash (بدون تعدين، السيرفر يحسبه مباشرة)
        block_hash = self._compute_block_hash(
            prof_id, rate, timestamp_str, vote_identity_hash, previous_hash
        )

        # التوقيع
        _signature = self.sign_rating(private_key_pem, block_hash)

        # الحفظ في قاعدة البيانات (لاحظ إزالة الـ nonce)
        new_rating = Rating(
            vote_identity_hash=vote_identity_hash,
            prof_id=prof_id,
            rate=rate,
            timestamp=now,
            previous_hash=previous_hash,
            block_hash=block_hash,

        )
        session.add(new_rating)
        await session.commit()
        await session.refresh(new_rating)
        return new_rating
