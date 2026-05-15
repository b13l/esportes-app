let canais = [];


// Carrega canais do Firestore
async function carregarCanais() {
  const container = document.getElementById('lista-canais');
  container.innerHTML = 'Carregando...';
  try {
    const snapshot = await db.collection('canais_esportes').get();
    canais = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderizarCanais(canais);
 } catch (err) {
    console.error('Erro ao carregar canais:', err);
    container.innerHTML = 'Erro ao carregar canais.';
}
}

function renderizarCanais(lista) {
  const container = document.getElementById('lista-canais');
  container.innerHTML = lista.map(c => `
    <div class="card" onclick="assistirCanal('${c.id}')">
      <img src="${c.logo || ''}" alt="${c.nome}" onerror="this.src='data:image/svg+xml,...'">
      <h3>${c.nome}</h3>
    </div>
  `).join('');
}

function assistirCanal(id) {
  const canal = canais.find(c => c.id === id);
  if (!canal) return;

  const video = document.getElementById('videoPlayer');
  const modal = document.getElementById('playerModal');
  modal.style.display = 'block';

  const url = canal.url; // URL direta do Firestore

  // Usa hls.js se for m3u8
  if (url.endsWith('.m3u8') && window.Hls && Hls.isSupported()) {
    if (window.hls) window.hls.destroy();
    const hls = new Hls();
    window.hls = hls;
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else {
    video.src = url;
    video.play();
  }
}

function fecharPlayer() {
  document.getElementById('playerModal').style.display = 'none';
  document.getElementById('videoPlayer').pause();
}

// Inicia o carregamento
carregarCanais();