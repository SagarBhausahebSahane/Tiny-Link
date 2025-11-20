import React, { useState, useEffect } from 'react';
import { Link2, Copy, Trash2, ExternalLink, Plus, Search, TrendingUp } from 'lucide-react';

// API Service
const API_BASE = 'https://tiny-link-backend-89bi.onrender.com';

const api = {
  async createLink(originalUrl, customCode = null) {
    const res = await fetch(`${API_BASE}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_url: originalUrl, custom_code: customCode })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create link');
    }
    return res.json();
  },

  async getLinks() {
    const res = await fetch(`${API_BASE}/api/links`);
    return res.json();
  },

  async getLinkByCode(code) {
    const res = await fetch(`${API_BASE}/api/links/${code}`);
    if (!res.ok) throw new Error('Link not found');
    return res.json();
  },

  async deleteLink(code) {
    const res = await fetch(`${API_BASE}/api/links/${code}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete link');
    return res.json();
  }
};

// Main App Component
export default function TinyLinkApp() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await api.getLinks();
      setLinks(data);
    } catch (err) {
      showNotification('Failed to load links', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(search.toLowerCase()) ||
    link.original_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TinyLink</h1>
                <p className="text-sm text-gray-500">URL Shortener Service</p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Link</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.message}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Add Form */}
        {showForm && (
          <AddLinkForm
            onSuccess={(link) => {
              loadLinks();
              setShowForm(false);
              showNotification('Link created successfully!');
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Links"
            value={links.length}
            icon={<Link2 className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Clicks"
            value={links.reduce((sum, l) => sum + l.click_count, 0)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="bg-green-500"
          />
          <StatCard
            title="Active Today"
            value={links.filter(l => {
              if (!l.last_clicked_at) return false;
              const today = new Date().toDateString();
              return new Date(l.last_clicked_at).toDateString() === today;
            }).length}
            icon={<TrendingUp className="w-6 h-6" />}
            color="bg-purple-500"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading links...</p>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="p-8 text-center">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No links found</p>
              <p className="text-sm text-gray-500 mt-2">Create your first short link to get started</p>
            </div>
          ) : (
            <LinkTable
              links={filteredLinks}
              onDelete={(code) => {
                if (window.confirm('Are you sure you want to delete this link?')) {
                  api.deleteLink(code)
                    .then(() => {
                      loadLinks();
                      showNotification('Link deleted successfully');
                    })
                    .catch(() => showNotification('Failed to delete link', 'error'));
                }
              }}
              onCopy={(url) => {
                navigator.clipboard.writeText(url);
                showNotification('Copied to clipboard!');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Add Link Form Component
function AddLinkForm({ onSuccess, onCancel }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!url) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(url);
      } catch {
        newErrors.url = 'Invalid URL format';
      }
    }

    if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
      newErrors.customCode = 'Code must be 6-8 alphanumeric characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const link = await api.createLink(url, customCode || null);
      onSuccess(link);
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original URL *
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.url ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.url && <p className="text-red-600 text-sm mt-1">{errors.url}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Code (optional)
          </label>
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="mylink (6-8 characters)"
            maxLength={8}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.customCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.customCode && <p className="text-red-600 text-sm mt-1">{errors.customCode}</p>}
          <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated code</p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Link'}
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

// Link Table Component
// Link Table Component
function LinkTable({ links, onDelete, onCopy }) {
  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Short Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Short Link
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Original URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Last Clicked
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {links.map((link) => {
            const shortLink = `${API_BASE}/${link.code}`;

            return (
              <tr key={link.code} className="hover:bg-gray-50">

                {/* Code */}
                <td className="px-6 py-4">
                  <code className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded font-mono text-sm">
                    {link.code}
                  </code>
                </td>

                {/* Short Link */}
                <td className="px-6 py-4">
                  <a
                    href={shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 truncate max-w-xs"
                  >
                    <span className="truncate">{shortLink}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onCopy(shortLink)}
                    className="text-indigo-600 hover:text-indigo-900 mt-1 flex items-center space-x-1 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Short</span>
                  </button>
                </td>

                {/* Original URL */}
                <td className="px-6 py-4">
                  <a
                    href={link.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 truncate max-w-md flex items-center space-x-1"
                  >
                    <span className="truncate">{link.original_url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onCopy(link.original_url)}
                    className="text-indigo-600 hover:text-indigo-900 mt-1 flex items-center space-x-1 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Original</span>
                  </button>
                </td>

                {/* Clicks */}
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {link.click_count}
                  </span>
                </td>

                {/* Last Clicked */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(link.last_clicked_at)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onDelete(link.code)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


// Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>

        <div className={`${color} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
