import { useEffect, useState } from "react";
import Header from "./components/Header";
import AddLinkForm from "./components/AddLinkForm";
import LinkTable from "./components/LinkTable";
import StatCard from "./components/StatCard";
import Notification from "./components/Notification";
import { api } from "./api/linkApi";
import { Link2, TrendingUp, Search } from "lucide-react";

export default function TinyLinkApp() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => { loadLinks(); }, []);

  const loadLinks = async () => {
    setLoading(true);
    const data = await api.getLinks();
    setLinks(data);
    setLoading(false);
  };

  const showNote = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 2000);
  };

  const filtered = links.filter(l =>
    l.code.toLowerCase().includes(search.toLowerCase()) ||
    l.original_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <Header toggleForm={() => setShowForm(!showForm)} />

      {notification && <Notification {...notification} />}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {showForm && (
          <AddLinkForm
            onSuccess={() => {
              loadLinks();
              setShowForm(false);
              showNote("Link created!");
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Links" value={links.length} icon={<Link2 />} color="bg-blue-500" />
          <StatCard title="Total Clicks" value={links.reduce((a,b)=>a+b.click_count,0)} icon={<TrendingUp />} color="bg-green-500" />
          <StatCard title="Active Today" value={links.filter(l=> new Date(l.last_clicked_at).toDateString()===new Date().toDateString()).length} icon={<TrendingUp />} color="bg-purple-500" />
        </div>

        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search by code or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <LinkTable
              links={filtered}
              onCopy={(url) => {
                navigator.clipboard.writeText(url);
                showNote("Copied!");
              }}
              onDelete={(code) => {
                if (window.confirm("Delete this link?"))
                  api.deleteLink(code).then(() => { loadLinks(); showNote("Deleted"); });
              }}
            />
          )}
        </div>

      </main>

    </div>
  );
}
