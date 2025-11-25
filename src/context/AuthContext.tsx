// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";

// 🔥 EXTENSÃO DO USER DO FIREBASE
interface ExtendedUser extends User {
  favorites?: any[];
  paymentData?: any;
  phone?: string;
  name?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  savePaymentData: (data: any) => Promise<void>;
  getPaymentData: () => Promise<any>;
  addOrderToHistory: (order: Order) => Promise<void>;
}

// 🔥 Estrutura do pedido
interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  products: Product[];
  total: number;
  discount?: number;
  couponCode?: string;
  deliveryAddress?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LISTENER DO FIREBASE LOGIN
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setUser({
            ...firebaseUser,
            name: data.name || firebaseUser.displayName || "",
            phone: data.phone || "",
            favorites: data.favorites || [],
            paymentData: data.paymentData || null,
          });
        } else {
          setUser({
            ...firebaseUser,
            name: firebaseUser.displayName || "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔥 LOGIN
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🔥 SIGNUP + HISTÓRICO INICIAL
  const signup = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (!cred.user) return;

    await updateProfile(cred.user, { displayName: name });

    // Cria documento do usuário
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      name,
      phone: "",
      email,
      createdAt: serverTimestamp(),
      favorites: [],
      paymentData: null,
    });

    // Cria subcoleção "history" inicial
    const historyRef = collection(db, "users", cred.user.uid, "history");
    await addDoc(historyRef, {
      createdAt: serverTimestamp(),
      message: "Histórico inicial",
      orderId: "0000",
      products: [],
      total: 0,
      discount: 0,
      finalTotal: 0,
      deliveryAddress: null,
    });

    setUser({
      ...cred.user,
      name,
      phone: "",
      favorites: [],
      paymentData: null,
    });
  };

  // 🔥 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🔥 SALVAR CARTÃO
  const savePaymentData = async (data: any) => {
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      { paymentData: data },
      { merge: true }
    );

    setUser((prev) =>
      prev
        ? {
            ...prev,
            paymentData: data,
          }
        : prev
    );
  };

  // 🔥 PEGAR CARTÃO
  const getPaymentData = async () => {
    if (!user) return null;

    const snap = await getDoc(doc(db, "users", user.uid));
    return snap.exists() ? snap.data().paymentData || null : null;
  };

  // 🔥 ADICIONAR PEDIDO AO HISTÓRICO (com cálculo de desconto)
  const addOrderToHistory = async (order: Order) => {
    if (!user) return;

    const historyRef = collection(db, "users", user.uid, "history");
    const discount = order.discount || 0;
    const finalTotal = order.total - discount;

    await addDoc(historyRef, {
      ...order,
      finalTotal,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        savePaymentData,
        getPaymentData,
        addOrderToHistory,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
