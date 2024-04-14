import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CitiesTable from "./pages/AllCities.tsx";
import WeatherPage from "./pages/DisplayWeather.tsx";
import Three from "./components/ThreeJs.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-full h-screen App bg-gradient-to-b to-sky-200 from-sky-500 flex justify-center items-center flex-col gap-4">
        <Routes>
          <Route path="/" element={<CitiesTable />}></Route>
          <Route path="/weather/:cityId" element={<WeatherPage />}></Route>
          <Route path="/model" element={<Three />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
