# 내일 할 일: 토스페이먼츠 테스트

> 작성일: 2026-02-26
> 코드 구현 완료. 환경변수 설정 + 테스트만 남음.

---

## ✅ 완료된 것 (오늘)

- [x] `@tosspayments/tosspayments-sdk` 패키지 설치
- [x] `/app/payment/[interviewId]/page.tsx` 결제 페이지 생성
- [x] `/app/api/payment/confirm/route.ts` 결제 승인 API 생성
- [x] `/app/payment/success/page.tsx` 성공 페이지 생성
- [x] `/app/payment/fail/page.tsx` 실패 페이지 생성
- [x] `ArchiveView.tsx`에 "기록 보관하기 9,900원" CTA 버튼 추가
- [x] `Interview` 타입에 `payment` 필드 추가
- [x] `TOSS_PAYMENT_SETUP.md` 설정 가이드 작성

---

## 🔥 내일 반드시 해야 할 것

### 1단계: 토스페이먼츠 가입 (5분)

1. https://developers.tosspayments.com 접속
2. 회원가입 (이메일 또는 소셜 로그인)
3. "내 상점" 또는 "테스트 상점" 생성
4. 좌측 메뉴 "API 키" 클릭
5. **테스트 클라이언트 키** 복사 (test_ck_로 시작)
6. **테스트 시크릿 키** 복사 (test_sk_로 시작)

> **중요**: 실제 키(test_ 없는 것)가 아니라 **테스트 키**를 사용해야 함!

---

### 2단계: 환경변수 추가 (2분)

**로컬 개발 환경:**

`.env.local` 파일 열기 (없으면 생성):

```bash
# 기존 환경변수들...
OPENAI_API_KEY=sk-...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_KAKAO_JS_KEY=...

# 토스페이먼츠 테스트 키 (아래 2줄 추가)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_여기에복사한클라이언트키
TOSS_SECRET_KEY=test_sk_여기에복사한시크릿키
```

**Vercel 배포 환경:**

1. Vercel 대시보드 접속
2. siltare 프로젝트 선택
3. Settings → Environment Variables
4. 위 2개 변수 추가:
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY` = `test_ck_...`
   - `TOSS_SECRET_KEY` = `test_sk_...`
5. Production, Preview, Development 모두 체크
6. Save
7. 재배포 (Deployments → 최신 배포 → Redeploy)

---

### 3단계: 로컬 테스트 (5분)

```bash
npm run dev
```

1. http://localhost:3000 접속
2. 인터뷰 하나 만들기 (/request)
3. 대화 완료 후 /archive/{id}로 이동
4. **페이지 하단 스크롤**
5. **"기록 보관하기 9,900원"** 버튼 확인
6. 버튼 클릭 → `/payment/{interviewId}` 페이지로 이동
7. **토스페이먼츠 결제 위젯**이 렌더링되는지 확인
   - 카드 결제, 간편결제 등 옵션이 보여야 함
8. "테스트 카드"를 선택하거나 테스트 카드 번호 입력:
   - 카드번호: 아무 16자리 (예: 1234 5678 9012 3456)
   - 유효기간: 미래 날짜 (예: 12/25)
   - CVC: 아무 3자리 (예: 123)
9. "9,900원 결제하기" 버튼 클릭
10. 결제 진행 → `/payment/success` 페이지로 리다이렉트
11. "결제를 확인하고 있습니다..." → "감사합니다" 메시지 확인
12. 3초 후 자동으로 `/archive/{id}`로 돌아가는지 확인

---

### 4단계: 오류 시나리오 테스트 (2분)

1. 다시 /payment/{interviewId} 접속
2. 결제 위젯에서 취소 버튼 클릭 또는 창 닫기
3. `/payment/fail` 페이지로 이동하는지 확인
4. "결제에 실패했습니다" 메시지 확인
5. "돌아가기" 버튼 클릭 → 이전 페이지로 이동하는지 확인

---

### 5단계: 결제 정보 확인 (2분)

1. 토스페이먼츠 개발자센터 접속
2. "거래 조회" 또는 "결제 내역" 메뉴
3. 방금 테스트한 결제 내역이 보이는지 확인
4. orderId: `siltare_{interviewId}_{timestamp}` 형식인지 확인
5. 금액: 9,900원인지 확인
6. 상태: "완료" 또는 "승인"인지 확인

---

### 6단계: Supabase 데이터 확인 (1분)

1. Supabase 대시보드 접속
2. Table Editor → interviews 테이블
3. 테스트한 interview 레코드 선택
4. `payment` 컬럼에 JSON 데이터가 들어있는지 확인:
   ```json
   {
     "paymentKey": "...",
     "orderId": "siltare_...",
     "amount": 9900,
     "method": "카드",
     "status": "DONE",
     "approvedAt": "2026-02-26T..."
   }
   ```

---

## 🚨 문제 발생 시 체크리스트

### 결제 위젯이 안 보여요
- [ ] `.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 있는지 확인
- [ ] 키가 `test_ck_`로 시작하는지 확인
- [ ] 개발 서버 재시작 (`npm run dev` 다시 실행)
- [ ] 브라우저 콘솔(F12) 에러 메시지 확인

### "기록 보관하기" 버튼이 안 보여요
- [ ] /archive/{id} 페이지 맨 하단까지 스크롤했는지 확인
- [ ] Book CTA, Share CTA 위에 있어야 함

### 결제 승인이 실패해요
- [ ] `.env.local`에 `TOSS_SECRET_KEY` 있는지 확인 (NEXT_PUBLIC_ 없음!)
- [ ] 키가 `test_sk_`로 시작하는지 확인
- [ ] 서버 터미널에 에러 로그 확인
- [ ] /api/payment/confirm API 응답 확인 (Network 탭)

### Vercel 배포 후 작동 안 해요
- [ ] Vercel 환경변수 두 개 다 추가했는지 확인
- [ ] 재배포했는지 확인
- [ ] Vercel 함수 로그(Function Logs) 에러 확인

---

## 📚 참고 자료

- **설정 가이드**: `/TOSS_PAYMENT_SETUP.md`
- **공식 문서**: https://docs.tosspayments.com/guides/v2/payment-widget/integration
- **SDK 레퍼런스**: https://docs.tosspayments.com/sdk/v2/js
- **테스트 카드**: https://docs.tosspayments.com/reference/test-card
- **샘플 코드**: https://github.com/tosspayments/tosspayments-sample

---

## ✨ 성공하면

1. F-034 상태를 `wip` → `done`으로 변경
2. `completedAt: "2/26"` 추가
3. git commit:
   ```
   feat: F-034 토스페이먼츠 결제 연동 테스트 완료

   - 테스트 결제 성공 확인
   - 환경변수 설정 완료
   - Vercel 배포 확인
   ```

---

## 💡 다음 단계 (나중에)

- [ ] 실제 키로 전환 (서비스 오픈 시)
- [ ] payments 테이블 분리 (현재는 interviews.payment jsonb)
- [ ] 결제 실패 시 재시도 로직
- [ ] 결제 취소/환불 기능
- [ ] 결제 내역 조회 페이지
- [ ] 영수증 이메일 발송

---

**시작하기 전에 커피 한 잔 ☕**
**문제 없으면 15분 안에 끝남!**
