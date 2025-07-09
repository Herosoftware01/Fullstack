import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeTable from './employee.jsx';
import PivotTable from './pivot_table';
import Home from './Home'
import PivotView from './PivotView'
import DataTable from './datatable.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="Home" element={<Home />} />
        <Route path="DataTable" element={<DataTable />} />
        <Route path="PivotView" element={<PivotView />} />
        <Route path="/" element={<EmployeeTable />} />
        <Route path="/pivot_table" element={<PivotTable />} />
      </Routes>
    </Router>
  );
}

export default App;
