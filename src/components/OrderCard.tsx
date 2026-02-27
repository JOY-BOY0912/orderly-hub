import { Clock, User } from "lucide-react";
import { useState } from "react";

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

interface OrderCardProps {
  order: Order;
  onConfirm: (order: Order) => Promise<void>;
}

const OrderCard = ({ order, onConfirm }: OrderCardProps) => {
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState(order.status);

  const isConfirmed = status === "CONFIRMED";
  const isPending = status === "PENDING";

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm(order);
      setStatus("CONFIRMED");
    } catch (e) {
      console.error("Failed to confirm order", e);
    } finally {
      setConfirming(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        ", " +
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-card border border-border rounded-[14px] p-4 flex flex-col gap-3 transition-all duration-200 hover:border-primary/35 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-primary text-xs font-medium">#{order.order_code}</span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${isConfirmed ? "bg-[hsl(var(--success))]" : "bg-primary"}`}
          />
          <span className={`text-xs font-medium ${isConfirmed ? "text-[hsl(var(--success))]" : "text-muted-foreground"}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2.5 border-b border-border pb-3">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground">📞 {order.phone}</p>
        </div>
      </div>

      {/* Items table */}
      <div>
        <div className="flex text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1.5">
          <span className="flex-1">Item</span>
          <span className="w-12 text-right">Price</span>
          <span className="w-8 text-center">Qty</span>
          <span className="w-14 text-right">Total</span>
        </div>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex text-sm py-1">
            <span className="flex-1 font-medium text-foreground">{item.food_item}</span>
            <span className="w-12 text-right text-muted-foreground">₹{item.price}</span>
            <span className="w-8 text-center text-muted-foreground">{item.quantity}</span>
            <span className="w-14 text-right font-bold text-foreground">₹{item.total}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDate(order.order_date)}</span>
        </div>
        <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          ₹{order.order_total}
        </span>
      </div>

      {/* Confirm button */}
      {isPending && (
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="w-full mt-1 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-90 transition-all duration-200 disabled:opacity-50"
        >
          {confirming ? "Confirming..." : "Confirm Order"}
        </button>
      )}
    </div>
  );
};

export default OrderCard;
