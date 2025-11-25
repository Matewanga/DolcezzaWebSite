// Hero.jsx
import "../styles/Hero.css";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronRight, Star, Award, Truck } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="hero-section">

      {/* Círculos decorativos */}
      <div className="hero-deco-circle hero-deco-1"></div>
      <div className="hero-deco-circle hero-deco-2"></div>

      <div className="hero-container">
        <div className="hero-grid">

          {/* ================= TEXT CONTENT ================= */}
          <div className="hero-text">

            <h1 className="hero-title">
              Doces que
              <span>Encantam</span>
              seu Paladar
            </h1>

            <p className="hero-subtext">
              Criamos experiências doces inesquecíveis com ingredientes premium e receitas exclusivas.  
              Cada doce é uma obra de arte feita especialmente para você.
            </p>

            <div className="hero-buttons">
              <a href="#products" className="hero-btn hero-btn-primary">
                Explorar Produtos
                <ChevronRight className="arrow-icon" />
              </a>

              <a href="#contact" className="hero-btn hero-btn-secondary">
                Fazer Pedido Personalizado
              </a>
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <div className="hero-feature-icon"><Award size={26} /></div>
                <p>Qualidade Premium</p>
              </div>

              <div className="hero-feature">
                <div className="hero-feature-icon"><Truck size={26} /></div>
                <p>Entrega Rápida</p>
              </div>

              <div className="hero-feature">
                <div className="hero-feature-icon"><Star size={26} /></div>
                <p>5000+ Clientes</p>
              </div>
            </div>
          </div>

          {/* ================= IMAGE CONTENT ================= */}
          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1672698977671-9eb551549dcb?auto=format&fit=crop&w=1100&q=80"
                alt="Mesa de doces elegante"
                className="hero-image"
              />

              <div className="hero-image-overlay"></div>
            </div>

            <div className="hero-image-circle1"></div>
            <div className="hero-image-circle2"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
