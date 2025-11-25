// src/components/ProfileModal.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Settings, History, ArrowLeft, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../styles/ProfileModal.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user: authUser, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Carregar dados do usuário
  useEffect(() => {
    if (!authUser) return;
    const fetchUserData = async () => {
      const userRef = doc(db, "users", authUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          address: data.addressInfo?.address || "",
          number: data.addressInfo?.number || "",
          complement: data.addressInfo?.complement || "",
          neighborhood: data.addressInfo?.neighborhood || "",
          city: data.addressInfo?.city || "",
          state: data.addressInfo?.state || "",
          zipCode: data.addressInfo?.zipCode || "",
        });
      }
    };
    fetchUserData();
  }, [authUser]);

  // Carregar histórico de pedidos
  useEffect(() => {
    if (!authUser || activeTab !== "history") return;

    const fetchHistory = async () => {
      const historyRef = collection(db, "users", authUser.uid, "history");
      const q = query(historyRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const orders = snap.docs.map(doc => {
        const data = doc.data();
        // Calcular finalTotal caso não exista
        const finalTotal =
          data.total && data.discountApplied
            ? Math.max(data.total - data.discountApplied, 0)
            : data.total || 0;
        return { id: doc.id, ...data, finalTotal };
      });
      setHistoryData(orders);
    };

    fetchHistory();
  }, [authUser, activeTab]);

  if (!isOpen || !authUser) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const handleSaveProfile = async () => {
    if (!authUser) return;
    const userRef = doc(db, "users", authUser.uid);
    await updateDoc(userRef, {
      name: form.name,
      addressInfo: {
        address: form.address,
        number: form.number,
        complement: form.complement,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      },
      updatedAt: serverTimestamp(),
    });
    alert("Perfil atualizado!");
    setIsEditing(false);
    setUserData({ ...userData, name: form.name, addressInfo: form });
  };

  return createPortal(
    <div className="auth-overlay">
      <div className="profile-modal">

        <button className="auth-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="profile-icon-wrapper">
          <User className="profile-icon" size={60} />
        </div>

        <h2 className="profile-name-display">{form.name}</h2>
        <p className="profile-email-display">{form.email}</p>

        <div className="profile-tabs">
          <button
            className={activeTab === "profile" ? "tab active" : "tab"}
            onClick={() => setActiveTab("profile")}
          >
            <Settings size={18} /> Perfil
          </button>

          <button
            className={activeTab === "history" ? "tab active" : "tab"}
            onClick={() => setActiveTab("history")}
          >
            <History size={18} /> Histórico
          </button>
        </div>

        {/* Aba Perfil */}
        {activeTab === "profile" && (
          <div className="profile-section scroll-area">
            {!isEditing && (
              <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </button>
            )}

            {isEditing && (
              <div className="profile-edit-form scroll-area">
                <button className="back-btn" onClick={() => setIsEditing(false)}>
                  <ArrowLeft size={22} />
                </button>

                <label>Nome:</label>
                <input name="name" value={form.name} onChange={handleChange} />

                <label>Endereço:</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Rua" />
                <input name="number" value={form.number} onChange={handleChange} placeholder="Número" />
                <input name="complement" value={form.complement} onChange={handleChange} placeholder="Complemento" />
                <input name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="Bairro" />
                <input name="city" value={form.city} onChange={handleChange} placeholder="Cidade" />
                <input name="state" value={form.state} onChange={handleChange} placeholder="Estado" maxLength={2} />
                <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="CEP" />

                <button className="save-btn" onClick={handleSaveProfile}>
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        )}

        {/* Aba Histórico */}
        {activeTab === "history" && (
          <div className="profile-section scroll-area">
            <button className="back-btn" onClick={() => setActiveTab("profile")}>
              <ArrowLeft size={22} />
            </button>

            <h3>📦 Histórico de Compras</h3>

            {historyData.length === 0 ? (
              <p>Você ainda não fez pedidos.</p>
            ) : (
              <div className="orders-container">
                {historyData.map(order => (
                  <div key={order.id} className="order-card">
                    <p><strong>Pedido:</strong> {order.orderId}</p>
                    <p><strong>Total:</strong> R$ {(order.total ?? 0).toFixed(2)}</p>
                    {order.discountApplied > 0 && (
                      <>
                        <p><strong>Desconto:</strong> R$ {(order.discountApplied ?? 0).toFixed(2)}</p>
                        <p><strong>Total Final:</strong> R$ {(order.finalTotal ?? 0).toFixed(2)}</p>
                        <p><strong>Cupom:</strong> {order.couponCode || "-"}</p>
                      </>
                    )}
                    <p><strong>Data:</strong> {order.createdAt?.toDate?.().toLocaleString()}</p>
                    <p><strong>Endereço:</strong> {order.deliveryAddress?.address}, {order.deliveryAddress?.number} - {order.deliveryAddress?.city}/{order.deliveryAddress?.state}</p>

                    <p><strong>Produtos:</strong></p>
                    <div className="product-cards">
                      {order.products?.map((p: any, i: number) => (
                        <div key={i} className="product-card">
                          <p><strong>{p.name}</strong></p>
                          <p>Quantidade: {p.quantity}</p>
                          <p>Preço: R$ {(p.price ?? p.priceValue ?? 0).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button className="auth-btn logout-btn" onClick={handleLogout}>
          Sair da Conta
        </button>
      </div>
    </div>,
    document.body
  );
}
