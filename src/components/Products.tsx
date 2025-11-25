import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import "../styles/Products.css";

const categoriesBase = ["Todos", "Bolos", "Cupcakes", "Biscoitos", "Tortas", "Docinhos", "Gelados", "Lanches Finos", "Bebidas", "Especial"];

interface ProductsProps {
  searchTerm: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showFavorites?: boolean;
  setShowFavorites?: (show: boolean) => void;
  setSearchTerm?: (term: string) => void;
}

export function Products({
  searchTerm,
  selectedCategory,
  setSelectedCategory,
  showFavorites = false,
  setShowFavorites,
  setSearchTerm,
}: ProductsProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // posição salva antes de clicar em VER MAIS
  const [lastScrollPosition, setLastScrollPosition] = useState<number | null>(null);

  // Buscar produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const items: any[] = [];
        snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao carregar produtos.");
      }
    };
    fetchProducts();
  }, []);

  // Buscar favoritos
  useEffect(() => {
    if (!user || !user.uid) return;

    const fetchFavorites = async () => {
      try {
        const favCol = collection(db, "users", user.uid, "favorites");
        const snapshot = await getDocs(favCol);
        setFavorites(snapshot.docs.map(doc => doc.id));
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Alternar favorito
  const toggleFavorite = async (product: any) => {
    if (!user || !user.uid) {
      toast.error("Faça login para favoritar produtos!");
      return;
    }

    try {
      const favRef = doc(db, "users", user.uid, "favorites", product.id);
      const favSnap = await getDoc(favRef);

      if (favSnap.exists()) {
        await deleteDoc(favRef);
        setFavorites(prev => prev.filter(id => id !== product.id));
        toast("Produto removido dos favoritos");
      } else {
        await setDoc(favRef, { createdAt: serverTimestamp() });
        setFavorites(prev => [...prev, product.id]);
        toast.success("Produto favoritado!");
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      toast.error("Ocorreu um erro ao atualizar seus favoritos.");
    }
  };

  const handleAddToCart = (product: any) => {
    const event = new CustomEvent("addToCart", { detail: product });
    window.dispatchEvent(event);
  };

  // FILTRAGEM
  let filteredProducts = products;

  if (showFavorites) {
    filteredProducts = filteredProducts.filter(p => favorites.includes(p.id));
  }

  filteredProducts = filteredProducts.filter(
    p =>
      selectedCategory === "Todos" ||
      selectedCategory === "Favoritos" ||
      p.category === selectedCategory
  );

  filteredProducts = filteredProducts.filter(
    p => searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const categories = [...categoriesBase, "Favoritos"];

  return (
    <section id="products" className="products-section">
      <Toaster position="top-right" />

      <div className="products-container">

        {/* Categorias */}
        <div className="category-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(6);
                if (setSearchTerm) setSearchTerm("");

                if (cat === "Favoritos" && setShowFavorites) setShowFavorites(true);
                else if (setShowFavorites) setShowFavorites(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="products-grid">
          {visibleProducts.length > 0 ? (
            visibleProducts.map(product => (
              <div className="product-card" key={product.id} id={product.id}>
                <div className="product-image-wrapper">
                  <ImageWithFallback src={product.image} alt={product.name} className="product-image" />

                  {product.badge && <div className="product-badge">{product.badge}</div>}

                  {/* Favorito */}
                  <button className="fav-btn" onClick={() => toggleFavorite(product)}>
                    <Heart className={`fav-icon ${favorites.includes(product.id) ? "fav-active" : ""}`} />
                  </button>

                  <div className="quick-add">
                    <button className="add-cart-btn" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart /> Adicionar ao Carrinho
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`star-icon ${i < Math.floor(product.rating) ? "star-filled" : ""}`}
                      />
                    ))}
                    <span className="rating-text">{product.rating} ({product.reviews})</span>
                  </div>

                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>

                  <div className="product-bottom">
                    <span className="product-price">{product.price}</span>

                    <button className="small-cart-btn" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="small-cart-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="dropdown-empty">
              {showFavorites ? "Nenhum produto favoritado" : "Nenhum produto encontrado"}
            </p>
          )}
        </div>

        {/* Ver Mais / Ver Menos */}
        <div className="view-more-wrapper">
          {visibleCount < filteredProducts.length && (
            <button
              className="view-more-btn"
              onClick={() => {
                setLastScrollPosition(window.scrollY); // salva onde estava
                setVisibleCount(prev => prev + 6);
              }}
            >
              Ver Mais Produtos
            </button>
          )}

          {visibleCount > 6 && (
            <button
              className="view-more-btn"
              onClick={() => {
                setVisibleCount(prev => prev - 6);

                if (lastScrollPosition !== null) {
                  setTimeout(() => {
                    window.scrollTo({
                      top: lastScrollPosition,
                      behavior: "smooth",
                    });
                  }, 150);
                }
              }}
            >
              Ver Menos Produtos
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
