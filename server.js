// server.js
const express = require("express");
const next = require("next");

// 환경 설정: 개발 모드인지 프로덕션 모드인지 결정
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

// Next.js의 요청 핸들러를 설정
const handle = app.getRequestHandler();

// 서버 준비
app
  .prepare()
  .then(() => {
    const server = express();

    // 필요한 API 경로를 추가할 수 있음
    // server.get('/api/hello', (req, res) => {
    //   res.json({ message: 'Hello from Express!' });
    // });

    // 모든 요청을 Next.js로 전달
    server.all("*", (req, res) => {
      return handle(req, res);
    });

    // 서버를 실행
    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error preparing Next.js app:", err);
  });
