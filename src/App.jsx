import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
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
import TermsOfServicePage from "./pages/TermsOfServicePage";
import DisclaimerPage from "./pages/DisclaimerPage";
import FinanceHubPage, { RetirementPage, HousingPage, CarPage, IndexFundsPage, Plans529Page, LifeInsurancePage, W2Page, RrspTfsaPage, CanadaHousingPage, CanadaCarPage, CanadaIndexFundsPage, RespPage, CanadaLifeInsurancePage, T4Page } from "./pages/finance/FinancePages";
import NewsHubPage, { ImmigrationNewsPage, JobsNewsPage, FinanceNewsPage } from "./pages/news/NewsPage";
import BlogHubPage, { BlogPostPage } from "./pages/blog/BlogPage";
import { AdsProvider } from "./lib/AdsContext";
import GoogleAnalytics from "./components/GoogleAnalytics";
import CookieConsent from "./components/CookieConsent";
import HashScroller from "./components/HashScroller";

export default function App() {
  return (
    <AdsProvider>
      <GoogleAnalytics />
      <CookieConsent />
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
        <Route path="/finance/rrsp-tfsa"           element={<RrspTfsaPage />} />
        <Route path="/finance/canada-housing"      element={<CanadaHousingPage />} />
        <Route path="/finance/canada-car"          element={<CanadaCarPage />} />
        <Route path="/finance/canada-index-funds"  element={<CanadaIndexFundsPage />} />
        <Route path="/finance/resp"                element={<RespPage />} />
        <Route path="/finance/canada-life-insurance" element={<CanadaLifeInsurancePage />} />
        <Route path="/finance/t4-t4a"              element={<T4Page />} />
        <Route path="/news"                        element={<NewsHubPage />} />
        <Route path="/news/immigration"            element={<ImmigrationNewsPage />} />
        <Route path="/news/jobs"                   element={<JobsNewsPage />} />
        <Route path="/news/finance"                element={<FinanceNewsPage />} />
        <Route path="/lawyers"                     element={<GlobalLawyersPage />} />
        <Route path="/contact"                     element={<ContactPage />} />
        <Route path="/privacy"                     element={<PrivacyPolicyPage />} />
        <Route path="/terms"                       element={<TermsOfServicePage />} />
        <Route path="/disclaimer"                  element={<DisclaimerPage />} />
        <Route path="/blog"                        element={<BlogHubPage />} />
        <Route path="/blog/:slug"                  element={<BlogPostPage />} />
        <Route path="/admin"                       element={<AdminPage />} />
        <Route path="/admin/messages"              element={<AdminMessagesPage />} />
        <Route path="/admin/approvals"             element={<AdminApprovalsPage />} />
        <Route path="*"                            element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </AdsProvider>
  );
}
