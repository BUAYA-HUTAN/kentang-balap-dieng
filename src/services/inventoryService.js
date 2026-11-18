import {
  doc,
  collection,
  updateDoc,
  runTransaction,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

// 1. Inisialisasi 3 varian kentang awal jika database masih kosong
export const initInitialProducts = async () => {
  const initialData = [
    { id: "kecil", name: "Kentang Kecil", unit: "0.5 kg", price: 12000, stock: 50 },
    { id: "sedang", name: "Kentang Sedang", unit: "1 kg", price: 22000, stock: 40 },
    { id: "besar", name: "Kentang Besar", unit: "1 kg", price: 25000, stock: 30 },
  ];

  for (const item of initialData) {
    const docRef = doc(db, "products", item.id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        name: item.name,
        unit: item.unit,
        price: item.price,
        stock: item.stock,
        updatedAt: serverTimestamp(),
      });
    }
  }
};

// 2. Tambah Stok Masuk (Otomatis menambah stok di collection products)
export const addStockIn = async ({ productId, qty, buyPrice = 0, note = "" }) => {
  const productRef = doc(db, "products", productId);
  const stockInCol = collection(db, "stock_ins");

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) throw new Error("Produk tidak ditemukan!");

    const productData = productSnap.data();
    const addedQty = Number(qty);
    if (addedQty <= 0) throw new Error("Jumlah stok masuk harus lebih dari 0!");

    transaction.update(productRef, {
      stock: productData.stock + addedQty,
      updatedAt: serverTimestamp(),
    });

    const newStockInRef = doc(stockInCol);
    transaction.set(newStockInRef, {
      productId,
      productName: productData.name,
      qty: addedQty,
      buyPrice: Number(buyPrice) || 0,
      note: note.trim() || "Stok masuk reguler",
      createdAt: serverTimestamp(),
    });
  });
};

// 3. Input Penjualan (Otomatis memotong stok & validasi sisa stok)
export const createSaleTransaction = async ({ productId, qty }) => {
  const productRef = doc(db, "products", productId);
  const txCol = collection(db, "transactions");

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) throw new Error("Produk tidak ditemukan!");

    const productData = productSnap.data();
    const buyQty = Number(qty);
    if (buyQty <= 0) throw new Error("Jumlah beli harus lebih dari 0!");

    if (productData.stock < buyQty) {
      throw new Error(
        `Stok ${productData.name} tidak mencukupi! Sisa stok saat ini: ${productData.stock} kemasan.`
      );
    }

    const totalAmount = productData.price * buyQty;

    transaction.update(productRef, {
      stock: productData.stock - buyQty,
      updatedAt: serverTimestamp(),
    });

    const newTxRef = doc(txCol);
    transaction.set(newTxRef, {
      productId,
      productName: productData.name,
      qty: buyQty,
      pricePerUnit: productData.price,
      totalAmount,
      createdAt: serverTimestamp(),
    });
  });
};

// 4. Update Harga Dummy saat Presentasi Demo ke Klien
export const updateProductPrice = async (productId, newPrice) => {
  const priceNumber = Number(newPrice);
  if (isNaN(priceNumber) || priceNumber < 0) {
    throw new Error("Harga tidak valid!");
  }
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, {
    price: priceNumber,
    updatedAt: serverTimestamp(),
  });
};