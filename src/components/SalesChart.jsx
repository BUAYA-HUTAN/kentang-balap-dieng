import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatRupiah } from "../utils/formatters";

export default function SalesChart({ chartData, filteredTransactions, products }) {
  // Hitung performa per ukuran kentang
  const variantStats = ["kecil", "sedang", "besar"].map((id) => {
    const productInfo = products.find((p) => p.id === id);
    const txs = filteredTransactions.filter((t) => t.productId === id);
    const qty = txs.reduce((sum, t) => sum + (Number(t.qty) || 0), 0);
    const revenue = txs.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);

    return {
      id,
      name: productInfo?.name || `Kentang ${id}`,
      unit: productInfo?.unit || "-",
      qty,
      revenue,
    };
  });

  const maxQty = Math.max(...variantStats.map((v) => v.qty), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Grafik Tren Penjualan (2 Kolom) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-800">Grafik Pendapatan Penjualan</h3>
          <p className="text-xs text-slate-500">
            Visualisasi tren omzet berdasarkan rentang waktu yang dipilih
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            Belum ada data transaksi pada periode ini
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val / 1000}rb`}
                />
                <Tooltip
                  formatter={(value) => [formatRupiah(value), "Omzet"]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="omzet" fill="#d97706" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Performa Per Ukuran Kentang (1 Kolom) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Penjualan Per Ukuran</h3>
          <p className="text-xs text-slate-500 mb-5">
            Perbandingan ukuran kentang paling diminati
          </p>

          <div className="space-y-4">
            {variantStats.map((item) => {
              const percentage = Math.round((item.qty / maxQty) * 100);
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-xs text-slate-400 ml-1">({item.unit})</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.qty} kemasan</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.qty > 0 ? Math.max(percentage, 6) : 0}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-slate-500 mt-1">
                    {formatRupiah(item.revenue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
          *Data diperbarui secara otomatis saat kasir menginput penjualan.
        </div>
      </div>
    </div>
  );
}