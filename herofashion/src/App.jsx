import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeTable from './employee.jsx';
import PivotTable from './pivot_table';
import Home from './Home'
import PivotView from './PivotView'
import DataTable from './datatable.jsx';
import DataTable11 from './datatable11.jsx';
import Newquery from './newquery1.jsx'
import Reactdatatable from './react_datatable.jsx'
import Sample12 from './sample12.jsx'
import Datatable_columns from './datatable_column.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="Home" element={<Home />} />
        <Route path="/" element={<DataTable />} />
        <Route path="/datatable11" element={<DataTable11 />} />
        <Route path="/datatable_columns" element={<Datatable_columns />} />
        <Route path="/sample12" element={<Sample12 />} />
        <Route path="/reactdatatable" element={<Reactdatatable />} />
        <Route path="/newquery" element={<Newquery />} />
        <Route path="PivotView" element={<PivotView />} />
        <Route path="EmployeeTable" element={<EmployeeTable />} />
        <Route path="/pivot_table" element={<PivotTable />} />
      </Routes>
    </Router>
  );
}

export default App;
