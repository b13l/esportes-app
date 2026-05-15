const firebaseConfig = {
  apiKey: "AIzaSyANK0yxqy4xg4BwDEJVX-8TCveISB0khQw",
  authDomain: "dorameiros-e1bdd.firebaseapp.com",
  projectId: "dorameiros-e1bdd",
  storageBucket: "dorameiros-e1bdd.firebasestorage.app",
  messagingSenderId: "1058153533023",
  appId: "1:1058153533023:web:fc3c67ec6c3806208555ea"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Configuração que resolve o problema de conexão
db.settings({
  host: 'southamerica-east1-firestore.googleapis.com',
  experimentalForceLongPolling: true,
  merge: true
});