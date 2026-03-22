## شرح خدمة التقييمات `RatingService`

هذه الخدمة تحاول تطبيق فكرة بسيطة تشبه الـ **Blockchain** على تقييمات الدكاترة.

### 1. توليد مفاتيح الناخب

- الدالة: `generate_voter_keypair`
- ماذا تفعل؟
  - تنشئ زوج مفاتيح RSA: مفتاح خاص `private_key` ومفتاح عام `public_key`.
  - ترجع `(private_key_pem, public_key_pem)` بصيغة PEM (نص).
- الفكرة:
  - **public_key**: يخزن في قاعدة البيانات مع حساب الناخب.
  - **private_key**: يحتفظ به الناخب نفسه، ويستخدم لاحقًا للتوقيع على التقييم.

---

### 2. هوية الناخب المخفية `vote_identity_hash`

- الدالة: `build_vote_identity_hash(public_key_pem, prof_id, salt)`
- ماذا تفعل؟
  - تحسب Hash باستخدام SHA256 لمحتوى:
    - public_key للناخب
    - معرف الدكتور `prof_id`
    - قيمة سرّية `salt` (pepper) مخزنة عند السيرفر.
  - الناتج هو `vote_identity_hash`.
- الفكرة:
  - نريد أن نعرف أن هذا الناخب **فريد** بالنسبة لهذا الدكتور (لا يصوّت مرتين لنفس الدكتور).
  - لكن لا نريد أن نعرف من هو (نحافظ على الخصوصية).
  - لذلك نخزن فقط `vote_identity_hash` وليس هوية الناخب مباشرة.

---

### 3. إثبات العمل (Proof-of-Work)

- المتغيرات:
  - `DIFFICULTY = 4`: عدد الأصفار المطلوبة في بداية الـ hash.
  - `_DIFFICULTY_PREFIX = "0" * DIFFICULTY`.

- الدالة: `_candidate_hash(...)`
  - تبني نصًا يجمع: `prof_id, rate, timestamp, vote_identity_hash, previous_hash, nonce`.
  - تحسب SHA256 لهذا النص وترجع النتيجة.

- الدالة: `mine_block(...)`
  - تبدأ من `nonce = 0` وتزيد 1 في كل مرة.
  - في كل محاولة:
    - تحسب `candidate = _candidate_hash(...)`.
    - تتأكد أن `candidate` يبدأ بعدد معين من الأصفار (`DIFFICULTY`).
  - عندما يتحقق الشرط، ترجع `(block_hash, nonce)`.

- الهدف:
  - جعل عملية إنشاء Block مكلفة قليلاً حسابيًا (مثل التعدين).
  - هذا يساعد على منع السبام أو التلاعب السهل بالبيانات.

---

### 4. التوقيع الرقمي

- الدالة: `sign_rating(private_key_pem, block_hash)`
  - تحمّل المفتاح الخاص من الـ PEM.
  - توقّع قيمة `block_hash` باستخدام:
    - خوارزمية RSA
    - Padding من نوع PSS
    - خوارزمية تجزئة SHA256
  - ترجع التوقيع `signature` (بايتات).

- الدالة: `verify_signature(public_key_pem, block_hash, signature)`
  - تتحقق من صحة التوقيع باستخدام المفتاح العام.
  - ترجع `True` إذا كان التوقيع صحيحًا، وإلا `False`.

- الفكرة:
  - الناخب يوقّع التقييم، فلا يستطيع لاحقًا إنكار التصويت (non‑repudiation).
  - في نفس الوقت، الهوية الفعلية غير مكشوفة؛ نعتمد على `vote_identity_hash`.

---

### 5. ربط الكتل (Chain Link)

- الدالة: `get_last_block_hash(db, prof_id)`
  - تجلب آخر تقييم (Block) لهذا الدكتور من جدول `ratings`.
  - إذا لا يوجد تقييمات:
    - ترجع Hash خاص (GENESIS) مبني من `GENESIS-{prof_id}`.
  - إذا يوجد تقييمات:
    - ترجع `block_hash` لآخر Block.

- الهدف:
  - كل تقييم جديد يرتبط بالتقييم السابق عن طريق `previous_hash`.
  - هذا يكوّن سلسلة كتل مترابطة (chain).

---

### 6. إضافة تقييم جديد `add_rating`

- الدالة: `add_rating(db, prof_id, rate, public_key_pem, private_key_pem, salt)`
- الخطوات:
  1. التحقق من أن `rate` بين 1 و 5.
  2. حساب `vote_identity_hash` باستخدام `build_vote_identity_hash`.
  3. التحقق من عدم وجود تقييم سابق لنفس الدكتور بنفس `vote_identity_hash`:
     - إذا وجد → رفع خطأ "Duplicate vote".
  4. جلب `previous_hash` باستدعاء `get_last_block_hash`.
  5. أخذ الوقت الحالي `timestamp`.
  6. تنفيذ التعدين `mine_block` للحصول على:
     - `block_hash`
     - `nonce`
  7. توقيع `block_hash` بالمفتاح الخاص `sign_rating` (حاليًا التوقيع لا يُخزَّن في الجدول).
  8. إنشاء صف جديد في جدول `Rating` يحتوي على:
     - `vote_identity_hash`
     - `prof_id`
     - `rate`
     - `timestamp`
     - `previous_hash`
     - `block_hash`
     - `nonce`
  9. حفظ التقييم في قاعدة البيانات (`commit`) ثم `refresh` ثم إرجاع الكائن.

- النتيجة:
  - تم إنشاء Block جديد في سلسلة تقييمات هذا الدكتور، مع حماية من:
    - التصويت المكرر
    - التلاعب بالسجلات
    - إخفاء هوية الناخب.

---

### 7. التحقق من سلامة السلسلة `verify_chain`

- الدالة: `verify_chain(db, prof_id) -> (is_valid, errors)`
- ماذا تفعل؟
  1. تجلب كل التقييمات لهذا الدكتور مرتبة حسب `id` تصاعديًا.
  2. تبدأ من GENESIS hash كـ `expected_previous`.
  3. لكل Block:
     - تتأكد أن `previous_hash` يساوي `expected_previous`.
     - تعيد حساب الـ hash من البيانات (rate, timestamp, vote_identity_hash, previous_hash, nonce).
     - إذا الـ hash الناتج لا يساوي المخزن في `block_hash` → تسجّل خطأ.
     - إذا الـ hash لا يبدأ بعدد الأصفار المطلوب (DIFFICULTY) → تسجّل خطأ.
     - تحدّث `expected_previous` ليصبح `block_hash` الحالي.
  4. في النهاية:
     - إذا قائمة الأخطاء فارغة → السلسلة سليمة (`is_valid = True`).
     - إذا فيها أخطاء → `is_valid = False`.

---

## شرح المسارات في `rating_routes.py`

### 1. المسار: إضافة تقييم

- **الـ Endpoint**:  
  `POST /profs/{prof_id}/ratings`

- **المدخلات (Body)**:
  - `rate`: رقم من 1 إلى 5.
  - `public_key_pem`: النص الذي يمثّل المفتاح العام للناخب بصيغة PEM.
  - `private_key_pem`: النص الذي يمثّل المفتاح الخاص للناخب بصيغة PEM.

- **الاعتماديات (Dependencies)**:
  - `rating_service`: كائن من `RatingService` يأتي من `get_rating_service`.
  - `session`: جلسة قاعدة بيانات `AsyncSession` من `get_db`.
  - `current_user`: المستخدم الحالي من `get_current_user` (للتأكد أنه مسجّل دخول).

- **ماذا يفعل؟**
  - يستدعي `rating_service.add_rating` لتنفيذ كامل منطق الـ blockchain.
  - يعيد معلومات عن التقييم الذي تم إنشاؤه (id, rate, block_hash, ...).

---

### 2. المسار: التحقق من سلامة سلسلة التقييمات

- **الـ Endpoint**:  
  `GET /profs/{prof_id}/ratings/verify`

- **ماذا يفعل؟**
  - يستدعي `rating_service.verify_chain`.
  - يعيد:
    - `is_valid`: هل السلسلة سليمة؟
    - `errors`: قائمة بالأخطاء إن وجدت (مثل tampering أو broken chain).

- **متى تستخدمه؟**
  - عند الشك في أن البيانات قد تم التلاعب بها.
  - لفحص دوري للتأكد أن كل التقييمات ما زالت متناسقة مع قواعد الـ blockchain.

---

### 3. المسار: آخر Block في السلسلة

- **الـ Endpoint**:  
  `GET /profs/{prof_id}/ratings/last_block`

- **ماذا يفعل؟**
  - يستدعي `rating_service.get_last_block_hash`.
  - يعيد:
    - `prof_id`
    - `last_block_hash`: 
      - إمّا block_hash لآخر تقييم،
      - أو GENESIS hash إذا لا يوجد تقييمات بعد.

- **الفائدة:**
  - مفيد لأغراض Debugging أو لمراقبة آخر حالة للسلسلة لهذا الدكتور.

---

بهذا الشكل صار عندك:

- **خدمة منطق قوية** في `rating_service.py` (Blockchain-like للتقييمات).
- **مسارات REST واضحة** في `rating_routes.py` لاستخدام هذه الخدمة من الـ Frontend أو أي عميل.
- **ملف توثيق بالعربي** يشرح كل جزء ووظيفته.

يمكنك الآن نسخ الكود والملف التوثيقي إلى مشروعك. إذا أردت، أستطيع مساعدتك في كتابة مثال Request/Response لكل endpoint.