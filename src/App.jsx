import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import StatePage from "./pages/StatePage";
import CityPage from "./pages/CityPage";
import AdminPage from "./pages/AdminPage";
import VisaPage from "./pages/visa/VisaPage";
import { ImmigrationPage, DS160Page } from "./pages/visa/TipPages";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                         element={<HomePage />} />
        <Route path="/states/:stateSlug"        element={<StatePage />} />
        <Route path="/states/:stateSlug/:citySlug" element={<CityPage />} />
        <Route path="/visa/:type"               element={<VisaPage />} />
        <Route path="/immigration"              element={<ImmigrationPage />} />
        <Route path="/ds160"                    element={<DS160Page />} />
        <Route path="/admin"                    element={<AdminPage />} />
        <Route path="*"                         element={<HomePage />} />
      </Routes>
    </>
  );
}
