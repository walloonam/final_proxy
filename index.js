const express = require('express');
const proxy = require("http-proxy-middleware");
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser'); // body-parser를 가져옵니다.

const app = express();
app.use(bodyParser.json());

app.post('/api/metrics', async (req, res) => {
    try {
      // 클라이언트로부터 전달된 데이터를 추출합니다.
      const data = req.body;
  
      // 받은 데이터를 가공하거나 다른 작업을 수행할 수 있습니다.
      console.log('Received POST request to /api/metrics:', data);
  
      // 다른 서버에 POST 요청을 보냅니다.
      const response = await fetch('http://18.182.29.254:8000/api/metrics', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // 다른 서버로부터 받은 응답을 클라이언트에게 전달합니다.
      const responseData = await response.json();
      res.json(responseData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

// 루트 엔드포인트에 대한 요청을 리액트 앱으로 프록시합니다.
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
}));

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
