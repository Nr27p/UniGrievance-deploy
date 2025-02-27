// firebase.js
import { initializeApp } from 'firebase/app'; // Import initializeApp function from firebase/app module
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "grievancesys-98c2f.firebaseapp.com",
  projectId: "grievancesys-98c2f",
  storageBucket: "grievancesys-98c2f.appspot.com",
  messagingSenderId: "612572703114",
  appId: "1:612572703114:web:e8225dbb3b6e8e90a54073",
  measurementId: "G-T73K595WX1"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(app);

export { storage, app as default };
