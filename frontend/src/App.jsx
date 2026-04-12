import { Routes, Route } from "react-router-dom";

function Placeholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="SoftwareICO - Home" />} />
      <Route path="/products" element={<Placeholder title="Products" />} />
      <Route path="/products/:slug" element={<Placeholder title="Product Detail" />} />
    </Routes>
  );
}
