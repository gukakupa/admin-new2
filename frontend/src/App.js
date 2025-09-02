import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import ServiceRequest from "./components/ServiceRequest";
import PriceEstimation from "./components/PriceEstimation";
import CaseTracking from "./components/CaseTracking";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import DataRecovery from "./components/DataRecovery";
import { Toaster } from "./components/ui/sonner";

const Home = () => {
  const [language, setLanguage] = useState('ka'); // 'ka' for Georgian, 'en' for English

  return (
    <div className="min-h-screen bg-gray-900">
      <Header language={language} setLanguage={setLanguage} />
      <Hero language={language} />
      <Services language={language} />
      <ServiceRequest language={language} />
      <PriceEstimation language={language} />
      <CaseTracking language={language} />
      <Testimonials language={language} />
      <Contact language={language} />
      <Footer language={language} />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/data-recovery" element={<DataRecovery />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;