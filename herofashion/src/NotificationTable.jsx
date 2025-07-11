// import React, { useEffect, useState } from 'react';
// import DataTable from 'react-data-table-component';
// import axios from 'axios';
// import './App.css'

// const NotificationTable = () => {
//   const [data, setData] = useState([]);
//   const [filterText, setFilterText] = useState('');

//   useEffect(() => {
//     axios.get('http://127.0.0.1:8000/chat/api/TBuyer_api/')
//       .then(res => {
//         setData(res.data);
//       })
//       .catch(err => {
//         console.error('API fetch error:', err);
//       });
//   }, []);

//   const columns = [
//     { name: 'buyerid', selector: row => row.buyerid, sortable: true },
//     { name: 'buyername', selector: row => row.buyerid, sortable: true },
//     { name: 'orderno', selector: row => row.orderno },
//     { name: 'date', selector: row => row.date },
//     { name: 'guid', selector: row => row.guid },
//     { name: 'refresh', selector: row => row.refresh },
//     // { name: 'New', selector: row => row.new },
//     // { name: 'Old', selector: row => row.old },
//   ];

//   const filteredData = data.filter(item =>
//     Object.values(item).some(
//       val =>
//         val &&
//         val.toString().toLowerCase().includes(filterText.toLowerCase())
//     )
//   );

//   return (
//     <div className='container mt-4'>
//       <h3>Backend Django</h3>

//       <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
//         <span className="input-group-text" id="basic-addon1">
//         </span>
//         <input
//           id = "search_box"
//           type="text"
//           className="form-control"
//           placeholder="Search notifications..."
//           value={filterText}
//           onChange={e => setFilterText(e.target.value)}
//         />
//       </div>
//       <DataTable
//         columns={columns}
//         data={filteredData}
//         pagination
//         highlightOnHover
//       />
//     </div>
//   );
// };

// export default NotificationTable;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function NotificationTable() {
//   const [buyers, setBuyers] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:3000/api/buyers')
//       .then(response => {
//         setBuyers(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching buyers:', error);
//       });
//   }, []);

//   return (
//     <div className="App">
//       <h3>Backend Node Js</h3>
//       <table border="1" cellPadding="8">
//         <thead>
//           <tr>
//             <th>Buyer ID</th>
//             <th>Buyer Name</th>
//             <th>Order No</th>
//             <th>Date</th>
//             <th>GUID</th>
//             <th>Refresh</th>
//           </tr>
//         </thead>
//         <tbody>
//           {buyers.map(buyer => (
//             <tr key={buyer.BuyerID}>
//               <td>{buyer.BuyerID}</td>
//               <td>{buyer.BuyerName}</td>
//               <td>{buyer.OrderNo}</td>
//               <td>{buyer.Date ? new Date(buyer.Date).toLocaleDateString() : ''}</td>
//               <td>{buyer.Guid}</td>
//               <td>{buyer.Refresh}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default NotificationTable;



import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './App.css';

const NotificationTable = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true); // 🔁 loader state

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://103.125.155.133:7001/api/image/')
      .then(res => {
        setData(res.data.data);
      })
      .catch(err => {
        console.error('API fetch error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredData = Array.isArray(data)
    ? data.filter(item =>
        Object.values(item).some(
          val =>
            val &&
            val.toString().toLowerCase().includes(filterText.toLowerCase())
        )
      )
    : [];

  const columns = [
    {
      name: 'Job No',
      selector: row => row.Jobno_Print_New_RGB,
      sortable: true,
    },
    {
      name: 'Top Clr/Siz/Line',
      selector: row => row.con_jobno_top_clr_siz_line,
      sortable: true,
    },
    {
      name: 'Secure Photo',
      cell: row =>
        row.securePhoto ? (
          <img
            src={row.securePhoto}
            alt="Photo"
            width={60}
            height={60}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/60x60?text=No+Img';
            }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              background: '#eee',
              borderRadius: '8px',
              textAlign: 'center',
              lineHeight: '60px',
              fontSize: 12,
              color: '#999',
            }}
          >
            N/A
          </div>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      width: '80px',
    },
    {
      name: 'MMT Photo',
      cell: row => (
        <img
          src={row.securePhoto2 || 'https://via.placeholder.com/60x60?text=No+Img'}
          alt="MMT"
          width={60}
          height={60}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'Print Photo',
      cell: row => (
        <img
          src={row.securePhoto1 || 'https://via.placeholder.com/60x60?text=No+Img'}
          alt="Print"
          width={60}
          height={60}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Backend Node.js – Notification Table</h3>

      <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
        <input
          id="search_box"
          type="text"
          className="form-control"
          placeholder="Search notifications..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <strong>Total Records: {filteredData.length}</strong>
      </div>

      {loading ? (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    <p className="mt-3 text-gray-600 text-sm">Loading data...</p>
  </div>
) :  (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          paginationPerPage={10}
          highlightOnHover
          striped
          dense
        />
      )}
    </div>
  );
};

export default NotificationTable;
