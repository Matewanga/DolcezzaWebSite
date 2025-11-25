import { useState, useEffect } from "react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 200) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

return (
  <div
    onClick={scrollTop}
    style={{
      position: "fixed",
      bottom: "35px",        // ↑ deixa mais alto
      right: "25px",
      background: "black",
      color: "white",
      width: "55px",         // mais gordinho
      height: "55px",
      borderRadius: "50%",   // bolinha perfeita
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "26px",      // seta maior
      fontWeight: "bold",
      zIndex: 9999,
      boxShadow: "0 6px 12px rgba(0,0,0,0.35)",
      transition: "transform 0.2s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    ↑
  </div>
);

}
