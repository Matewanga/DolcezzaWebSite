// uploadProducts.js
import { readFile } from "fs/promises";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3Yczv4YAUuQpkNErmxrRAB1YPx0mrIF4",
  authDomain: "dolcezza-586d5.firebaseapp.com",
  projectId: "dolcezza-586d5",
  storageBucket: "dolcezza-586d5.firebasestorage.app",
  messagingSenderId: "186663190348",
  appId: "1:186663190348:web:64ab653da41cbdcf8e99e9",
  measurementId: "G-R1NZL09SBG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadProducts() {
  try {
    const data = await readFile("./products.json", "utf-8");
    const products = JSON.parse(data);

    let insertedCount = 0;
    let skippedCount = 0;
    let invalidCount = 0;

    // Faz upload em paralelo
    await Promise.all(products.map(async (product) => {
      try {
        // Ignora produtos sem ID
        if (!product.id || product.id.trim() === "") {
          console.log(`Produto sem ID encontrado, pulando...`, product.name || product);
          invalidCount++;
          return;
        }

        const docRef = doc(collection(db, "products"), product.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, product);
          console.log(`Produto ${product.name} inserido!`);
          insertedCount++;
        } else {
          console.log(`Produto ${product.name} já existe, pulando...`);
          skippedCount++;
        }
      } catch (err) {
        console.log(`Erro ao processar o produto ${product.name || product.id}, pulando...`);
        invalidCount++;
      }
    }));

    console.log(`\nUpload finalizado!`);
    console.log(`Produtos inseridos: ${insertedCount}`);
    console.log(`Produtos pulados (já existentes): ${skippedCount}`);
    console.log(`Produtos inválidos ou com erro: ${invalidCount}`);
  } catch (err) {
    console.error("Erro ao ler o arquivo products.json:", err);
  }
}

uploadProducts();
