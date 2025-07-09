// src/EmployeeTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './Home';
import PivotView from './PivotView';
import '../src/test.css';

function EmployeeTable() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPivot, setShowPivot] = useState(false);

  useEffect(() => {
    axios
      .get('http://103.125.155.133:7001/api/csvdata')
      .then((response) => {
        setBuyers(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const pivotArray = buyers.map((b) => [b.id, b.Name, b.Image]);

  return (
    <div>
      <Home />
      <div className="p-6 par">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Employee Images (CSV Data)</h3>
        <h3 className="text-xl mb-4 text-gray-800">Total: {buyers.length}</h3>
         
        <button
          onClick={() => setShowPivot(!showPivot)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
        >
          {showPivot ? 'Show Table View' : 'Show Pivot Table'}
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-gray-600">Loading employee data...</p>
          </div>
        ) : showPivot ? (
          <PivotView data={pivotArray} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Company ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Image URL</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{buyer.id}</td>
                    <td className="border px-4 py-2">{buyer.Name}</td>
                    <td className="border px-4 py-2 text-blue-600">
                      <a href={buyer.Image} target="_blank" rel="noreferrer" className="underline">
                        {buyer.Image}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeTable;
