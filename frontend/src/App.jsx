import React, { useState, useEffect } from 'react';

const App = () => {
  const [names, setNames] = useState('');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === filter));
    }
  }, [leads, filter]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const nameList = names
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (nameList.length === 0) {
        setMessage('Please enter at least one name');
        setLoading(false);
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/leads/process',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ names: nameList }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessage(`${result.data.length} leads processed successfully`);
        fetchLeads();
        setNames('');
      } else {
        setMessage(result.error || 'Error processing leads');
      }
    } catch (error) {
      console.error('Error submitting names:', error);
      setMessage('Error submitting names');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0e7ff,_#fdf2f8,_#ffffff)] py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h1 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-12">
          🚀 Smart Lead Automation System
        </h1>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_25px_50px_rgba(99,102,241,0.2)] p-8 mb-12 border border-indigo-200">
          <form onSubmit={handleSubmit}>
            <label className="block text-indigo-700 font-semibold mb-2">
              Enter Names (comma-separated)
            </label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="e.g., Peter, Aditi, Ravi, Satoshi"
              className="w-full px-5 py-3 mb-5 rounded-lg border border-indigo-300 bg-white/80 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
            />

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                loading
                  ? 'bg-gray-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {loading ? 'Processing...' : 'Submit Names'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-sm font-medium ${
                message.includes('successfully')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-2xl overflow-hidden border border-indigo-200 shadow-lg bg-white">
            {['All', 'Verified', 'To Check'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 text-sm font-semibold transition-all ${
                  filter === status
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_25px_50px_rgba(99,102,241,0.2)] overflow-hidden border border-indigo-200">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                {['Name', 'Predicted Country', 'Confidence Score', 'Status'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-indigo-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-indigo-50/70 transition-all"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4">
                      {lead.country}
                    </td>
                    <td className="px-6 py-4">
                      {(lead.probability * 100).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 text-xs font-bold rounded-full ${
                          lead.status === 'Verified'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    {loading ? 'Loading...' : 'No leads found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
