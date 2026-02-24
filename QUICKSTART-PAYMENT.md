# 🚀 결제 테스트 빠른 시작 (5분)

## 1️⃣ 키 발급 (2분)
https://developers.tosspayments.com → 가입 → API 키 복사

## 2️⃣ 환경변수 (1분)
`.env.local`:
```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_복사한키
TOSS_SECRET_KEY=test_sk_복사한키
```

## 3️⃣ 테스트 (2분)
```bash
npm run dev
```
1. /archive/{id} 하단 → "기록 보관하기 9,900원" 클릭
2. 테스트 카드로 결제 (카드번호: 아무 16자리)
3. 성공 확인

## ✅ 완료!

상세: `TODO-PAYMENT.md` 참조
