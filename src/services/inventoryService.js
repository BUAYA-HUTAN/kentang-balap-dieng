import { 
  doc, collection, addDoc, updateDoc, runTransaction, 
  serverTimestamp, getDoc, setDoc 
} from "firebase/firestore";
import { db } from "../config/firebase";

// 1. Jalankan sekali untuk memastikan 3 data kentang awal tersedia di Firestore
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

// 2. Fungsi Tambah Stok Masuk (Otomatis menambah stok di products)
export const addStockIn = async ({ productId, qty, buyPrice = 0, note = "" }) => {
  const productRef = doc(db, "products", productId);
  const stockInCol = collection(db, "stock_ins");

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) throw new Error("Produk tidak ditemukan!");

    const productData = productSnap.data();
    const newStock = productData.stock + Number(qty);

    transaction.update(productRef, {
      stock: newStock,
      updatedAt: serverTimestamp(),
    });

    const newStockInRef = doc(stockInCol);
    transaction.set(newStockInRef, {
      productId,
      productName: productData.name,
      qty: Number(qty),
      buyPrice: Number(buyPrice),
      note,
      createdAt: serverTimestamp(),
    });
  });
};

// 3. Fungsi Input Penjualan (Otomatis memotong stok & validasi stok cukup)
export const createSaleTransaction = async ({ productId, qty }) => {
  const productRef = doc(db, "products", productId);
  const txCol = collection(db, "transactions");

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef);
    if (!productSnap.exists()) throw new Error("Produk tidak ditemukan!");

    const productData = productSnap.data();
    if (productData.stock < Number(qty)) {
      throw new Error(`Stok ${productData.name} tidak cukup! Sisa stok: ${productData.stock}`);
    }

    const newStock = productData.stock - Number(qty);
    const totalAmount = productData.price * Number(qty);

    transaction.update(productRef, {
      stock: newStock,
      updatedAt: serverTimestamp(),
    });

    const newTxRef = doc(txCol);
    transaction.set(newTxRef, {
      productId,
      productName: productData.name,
      qty: Number(qty),
      pricePerUnit: productData.price,
      totalAmount,
      createdAt: serverTimestamp(),
    });
  });
};

// 4. Fungsi Update Harga Dummy saat Demo
export const updateProductPrice = async (productId, newPrice) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, {
    price: Number(newPrice),
    updatedAt: serverTimestamp(),
  });
};