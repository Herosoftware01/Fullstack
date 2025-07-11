import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Home from "./Home";

const columns = [
  {
    name: "Order No",
    selector: (row) => (Array.isArray(row.OrderNo) ? row.OrderNo[0] : row.OrderNo),
    sortable: true,
  },
  {
    name: "PO No",
    selector: (row) => (Array.isArray(row.PONo) ? row.PONo[0] : row.PONo),
    sortable: true,
  },
  {
    name: "PO Date",
    selector: (row) => new Date(row.PODate).toLocaleDateString(),
    sortable: true,
  },
  {
    name: "Final Delivery",
    selector: (row) => row.Final_Year_delivery1,
    sortable: true,
  },
  {
    name: "Buyer",
    selector: (row) => row.Name,
    sortable: true,
  },
  {
    name: "Image",
    cell: (row) => (
      <img
        src={row.ImageOrder}
        alt="img"
        width={50}
        height={50}
        style={{ objectFit: "cover", borderRadius: 6 }}
      />
    ),
  },
];

const FilterComponent = ({ filterText, onFilter }) => (
  <input
    id="search"
    type="text"
    placeholder="Search"
    aria-label="Search Input"
    value={filterText}
    onChange={(e) => onFilter(e.target.value)}
    style={{ marginBottom: "10px", padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
  />
);

const Datatables11 = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("http://103.125.155.133:7001/api/employees11");
      setData(res.data.data || []);
    } catch (error) {
      console.error("❌ Fetch failed", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = data.filter((item) => {
    const orderNo = Array.isArray(item.OrderNo) ? item.OrderNo[0] : item.OrderNo;
    const poNo = Array.isArray(item.PONo) ? item.PONo[0] : item.PONo;
    return (
      (orderNo || "").toString().toLowerCase().includes(filterText.toLowerCase()) ||
      (poNo || "").toString().toLowerCase().includes(filterText.toLowerCase()) ||
      (item.Name || "").toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div style={{ padding: 20 }}>
      <Home />
      <h2 style={{ marginBottom: "10px" }}>📋 Employee Data Table</h2>

      <div className="flex gap-4 mb-4">
        <button className="bg-red-400 rounded-2xl px-4 py-1 text-white">
          <Link to="/EmployeeTable">Go to Ag_Grid</Link>
        </button>
        <button className="bg-red-400 rounded-2xl px-4 py-1 text-white">
          <Link to="/newquery">New Ajax</Link>
        </button>
      </div>

      <FilterComponent filterText={filterText} onFilter={setFilterText} />

      <DataTable
        columns={columns}
        data={filteredItems}
        // pagination
        highlightOnHover
        striped
        dense
        responsive
        persistTableHead
        // paginationPerPage={10}
        // paginationRowsPerPageOptions={[10, 20, 30, 50]}
        defaultSortFieldId={1}
      />
    </div>
  );
};

export default Datatables11;
