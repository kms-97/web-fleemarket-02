<div align="center">
  <!-- 필요하시다면 로고나 이미지 추가
  <img src='https://user-images.githubusercontent.com/72490858/184244116-a5487bbe-48d1-41d0-803e-b502ce12f8ac.png' width='100px'>  
  -->
  <h3>우아한 중고거래 프로젝트 - 우아마켓</h3>
  
  [데모](http://15.164.181.228/) | [위키](https://github.com/woowa-techcamp-2022/web-fleemarket-02/wiki) | [팀 노션](https://www.notion.so/2-0fb05219488b45b392280950aafe91cd)
</div>

## Built with
### client
<div>
<!-- ts -->
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<!-- react -->
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
<!-- emotion -->
<img src="https://img.shields.io/badge/emotion-CC6699?style=for-the-badge&logoColor=black">
</div>

### server
<div>
<!-- ts -->
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<!-- express -->
<img src="https://img.shields.io/badge/Nestjs-E0234E?style=for-the-badge&logo=Nestjs&logoColor=white">
<!-- mysql -->
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
 </div>
 
## Getting Started
### 1. 클론 레포지토리

```
https://github.com/woowa-techcamp-2022/web-fleemarket-02.git
```

### 2. 의존성 패키지 설치

```
yarn install
```

### 3. 환경변수 설정
- packages/client/.env
```
/* Github oAuth */
REACT_APP_GITHUB_AUTH_LOGIN=
```

- packages/server/.env
```
/* 데이터베이스 */
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

/* AWS S3 버킷 */
AWS_BUCKET_NAME=
AWS_BUCKET_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

HOST=

/* JWT */
JWT_ACCESS_TOKEN=
JWT_REFRESH_TOKEN=
JWT_SECRET_KEY=
LOGIN_SECRET_KEY=

/* Github oAuth */
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
```

### 4. 실행(Development)
기본 포트는 3000번입니다.
```
yarn client start
yarn server start:dev
```

