import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

// Listener Real-time untuk Data Produk & Stok
export const subscribeProducts = (callback) => {
  return onSnapshot(collection(db, "products"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// Listener Real-time untuk Semua Transaksi
export const subscribeTransactions = (callback) => {
  const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Konversi Timestamp Firebase ke JavaScript Date
      dateObj: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
    }));
    callback(data);
  });
};

// Filter Transaksi berdasarkan Periode ('daily' | 'weekly' | 'monthly' | 'yearly')
export const filterTransactionsByPeriod = (transactions, period) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return transactions.filter((tx) => {
    const txDate = tx.dateObj;
    if (period === "daily") {
      return txDate >= startOfDay;
    }
    if (period === "weekly") {
      const sevenDaysAgo = new Date(startOfDay);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return txDate >= sevenDaysAgo;
    }
    if (period === "monthly") {
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    }
    if (period === "yearly") {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
};