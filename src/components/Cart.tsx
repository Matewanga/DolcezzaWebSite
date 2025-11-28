// src/components/Cart.tsx
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "../styles/Cart.css";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

interface Coupon {
  code: string;
  discount: number;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const coupons: Coupon[] = [
    { code: "DOLCEZZAAMELHOR", discount: 30 },
    { code: "O DOCERIA", discount: 5 },
    { code: "DOLCEZZA", discount: 10 },
  ];

  if (!isOpen) return null;

  const deliveryFee = totalPrice >= 100 ? 0 : 10;
  const finalTotal = Math.max(totalPrice + deliveryFee - discount, 0);

  const handleCheckout = () => {
    if (!user || !user.uid) {
      window.dispatchEvent(new CustomEvent("openAuthModal"));
      return;
    }
    onCheckout();
  };

  const handleExploreProducts = () => {
    onClose();
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyCoupon = () => {
    if (couponApplied) {
      alert("Cupom já foi aplicado!");
      return;
    }

    const foundCoupon = coupons.find(c => c.code.toUpperCase() === coupon.toUpperCase());
    if (foundCoupon) {
      setDiscount(foundCoupon.discount);
      setCouponApplied(true);
      window.dispatchEvent(new CustomEvent("cartCouponApplied", { detail: foundCoupon.discount }));
      alert(`Cupom aplicado: R$${foundCoupon.discount} de desconto!`);
    } else {
      alert("Cupom inválido");
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-icon-circle">
              <ShoppingBag className="cart-icon" />
            </div>
            <div>
              <h2 className="cart-title">Meu Carrinho</h2>
              <p className="cart-items-count">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="cart-close-btn" aria-label="Fechar carrinho">
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag className="cart-empty-svg" />
              </div>
              <h3>Carrinho Vazio</h3>
              <p>Adicione produtos deliciosos ao seu carrinho</p>
              <button onClick={handleExploreProducts} className="cart-btn">
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-remove-btn"
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 />
                      </button>
                    </div>
                    <p className="cart-item-price">R$ {(item.priceValue * item.quantity).toFixed(2)}</p>
                    <div className="cart-quantity">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="cart-qty-btn"
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        <Minus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="cart-qty-btn"
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-coupon">
              <input
                type="text"
                placeholder="Cupom de desconto"
                className="cart-coupon-input"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                className="cart-coupon-btn"
                onClick={handleApplyCoupon}
              >
                Aplicar
              </button>
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Entrega:</span>
                <span className={deliveryFee === 0 ? "free-delivery" : ""}>
                  {deliveryFee === 0 ? "GRÁTIS" : `R$ ${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {totalPrice < 100 && (
                <p className="cart-summary-note">
                  Faltam R$ {(100 - totalPrice).toFixed(2)} para entrega grátis
                </p>
              )}
              {discount > 0 && (
                <div className="cart-summary-row text-green-700 font-semibold">
                  <span>Desconto:</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-summary-total">
                <span>Total:</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="cart-checkout-btn" aria-label="Finalizar pedido">
              Finalizar Pedido <ArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
