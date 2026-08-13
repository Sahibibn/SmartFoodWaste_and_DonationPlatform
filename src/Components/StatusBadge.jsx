const StatusBadge = ({ status }) => {
  const normalizedStatus =
    String(status || "UNKNOWN").toUpperCase();

  const styles = {
    AVAILABLE:
      "bg-green-100 text-green-700",

    CLAIMED:
      "bg-blue-100 text-blue-700",

    PICKED_UP:
      "bg-yellow-100 text-yellow-700",

    COMPLETED:
      "bg-purple-100 text-purple-700",

    EXPIRED:
      "bg-red-100 text-red-700",

    CANCELLED:
      "bg-gray-100 text-gray-700",

    PENDING:
      "bg-orange-100 text-orange-700",

    UNKNOWN:
      "bg-gray-100 text-gray-600",
  };

  const labels = {
    AVAILABLE: "Available",
    CLAIMED: "Claimed",
    PICKED_UP: "Picked Up",
    COMPLETED: "Completed",
    EXPIRED: "Expired",
    CANCELLED: "Cancelled",
    PENDING: "Pending",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        styles[normalizedStatus] ||
        styles.UNKNOWN
      }`}
    >
      {labels[normalizedStatus] ||
        normalizedStatus}
    </span>
  );
};

export default StatusBadge;