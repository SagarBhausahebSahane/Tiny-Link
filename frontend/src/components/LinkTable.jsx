import { Copy, Trash2, ExternalLink } from "lucide-react";
import { API_BASE } from "../api/linkApi";

export default function LinkTable({ links, onDelete, onCopy }) {
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Never";

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs text-gray-500">Short Code</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500">Short Link</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500">Original URL</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500">Clicks</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500">Last Clicked</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500">Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => {
            const short = `${API_BASE}/${link.code}`;

            return (
              <tr key={link.code} className="border-b hover:bg-gray-50">

                <td className="px-6 py-4">
                  <code className="bg-indigo-50 text-indigo-700 rounded px-2 py-1 text-sm">
                    {link.code}
                  </code>
                </td>

                <td className="px-6 py-4">
                  <a href={short} target="_blank" className="text-blue-600 flex items-center gap-1">
                    {short}
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onCopy(short)}
                    className="text-indigo-600 text-sm flex items-center gap-1 mt-1"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </td>

                <td className="px-6 py-4">
                  <a href={link.original_url} target="_blank" className="text-blue-600 flex items-center gap-1">
                    {link.original_url}
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onCopy(link.original_url)}
                    className="text-indigo-600 text-sm flex items-center gap-1 mt-1"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </td>

                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {link.click_count}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(link.last_clicked_at)}</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(link.code)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
