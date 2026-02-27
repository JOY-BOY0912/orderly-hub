import { useEffect, useState } from "react";
import { RefreshCw, LayoutGrid, List } from "lucide-react";
import OrderCard from "@/components/OrderCard";

interface OrderItem {
  food_item: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  phone: string;
  status: string;
  order_date: string;
  order_total: number;
  items: OrderItem[];
}

const API_BASE = "https://n8n.srv1302157.hstgr.cloud/webhook";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin-dashboard-menu`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirm = async (orderId: number) => {
    if (!orderId) {
      console.error("Order ID missing:", orderId);
      return;
    }

    console.log("Confirm payload:", orderId);

    await fetch(`${API_BASE}/confirm-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    });

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: "CONFIRMED" } : o
      )
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-lg">🍽</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <p className="text-muted-foreground text-center mt-20">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-center mt-20">No orders found</p>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4" : "flex flex-col gap-4"}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onConfirm={handleConfirm} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
