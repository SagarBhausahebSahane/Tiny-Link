import { Link2, Plus } from "lucide-react";

export default function Header({ toggleForm }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

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
          onClick={toggleForm}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          <span>New Link</span>
        </button>

      </div>
    </header>
  );
}
