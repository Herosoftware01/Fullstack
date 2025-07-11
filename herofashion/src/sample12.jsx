// Full React Component with Update & Delete

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import Home from "./Home";

const Datatables11 = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});

  const tableContainerRef = useRef(null);

  const columns = [
    "Final_Year_delivery1",
    "FinalDelvDate",
    "OrderNo",
    "ImageOrder",
    "PONo",
    "PODate",
    "UDF46",
    "u125",
    "u1",
    "Name",
    "Actions",
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get("http://103.125.155.133:7001/api/employees11");
      setData(res.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (row) => {
    setEditRow(row.OrderNo);
    setEditData(row);
  };

  const handleDelete = async (OrderNo) => {
    if (window.confirm("Are you sure to delete this record?")) {
      try {
        await axios.delete(`http://103.125.155.133:7001/api/employees11/${OrderNo}`);
        fetchData();
      } catch (err) {
        console.error("❌ Delete failed", err);
      }
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`http://103.125.155.133:7001/api/employees11/${editRow}`, editData);
      setEditRow(null);
      fetchData();
    } catch (err) {
      console.error("❌ Update failed", err);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const highlightMatch = (text, filter) => {
    if (!filter || typeof text !== "string") return text;
    const parts = text.split(new RegExp(`(${filter})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === filter.toLowerCase() ? (
        <span key={i} style={{ backgroundColor: "#3498db", color: "white" }}>{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const filteredData = data.filter((item) => {
    const globalMatch =
      (item.OrderNo || "").toString().toLowerCase().includes(filterText.toLowerCase()) ||
      (item.PONo || "").toString().toLowerCase().includes(filterText.toLowerCase()) ||
      (item.Name || "").toString().toLowerCase().includes(filterText.toLowerCase());

    const columnMatch = columns.every((col) => {
      if (!columnFilters[col]) return true;
      return (item[col] || "").toString().toLowerCase().includes(columnFilters[col].toLowerCase());
    });

    return globalMatch && columnMatch;
  });

  const handleSort = (col) => {
    setSortConfig((prev) => {
      if (prev.key === col) {
        return { key: col, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key: col, direction: "asc" };
    });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    return sortConfig.direction === "asc"
      ? valA > valB ? 1 : -1
      : valA < valB ? 1 : -1;
  });

  return (
    <div style={{ padding: 20 }}>
      <Home />
      <h2>📋 Employee Table</h2>
      <h2 className="text-center bg-red-400">Server 11</h2>

      <input
        type="text"
        placeholder="Global search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} onClick={() => handleSort(col)}>{col}</th>
            ))}
          </tr>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col !== "ImageOrder" && col !== "Actions" && (
                  <input
                    type="text"
                    placeholder="Filter"
                    value={columnFilters[col] || ""}
                    onChange={(e) => setColumnFilters({ ...columnFilters, [col]: e.target.value })}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col}>
                  {editRow === row.OrderNo && col !== "ImageOrder" && col !== "Actions" ? (
                    <input
                      value={editData[col] || ""}
                      onChange={(e) => handleInputChange(col, e.target.value)}
                    />
                  ) : col === "ImageOrder" ? (
                    <img src={row[col]} alt="img" width="60" height="60" />
                  ) : col === "Actions" ? (
                    editRow === row.OrderNo ? (
                      <>
                        <button onClick={handleUpdateSubmit}>✅</button>
                        <button onClick={() => setEditRow(null)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(row)}>✏️</button>
                        <button onClick={() => handleDelete(row.OrderNo)}>🗑️</button>
                      </>
                    )
                  ) : (
                    highlightMatch(row[col]?.toString() || "", filterText)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Datatables11;
