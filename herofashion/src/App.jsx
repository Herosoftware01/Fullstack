import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EmployeeTable from './employee.jsx';
import Home from './Home';
import DataTable from './datatable.jsx';
import DataTable11 from './datatable11.jsx';
import Newquery from './newquery1.jsx'
import Reactdatatable from './react_datatable.jsx'
import Sample12 from './sample12.jsx'
import Datatable_columns from './datatable_column.jsx'
import './App.css';
import Header from './components/header/header.jsx';
import Sidebar from './components/sidebar/sidebar.jsx';
import PivotReport from './components/pivotReport/pivotReport.jsx';
import PivotListTable from './components/pivotTable/pivotTable.jsx';
import CustomerReport from './components/customerReport/customerReport.jsx';


function App() {
  return (
    <Router>

      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-content">
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

              <Route path="/" element={<Navigate to="/customerReport" />} />
              <Route path="/customerReport" element={<CustomerReport />} />
              <Route path="employeeTable" element={<EmployeeTable />} />
              <Route path="/pivotListTable" element={<PivotListTable />} />
              <Route path="/pivot_table" element={<PivotReport />} />
              <Route path="/Home" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
