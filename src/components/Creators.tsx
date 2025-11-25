import { Instagram, Linkedin, Github, Globe, ArrowLeft } from "lucide-react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import "../styles/Creators.css";

// IMPORTANDO FOTOS
import joaoImg from "../img/joao.jpeg";
import marianaImg from "../img/mariana.jpeg";
import rebecaImg from "../img/rebeca.jpeg";
import giovannaImg from "../img/giovanna.jpeg";


export default function Creators() {
  const navigate = useNavigate();

  const members = [
    {
      name: "Giovanna Rodrigues",
      bio: "Olá, sou Giovanna! Designer UI/UX e Front-End, apaixonada por criar interfaces intuitivas, funcionais e visualmente marcantes.",
      photo: giovannaImg,
      links: { 
        ln: "https://www.linkedin.com/in/giovanna-aparecida-75269b2b5", 
        gh: "https://github.com/Gihyaa", 
      },
    },
    {
      name: "João Felix",
      bio: "Olá! Eu sou o João Pedro. Tenho interesse em banco de dados, programação, design e inteligência artificial.",
      photo: joaoImg,
      links: { 
        ig: "https://www.instagram.com/j.jo4n/", 
        ln: "https://www.linkedin.com/in/jo4n/", 
        gh: "https://github.com/Joaozin54P", 
      },
    },
    {
      name: "Mariana Ocireu",
      bio: "Olá, eu sou a Mariana, Desenvolvedora Full Stack e Designer UI/UX com foco em IA e Dados.",
      photo: marianaImg,
      links: { 
        ig: "https://instagram.com/marianaociz", 
        ln: "https://www.linkedin.com/in/marianaociz/", 
        gh: "https://github.com/marisouza31", 
        web: "https://marisouza31.github.io/MapaDeCarreira/" 
      },
    },
    {
      name: "Rebeca Matewanga",
      bio: "Olá, eu sou a Rebeca, Desenvolvedora Full Stack, Designer UI/UX com foco em IA e Cibersegurança.",
      photo: rebecaImg,
      links: { 
        ig: "https://instagram.com/matewanga_", 
        ln: "https://www.linkedin.com/in/matewanga", 
        gh: "https://github.com/Matewanga", 
        web: "https://matewanga-folio-ezzl.vercel.app/" 
      },
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">

          {/* LOGO */}
          <div className="navbar-left">
            <img src={logo} alt="Dolcezza" className="navbar-logo-img" />
            <div className="logo-text-wrapper">
              <Link to="/" className="navbar-logo">Dolcezza</Link>
              <div className="logo-sub">Il piacere que derrete</div>
            </div>
          </div>

          {/* LINKS CENTRALIZADOS */}
          <div className="navbar-center">
            <Link to="/" className="nav-item">Início</Link>
          </div>

          {/* BOTÃO VOLTAR */}
          <div className="navbar-right">
            <button onClick={() => navigate(-1)} className="nav-back-btn">
              <ArrowLeft size={18} /> Voltar
            </button>
          </div>

        </div>
      </nav>

      {/* CONTEÚDO */}
      <section className="creators-section">
        <div className="creators-container">
          <h1 className="creators-title">Sobre o Projeto Dolcezza</h1>

          <p className="creators-description justify">
            O <strong>Dolcezza</strong> é um projeto acadêmico desenvolvido em 2025 pelos alunos da 
            <strong> FATEC Zona Leste</strong>, do curso de 
            <strong> Análise e Desenvolvimento de Sistemas (AMS)</strong>.  
            O projeto simula uma plataforma moderna de venda de doces artesanais,
            explorando UI/UX, segurança, banco de dados e boas práticas de desenvolvimento web e mobile.
          </p>

          <p className="creators-description justify">
            Os responsáveis pela criação deste trabalho foram quatro estudantes dedicados
            que uniram criatividade, estética e tecnologia:
          </p>

          {/* CARDS */}
          <div className="creators-grid">
            {members.map((m, i) => (
              <div key={i} className="creator-card">
                <img src={m.photo} alt={m.name} className="creator-photo" />
                <h2 className="creator-name">{m.name}</h2>
                <p className="creator-bio">{m.bio}</p>

                <div className="creator-links fixed-height">
                  <a href={m.links.ig} target="_blank"><Instagram /></a>
                  <a href={m.links.ln} target="_blank"><Linkedin /></a>
                  <a href={m.links.gh} target="_blank"><Github /></a>
                  <a href={m.links.web} target="_blank"><Globe /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">

          <div className="footer-grid">
            <div className="brand">
              <div className="brand-logo">
                <img src={logo} alt="Logo Dolcezza" className="brand-logo-image" />
                <div className="brand-text">
                  <div className="title">Dolcezza</div>
                  <div className="subtitle">Il piacere que derrete</div>
                </div>
              </div>

              <p className="brand-description">
                Transformando momentos em memórias doces desde 2014.
              </p>
            </div>

            <div>
              <h4>Links Rápidos</h4>
              <ul>
                <li><Link to="/">Início</Link></li>
              </ul>
            </div>
          </div>

          <div className="contact-bar">
            <div className="contact-item">
              <MapPin /> <p>Rua dos Doces, 123 - São Paulo</p>
            </div>

            <div className="contact-item">
              <Phone /> <p>(11) 98765-4321</p>
            </div>

            <div className="contact-item">
              <Mail /> <p>dolcezzaa.2000@gmail.com</p>
            </div>
          </div>

          {/* BOTTOM BAR COM LINHA ACIMA */}
          <div className="bottom-bar">
            <div className="bottom-bar-line"></div>
            <p>© 2025 Dolcezza. Todos os direitos reservados.</p>
          </div>

        </div>
      </footer>
    </>
  );
}
