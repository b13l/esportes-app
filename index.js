const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/',
  createProxyMiddleware({
    target: 'http://play.1list.vip:80',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // Passa o IP real do cliente (importante para não ser bloqueado)
      if (req.headers['x-forwarded-for']) {
        proxyReq.setHeader('X-Forwarded-For', req.headers['x-forwarded-for']);
      }
      // Remove o Host original para evitar conflitos
      proxyReq.removeHeader('host');
      // Mantém o Referer original (se existir)
      if (req.headers['referer']) {
        proxyReq.setHeader('Referer', req.headers['referer']);
      }
      // Não mexe no User-Agent – deixa o do navegador/WebView
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));
