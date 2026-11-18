import { collection, writeBatch, doc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

const SAMPLE_PRODUCTS = [
  { id: "kecil", name: "Kentang Kecil", price: 12000 },
  { id: "sedang", name: "Kentang Sedang", price: 22000 },
  { id: "besar", name: "Kentang Besar", price: 25000 },
];

export const seedDemoTransactions = async (totalRecords = 60) => {
  const batch = writeBatch(db);
  const txCollection = collection(db, "transactions");
  const now = new Date();

  for (let i = 0; i < totalRecords; i++) {
    const product =
      SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
    const qty = Math.floor(Math.random() * 5) + 1; // 1 s.d. 5 kemasan
    const totalAmount = product.price * qty;

    // Sebar tanggal: 20% hari ini, 30% minggu ini, 30% bulan ini, 20% bulan-bulan sebelumnya tahun ini
    const randomDate = new Date(now);
    const bucket = Math.random();

    if (bucket < 0.2) {
      // Hari ini (jam acak sebelum sekarang)
      randomDate.setHours(Math.max(7, now.getHours() - Math.floor(Math.random() * 5)));
    } else if (bucket < 0.5) {
      // 1 - 6 hari lalu (Minggu ini)
      randomDate.setDate(now.getDate() - (Math.floor(Math.random() * 6) + 1));
    } else if (bucket < 0.8) {
      // 7 - 25 hari lalu (Bulan ini)
      randomDate.setDate(Math.max(1, now.getDate() - (Math.floor(Math.random() * 18) + 7)));
    } else {
      // Bulan-bulan sebelumnya dalam tahun berjalan
      const randomMonth = Math.floor(Math.random() * (now.getMonth() + 1));
      randomDate.setMonth(randomMonth);
      randomDate.setDate(Math.floor(Math.random() * 27) + 1);
    }

    const newDocRef = doc(txCollection);
    batch.set(newDocRef, {
      productId: product.id,
      productName: product.name,
      qty,
      pricePerUnit: product.price,
      totalAmount,
      createdAt: Timestamp.fromDate(randomDate),
    });
  }

  await batch.commit();
};