const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/',
  createProxyMiddleware({
    target: 'http://play.1list.vip:80',
    changeOrigin: true,
    headers: {
      'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
      'Referer': 'http://play.1list.vip/'
    },
    onProxyReq: (proxyReq, req, res) => {
      // Passa o IP real (se disponível)
      if (req.headers['x-forwarded-for']) {
        proxyReq.setHeader('X-Forwarded-For', req.headers['x-forwarded-for']);
      }
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));