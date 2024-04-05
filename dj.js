import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// The new Firebase configuration for "backtothe80s"
const firebaseConfig = {
  apiKey: "AIzaSyDx-wS_FBpDx1LQBFzmsP7tgt-btukmcQg",
  authDomain: "backtothe80s-50666.firebaseapp.com",
  projectId: "backtothe80s-50666",
  storageBucket: "backtothe80s-50666.appspot.com",
  messagingSenderId: "772603629636",
  appId: "1:772603629636:web:f79ae1a894d59a3916ac11",
  measurementId: "G-QBK9W1BG48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let fullList = []; // Liste complète des chansons
let isReduced = true; // Indicateur de l'état de la liste, réduite ou non
const MAX_DISPLAY = 5; // Nombre maximal de chansons à afficher en mode réduit

document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('song-list');
    const reduceListBtn = document.getElementById('reduce-list');
    const clearAllBtn = document.getElementById('clear-all');

    const submissionsRef = collection(db, "submissions");
    const q = query(submissionsRef, orderBy("timestamp", "desc"));

    // Écoute des mises à jour en temps réel
    onSnapshot(q, (querySnapshot) => {
        fullList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: `${data.artist} - ${data.song} (Table ${data.table})`
            };
        });
        updateDisplay();
    });

    // Fonction pour mettre à jour l'affichage de la liste des chansons
    function updateDisplay() {
        songList.innerHTML = '';
        const toDisplay = isReduced ? fullList.slice(0, MAX_DISPLAY) : fullList;
        toDisplay.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.text;
            songList.appendChild(li);
        });
    }

    // Gestionnaire d'événement pour réduire/étendre la liste
    reduceListBtn.addEventListener('click', () => {
        isReduced = !isReduced;
        updateDisplay();
        reduceListBtn.textContent = isReduced ? "Étendre la liste" : "Réduire la liste";
    });

    // Gestionnaire d'événement pour effacer tout
    clearAllBtn.addEventListener('click', () => {
        if (window.confirm("Êtes-vous sûr de vouloir effacer toute la liste ?")) {
            // Itérez sur chaque élément de `fullList`
            fullList.forEach(item => {
                // Obtenez une référence au document spécifique à supprimer
                // Notez l'utilisation de `doc(db, "collectionName", docId)`
                const docRef = doc(db, "submissions", item.id);
    
                // Supprimez le document
                deleteDoc(docRef).then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
            
            // Après la suppression, videz `fullList` et mettez à jour l'affichage
            fullList = [];
            updateDisplay();
        }
    });
});
