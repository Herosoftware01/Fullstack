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
import React, { useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import PivotTable from 'react-pivottable/PivotTable';
import 'react-pivottable/pivottable.css';

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
  // Transform flat array into object with keys
  const transformed = data.map(([id, name, image]) => ({
    ID: id,
    Name: name || 'Unknown',
    Image: `<img src="${image}" width="60" height="60" style="object-fit:cover; border-radius:6px;" onerror="this.src='/no-image.png'" />`,
  }));

  const [pivotState, setPivotState] = useState({
    data: transformed,
    rows: ['Name'],
    cols: ['ID'],
    vals: ['Image'],
    aggregatorName: 'List Unique Values',
    rendererName: 'Image Table',
    renderers: {
      'Image Table': HTMLTableRenderer
    },
  });

  return (
    <div>
      <PivotTableUI
        {...pivotState}
        onChange={s => setPivotState(s)}
        renderers={pivotState.renderers}
        unusedOrientationCutoff={Infinity}
      />
    </div>
  );
}

export default PivotView;


