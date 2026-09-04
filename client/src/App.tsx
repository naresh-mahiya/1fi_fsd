import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductPage } from "./pages/ProductPage";

export function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-ink">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
