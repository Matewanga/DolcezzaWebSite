import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  import.meta.env.VITE_BREVO_API_KEY
);

export async function sendOrderConfirmationEmail({
  to,
  name,
  orderId,
  items,
  total,
  paymentMethod,
}) {
  const productList = items
    .map(
      (it) =>
        `• ${it.name} — Qtd: ${it.quantity} — R$ ${(it.priceValue * it.quantity).toFixed(2)}`
    )
    .join("<br>");

  const htmlContent = `
    <h2>🎉 Pedido Confirmado!</h2>
    <p>Olá <strong>${name}</strong>, obrigado pelo seu pedido!</p>

    <p><strong>ID do Pedido:</strong> ${orderId}</p>

    <h3>Itens:</h3>
    <p>${productList}</p>

    <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
    <p><strong>Pagamento:</strong> ${paymentMethod.toUpperCase()}</p>

    <p>Você receberá atualizações sobre o status do pedido.</p>
    <br>
    <p>❤️ Dolcezza</p>
  `;

  const sendSmtpEmail = {
    sender: { name: "Dolcezza", email: "no-reply@dolcezza.com" },
    to: [{ email: to, name }],
    subject: "Seu pedido foi confirmado! 🎉",
    htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email enviado!");
  } catch (error) {
    console.error("Erro ao enviar email:", error);
  }
}
