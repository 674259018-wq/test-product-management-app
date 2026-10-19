import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import AddProductPage from "./pages/AddProductPage.jsx";
import EditProductPage from "./pages/EditProductPage.jsx";
import JournalDetailPage from "./pages/JournalDetailPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/journals" replace />} />
        <Route path="/journals" element={<ProductPage />} />
        <Route path="/journals/new" element={<AddProductPage />} />
        <Route path="/journals/:id" element={<JournalDetailPage />} />
        <Route path="/journals/:id/edit" element={<EditProductPage />} />
        <Route path="*" element={<Navigate to="/journals" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
