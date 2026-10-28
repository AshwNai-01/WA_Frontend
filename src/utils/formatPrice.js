// Short Indian price labels for cards:
// 800 -> "₹800", 1000 -> "₹1,000", 20000 -> "₹20K", 150000 -> "₹1.5L", 25000000 -> "₹2.5Cr"
const trim = (n) => Number(n.toFixed(1)).toString();

export default function formatPrice(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) return null;

  if (amount >= 1e7) return `₹${trim(amount / 1e7)}Cr`;
  if (amount >= 1e5) return `₹${trim(amount / 1e5)}L`;
  if (amount >= 1e4) return `₹${trim(amount / 1e3)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}
