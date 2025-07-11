import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import Home from "./Home";

const Newquery = () => {
  const columns = [
    "OrderNo",
    "ImageOrder",
    "Final_Year_delivery1",
    "FinalDelvDate",
    "PONo",
    "PODate",
    "Name",
    "ItemID",
    "Value"
  ];

  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [editingRow, setEditingRow] = useState(null);
  const [columnFilters, setColumnFilters] = useState(
    columns.reduce((acc, col) => {
      acc[col] = "";
      return acc;
    }, {})
  );

  const tableContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://103.125.155.133:7001/api/new-Query");
        setData(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch employee data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const highlightMatch = (text, filter) => {
    if (!filter || typeof text !== "string") return text;
    const parts = text.split(new RegExp(`(${filter})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === filter.toLowerCase() ? (
            <span key={i} style={{ backgroundColor: "#3498db", color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const filteredData = data.filter((item) => {
    const globalMatch =
      item.OrderNo?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.PONo?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.Name?.toLowerCase().includes(filterText.toLowerCase());

    const columnMatch = columns.filter(col => col !== "ImageOrder").every(col => {
      const value = (item[col] || "").toString().toLowerCase();
      return value.includes(columnFilters[col].toLowerCase());
    });

    return globalMatch && columnMatch;
  });

  const handleKeyDown = useCallback((e) => {
    if (!filteredData.length) return;

    let { row, col } = selectedCell;
    const maxRow = filteredData.length - 1;
    const maxCol = columns.length - 1;

    if (e.key === "ArrowDown") row = Math.min(row + 1, maxRow);
    if (e.key === "ArrowUp") row = Math.max(row - 1, 0);
    if (e.key === "ArrowRight") col = Math.min(col + 1, maxCol);
    if (e.key === "ArrowLeft") col = Math.max(col - 1, 0);

    setSelectedCell({ row, col });
    const cellId = `cell-${row}-${col}`;
    const cellElement = document.getElementById(cellId);
    if (cellElement) {
      cellElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [selectedCell, filteredData.length]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleDelete = async (orderNo) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;
    try {
      await axios.delete(`http://103.125.155.133:7001/api/orders/${orderNo}`);
      setData((prev) => prev.filter((item) => item.OrderNo !== orderNo));
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://103.125.155.133:7001/api/editorders/${editingRow.OrderNo}`, editingRow);
      setEditingRow(null);
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Home />
      <div className="flex gap-12 py-2">
        <h2>📋 Employee Table</h2>
        <p>🧾 Data count: {filteredData.length}</p>
        <p>📡 Server 11</p>
      </div>

      <button className="bg-red-400 rounded-2xl px-4">
        <Link to="/EmployeeTable">Go to Ag_Grid</Link>
      </button>

      <input
        type="text"
        placeholder="🔍 Global Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", width: "300px" }}
      />

      <div ref={tableContainerRef} className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col === "ImageOrder" ? "Image" : col}</th>
              ))}
              <th>✏️</th>
              <th>🗑️</th>
            </tr>
            <tr>
              {columns.map((col) => (
                <th key={col}>
                  {col !== "ImageOrder" && (
                    <input
                      type="text"
                      placeholder="Filter"
                      value={columnFilters[col] || ""}
                      onChange={(e) => setColumnFilters({ ...columnFilters, [col]: e.target.value })}
                      className="column-filter"
                    />
                  )}
                </th>
              ))}
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={row.OrderNo}>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    id={`cell-${rowIndex}-${colIndex}`}
                    className={selectedCell.row === rowIndex && selectedCell.col === colIndex ? "selected-cell" : ""}
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                  >
                    {col === "ImageOrder" ? (
                      <img
                        src={row[col]}
                        alt="img"
                        width="60"
                        height="60"
                        style={{ objectFit: "cover", borderRadius: 6 }}
                      />
                    ) : (
                      highlightMatch(row[col], columnFilters[col] || filterText)
                    )}
                  </td>
                ))}
                <td><button onClick={() => setEditingRow(row)}>Edit</button></td>
                <td><button onClick={() => handleDelete(row.OrderNo)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Row: {editingRow.OrderNo}</h3>
            {columns.map((col) =>
              col !== "ImageOrder" ? (
                <div key={col}>
                  <label>{col}:</label>
                  <input
                    value={editingRow[col] || ""}
                    onChange={(e) =>
                      setEditingRow((prev) => ({
                        ...prev,
                        [col]: e.target.type === "number" ? Number(e.target.value) : e.target.value
                      }))
                    }
                  />
                </div>
              ) : null
            )}
            <button onClick={handleEditSave}>Save</button>
            <button onClick={() => setEditingRow(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newquery;
