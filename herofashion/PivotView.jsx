// // src/PivotView.jsx
// import React, { useState } from 'react';
// import PivotTableUI from 'react-pivottable/PivotTableUI';
// import 'react-pivottable/pivottable.css';
// import TableRenderers from 'react-pivottable/TableRenderers';
// import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
// import Plot from 'react-plotly.js';

// const PlotlyRenderers = createPlotlyRenderers(Plot);

// function PivotView({ data }) {
//   // Convert array of arrays (if needed) into array of objects with keys
//   const transformed = data.map(([id, name, image]) => ({
//     ID: id,
//     Name: name,
//     // Image: image, // ⛔️ Do not wrap in <img> – just URL string
//     Image: `<img src="${image}" width="60" height="60" style="object-fit:cover; border-radius:6px;" onerror="this.src='/no-image.png'" />`,
//   }));

//   const [pivotState, setPivotState] = useState({
//     data: transformed,
//     rows: ['Name'],
//     cols: [],
//     aggregatorName: 'List Unique Values',
//     vals: ['Image'],
//     rendererName: 'Table',
//     renderers: {
//       ...TableRenderers,
//       ...PlotlyRenderers,
//     },
//   });

//   return (
//     <div>
//       <PivotTableUI
//         {...pivotState}
//         onChange={(s) => setPivotState(s)}
//         renderers={pivotState.renderers}
//         unusedOrientationCutoff={Infinity}
//       />
//     </div>
//   );
// }

// export default PivotView;


// src/PivotView.jsx
import React, { useEffect, useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import PivotTable from 'react-pivottable/PivotTable';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import Plot from 'react-plotly.js';
import axios from 'axios';
const PlotlyRenderers = createPlotlyRenderers(Plot);
// Custom cell renderer to allow HTML (like <img>) in cells
function HTMLCellRenderer({ value }) {
  return (
    <td
      style={{
        textAlign: 'center',
        padding: '6px',
        border: '1px solid #ccc',
        verticalAlign: 'middle'
      }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

// Custom renderer that uses HTML cell renderer
function HTMLTableRenderer(props) {
  return (
    <PivotTable
      {...props}
      rendererOptions={{ cellRenderer: HTMLCellRenderer }}
    />
  );
}

function PivotView({ data }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pivotState, setPivotState] = useState({
    data: [],
    rows: ['OrderNo', 'ImageOrder'],
    cols: [ 'Name'],
    // aggregatorName: 'Sum',
    vals: ['quantity'],
    rendererName: 'Table'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://103.125.155.133:7001/api/employee');
      if (response.data.success) {
        console.log(response.data.data);
        
        const orderData = response.data.data.map(order => ({
          ...order,
          ImageOrder: order.ImageOrder ? <img src={order.ImageOrder} style={{ width: '30px', height: '30px', margin: '0 auto' }} alt={order.style} /> : 'No Image'

        }));
        setOrders(orderData);
        setPivotState(prev => ({ ...prev, data: orderData }));
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching orders: ' + err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="pivot-container" style={{ overflow: 'auto' }}>
        <PivotTableUI
          data={orders}
          onChange={s => setPivotState(s)}
          renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
          {...pivotState}
        />
      </div>
    </div>
  );
}

export default PivotView;


