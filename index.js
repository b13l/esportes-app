const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuração do proxy
const proxyOptions = {
  target: 'http://play.1list.vip:80',
  changeOrigin: true,
  // Força o Host para o servidor de destino (essencial para evitar 400)
  headers: {
    'Host': 'play.1list.vip'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Mantém o User-Agent original do cliente
    if (req.headers['user-agent']) {
      proxyReq.setHeader('User-Agent', req.headers['user-agent']);
    }
    // Mantém o Referer
    if (req.headers['referer']) {
      proxyReq.setHeader('Referer', req.headers['referer']);
    }
    // Passa o IP real do cliente (se disponível)
    if (req.headers['x-forwarded-for']) {
      proxyReq.setHeader('X-Forwarded-For', req.headers['x-forwarded-for']);
    }
  },
  // Resposta: adiciona cabeçalhos CORS
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
    proxyRes.headers['access-control-allow-methods'] = 'GET, OPTIONS';
    proxyRes.headers['access-control-allow-headers'] = '*';
  }
};

app.use('/', createProxyMiddleware(proxyOptions));

// Trata preflight CORS (OPTIONS)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy rodando na porta ${PORT}`));
