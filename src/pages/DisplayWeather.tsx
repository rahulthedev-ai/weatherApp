import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { LiaWindSolid } from "react-icons/lia";
import { WiRaindrops } from "react-icons/wi";
import { motion } from "framer-motion";
import { FaRegSnowflake, FaSnowman } from "react-icons/fa";
import { MdFoggy } from "react-icons/md";
import { LuTornado } from "react-icons/lu";

interface WeatherData {
  name: string;
  temperature: number;
  description: string;
  type: string;
  wind: number;
  humidity: number;
  country: string;
}

const WeatherPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=9385b3eca6b1f7fa3284635eca4bfb45&units=${
            isCelsius ? "metric" : "imperial"
          }`
        );
        const data = response.data;
        setWeatherData({
          temperature: data.main.temp,
          description: data.weather[0].description,
          type: data.weather[0].main,
          wind: data.wind.speed,
          humidity: data.main.humidity,
          name: data.name,
          country: data.sys.country,
        });
        setError(null);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [cityId, isCelsius]);

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevIsCelsius) => !prevIsCelsius);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-400 to-indigo-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto sm:px-10 sm:w-1/2 sm:mx-auto rounded bg-gradient-to-br from-sky-400 to-indigo-500 text-white w-full mx-auto rounded shadow-lg shadow-gray-900 text-center w-full mx-auto">
      {error ? (
        <div className="text-center text-white p-4 rounded bg-gradient-to-br from-sky-400 to-indigo-500 w-full mx-auto rounded ">
          <img
            className="w-full h-full"
            src="https://freefrontend.com/assets/img/html-funny-404-pages/CodePen-404-Page.gif"
            alt=" Page Not Found "
          />
          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={() => {
              navigate("/");
            }}
            className="px-3 py-2 text-white bg-green-500 rounded-lg animate-bounce hover:bg-green-600"
          >
            Go Home
          </motion.button>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-md shadow-lg shadow-gray-900 text-white text-center w-full mx-auto rounded">
          {weatherData ? (
            <div className="flex flex-col gap-6 items-center justify-center text-center w-full mx-auto">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight">
                  {weatherData.name}
                </h1>
                <h2 className="mt-2 text-lg font-bold text-white">
                  {weatherData.country}
                </h2>

                <div className="flex flex-col items-center justify-center text-[20vh] sm:my-12 my-5 font-extrabold">
                  {weatherData.type === "Clear" && (
                    <BsFillSunFill className="text-yellow-400 animate-bounce" />
                  )}
                  {weatherData.type === "Clouds" && (
                    <BsCloudyFill className="text-gray-300 animate-pulse" />
                  )}
                  {weatherData.type === "Rain" && (
                    <BsFillCloudRainFill className="text-blue-300 animate-[rain_2s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Drizzle" && (
                    <BsFillCloudRainFill className="text-blue-300 animate-[drizzle_2s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Thunderstorm" && (
                    <BsCloudFog2Fill className="text-blue-300 animate-[thunder_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Mist" && (
                    <FaRegSnowflake className="text-zinc-200 animate-[mist_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Fog" && (
                    <BsCloudFog2Fill className="text-blue-800 animate-[fog_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Haze" && (
                    <FaRegSnowflake className="text-zinc-200 animate-[haze_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Smoke" && (
                    <MdFoggy className="text-blue-800 animate-[smoke_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Dust" && (
                    <MdFoggy className="text-blue-800 animate-[dust_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Sand" && (
                    <BsCloudFog2Fill className="text-blue-800 animate-[sand_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Ash" && (
                    <BsCloudFog2Fill className="text-blue-800 animate-[ash_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Squall" && (
                    <BsCloudFog2Fill className="text-blue-800 animate-[squall_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Tornado" && (
                    <LuTornado className="text-zinc-600 animate-[tornado_3s_ease-in-out_infinite]" />
                  )}
                  {weatherData.type === "Snow" && (
                    <FaSnowman className="text-zinc-200 animate-[snow_3s_ease-in-out_infinite]" />
                  )}
                </div>
                <p
                  onClick={toggleTemperatureUnit}
                  className="text-2xl font-semibold text-white cursor-pointer hover:underline underline-offset-4 sm:text-3xl"
                >
                  {isCelsius
                    ? `${weatherData.temperature.toFixed(1)} °C`
                    : `${weatherData.temperature.toFixed(1)} °F`}
                </p>
                <p className="text-lg font-medium text-white">
                  {weatherData.description}
                </p>
              </div>

              <div className="flex justify-between px-5 bg-white bg-opacity-20 backdrop-blur-md sm:gap-20 sm:px-1 sm:justify-around rounded-2xl">
                <p className="flex items-center text-lg text-white">
                  <WiRaindrops className="text-[20vw] sm:text-[8vw]" />
                  {weatherData.humidity}%
                </p>
                <p className="flex items-center gap-5 text-lg text-white">
                  <LiaWindSolid className="text-[10vw] sm:text-[5vw]" />{" "}
                  {weatherData.wind} m/s
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white">Sorry, no weather data found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
