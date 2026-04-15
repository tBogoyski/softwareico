import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import IndexPage from "./pages/IndexPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}
