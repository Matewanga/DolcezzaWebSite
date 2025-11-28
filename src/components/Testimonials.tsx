import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../styles/Testimonials.css";

export function Testimonials() {
  const { user } = useAuth();

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [average, setAverage] = useState(0);

  // form
  const [newContent, setNewContent] = useState("");
  const [newRating, setNewRating] = useState(5);

  // edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  // 🔥 1 — Buscar depoimentos
  const fetchTestimonials = async () => {
    const allUsers = await getDocs(collection(db, "users"));
    let list: any[] = [];

    for (let u of allUsers.docs) {
      const tRef = collection(db, "users", u.id, "testimonials");
      const tSnap = await getDocs(tRef);

      tSnap.forEach((doc) => {
        list.push({
          id: doc.id,
          userId: u.id,
          ...doc.data(),
        });
      });
    }

    setTestimonials(list);

    // média
    if (list.length > 0) {
      const avg =
        list.reduce((acc, cur) => acc + (cur.rating || 0), 0) / list.length;
      setAverage(avg);
    } else {
      setAverage(0);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // 🔥 2 — Adicionar depoimento
  const addTestimonial = async () => {
    if (!user) return alert("Você precisa estar logado!");

    if (newContent.trim() === "") return alert("Escreva algo!");

    await addDoc(collection(db, "users", user.uid, "testimonials"), {
      content: newContent,
      rating: newRating,
      createdAt: serverTimestamp(),
      userName: user.displayName || "Usuário",
    });

    setNewContent("");
    setNewRating(5);

    fetchTestimonials();
  };

  // 🔥 3 — Atualizar depoimento
  const saveEdit = async () => {
    if (!editingId) return;

    const ref = doc(db, "users", user!.uid, "testimonials", editingId);

    await updateDoc(ref, {
      content: editContent,
      rating: editRating,
    });

    setEditingId(null);
    fetchTestimonials();
  };

  // 🔥 4 — Apagar depoimento
  const deleteTestimonial = async (t: any) => {
    if (!user) return;
    if (t.userId !== user.uid)
      return alert("Você só pode excluir o seu depoimento!");

    const ref = doc(db, "users", user.uid, "testimonials", t.id);
    await deleteDoc(ref);

    fetchTestimonials();
  };

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        {/* HEADER */}
        <div className="header">
          <span className="tag">Depoimentos</span>
          <h2>O Que Nossos Clientes Dizem</h2>
          <p>A satisfação dos nossos clientes é nossa maior conquista</p>

          <p className="average-rating">
            Avaliação média: ⭐ <b>{average.toFixed(1)}</b>
          </p>
        </div>

        {/* LISTA */}
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="quote-icon">
                <Quote className="quote-svg" />
              </div>

              <div className="avatar-row">
                <div className="avatar">😊</div>
                <div>
                  <h4>{t.userName || "Cliente"}</h4>
                </div>
              </div>

              <div className="stars">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="star" />
                ))}
              </div>

              <p className="content">"{t.content}"</p>

              {user?.uid === t.userId && (
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(t.id);
                      setEditContent(t.content);
                      setEditRating(t.rating);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTestimonial(t)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FORMULÁRIO DE ADICIONAR */}
        {user && (
          <div className="add-box">
            <h3>Deixe seu depoimento</h3>

            <textarea
              placeholder="Escreva seu comentário..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />

            <label className="label-strong">Avaliação:</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
            >
              <option value={5}>5 estrelas</option>
              <option value={4}>4 estrelas</option>
              <option value={3}>3 estrelas</option>
              <option value={2}>2 estrelas</option>
              <option value={1}>1 estrela</option>
            </select>

            <button className="send-btn" onClick={addTestimonial}>
              Enviar
            </button>
          </div>
        )}

        {/* MODAL DE EDIÇÃO */}
        {editingId && (
          <div className="modal">
            <div className="modal-content">
              <h3>Editar Depoimento</h3>

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />

              <select
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
              >
                <option value={5}>5 estrelas</option>
                <option value={4}>4 estrelas</option>
                <option value={3}>3 estrelas</option>
                <option value={2}>2 estrelas</option>
                <option value={1}>1 estrela</option>
              </select>

              <div className="modal-actions">
                <button className="save-btn" onClick={saveEdit}>
                  Salvar
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingId(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
