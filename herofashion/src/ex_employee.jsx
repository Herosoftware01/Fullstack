// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../src/test.css'
// // import Pivot_table from './pivot_table';
// // import { useNavigate } from 'react-router-dom';
// import Home from './Home'

// function EmployeeTable() {
//   const [buyers, setBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const navigate = useNavigate();
//   useEffect(() => {
//     axios.get('http://103.125.155.133:7001/api/tbuyer')
//       .then((response) => {
//         setBuyers(response.data || []);
//         console.log("Total Records:", response.data.total);
//         console.log(response.data.data.Image)
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div><Home />
//     <div className="p-6 par">
      
//       <h3 className="text-2xl font-bold mb-4 text-gray-800">Employee Images (Node.js + SQL)</h3>
//       <h3 className="text-2xl font-bold mb-4 text-gray-800">
//         total : ({buyers.length})
//       </h3>

//       {/* <button
//         onClick={() => navigate('/pivot_table')}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Pivot Table
//       </button> */}

//       {loading ? (
//         <div className="flex flex-col items-center justify-center mt-20">
//           <div
//             className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
//             role="status"
//           />
//           <p className="mt-3 text-gray-600">Loading employee data...</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2 text-left">Buyer ID</th>
//                 <th className="border px-4 py-2 text-left">Name</th>
//                 <th className="border px-4 py-2 text-left">OrderNo</th>
//                 {/* <th className="border px-4 py-2 text-left">Image</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {buyers.map((buyer, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border px-4 py-2">{buyer.BuyerID}</td>
//                   <td className="border px-4 py-2">{buyer.BuyerName}</td>
//                   <td className="border px-4 py-2">{buyer.OrderNo}</td>
//                   {/* <td className="border px-4 py-2">
//                     <img
//                       src={buyer.Img_Print_MMT || '/no-image.png'}
//                       alt="employee"
//                       className="w-12 h-12 object-cover rounded-md border"
//                       loading="lazy"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = '/no-image.png';
//                       }}
//                     />
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// }

// export default EmployeeTable;




// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import PivotTableUI from "react-pivottable/PivotTableUI";
// import "react-pivottable/pivottable.css";
// import TableRenderers from "react-pivottable/TableRenderers";

// // Custom image renderer
// const CustomImageRenderer = (props) => {
//   const TableRenderer = TableRenderers["Table"];

//   const modifiedData = Array.isArray(props.data)
//     ? props.data.map((row) =>
//         Array.isArray(row)
//           ? row.map((cell) => {
//               if (
//                 typeof cell === "string" &&
//                 cell.startsWith("http") &&
//                 cell.match(/\.(jpg|jpeg|png|gif)$/i)
//               ) {
//                 return (
//                   <img
//                     src={cell}
//                     alt="Preview"
//                     style={{
//                       width: "50px",
//                       height: "50px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                     }}
//                   />
//                 );
//               }
//               return cell;
//             })
//           : row // fallback if not array
//       )
//     : [];

//   return <TableRenderer {...props} data={modifiedData} />;
// };

// const EmployeePivotTable = () => {
//   const [data, setData] = useState([]);
//   const [pivotState, setPivotState] = useState({
//     data: [],
//     rows: ["Name"],
//     cols: ["Image"],
//     aggregatorName: "Count",
//     vals: [],
//     rendererName: "Image Table",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("http://103.125.155.133:7001/api/csvdata");
//         const cleaned = (res.data.data || []).map((item) => ({
//           Name: item["﻿Name"]?.trim() || item.Name?.trim() || "",
//           id: parseInt(item.id),
//           Image: item.Image,
//         }));
//         setData(cleaned);
//         setPivotState((prev) => ({
//           ...prev,
//           data: cleaned,
//         }));
//       } catch (err) {
//         console.error("Error loading data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   const customRenderers = {
//     ...TableRenderers,
//     "Image Table": CustomImageRenderer,
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">Employee Pivot Table</h2>
//       {data.length === 0 ? (
//         <p className="text-gray-600">Loading data...</p>
//       ) : (
//         <div style={{ overflow: "auto" }}>
//           <PivotTableUI
//             data={data}
//             onChange={(s) => setPivotState(s)}
//             {...pivotState}
//             renderers={customRenderers}
//             unusedOrientationCutoff={Infinity}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeePivotTable;


// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import PivotTableUI from "react-pivottable/PivotTableUI";
// import PivotTable from "react-pivottable/PivotTable";
// import "react-pivottable/pivottable.css";
// import TableRenderers from "react-pivottable/TableRenderers";

// // Custom Table renderer to render image HTML
// const CustomImageRenderer = (pivotData, opts) => {
//   const colAttrs = pivotData.colAttrs;
//   const rowAttrs = pivotData.rowAttrs;
//   const colKeys = pivotData.colKeys;
//   const rowKeys = pivotData.rowKeys;

//   return (
//     <table className="pvtTable">
//       <thead>
//         {colAttrs.length > 0 && (
//           <tr>
//             {rowAttrs.map((r, i) => (
//               <th className="pvtAxisLabel" key={`colAttr${i}`} rowSpan={colAttrs.length}>
//                 {r}
//               </th>
//             ))}
//             {colKeys.map((colKey, i) => (
//               <th className="pvtColLabel" key={`colKey${i}`}>
//                 {colKey.join("-")}
//               </th>
//             ))}
//           </tr>
//         )}
//       </thead>
//       <tbody>
//         {rowKeys.map((rowKey, i) => (
//           <tr key={`rowKeyRow${i}`}>
//             {rowKey.map((txt, j) => (
//               <th className="pvtRowLabel" key={`rowKeyLabel${j}`}>
//                 {txt}
//               </th>
//             ))}
//             {colKeys.map((colKey, j) => {
//               const val = pivotData.getAggregator(rowKey, colKey).value();
//               return (
//                 <td key={`cell${j}`} className="pvtVal">
//                   {/* Render HTML image tag */}
//                   <div
//                     dangerouslySetInnerHTML={{
//                       __html: typeof val === "string" ? val : String(val),
//                     }}
//                   />
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// const EmployeePivotTable = () => {
//   const [data, setData] = useState([]);
//   const [pivotState, setPivotState] = useState({
//     data: [],
//     rows: ["Name"],
//     cols: [],
//     vals: ["Image"],
//     aggregatorName: "First",
//     rendererName: "Image Table",
//   });

//   useEffect(() => {
//     axios
//       .get("http://103.125.155.133:7001/api/csvdata")
//       .then((res) => {
//         const raw = res.data.data || [];

//         const cleaned = raw.map((item) => {
//           const name = item["﻿Name"]?.trim() || item.Name?.trim() || "";
//           const image = item.Image?.trim() || "";
//           return {
//             Name: name,
//             Image: image
//               ? `<img src="${image}" width="50" height="50" style="object-fit:cover; border-radius:6px;" />`
//               : "No Image",
//             id: item.id,
//           };
//         });

//         setData(cleaned);
//         setPivotState((prev) => ({ ...prev, data: cleaned }));
//       })
//       .catch((err) => {
//         console.error("Failed to load data", err);
//       });
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Image Pivot Table</h2>

//       <PivotTableUI
//         data={data}
//         onChange={(s) => setPivotState(s)}
//         {...pivotState}
//         renderers={{
//           ...TableRenderers,
//           "Image Table": (pivotData, opts) => CustomImageRenderer(pivotData, opts),
//         }}
//         unusedOrientationCutoff={Infinity}
//       />
//     </div>
//   );
// };

// export default EmployeePivotTable;






// import React, { useEffect, useState } from 'react';
// import Home from './Home';

// function EmployeeTable() {
//   const [buyers, setBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const socket = new WebSocket('ws://103.125.155.133:7001');

//     socket.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     socket.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       if (message.type === 'BUYER_DATA') {
//         setBuyers(message.data);
//         setLoading(false);
//       } else if (message.type === 'ERROR') {
//         console.error('WebSocket error:', message.message);
//         setLoading(false);
//       }
//     };

//     socket.onerror = (err) => {
//       console.error('WebSocket error:', err);
//     };

//     socket.onclose = () => {
//       console.log('WebSocket disconnected');
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   return (
//     <div>
//       <Home />
//       <div className="p-6 par">
//         <h3 className="text-2xl font-bold mb-4 text-gray-800">Employee Images (WebSocket + SQL)</h3>
//         <h3 className="text-2xl font-bold mb-4 text-gray-800">Total: ({buyers.length})</h3>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center mt-20">
//             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//             <p className="mt-3 text-gray-600">Loading employee data...</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-4 py-2 text-left">Buyer ID</th>
//                   <th className="border px-4 py-2 text-left">Name</th>
//                   <th className="border px-4 py-2 text-left">OrderNo</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {buyers.map((buyer, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="border px-4 py-2">{buyer.BuyerID}</td>
//                     <td className="border px-4 py-2">{buyer.BuyerName}</td>
//                     <td className="border px-4 py-2">{buyer.OrderNo}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default EmployeeTable;

import React, { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import './App.css'
import {
  ClientSideRowModelModule,
  ModuleRegistry,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  FiltersToolPanelModule,
  RowGroupingPanelModule,
]);

const EmployeeTable = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [data, setData] = useState([]);
  const [pageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchData = async (currentPage) => {
    try {
      const response = await axios.get(
        `http://103.125.155.133:7001/api/employee?page=${currentPage}&pageSize=${pageSize}`
      );
      const resData = response.data;
      setData(resData.data);
      setTotalCount(resData.totalCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const columnDefs = useMemo(
    () => [
      { headerName: "OrderNo", field: "OrderNo" },
      { headerName: "PONo", field: "PONo" },
      { headerName: "PODate", field: "PODate" },
      { headerName: "Name", field: "Name" },
      {
        headerName: "Photo",
        field: "ImageOrder",
        cellRenderer: (params) => (
          <img
            src={params.value}
            alt="Photo"
            style={{
              width: "50px",
              height: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
        ),
        width: 80,
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 140,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
    }),
    []
  );

  return (
    <div>
      <span style={{ marginTop: "10px", padding: "6px 12px" }}>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong> |
        Showing <strong>{data.length}</strong> of <strong>{totalCount}</strong> records
      </span>
   
    <div style={containerStyle}>

     



      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          pagination={false} // we handle pagination manually
          getRowHeight={() => 100}
        />
      </div>

      {/* Pagination Controls */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: "10px", padding: "6px 12px" }}
        >
          ⬅️ Previous
        </button>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          style={{ marginLeft: "10px", padding: "6px 12px" }}
        >
          Next ➡️
        </button>
      </div>
    </div>
     </div>
  );
};

export default EmployeeTable;

