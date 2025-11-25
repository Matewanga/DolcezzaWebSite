const fetch = require("node-fetch"); // se não tiver, instale com: npm install node-fetch@2

const testEmail = async () => {
  try {
    const response = await fetch("http://localhost:4000/finalizar-compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "seuemail@teste.com",
        name: "Rebeca"
      }),
    });

    const data = await response.json();
    console.log("Resposta do backend:", data);
  } catch (err) {
    console.error("Erro ao chamar rota:", err);
  }
};

testEmail();
