require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// Config Brevo
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: Number(process.env.BREVO_PORT),
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// Rota para criar pedido e enviar e-mail
app.post("/create-order", async (req, res) => {
  const { userEmail, total, address, paymentMethod } = req.body;

  if (!userEmail || !total || !address || !paymentMethod) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  // Simular PIX QR
  let pixQrCode = null;
  if (paymentMethod === "pix") {
    pixQrCode = `PIX_FAKE_${total}_${Date.now()}`;
  }

  const html = `
    <h1>Pedido Confirmado! 🎉</h1>
    <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
    <p><strong>Endereço:</strong> ${address.address}, ${address.number} - ${address.neighborhood}</p>
    <p><strong>Pagamento:</strong> ${paymentMethod.toUpperCase()}</p>
    ${
      paymentMethod === "pix" && pixQrCode
        ? `<p>Escaneie o QR Code abaixo para pagar (simulado):</p>
           <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
             pixQrCode
           )}&size=200x200"/>`
        : ""
    }
    <p>Obrigado por comprar com a Dolcezza! 🍰</p>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: userEmail,
      subject: "Confirmação do seu pedido",
      html,
    });

    return res.status(200).json({ success: true, pixQr: pixQrCode });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    return res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
