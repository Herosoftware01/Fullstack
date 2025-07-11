import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import Home from "./Home";

const Datatables11 = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [columnFilters, setColumnFilters] = useState({
    Final_Year_delivery1: "",
    FinalDelvDate: "",
    OrderNo: "",
    PONo: "",
    PODate: "",
    Name: "",
  });
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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
  ];

  const highlightMatch = (text, filter) => {
    if (!filter || typeof text !== "string") return text;
    const parts = text.split(new RegExp(`(${filter})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === filter.toLowerCase() ? (
            <span key={i} style={{ backgroundColor: "#3498db", color: "#fff", padding: "2px 4px", borderRadius: "4px" }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://103.125.155.133:7001/api/employees11");
      setData(res.data.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch employee data", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data
    .filter((item) => {
      const globalMatch =
        (Array.isArray(item.OrderNo) ? item.OrderNo[0] : item.OrderNo || "")
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase()) ||
        (Array.isArray(item.PONo) ? item.PONo[0] : item.PONo || "")
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase()) ||
        (item.Name || "")
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase());

      const columnMatch = columns.every((col) => {
        const rawValue = Array.isArray(item[col]) ? item[col][0] : item[col];
        const value = (rawValue || "").toString().toLowerCase();
        return value.includes((columnFilters[col] || "").toLowerCase());
      });

      return globalMatch && columnMatch;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const valA = Array.isArray(a[sortConfig.key]) ? a[sortConfig.key][0] : a[sortConfig.key];
      const valB = Array.isArray(b[sortConfig.key]) ? b[sortConfig.key][0] : b[sortConfig.key];

      const parseVal = (val) => {
        if (!val) return "";
        if (sortConfig.key === "PODate" || sortConfig.key.includes("Date")) return new Date(val);
        return val.toString().toLowerCase();
      };

      const aVal = parseVal(valA);
      const bVal = parseVal(valB);

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (col) => {
    setSortConfig((prev) => {
      if (prev.key === col) {
        if (prev.direction === "asc") return { key: col, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key: col, direction: "asc" };
    });
  };

  const handleKeyDown = useCallback(
    (e) => {
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
        cellElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    [selectedCell, filteredData.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ padding: 20 }}>
      <Home />
      <div className="flex gap-12 py-2">
        <h2>📋 Employee Table</h2>
        <p>🧾 Data count: {data.length}</p>
        <p>🔄 Refresh every 5s (AJAX)</p>
      </div>

      <div className="flex gap-4">
        <button className="bg-red-400 rounded-2xl px-4">
          <Link to="/EmployeeTable">Go to Ag_Grid</Link>
        </button>
        <button className="bg-red-400 rounded-2xl px-4">
          <Link to="/newquery">New Ajax</Link>
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Global Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: 10, padding: 8, borderRadius: 6, border: "1px solid #ccc", width: 300 }}
      />

      <div ref={tableContainerRef} className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} onClick={() => handleSort(col)} style={{ cursor: "pointer" }}>
                  {col === "ImageOrder" ? "Image" : col}
                  {sortConfig.key === col && (
                    <span>
                      {sortConfig.direction === "asc" ? " 🔼" : sortConfig.direction === "desc" ? " 🔽" : ""}
                    </span>
                  )}
                </th>
              ))}
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
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
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
                    ) : col === "PODate" ? (
                      new Date(row[col]).toLocaleDateString()
                    ) : (
                      highlightMatch(
                        Array.isArray(row[col]) ? row[col][0] : row[col],
                        columnFilters[col] || filterText
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Datatables11;
