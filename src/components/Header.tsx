import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, User, Heart, Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import logo from "../img/logo.png";
import "../styles/Header.css";

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenFavorites: () => void;
  onSearch: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
}

let productsCache: any[] | null = null;

export default function Header({
  onOpenAuth,
  onOpenCart,
  onOpenProfile,
  onOpenFavorites,
  onSearch,
  setSelectedCategory,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { totalItems } = useCart();
  const { user } = useAuth();
  const headerRef = useRef<HTMLDivElement | null>(null);

  /* CLICK FORA */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
        setIsSearchMobileOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* BUSCAR PRODUTOS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (productsCache) {
          setProducts(productsCache);
          return;
        }
        const snapshot = await getDocs(collection(db, "products"));
        const items: any[] = [];
        snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));

        productsCache = items;
        setProducts(items);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  /* FILTRAR */
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setIsDropdownOpen(false);
      return;
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
    setIsDropdownOpen(true);
  }, [searchTerm, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleAddToCart = (product: any) => {
    const event = new CustomEvent("addToCart", { detail: product });
    window.dispatchEvent(event);
  };

  /* 🔥 SCROLL ATÉ O PRODUTO EXATO */
  const handleItemClick = (product: any) => {
    const targetId = product.id;

    setSelectedCategory(product.category);

    const tryScroll = async () => {
      let item = document.getElementById(targetId);
      let attempts = 0;

      while (!item && attempts < 30) {
        const btn = document.querySelector(".view-more-btn") as HTMLButtonElement;
        if (btn) btn.click();

        await new Promise((r) => setTimeout(r, 200));

        item = document.getElementById(targetId);
        attempts++;
      }

      if (item) {
        const headerH = headerRef.current?.offsetHeight || 0;

        const y =
          item.getBoundingClientRect().top +
          window.scrollY -
          headerH -
          10;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    tryScroll();

    setSearchTerm("");
    setIsDropdownOpen(false);
    setIsSearchMobileOpen(false);
    onSearch("");
  };

  return (
    <header className="navbar-main" ref={headerRef}>
      <div className="container-header">

        <a href="#home" className="header-logo">
          <div className="logo-circle">
            <img src={logo} alt="Dolcezza Logo" />
          </div>
          <div className="logo-text">
            <div className="logo-title">Dolcezza</div>
            <div className="logo-sub">Il piacere che derrette</div>
          </div>
        </a>

        {/* 🔎 DESKTOP SEARCH — sem lupa */}
        <div className="header-search-desktop">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />

          {isDropdownOpen && filteredProducts.length > 0 && (
            <div className="search-dropdown">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="dropdown-item"
                  onClick={() => handleItemClick(p)}
                >
                  <img src={p.image} className="dropdown-img" />
                  <div className="drop-text">
                    <div className="dropdown-name">{p.name}</div>
                    <div className="dropdown-cat">{p.category}</div>
                  </div>

                  <button
                    className="dropdown-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isDropdownOpen && filteredProducts.length === 0 && (
            <div className="search-dropdown dropdown-empty">
              Nenhum produto encontrado
            </div>
          )}
        </div>

        <nav className={`nav-links ${isMenuOpen ? "nav-open" : ""}`}>
          <a href="#home">Início</a>
          <a href="#products">Produtos</a>
          <a href="#about">Sobre</a>
          <a href="#contact">Contato</a>
        </nav>

        <div className="header-buttons">
          <button
            className="btn-fav"
            onClick={() => {
              if (!user) return onOpenAuth();
              onOpenFavorites();
            }}
          >
            <Heart className="icon-24" />
          </button>

          <button onClick={onOpenCart} className="btn-cart">
            <ShoppingCart className="icon-24" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          <button
            onClick={user ? onOpenProfile : onOpenAuth}
            className="btn-login"
          >
            <User className="icon-20" />
            <span>{user ? user.name || "Minha Conta" : "Entrar"}</span>
          </button>

          <button
            className="btn-mobile-menu"
            onClick={() => setIsMenuOpen((s) => !s)}
          >
            {isMenuOpen ? <X className="icon-28" /> : <Menu className="icon-28" />}
          </button>

          {/* 🔍 MOBILE SEARCH */}
          <button
            className="btn-mobile-search"
            onClick={() => setIsSearchMobileOpen((s) => !s)}
          >
            <Search className="icon-24" />
          </button>
        </div>
      </div>

      {isSearchMobileOpen && (
        <div className="mobile-search-panel">
          <div className="mobile-search-top">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
              className="mobile-search-input"
            />

            <button
              className="mobile-search-close"
              onClick={() => {
                setIsSearchMobileOpen(false);
                setIsDropdownOpen(false);
                setSearchTerm("");
              }}
            >
              <X className="icon-24" />
            </button>
          </div>

          {isDropdownOpen && (
            <div className="mobile-search-results">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="mobile-result-item"
                    onClick={() => handleItemClick(p)}
                  >
                    <img src={p.image} className="mobile-result-img" />
                    <div>
                      <div className="mobile-result-name">{p.name}</div>
                      <div className="mobile-result-cat">{p.category}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dropdown-empty">Nenhum produto encontrado</div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
