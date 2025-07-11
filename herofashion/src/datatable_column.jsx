import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";

const columns = [
  // "OrderNo",
  "Order Details",
  "Final delivery date",
  "OrdImg1_Pen",
  "styleid",
  "008_Fabric",
  "046  Organic",
  "001 Printing",
  "ImageOrder",
  "PONo",
];

const Datatable_columns = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [colFilters, setColFilters] = useState({});
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selCell, setSelCell] = useState({ row: 0, col: 0 });
  const tableRef = useRef();
  const [updatedRow, setUpdatedRow] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [checkboxSearch, setCheckboxSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("http://10.1.21.13:7001/api/table-join-data");
      console.log(res)
      setData(res.data);
    } catch (err) {
      console.error("❌ Fetch error", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

   const filtered = data
    .filter((row) => {
      const globalMatch =
        !filterText ||
        Object.values(row).some((val) =>
          (val || "").toString().toLowerCase().includes(filterText.toLowerCase())
        );

      const columnMatch = columns.every((c) =>
        (row[c] || "")
          .toString()
          .toLowerCase()
          .includes((colFilters[c] || "").toLowerCase())
      );

      const selectionMatch =
        !showSelectedOnly || selectedOrders.includes(row.OrderNo);

      return globalMatch && columnMatch && selectionMatch;
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      if (!key) return 0;
      const av = (a[key] || "").toString();
      const bv = (b[key] || "").toString();
      return direction === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const handleCheckboxChange = (orderNo) => {
    setSelectedOrders((prev) =>
      prev.includes(orderNo)
        ? prev.filter((o) => o !== orderNo)
        : [...prev, orderNo]
    );
  };



  const handleKey = useCallback(
    (e) => {
      let { row, col } = selCell;
      const maxRow = filtered.length - 1,
        maxCol = columns.length - 1;
      if (e.key === "ArrowDown") row = Math.min(row + 1, maxRow);
      if (e.key === "ArrowUp") row = Math.max(row - 1, 0);
      if (e.key === "ArrowRight") col = Math.min(col + 1, maxCol);
      if (e.key === "ArrowLeft") col = Math.max(col - 1, 0);
      setSelCell({ row, col });
      document
        .getElementById(`cell-${row}-${col}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
    [selCell, filtered]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleAdd = async () => {
    try {
      await axios.post("http://10.1.21.13:7001/api/table-join-data", newRow);
      setNewRow({});
      fetchData();
    } catch (err) {
      console.error("❌ Add error", err);
    }
  };

  const handleUpdate = async (row) => {
    const orderNo = row.OrderNo;

    const updatePayload = {
      styleid: String(row.styleid),
      PONo: row.PONo,
      "008_Fabric": row["008_Fabric"],
      "046  Organic": row["046  Organic"],
      "Final delivery date": row["Final delivery date"],
    };

    if (!window.confirm(`🎲update ${orderNo} ?`)) return;

    try {
      await axios.put(
        `http://10.1.21.13:7001/api/table-join-data/${orderNo}`,
        updatePayload
      );
      console.log("✅ Update successful");
      alert("✅ Update successful");

      setUpdatedRow(orderNo);
      setTimeout(() => setUpdatedRow(null), 2000);
      fetchData();
    } catch (err) {
      console.error("❌ Update error", err.response?.data || err.message);
    }
  };

  const handleDelete = async (jobno) => {
    if (!window.confirm(`Delete ${jobno}?`)) return;
    try {
      await axios.delete(`http://10.1.21.13:7001/api/table-join-data/${jobno}`);
      fetchData();
    } catch (err) {
      console.error("❌ Delete error", err);
    }
  };

  const highlight = (text, filter) => {
    if (!filter) return text;
    const parts = text.toString().split(new RegExp(`(${filter})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === filter.toLowerCase() ? (
        <span key={i} style={{ background: "yellow" }}>
          {p}
        </span>
      ) : (
        p
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
     
      <div className="my-4 border rounded-lg p-4 bg-white shadow-sm">
  {/* Section Heading */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
    <h2 className="text-lg font-semibold text-gray-800">
      📦 Total Orders: {data.length}
    </h2>

    {/* Search Input */}
    <input
      type="text"
      placeholder="🔍 Search OrderNo..."
      value={checkboxSearch}
      onChange={(e) => setCheckboxSearch(e.target.value)}
      className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Scrollable Checkbox Container */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-1">
    {data
      .filter((row) =>
        row.OrderNo?.toString().toLowerCase().includes(checkboxSearch.toLowerCase())
      )
      .map((row, index) => (
        <label
          key={index}
          className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
        >
          <input
            type="checkbox"
            name="order"
            value={row.OrderNo}
            checked={selectedOrders.includes(row.OrderNo)}
            onChange={() => handleCheckboxChange(row.OrderNo)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm text-gray-800">{row.OrderNo}</span>
        </label>
      ))}
  </div>
</div>

      <label className="block mb-3">
      <input
        type="checkbox"
        checked={showSelectedOnly}
        onChange={() => setShowSelectedOnly(!showSelectedOnly)}
        className="mr-2"
      />
      Show only selected orders
    </label>

      {/* Global Search */}
      <input
        type="text"
        placeholder="🔍 Global Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          // width: "100%",
          padding: "10px",
          marginBottom: "16px",
          fontSize: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      {/* Column Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {columns.map((c) => (
          <div key={c} style={{ flex: "1 1 180px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              {c}
            </label>
            <input
              type="text"
              value={colFilters[c] || ""}
              placeholder={`Search ${c}`}
              onChange={(e) => setColFilters({ ...colFilters, [c]: e.target.value })}
              style={{
                width: "100%",
                padding: "6px 8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
      </div>

      <table ref={tableRef} border={1} cellPadding={6} style={{ width: "100%" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                onClick={() => {
                  setSortConfig((prev) =>
                    prev.key === c
                      ? { key: c, direction: prev.direction === "asc" ? "desc" : "asc" }
                      : { key: c, direction: "asc" }
                  );
                }}
                style={{ cursor: "pointer" }}
              >
                {c}
                {sortConfig.key === c
                  ? sortConfig.direction === "asc"
                    ? " 🔼"
                    : " 🔽"
                  : ""}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filtered.map((row, ri) => (
            <tr key={ri}>
              {columns.map((c, ci) => (
                
                <td
                  id={`cell-${ri}-${ci}`}
                  key={ci}
                  style={{
                    backgroundColor:
                      ri === selCell.row && ci === selCell.col ? "#e3e31e" : "transparent",
                  }}
                  contentEditable={c !== "JobnoOms"}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newVal = e.target.textContent;
                    setData((prevData) => {
                      const newData = [...prevData];
                      newData[ri] = { ...newData[ri], [c]: newVal };
                      return newData;
                    });
                  }}
                  onClick={() => setSelCell({ row: ri, col: ci })}
                >
                  {c === "ImageOrder" && row[c] ? (
                    <img src={row[c]} alt="" width={50} height={50} />
                  ) : c === "Order Details" ? (
                    <>
                      <strong>{row.OrderNo}</strong>
                      <br />
                      <span>{row.Date}</span>
                    </>
                  ) : (
                    highlight(row[c], colFilters[c])
                  )}
                </td>

              ))}
              <td>
                <button className="bg-green-600 text-white px-3 rounded-2xl" onClick={() => handleUpdate(row)} style={{ marginRight: 8 }}>
                  Update
                </button>
                <button className="bg-red-600 text-white px-3 rounded-2xl" onClick={() => handleDelete(row.JobnoOms)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Datatable_columns;