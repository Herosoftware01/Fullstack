import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CustomerReport = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [columnFilters, setColumnFilters] = useState({
    OrderNo: "",
    PONo: "",
    PODate: "",
    Name: "",
  });
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

  const tableContainerRef = useRef(null);
  const wsRef = useRef(null);

  const columns = ["OrderNo", "ImageOrder", "PONo", "PODate", "Name"];


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


  const filteredData = data.filter((item) => {
    const globalMatch =
      item.OrderNo?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.PONo?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.Name?.toLowerCase().includes(filterText.toLowerCase());

    const columnMatch =
      item.OrderNo?.toLowerCase().includes(columnFilters.OrderNo.toLowerCase()) &&
      item.PONo?.toLowerCase().includes(columnFilters.PONo.toLowerCase()) &&
      item.PODate?.toLowerCase().includes(columnFilters.PODate.toLowerCase()) &&
      item.Name?.toLowerCase().includes(columnFilters.Name.toLowerCase());

    return globalMatch && columnMatch;
  });

  useEffect(() => {
    axios
      .get("http://103.125.155.133:7001/api/employee")
      .then((res) => setData(res.data.data || []))
      .catch((err) => console.error("❌ Failed to fetch employee data", err));
  }, []);

  useEffect(() => {
    const connectWS = () => {
      const ws = new WebSocket("ws://103.125.155.133:7001");
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("Connected");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "new") {
          setData((prev) => [message.item, ...prev]);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
        ws.close();
      };

      ws.onclose = () => {
        setConnectionStatus("Disconnected");
        setTimeout(connectWS, 3000);
      };
    };

    connectWS();
    return () => wsRef.current?.close();
  }, []);

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
        cellElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
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
      <div className="flex gap-12 py-2"><h2>📋 Employee Table</h2>
      <p>🧾 Data count: {data.length}</p>
      <p>🔌 WebSocket: <strong>{connectionStatus}</strong></p>
     
                </div>
                 <button className="bg-red-400 rounded-2xl px-4">
                  <Link to="/EmployeeTable">Go to Ag_Grid</Link>
                </button>

      {/* Global Search */}
      <input
        type="text"
        placeholder="🔍 Global Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          marginBottom: 10,
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          width: "300px",
        }}
      />

      <div ref={tableContainerRef} className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Image</th>
              <th>PO No</th>
              <th>PO Date</th>
              <th>Buyer</th>
            </tr>
            <tr>
              <th>
                <input
                  type="text"
                  placeholder="Filter"
                  value={columnFilters.OrderNo}
                  onChange={(e) =>
                    setColumnFilters({ ...columnFilters, OrderNo: e.target.value })
                  }
                  className="column-filter"
                />
              </th>
              <th></th>
              <th>
                <input
                  type="text"
                  placeholder="Filter"
                  value={columnFilters.PONo}
                  onChange={(e) =>
                    setColumnFilters({ ...columnFilters, PONo: e.target.value })
                  }
                  className="column-filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Filter"
                  value={columnFilters.PODate}
                  onChange={(e) =>
                    setColumnFilters({ ...columnFilters, PODate: e.target.value })
                  }
                  className="column-filter"
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Filter"
                  value={columnFilters.Name}
                  onChange={(e) =>
                    setColumnFilters({ ...columnFilters, Name: e.target.value })
                  }
                  className="column-filter"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    id={`cell-${rowIndex}-${colIndex}`}
                    className={
                      selectedCell.row === rowIndex && selectedCell.col === colIndex
                        ? "selected-cell"
                        : ""
                    }
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                  >
                    {col === "ImageOrder" ? (
                      <img
                        src={row[col]}
                        alt="photo"
                        width="60"
                        height="60"
                        style={{ objectFit: "cover", borderRadius: 6 }}
                        
                      />
                    ) : col === "PODate" ? (
                      new Date(row[col]).toLocaleDateString()
                    ) : col === "ImageOrder" ? (
                        <img
                            src={row[col]}
                            alt="photo"
                            width="60"
                            height="60"
                            style={{ objectFit: "cover", borderRadius: 6 }}
                        />
                        ) : col === "PODate" ? (
                        new Date(row[col]).toLocaleDateString()
                        ) : (
                        highlightMatch(
                            row[col],
                            columnFilters[col] || filterText // ✅ prioritizes column filter if present
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

export default CustomerReport;
