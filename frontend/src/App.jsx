import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import Votacao from "./pages/Votacao";
import Resultados from "./pages/Resultados";
import Header from "./components/Header";
export default function App() {
  const navigate = useNavigate();

  function handleConfirm() {
    navigate("/resultados");
  }

  function handleNovo() {
    navigate("/");
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Votacao onConfirm={handleConfirm} />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </>
  );
}
