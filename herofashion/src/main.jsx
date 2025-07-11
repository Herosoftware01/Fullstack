import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import Facebook from './assets/facebookpage/home.jsx'
// import NotificationTable from './NotificationTable.jsx'
// import EmployeeTable from './employee.jsx'
import 'flowbite';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Facebook/> */}
    {/* <NotificationTable /> */}
    {/* <EmployeeTable /> */}
  </StrictMode>,
)
