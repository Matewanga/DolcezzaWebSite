import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ======================================
// 🔥 FIREBASE ADMIN
// ======================================
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("Firebase conectado");
} catch (e) {
  console.log("Firebase já inicializado");
}

const db = admin.firestore();

// ======================================
// 📧 NODMAILER (GMAIL)
// ======================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // seu gmail
    pass: process.env.EMAIL_PASS, // senha de app
  },
});

// ======================================
// 🔐 LOGIN / REGISTRO
// ======================================
app.post("/auth", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send({ erro: "Dados inválidos" });
  }

  const ref = db.collection("users").doc(email);
  const docSnap = await ref.get();

  if (!docSnap.exists) {
    await ref.set({ email, senha });
    return res.send({ msg: "Registrado" });
  }

  if (docSnap.data().senha !== senha) {
    return res.status(401).send({ erro: "Senha incorreta" });
  }

  res.send({ msg: "Login OK" });
});

// ======================================
// 🛒 REGISTRAR COMPRA E MANDAR EMAIL
// ======================================
app.post("/compra", async (req, res) => {
  const { email, itens, total } = req.body;

  if (!email || !itens) {
    return res.status(400).send({ erro: "Dados inválidos" });
  }

  const orderId = Date.now().toString();

  await db
    .collection("compras")
    .doc(orderId)
    .set({
      email,
      itens,
      total,
      data: Date.now(),
    });

  // =============================
  // 📧 EMAIL AUTOMÁTICO
  // =============================
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirmação do Pedido #${orderId}`,
      html: `
        <h2>Olá!</h2>
        <p>Seu pedido <strong>#${orderId}</strong> foi registrado com sucesso!</p>

        <h3>Itens:</h3>
        <ul>
          ${itens.map((i) => `<li>${i.name} — R$ ${i.price}</li>`).join("")}
        </ul>

        <h3>Total: R$ ${total}</h3>

        <p>Obrigado por comprar conosco! 💛</p>
      `,
    });
  } catch (err) {
    console.log("Erro ao enviar email:", err);
  }

  res.send({ msg: "Compra registrada e email enviado!", orderId });
});

// ======================================
// 📄 LISTAR COMPRAS DO USUÁRIO
// ======================================
app.get("/compras", async (req, res) => {
  const { email } = req.query;

  const snap = await db
    .collection("compras")
    .where("email", "==", email)
    .get();

  res.send(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});

// ======================================
app.listen(3001, () => console.log("Backend rodando na porta 3001"));
