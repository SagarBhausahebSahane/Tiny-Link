export default function Notification({ type, message }) {
  return (
    <div className="fixed top-20 right-4 z-50">
      <div
        className={`px-4 py-3 rounded-lg shadow-lg ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        {message}
      </div>
    </div>
  );
}
