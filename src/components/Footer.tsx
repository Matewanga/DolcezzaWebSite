import { MapPin, Phone, Mail } from "lucide-react"; 
import logo from "../img/logo.png"; 
import "../styles/Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        {/* GRID PRINCIPAL */}
        <div className="footer-grid">
          
          {/* BRAND / LOGO */}
          <div className="brand">
            <div className="brand-logo">
              <img src={logo} alt="Logo Dolcezza" className="brand-logo-image" />
              <div className="brand-text">
                <div className="title">Dolcezza</div>
                <div className="subtitle">Il piacere che derrete</div>
              </div>
            </div>

            <p className="brand-description">
              Transformando momentos em memórias doces desde 2014. Qualidade,
              sabor e dedicação em cada produto.
            </p>
          </div>

          {/* LINKS RÁPIDOS */}
          <div>
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="#home">Início</a></li>
              <li><a href="#products">Produtos</a></li>
              <li><a href="#about">Sobre Nós</a></li>
              <li><a href="#testimonials">Depoimentos</a></li>
              <li><a href="#contact">Contato</a></li>
            </ul>
          </div>

          {/* CATEGORIAS */}
          <div>
            <h4>Categorias</h4>
            <ul>
              <li>Bolos Personalizados</li>
              <li>Cupcakes Gourmet</li>
              <li>Macarons Franceses</li>
              <li>Donuts Artesanais</li>
              <li>Bolos de Casamento</li>
              <li>Encomendas Especiais</li>
            </ul>
          </div>
        </div>

        {/* BARRA DE CONTATO */}
        <div className="contact-bar">
          <div className="contact-item">
            <MapPin className="w-5 h-5 text-[#ffaaaa]" />
            <div>
              <p>Endereço</p>
              <p>Rua dos Doces, 123 - São Paulo</p>
            </div>
          </div>

          <div className="contact-item">
            <Phone className="w-5 h-5 text-[#ffaaaa]" />
            <div>
              <p>Telefone</p>
              <p>(11) 98765-4321</p>
            </div>
          </div>

          <div className="contact-item">
            <Mail className="w-5 h-5 text-[#ffaaaa]" />
            <div>
              <p>E-mail</p>
              <p>dolcezzaa.2000@gmail.com</p>
            </div>
          </div>
        </div>

        {/* RODAPÉ FINAL */}
        <div className="bottom-bar">
          <div className="bottom-bar-line"></div> {/* LINHA ACIMA DO TEXTO */}
          <p>© 2025 Dolcezza. Todos os direitos reservados.</p>

          <div className="footer-links">
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Uso</a>
            <a href="#">Cookies</a>
            <a href="#">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
