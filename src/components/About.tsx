import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle, Users, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/About.css"; // <-- IMPORTA O CSS SEPARADO

export function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-grid">
          
          {/* Images */}
          <div className="about-images">
            <div className="about-images-grid">

              <div className="main-image-wrapper">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1691052154815-6247a3cfedd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Confeiteira trabalhando"
                  className="main-image"
                />
              </div>

              <div className="small-image-wrapper">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Produtos"
                  className="small-image"
                />
              </div>

              <div className="small-image-wrapper">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Bolo"
                  className="small-image"
                />
              </div>
            </div>

            {/* Floating Card */}
            <div className="floating-card">
              <div className="floating-content">
                <div className="floating-icon">
                  <Users className="floating-icon-inner" />
                </div>
                <div>
                  <p className="floating-number">5000+</p>
                  <p className="floating-label">Clientes Felizes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="about-content">
            <div>
              <span className="about-badge">Nossa História</span>
              <h2 className="about-title">Uma História de Paixão e Dedicação</h2>

              <p className="about-text-lg">
                Há mais de 10 anos, a Dolcezza nasceu do sonho de transformar momentos simples em memórias doces e inesquecíveis.
              </p>

              <p className="about-text-md">
                Nossa missão é proporcionar experiências únicas através de sabores autênticos, sempre utilizando ingredientes selecionados e técnicas tradicionais combinadas com toques modernos.
              </p>
            </div>

            <div className="about-stats">
              <div className="about-stat-card">
                <TrendingUp className="stat-icon" />
                <p className="stat-number">98%</p>
                <p className="stat-label">Satisfação dos Clientes</p>
              </div>

              <div className="about-stat-card">
                <Heart className="stat-icon" />
                <p className="stat-number">50+</p>
                <p className="stat-label">Produtos Diferentes</p>
              </div>
            </div>

            <div className="about-checklist">
              {[
                "Ingredientes 100% naturais e selecionados",
                "Produção artesanal e diária",
                "Receitas exclusivas desenvolvidas por especialistas",
                "Atendimento personalizado para cada cliente",
              ].map((item, index) => (
                <div key={index} className="check-item">
                  <CheckCircle className="check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link to="/creators" className="about-button">
              Conheça Nossa História Completa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
