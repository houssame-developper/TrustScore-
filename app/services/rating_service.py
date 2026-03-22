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

    # ──────────────────────────────────────────────
    # 1.  KEY GENERATION  (call once per user/voter)
    # ──────────────────────────────────────────────
class RatingService:
    def generate_voter_keypair(self) -> tuple[bytes, bytes]:
        """
        Returns (private_key_pem, public_key_pem).
        Store the public key; give the private key ONLY to the voter.
        """
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
        return public_pem ,private_pem


    # ──────────────────────────────────────────────
    # 2.  VOTE-IDENTITY HASH  (privacy layer)
    # ──────────────────────────────────────────────

    def build_vote_identity_hash(self,public_key_pem: bytes, prof_id: UUID, salt: str) -> str:
        """
        One-way identity token: proves the voter is unique for this prof
        WITHOUT revealing who they are.
        salt  – a secret server-side pepper (store in env-var, never in DB).
        """
        raw = public_key_pem + str(prof_id).encode() + salt.encode()
        return hashlib.sha256(raw).hexdigest()


    # ──────────────────────────────────────────────
    # 3.  PROOF-OF-WORK  (anti-spam / anti-fake)
    # ──────────────────────────────────────────────

    DIFFICULTY = 4          # leading zeros required – raise to make mining harder
    _DIFFICULTY_PREFIX = "0" * DIFFICULTY


    def _candidate_hash(self,prof_id: UUID, rate: int, timestamp: str,
                        vote_identity_hash: str, previous_hash: str, nonce: int) -> str:
        payload = f"{prof_id}{rate}{timestamp}{vote_identity_hash}{previous_hash}{nonce}"
        return hashlib.sha256(payload.encode()).hexdigest()


    async def mine_block(self,prof_id: int, rate: int, timestamp: str,
                vote_identity_hash: str, previous_hash: str) -> tuple[str, int]:
        """
        Brute-force nonce until block_hash starts with DIFFICULTY zeros.
        Returns (block_hash, nonce).
        """
        import asyncio
        # كل 1000 محاولة، نعطي فرصة للسيرفر ليعالج طلبات أخرى

        nonce = 0
        while True:
            candidate = self._candidate_hash(
                prof_id, rate, timestamp, vote_identity_hash, previous_hash, nonce
            )
            if candidate.startswith(self._DIFFICULTY_PREFIX):
                return candidate, nonce
            nonce += 1
            if nonce % 1000 == 0:
                 await asyncio.sleep(0) 


    # ──────────────────────────────────────────────
    # 4.  SIGNATURE  (non-repudiation / anti-fake)
    # ──────────────────────────────────────────────

    def sign_rating(self,private_key_pem: bytes, block_hash: str) -> bytes:
        """Voter signs the mined block_hash with their private key."""
        private_key = serialization.load_pem_private_key(
            private_key_pem, password=None, backend=default_backend()
        )
        signature = private_key.sign(
            block_hash.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH,
            ),
            hashes.SHA256(),
        )

        return signature          # store as BYTEA / LargeBinary if you need it


    def verify_signature(self,public_key_pem: bytes, block_hash: str, signature: bytes) -> bool:
        """Returns True if the signature is valid – use for audit/dispute."""
        try:
            public_key = serialization.load_pem_public_key(
                public_key_pem, backend=default_backend()
            )
            public_key.verify(
                signature,
                block_hash.encode(),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH,
                ),
                hashes.SHA256(),
            )
            return True
        except Exception:
            return False


    # ──────────────────────────────────────────────
    # 5.  GET LAST BLOCK HASH  (chain linkage)
    # ──────────────────────────────────────────────

    async def get_last_block_hash(self,session: AsyncSession, prof_id: UUID) -> str:
        """
        Fetches the most recent block_hash for this prof.
        Returns the genesis hash if no ratings exist yet.
        """
        stmt = (
            select(Rating)
            .filter(Rating.prof_id == prof_id)
            .order_by(Rating.id.desc())
            
        )
        result = await session.execute(stmt)
        last = result.scalars().first()
        if last is None:
            # Genesis block sentinel
            return hashlib.sha256(f"GENESIS-{prof_id}".encode()).hexdigest()
        return last.block_hash


    # ──────────────────────────────────────────────
    # 6.  ADD RATING  (the only write operation)
    # ──────────────────────────────────────────────

    async def add_rating(self,
        session: AsyncSession,
        prof_id: int,
        rate: float,
        public_key_pem: bytes,
        private_key_pem: bytes,
        salt: str,
    ) -> Rating:
        """
        Full blockchain pipeline:
        1. Build anonymous voter identity hash
        2. Reject duplicate votes for the same prof
        3. Get previous block hash (chain linkage)
        4. Mine proof-of-work
        5. Sign with voter's private key
        6. Persist to DB

        Returns the newly created Rating row.
        Raises ValueError for invalid input or duplicate votes.
        """
        # Validate rate
        if rate < 1.0 or rate > 5.0:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"rate must be between 1 and 5")

        # Build privacy-preserving identity token
        vote_identity_hash = self.build_vote_identity_hash(public_key_pem, prof_id, salt)

        # ── Duplicate-vote guard ──────────────────────────────────────────────────
        stmt =  select(Rating).filter(
                Rating.prof_id == prof_id,
                Rating.vote_identity_hash == vote_identity_hash,
            )

        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()

     
        if existing:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Duplicate vote: this voter already rated this professor.")

        # ── Chain linkage ─────────────────────────────────────────────────────────
        previous_hash = await self.get_last_block_hash(session, prof_id)

        # ── Timestamp ─────────────────────────────────────────────────────────────
        now = datetime.now(timezone.utc)
        timestamp_str = now.isoformat()

        # ── Proof-of-work ─────────────────────────────────────────────────────────
        block_hash, nonce = await self.mine_block(
            prof_id, rate, timestamp_str, vote_identity_hash, previous_hash
        )


        # ── Signature ─────────────────────────────────────────────────────────────
        _signature = self.sign_rating(private_key_pem, block_hash)
        # _signature can be stored separately if you add a `signature` column later

        # ── Persist ───────────────────────────────────────────────────────────────
        new_rating = Rating(
            vote_identity_hash=vote_identity_hash,
            prof_id=prof_id,
            rate=rate,
            timestamp=now,
            previous_hash=previous_hash,
            block_hash=block_hash,
            nonce=nonce,
        )
        session.add(new_rating)
        await session.commit()
        await session.refresh(new_rating)
        return new_rating


    # ──────────────────────────────────────────────
    # 7.  CHAIN INTEGRITY VERIFIER  (audit / detect tampering)
    # ──────────────────────────────────────────────

    async def verify_chain(self,session: AsyncSession, prof_id: UUID) -> tuple[bool, list[str]]:
        """
        Re-computes every block hash for prof_id and checks:
        • proof-of-work still valid
        • previous_hash linkage is intact

        Returns (is_valid: bool, errors: list[str]).
        An empty errors list means the chain is clean.
        """
        stmt = (
            select(Rating)
            .filter(Rating.prof_id == prof_id)
            .order_by(Rating.id.asc())
            
        )
        
        result = await session.execute(stmt)
        ratings = result.scalars().all()
        errors: list[str] = []
        expected_previous = hashlib.sha256(f"GENESIS-{prof_id}".encode()).hexdigest()

        for r in ratings:
            # 1. Check chain linkage
            if r.previous_hash != expected_previous:
                errors.append(
                    f"Block #{r.id}: broken chain link "
                    f"(expected {expected_previous[:10]}… got {r.previous_hash[:10]}…)"
                )

            # 2. Re-compute and check proof-of-work
            recomputed = self._candidate_hash(
                r.prof_id,
                r.rate,
                r.timestamp.astimezone(timezone.utc).isoformat(),
                r.vote_identity_hash,
                r.previous_hash,
                r.nonce,
            )
            if recomputed != r.block_hash:
                errors.append(
                    f"Block #{r.id}: hash mismatch – record may have been tampered with."
                )
            elif not recomputed.startswith(self._DIFFICULTY_PREFIX):
                errors.append(f"Block #{r.id}: proof-of-work invalid.")

            expected_previous = r.block_hash

        return (len(errors) == 0), errors