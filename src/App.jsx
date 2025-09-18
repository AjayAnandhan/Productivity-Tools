import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/Components/home-page";
import TimesheetCalculator from "./components/TimeCard";
import QRCodeGenerator from "./components/QRCodeGenerator";
import Navigation from "./Components/navigation";

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timesheet" element={<TimesheetCalculator />} />
        <Route path="/qrcode" element={<QRCodeGenerator />} />
      </Routes>
    </Router>
  );
}
