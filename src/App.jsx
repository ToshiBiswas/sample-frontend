import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WarehousesHomePage from "./pages/WarehousesHomePage/WarehousesHomePage.jsx";
import InventoriesHomePage from "./pages/InventoriesHomePage/InventoriesHomePage.jsx";
import WarehousesDetailsPage from "./pages/WarehousesDetailsPage/WarehousesDetailsPage.jsx";
import InventoriesDetailsPage from "./pages/InventoriesDetailsPage/InventoriesDetailsPage.jsx";
import WarehousesEditPage from "./pages/WarehousesEditPage/WarehousesEditPage.jsx";
import InventoriesEditPage from "./pages/InventoriesEditPage/InventoriesEditPage.jsx";
import WarehousesAddPage from "./pages/WarehousesAddPage/WarehousesAddPage.jsx";
import InventoriesAddPage from "./pages/InventoriesAddPage/InventoriesAddPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header className/>
        <div className="Layout">
          <div className="Layout_section">
            <Routes>
              <Route path="/" element={<Navigate to="/warehouses" replace />} />
              <Route path="/warehouses" element={<WarehousesHomePage />} />
              <Route path="/inventories" element={<InventoriesHomePage />} />
              <Route path="/warehouses/:id" element={<WarehousesDetailsPage />} />
              <Route path="/inventories/:id" element={<InventoriesDetailsPage />} />
              <Route path="/warehouses/:id/edit" element={<WarehousesEditPage />} />
              <Route path="/inventories/:id/edit" element={<InventoriesEditPage />} />
              <Route path="/warehouses/add" element={<WarehousesAddPage />} />
              <Route path="/inventories/add" element={<InventoriesAddPage />} />
              <Route path="*" element={<Navigate to="/notfound" replace />} />
              <Route path="/notfound" element={<NotFoundPage />} />
            </Routes>
            <Footer/>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
