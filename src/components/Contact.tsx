import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      time: new Date().toLocaleString("pt-BR"),
    };

    emailjs
      .send(
        "service_53l9dea",
        "template_uklmc6e",
        dataToSend,
        "vsJDKbGGd_w2ZWGP0"
      )
      .then(() => {
        alert("Mensagem enviada com sucesso!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao enviar mensagem. Tente novamente.");
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // URLs dos botões
  const telefoneLink = "tel:11987654321";
  const emailLink = "mailto:dolcezzaa.2000@gmail.com";
  const mapaLink =
    "https://www.google.com/maps?q=FATEC+Zona+Leste";

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Header */}
        <div className="header-line"></div>

        <div className="contact-header">
          <span className="contact-badge">Contato</span>
          <h2>Vamos Conversar?</h2>
          <p>Entre em contato conosco e vamos criar juntos o doce perfeito para você</p>
        </div>

        {/* ==== 4 CARDS ACIMA ==== */}
        <div className="contact-cards">

          {/* TELEFONE */}
          <div className="contact-card">
            <div className="icon phone"><Phone /></div>
            <h3>Telefone</h3>
            <p>(11) 98765-4321</p>
            <p>(11) 3456-7890</p>
            <button 
              className="card-btn"
              onClick={() => window.location.href = telefoneLink}
            >
              Ligar Agora →
            </button>
          </div>

          {/* EMAIL */}
          <div className="contact-card">
            <div className="icon email"><Mail /></div>
            <h3>E-mail</h3>
            <p>dolcezzaa.2000@gmail.com</p>
            <p>dolcezzaa.2000@gmail.com</p>
            <button 
              className="card-btn"
              onClick={() => window.location.href = emailLink}
            >
              Enviar E-mail →
            </button>
          </div>

          {/* ENDEREÇO */}
          <div className="contact-card">
            <div className="icon address"><MapPin /></div>
            <h3>Endereço</h3>
            <p>FATEC Zona Leste</p>
            <p>São Paulo, SP</p>
            <button 
              className="card-btn"
              onClick={() => window.open(mapaLink, "_blank")}
            >
              Ver no Mapa →
            </button>
          </div>

          {/* HORÁRIO */}
          <div className="contact-card">
            <div className="icon hours-icon"><Clock /></div>
            <h3>Horário de Funcionamento</h3>
            <p>Segunda a Sexta: 8h - 19h</p>
            <p>Sábado: 8h - 17h</p>
            <p>Domingo: 9h - 14h</p>
          </div>
        </div>

        {/* FORM */}
        <div className="contact-form-wrapper">
          <div className="form-header">
            <MessageCircle />
            <h3>Envie sua Mensagem</h3>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome"
                />
              </div>

              <div className="form-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div className="form-group">
                <label>Assunto *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="orcamento">Solicitar Orçamento</option>
                  <option value="pedido">Fazer Pedido</option>
                  <option value="duvida">Dúvida</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mensagem *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Conte-nos sobre seu pedido..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <Send />
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
