import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: Number(process.env.BREVO_PORT),
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendOrderEmail = functions.firestore
  .document("users/{uid}/history/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();
    if (!order || !order.userEmail) return;

    let pixQrCode = order.pixQr;

    // PIX simulado
    if (order.paymentMethod === "pix" && !pixQrCode) {
      pixQrCode = `PIX_FAKE_${order.total}_${Date.now()}`;
      const orderRef = admin.firestore().doc(`users/${context.params.uid}/history/${context.params.orderId}`);
      await orderRef.update({ pixQr: pixQrCode });
    }

    const html = `
      <h1>Pedido Confirmado! 🎉</h1>
      <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
      <p><strong>Endereço:</strong> ${order.address.address}, ${order.address.number} - ${order.address.neighborhood}</p>
      <p><strong>Pagamento:</strong> ${order.paymentMethod.toUpperCase()}</p>
      ${
        order.paymentMethod === "pix" && pixQrCode
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
        to: order.userEmail,
        subject: "Confirmação do seu pedido",
        html,
      });
      console.log(`E-mail enviado para ${order.userEmail}`);
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
    }
  });
