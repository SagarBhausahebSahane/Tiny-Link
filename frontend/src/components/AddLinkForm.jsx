import { useState } from "react";
import { api } from "../api/linkApi";

export default function AddLinkForm({ onSuccess, onCancel }) {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};

    if (!url) err.url = "URL is required";
    else {
      try { new URL(url); }
      catch { err.url = "Invalid URL format"; }
    }

    if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
      err.customCode = "Code must be 6-8 alphanumeric characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.createLink(url, customCode || null);
      onSuccess(res);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Short Link</h2>

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original URL *</label>
          <input
            className={`w-full px-4 py-2 border rounded-lg ${errors.url ? "border-red-500" : "border-gray-300"}`}
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && <p className="text-sm text-red-600">{errors.url}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Code (optional)</label>
          <input
            className={`w-full px-4 py-2 border rounded-lg ${errors.customCode ? "border-red-500" : "border-gray-300"}`}
            maxLength={8}
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="mylink"
          />
          {errors.customCode && <p className="text-sm text-red-600">{errors.customCode}</p>}
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-300 px-3 py-2 rounded text-red-700">
            {errors.submit}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Create Link"}
          </button>

          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
