import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StatePage from "./pages/StatePage";
import CityPage from "./pages/CityPage";
import AdminPage from "./pages/AdminPage";
import AdminApprovalsPage from "./pages/admin/AdminApprovalsPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";
import VisaPage from "./pages/visa/VisaPage";
import { ImmigrationPage, DS160Page } from "./pages/visa/TipPages";
import EventsPage from "./pages/EventsPage";
import HealthWellnessPage from "./pages/HealthWellnessPage";
import GlobalLawyersPage from "./pages/GlobalLawyersPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import FinanceHubPage, { RetirementPage, HousingPage, CarPage, IndexFundsPage, Plans529Page, LifeInsurancePage, W2Page } from "./pages/finance/FinancePages";
import { AdsProvider } from "./lib/AdsContext";
import GoogleAnalytics from "./components/GoogleAnalytics";
import HashScroller from "./components/HashScroller";

export default function App() {
  return (
    <AdsProvider>
      <GoogleAnalytics />
      <Navbar />
      <HashScroller />
      <Routes>
        <Route path="/"                            element={<HomePage />} />
        <Route path="/states/:stateSlug"           element={<StatePage />} />
        <Route path="/states/:stateSlug/:citySlug" element={<CityPage />} />
        <Route path="/visa/:type"                  element={<VisaPage />} />
        <Route path="/events"                      element={<EventsPage />} />
        <Route path="/immigration"                 element={<ImmigrationPage />} />
        <Route path="/ds160"                       element={<DS160Page />} />
        <Route path="/health"                      element={<HealthWellnessPage />} />
        <Route path="/finance"                     element={<FinanceHubPage />} />
        <Route path="/finance/retirement"          element={<RetirementPage />} />
        <Route path="/finance/housing"             element={<HousingPage />} />
        <Route path="/finance/car"                 element={<CarPage />} />
        <Route path="/finance/index-funds"         element={<IndexFundsPage />} />
        <Route path="/finance/529"                 element={<Plans529Page />} />
        <Route path="/finance/life-insurance"      element={<LifeInsurancePage />} />
        <Route path="/finance/w2-1099"             element={<W2Page />} />
        <Route path="/lawyers"                     element={<GlobalLawyersPage />} />
        <Route path="/contact"                     element={<ContactPage />} />
        <Route path="/privacy"                     element={<PrivacyPolicyPage />} />
        <Route path="/disclaimer"                  element={<DisclaimerPage />} />
        <Route path="/admin"                       element={<AdminPage />} />
        <Route path="/admin/messages"              element={<AdminMessagesPage />} />
        <Route path="/admin/approvals"             element={<AdminApprovalsPage />} />
        <Route path="*"                            element={<HomePage />} />
      </Routes>
      <Footer />
    </AdsProvider>
  );
}
