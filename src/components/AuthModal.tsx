import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  X,
  Settings,
  History
} from "lucide-react";
import {
  collection,
  getDocs
} from "firebase/firestore";

import "../styles/AuthModal.css";
import logo from "../img/logo.png";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, login, signup, logout } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Seções internas
  const [section, setSection] = useState<"profile" | "history" | "settings">("profile");
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingSection, setLoadingSection] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);

      onClose();
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      setError(err?.message || "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // ---------------------------------------------------------------------------
  // HISTÓRICO
  // ---------------------------------------------------------------------------
  const loadHistory = async () => {
    if (!user) return;
    setLoadingSection(true);

    const ref = collection(db, "users", user.uid, "history");
    const snap = await getDocs(ref);

    const items: any[] = [];
    snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

    setHistoryList(items);
    setLoadingSection(false);
  };

  useEffect(() => {
    if (section === "history") loadHistory();
  }, [section]);

  const updateProfile = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      name: form.name || user.name,
      email: form.email || user.email,
      ...(form.password ? { password: form.password } : {})
    });

    alert("Informações atualizadas!");
  };

  // ---------------------------------------------------------------------------
  // RENDERS
  // ---------------------------------------------------------------------------
  const renderLoginSignup = () => (
    <>
      <div className="auth-header">
        <img src={logo} alt="Logo" className="auth-logo-img" />
        <h2>{isLogin ? "Entrar" : "Criar Conta"}</h2>
      </div>

      <div className="auth-tabs">
        <div className={`auth-tab ${isLogin ? "auth-tab-active" : ""}`} onClick={() => setIsLogin(true)}>Entrar</div>
        <div className={`auth-tab ${!isLogin ? "auth-tab-active" : ""}`} onClick={() => setIsLogin(false)}>Criar Conta</div>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="auth-input-group">
            <label>Nome</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
        )}
        <div className="auth-input-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="auth-input-group">
          <label>Senha</label>
          <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required />
          <span className="auth-icon-right" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>
        {error && <div className="auth-error">{error}</div>}

        <button className="auth-btn" disabled={loading}>
          {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
        </button>
      </form>
    </>
  );

  const renderProfile = () => (
    <div className="account-card">
      <h2>{user.name || "Usuário"}</h2>
      <p>{user.email}</p>

      <div className="account-actions">
        <button onClick={() => setSection("history")} title="Histórico">
          <History size={24} />
        </button>

        <button onClick={() => setSection("settings")} title="Configurações">
          <Settings size={24} />
        </button>
      </div>

      <button onClick={handleLogout} className="auth-btn logout-btn">
        Sair da conta
      </button>
    </div>
  );

  const renderHistory = () => (
    <div className="section-box">
      <h2>Histórico de compras</h2>
      <button className="back-btn" onClick={() => setSection("profile")}>← Voltar</button>

      {loadingSection && <p>Carregando...</p>}
      {!loadingSection && historyList.length === 0 && <p>Nenhuma compra registrada.</p>}

      {!loadingSection && historyList.length > 0 && (
        <ul className="history-list">
          {historyList.map((h) => (
            <li key={h.id} className="history-item">
              <p>Data: {h.date}</p>
              <p>Total: R$ {h.total}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="section-box">
      <h2>Editar suas informações</h2>
      <button className="back-btn" onClick={() => setSection("profile")}>← Voltar</button>

      <div className="auth-input-group">
        <label>Nome</label>
        <input type="text" name="name" defaultValue={user.name} onChange={handleChange} />
      </div>
      <div className="auth-input-group">
        <label>Email</label>
        <input type="email" name="email" defaultValue={user.email} onChange={handleChange} />
      </div>
      <div className="auth-input-group">
        <label>Senha (opcional)</label>
        <input type="password" name="password" onChange={handleChange} />
      </div>

      <button className="auth-btn" onClick={updateProfile}>Salvar alterações</button>
    </div>
  );

  return createPortal(
    <div className="auth-overlay">
      <div className="auth-modal" role="dialog" aria-modal="true">
        <button className="auth-close" onClick={onClose} aria-label="Fechar modal">
          <X size={22} />
        </button>

        {!user ? (
          renderLoginSignup()
        ) : section === "profile" ? (
          renderProfile()
        ) : section === "history" ? (
          renderHistory()
        ) : section === "settings" ? (
          renderSettings()
        ) : null}
      </div>
    </div>,
    document.body
  );
}
