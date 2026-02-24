# 토스페이먼츠 환경변수 설정

## 필요한 환경변수

`.env.local` 파일에 다음 변수를 추가하세요:

```bash
# 토스페이먼츠 테스트 키
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxxxxx
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxxxxx
```

## 키 발급 방법

1. https://developers.tosspayments.com 접속
2. 회원가입 및 로그인
3. "내 상점" 또는 "테스트 상점" 생성
4. 좌측 메뉴에서 "API 키" 클릭
5. "테스트 클라이언트 키"와 "테스트 시크릿 키" 복사

## Vercel 배포 시

Vercel 대시보드에서도 동일한 환경변수를 추가해야 합니다:

1. Vercel 프로젝트 Settings → Environment Variables
2. 위 두 변수를 추가
3. 재배포

## 주의사항

- `NEXT_PUBLIC_` 접두어가 있는 키는 클라이언트에 노출됩니다.
- `TOSS_SECRET_KEY`는 절대 클라이언트에 노출되면 안 됩니다.
- 테스트 키(`test_` 접두어)는 실제 결제가 발생하지 않습니다.
- 실제 서비스 오픈 시에는 test 키를 실제 키로 교체해야 합니다.

## 테스트 카드 정보

테스트 결제 시 사용할 수 있는 카드 정보는:
https://docs.tosspayments.com/reference/test-card

일반적으로:
- 카드번호: 아무 16자리 숫자
- 유효기간: 미래 날짜 (예: 12/25)
- CVC: 아무 3자리 숫자

토스페이먼츠 결제창에서 "테스트 카드"를 선택하면 자동으로 테스트 정보가 입력됩니다.
