
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Your web app's Firebase configuration
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

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM entièrement chargé et analysé");
    const form = document.getElementById('song-form');
    if (!form) {
        console.log("Le formulaire n'a pas été trouvé");
        return;
    }
    form.addEventListener('submit', async event => {
        console.log("Tentative de soumission du formulaire");
        event.preventDefault();
        const artist = document.getElementById('artist').value;
        const song = document.getElementById('song').value;
        const table = document.getElementById('table').value;

        console.log({artist, song, table}); // Pour vérifier les valeurs récupérées

        try {
            const docRef = await addDoc(collection(db, "submissions"), {
                artist: artist,
                song: song,
                table: table,
                timestamp: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
            alert('Chanson soumise avec succès !');
            form.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Erreur lors de la soumission de la chanson.');
        }
    });
});
