// src/App.tsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { Features } from "./components/Features";
import { About } from "./components/About";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { BackToTop } from "./components/BackToTop";
import { ProfileModal } from "./components/ProfileModal";

import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import Creators from "./components/Creators";

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showFavorites, setShowFavorites] = useState(false);

  const { totalItems, addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleAddToCart = (event: any) => {
      const product = event.detail;
      if (!user || !user.uid) {
        setIsAuthModalOpen(true);
        return;
      }
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        priceValue: product.priceValue,
        image: product.image,
      });
    };
    window.addEventListener("addToCart", handleAddToCart);
    return () => window.removeEventListener("addToCart", handleAddToCart);
  }, [user, addToCart]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const getUserData = () => {
    if (!user) return null;
    return {
      uid: user.uid,
      name: user.displayName || user.name || "Usuário",
      email: user.email || "sem-email@exemplo.com",
      photoURL: user.photoURL || "/default-avatar.png",
    };
  };

  const userData = getUserData();

  return (
    <div className="min-h-screen bg-white">
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenFavorites={() => {
          setSelectedCategory("Favoritos");
          setShowFavorites(true);
          const favSection = document.getElementById("products");
          if (favSection) favSection.scrollIntoView({ behavior: "smooth" });
        }}
        onSearch={(term) => {
          setSearchTerm(term);
          setShowFavorites(false);
        }}
        setSelectedCategory={setSelectedCategory}
      />

      <main>
        <Hero />
        <Products
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat);
            setShowFavorites(cat === "Favoritos");
          }}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          setSearchTerm={setSearchTerm}
        />
        <Features />
        <About />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <BackToTop />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isProfileOpen && userData && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userData={userData}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Routes sem criar outro <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/creators" element={<Creators />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
