import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

// 1. Listener Real-time Data Produk & Stok
export const subscribeProducts = (callback) => {
  const order = { kecil: 1, sedang: 2, besar: 3 };
  return onSnapshot(collection(db, "products"), (snapshot) => {
    const data = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (order[a.id] || 99) - (order[b.id] || 99));
    callback(data);
  });
};

// 2. Listener Real-time Data Transaksi Penjualan
export const subscribeTransactions = (callback) => {
  const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dateObj: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
    }));
    callback(data);
  });
};

// 3. Listener Real-time Riwayat Stok Masuk
export const subscribeStockIns = (callback) => {
  const q = query(collection(db, "stock_ins"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dateObj: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
    }));
    callback(data);
  });
};

// 4. Filter Transaksi Berdasarkan Periode ('daily' | 'weekly' | 'monthly' | 'yearly')
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
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
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

// 5. Kelompokkan Data untuk Grafik Sesuai Periode Aktif
export const groupTransactionsForChart = (filteredTx, period) => {
  const grouped = {};

  // Urutkan kronologis (lama -> baru) untuk grafik
  const sorted = [...filteredTx].sort((a, b) => a.dateObj - b.dateObj);

  sorted.forEach((tx) => {
    const d = tx.dateObj;
    let label = "";

    if (period === "daily") {
      label = `${String(d.getHours()).padStart(2, "0")}:00`;
    } else if (period === "weekly" || period === "monthly") {
      label = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
      }).format(d);
    } else {
      label = new Intl.DateTimeFormat("id-ID", {
        month: "short",
      }).format(d);
    }

    if (!grouped[label]) {
      grouped[label] = { label, omzet: 0, terjual: 0 };
    }
    grouped[label].omzet += Number(tx.totalAmount) || 0;
    grouped[label].terjual += Number(tx.qty) || 0;
  });

  return Object.values(grouped);
};

// 6. Export Laporan ke CSV (Bisa Dibuka Langsung di Microsoft Excel)
export const exportTransactionsToCSV = (transactions, periodLabel) => {
  const headers = ["Tanggal", "Varian Kentang", "Jumlah (Kemasan)", "Harga Satuan", "Total Bayar"];
  const rows = transactions.map((tx) => [
    `"${tx.dateObj.toLocaleString("id-ID")}"`,
    `"${tx.productName}"`,
    tx.qty,
    tx.pricePerUnit,
    tx.totalAmount,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Laporan_Kentang_Balap_${periodLabel}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};