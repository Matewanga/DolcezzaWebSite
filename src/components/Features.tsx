import { Award, Truck, Clock, Heart, Shield, Sparkles } from "lucide-react";
import "../styles/Features.css"; // <-- IMPORTA O CSS SEPARADO

const features = [
  {
    icon: Award,
    title: "Qualidade Premium",
    description: "Ingredientes selecionados e de origem controlada para garantir o melhor sabor",
  },
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Entrega no mesmo dia para pedidos até 14h. Grátis acima de R$ 100",
  },
  {
    icon: Clock,
    title: "Produção Diária",
    description: "Todos os produtos são feitos frescos diariamente pela manhã",
  },
  {
    icon: Heart,
    title: "Feito com Amor",
    description: "Cada doce é preparado com dedicação e carinho pelos nossos confeiteiros",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Certificações sanitárias e padrões de qualidade rigorosos",
  },
  {
    icon: Sparkles,
    title: "Personalização",
    description: "Criamos doces sob medida para sua ocasião especial",
  },
];

export function Features() {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <span className="features-badge">Por Que Escolher a Doce Encanto</span>
          <h2 className="features-title">Diferenciais Únicos</h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon className="feature-icon" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
