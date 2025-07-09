import { BrowserRouter, Routes, Route } from "react-router-dom";
import Face1 from "./face1"; // or your actual file


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Face1 />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;