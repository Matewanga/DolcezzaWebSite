import { saveOrderToHistory } from "../services/saveOrder";
import { useAuth } from "../context/AuthContext";

export function CheckoutButton() {
  const { user: authUser } = useAuth();

  const handleCheckout = async () => {
    if (!authUser) return alert("Você precisa estar logado para finalizar a compra.");

    const orderData = {
      orderId: "001",
      total: 120.5,
      paymentMethod: "pix",
      deliveryAddress: {
        address: "Rua Exemplo",
        number: "123",
        city: "São Paulo",
        state: "SP",
      },
      products: [
        { name: "Produto A", quantity: 2, price: 50 },
        { name: "Produto B", quantity: 1, price: 20.5 },
      ],
      createdAt: new Date(),
    };

    try {
      await saveOrderToHistory(authUser.uid, orderData);
      alert("Compra registrada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar a compra.");
    }
  };

  return (
    <button onClick={handleCheckout} className="btn-primary">
      Finalizar Compra
    </button>
  );
}
