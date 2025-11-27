// src/components/Checkout.tsx
import { X, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/Checkout.css";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { user, savePaymentData } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "credit",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVV: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [pixCode, setPixCode] = useState("");

  useEffect(() => {
    const handleCartCoupon = (event: any) => {
      setDiscount(event.detail);
      setCouponCode("DOLCEZZAAMELHOR");
    };
    window.addEventListener("cartCouponApplied", handleCartCoupon);
    return () => window.removeEventListener("cartCouponApplied", handleCartCoupon);
  }, []);

  useEffect(() => {
    if (!isOpen || !user) return;
    const saved = localStorage.getItem("userData");
    if (saved) {
      setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const deliveryFee = totalPrice >= 100 ? 0 : 10;
  const finalTotal = Math.max(totalPrice + deliveryFee - discount, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const maskCard = (card: string) => {
    const onlyDigits = card.replace(/\D/g, "");
    return onlyDigits.length <= 4 ? onlyDigits : "**** **** **** " + onlyDigits.slice(-4);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "DOLCEZZAAMELHOR") {
      setDiscount(30);
      alert("Cupom aplicado! R$30 de desconto.");
    } else {
      setDiscount(0);
      alert("Cupom inválido.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2 && user) {
      const addressInfo = {
        address: formData.address,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };

      const paymentInfo = {
        paymentMethod: formData.paymentMethod,
        cardMask: maskCard(formData.cardNumber),
        cardName: formData.cardName,
        cardExpiry: formData.cardExpiry,
      };

      localStorage.setItem("userData", JSON.stringify({ ...addressInfo, ...paymentInfo }));

      await savePaymentData?.({ addressInfo, paymentInfo }).catch(() => {});

      if (formData.paymentMethod === "pix") {
        setPixCode(
          `00020126580014BR.GOV.BCB.PIX0136fake-pix-chave-dolcezza5204000053039865405100.005802BR5925DOLCEZZA CONFEITARIA6009SaoPaulo62070503***6304ABCD`
        );
      }

      setStep(3);
      return;
    }

    if (step === 3 && user) {
      try {
        const orderData = {
          orderId: Date.now(),
          total: totalPrice,
          discountApplied: discount,
          finalTotal: finalTotal,
          couponCode: couponCode || null,
          createdAt: serverTimestamp(),
          deliveryAddress: {
            address: formData.address,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          paymentMethod: formData.paymentMethod,
          products: items.map(it => ({
            id: it.id,
            name: it.name,
            quantity: it.quantity,
            price: it.priceValue,
          })),
        };

        await addDoc(collection(db, "users", user.uid, "history"), orderData);

        clearCart();
        setStep(1);
        setDiscount(0);
        setCouponCode("");
        setPixCode("");
        alert("Pedido realizado com sucesso!");
        onClose();
      } catch (err) {
        alert("Erro ao salvar pedido. Tente novamente.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="checkout-wrapper">
        <button onClick={onClose} className="close-btn">
          <X className="w-5 h-5 text-[#503020]" />
        </button>

        {/* ETAPAS */}
        <div className="steps-wrapper">
          {[1, 2, 3].map(s => (
            <div key={s} className="step-item">
              <div className={`step-circle ${step >= s ? "active" : ""}`}>
                {s === 1 && <Truck className="w-6 h-6" />}
                {s === 2 && <CreditCard className="w-6 h-6" />}
                {s === 3 && <CheckCircle className="w-6 h-6" />}
              </div>
              {s < 3 && <div className={`step-line ${step > s ? "active" : ""}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* CUPOM */}
              <div className="coupon-row">
                <input
                  type="text"
                  placeholder="Digite seu cupom"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button type="button" onClick={applyCoupon} className="coupon-btn">
                  Aplicar
                </button>
              </div>

              {/* ETAPA 1 */}
              {step === 1 && (
                <div className="fade-section">
                  <h3 className="text-3xl text-[#503020] mb-4">Endereço de Entrega</h3>
                  <div><label>Endereço</label><input name="address" value={formData.address} onChange={handleChange} required /></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label>Número</label><input name="number" value={formData.number} onChange={handleChange} required /></div>
                    <div><label>Complemento</label><input name="complement" value={formData.complement} onChange={handleChange} /></div>
                  </div>

                  <div><label>Bairro</label><input name="neighborhood" value={formData.neighborhood} onChange={handleChange} required /></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label>Cidade</label><input name="city" value={formData.city} onChange={handleChange} required /></div>
                    <div><label>Estado</label><input name="state" value={formData.state} onChange={handleChange} required /></div>
                  </div>

                  <div><label>CEP</label><input name="zipCode" value={formData.zipCode} onChange={handleChange} required /></div>
                </div>
              )}

              {/* ETAPA 2 */}
              {step === 2 && (
                <div className="fade-section">
                  <h3 className="payment-title text-3xl text-[#503020]">Forma de Pagamento</h3>

                  <div className="payment-methods">
                    {["credit", "debit", "pix"].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: m })}
                        className={`payment-btn ${formData.paymentMethod === m ? "active" : ""}`}
                      >
                        {m.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {(formData.paymentMethod === "credit" || formData.paymentMethod === "debit") && (
                    <div className="space-y-5">
                      <div><label>Número do cartão</label><input name="cardNumber" value={formData.cardNumber} onChange={handleChange} required /></div>
                      <div><label>Nome impresso no cartão</label><input name="cardName" value={formData.cardName} onChange={handleChange} required /></div>

                      <div className="grid grid-cols-2 gap-4">
                        <div><label>Validade</label><input name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} required /></div>
                        <div><label>CVV</label><input name="cardCVV" value={formData.cardCVV} onChange={handleChange} required /></div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "pix" && (
                    <p className="pix-info">O QR Code será exibido na próxima etapa.</p>
                  )}
                </div>
              )}

              {/* ETAPA 3 */}
              {step === 3 && (
                <div className="fade-section">
                  <CheckCircle className="confirm-icon" />
                  <h3 className="text-3xl text-[#503020]">Confirmar Pedido</h3>

                  <p>Total: R$ {finalTotal.toFixed(2)}</p>

                  {formData.paymentMethod === "pix" && pixCode && (
                    <div className="mt-4 flex flex-col items-center gap-4">
                      <p>Escaneie para pagar via PIX:</p>
                      <div className="bg-white p-4 rounded-xl shadow-md">
                        <QRCodeCanvas value={pixCode} size={200} />
                      </div>
                      <p className="text-sm break-all text-gray-700 text-center">{pixCode}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 🔥 BOTÕES SEMPRE VISÍVEIS */}
              <div className="action-row mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn-outline"
                  >
                    Voltar
                  </button>
                )}

                <button type="submit" className="btn-primary">
                  {step < 3 ? "Continuar" : "Confirmar Pedido"}
                </button>
              </div>
            </form>
          </div>

          {/* RESUMO */}
          <div className="lg:col-span-1">
            <div className="summary-card">
              <h3 className="summary-title">Resumo do Pedido</h3>

              {items.map(it => (
                <div key={it.id} className="summary-item">
                  <span>{it.name} x {it.quantity}</span>
                  <span>R$ {(it.priceValue * it.quantity).toFixed(2)}</span>
                </div>
              ))}

              {discount > 0 && (
                <div className="summary-discount">
                  <span>Desconto</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-total">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Entrega</span>
                  <span>{deliveryFee === 0 ? "GRÁTIS" : `R$ ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="summary-line total">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
