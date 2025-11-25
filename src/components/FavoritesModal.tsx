import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/FavoritesModal.css";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!isOpen) return null;

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);

      try {
        const favRef = collection(db, "users", user.uid, "favorites");
        const favSnap = await getDocs(favRef);

        const favList: any[] = [];

        for (const favDoc of favSnap.docs) {
          const productRef = doc(db, "products", favDoc.id);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            favList.push({ id: productSnap.id, ...productSnap.data() });
          }
        }

        setFavorites(favList);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  return createPortal(
    <div className="fav-overlay">
      <div className="fav-modal">
        <button className="fav-close" onClick={onClose}>
          <X size={22} />
        </button>

        <h2 className="fav-title">Seus Favoritos</h2>

        {loading ? (
          <p className="fav-loading">Carregando...</p>
        ) : favorites.length === 0 ? (
          <p className="fav-empty">Você ainda não favoritou nenhum produto 😢</p>
        ) : (
          <div className="fav-grid">
            {favorites.map(product => (
              <div key={product.id} className="fav-card">
                <img src={product.image} alt={product.name} className="fav-img" />
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
