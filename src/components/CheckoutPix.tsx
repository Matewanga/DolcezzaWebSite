// src/components/CheckoutPIX.tsx
import { useState } from "react";
import QRCode from "react-qr-code";

interface CheckoutPIXProps {
  amount: number; // valor final do pedido
  onClose?: () => void; // opcional para fechar modal/pai
}

export default function CheckoutPIX({ amount, onClose }: CheckoutPIXProps) {
  const [loading, setLoading] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  // Código PIX fake (substituir pelo real se tiver)
  const fakePixCode = `00020126580014BR.GOV.BCB.PIX0136fake-pix-chave-dolcezza520400005303986540${amount.toFixed(
    2
  )}5802BR5925DOLCEZZA CONFEITARIA6009SaoPaulo62070503***6304ABCD`;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setQrVisible(true);
    }, 1500); // simula processamento
  };

  return (
    <div className="flex flex-col items-center p-6 gap-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#503020]">Pagamento via PIX</h2>

      {!qrVisible && (
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`px-6 py-3 rounded-2xl text-white font-semibold shadow-md transition-all w-full text-center ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processando..." : "Confirmar pagamento"}
        </button>
      )}

      {qrVisible && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-center text-[#503020]">
            Escaneie o QR Code para pagar:
          </p>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <QRCode value={fakePixCode} size={220} />
          </div>
          <p className="text-sm break-all text-gray-700 text-center mt-2">
            {fakePixCode}
          </p>
          {onClose && (
            <button
              className="mt-4 px-6 py-2 rounded-xl bg-[#503020] text-white"
              onClick={onClose}
            >
              Fechar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
