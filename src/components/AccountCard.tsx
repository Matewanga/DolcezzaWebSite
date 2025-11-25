import { useState } from "react";
import { Settings, Star, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AccountCard() {
  const { user } = useAuth(); // Usuário logado
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return <p>Carregando usuário...</p>; // evita erros se user for null

  return (
    <div className="account-card">
      {/* Foto do perfil */}
      <img 
        src={user.photoURL || "/default-avatar.png"} 
        alt="Foto do usuário" 
        className="account-photo"
      />

      {/* Nome e email */}
      <h2>{user.name || "Usuário"}</h2>
      <p>{user.email || "email@exemplo.com"}</p>

      {/* Botões de ação */}
      <div className="account-actions">
        <button onClick={() => alert("Favoritos")} title="Favoritos">
          <Star size={24} />
        </button>
        <button onClick={() => alert("Compras anteriores")} title="Histórico de compras">
          <ShoppingCart size={24} />
        </button>
        <button onClick={() => setIsEditing(!isEditing)} title="Configurações">
          <Settings size={24} />
        </button>
      </div>

      {/* Formulário de edição */}
      {isEditing && (
        <div className="account-edit">
          <input type="text" placeholder="Nome" defaultValue={user.name || ""} />
          <input type="email" placeholder="Email" defaultValue={user.email || ""} />
          <button>Salvar alterações</button>
        </div>
      )}
    </div>
  );
}
