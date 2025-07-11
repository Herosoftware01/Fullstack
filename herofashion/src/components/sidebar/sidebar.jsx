import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <NavLink to="/customerReport" className={({ isActive }) => isActive ? 'active' : ''}>
          Customer Report
        </NavLink>
        <NavLink to="/EmployeeTable" className={({ isActive }) => isActive ? 'active' : ''}>
          Employee Report
        </NavLink>
        <NavLink to="/PivotListTable" className={({ isActive }) => isActive ? 'active' : ''}>
          Pivot Table
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
