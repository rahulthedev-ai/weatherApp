import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface City {
  geoname_id: string;
  name: string;
  country: string;
  timezone: string;
  cou_name_en: string;
}

function CitiesTable() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCityElementRef = useRef<HTMLTableRowElement | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCelsius, setIsCelsius] = useState<boolean>(false);

  async function fetchCities() {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=geoname_id%2Cname%2Ctimezone%2Ccou_name_en&limit=20&offset=${
          (page - 1) * 20
        }`
      );
      if (response.data && response.data.results) {
        setCities((prevCities) => [...prevCities, ...response.data.results]);
        setHasMore(response.data.results.length > 0);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.log("Error fetching city data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchCities();
      }
    }, options);

    if (lastCityElementRef.current) {
      observer.current.observe(lastCityElementRef.current);
    }
  }, [hasMore, loading, cities]);

  const handleSearch = async () => {
    const apiKey = "31345797b09b2d20c20a82cbef3ec47e";    
    if (searchQuery.length > 0) {
      try {
        const searchedData = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}`
        );

        const { coord } = searchedData.data;
        const { lon, lat } = coord;
        const searchedData2 = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );

        const { sys, id, name } = searchedData2.data;
        const { country, timezone } = sys;

        setCities([
          { geoname_id: id, name, country, timezone, cou_name_en: name },
        ]);
      } catch (error) {
        console.log("Failed to fetch city details:", error);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleGetMyWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiKey = "31345797b09b2d20c20a82cbef3ec47e"; //  "YOUR_API_KEY" with your actual API key
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
            );
            const { name, main, weather, sys } = response.data;
            const { country } = sys;
            const { temp, humidity } = main;
            const { description } = weather[0];
            // Handle the weather data, e.g., display it on the page
          } catch (error) {
            console.error("Failed to fetch weather data:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  

  return (
    <div className="h-full overflow-x-auto">
      <div className="text-center search">
        <motion.h1
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Climate-Companion
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-6"
        >
          <input
            type="text"
            className="px-5 py-2 w-[60vw] sm:w-[20vw] text-lg rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            placeholder="Search your city..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 ml-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={handleSearch}
          >
            Search
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 ml-4 rounded-lg bg-green-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={handleGetMyWeather}
          >
            Get My Weather
          </motion.button>
        </motion.div>
      </div>

      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full border-collapse shadow-md rounded-lg mt-10 text-center"
      >
        <thead>
          <tr className="bg-blue-500 text-white font-bold">
            <th className="py-3 px-4">City</th>
            <th className="py-3 px-4">Country</th>
            <th className="py-3 px-4">Local time</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hover:bg-black-100 transition-colors duration-3 ease-in-out"
              ref={index === cities.length - 1 ? lastCityElementRef : null}
            >
              <td className="px-4 py-3 text-center font-bold text-blue-500 hover:text-blue-600 transition-colors duration-3 ease-in-out">
                <Link
                  to={`/weather/${city.geoname_id}`}
                  className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  {city.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-center font-semibold">{city.cou_name_en}</td>
              <td className="px-4 py-3 text-center font-semibold">{city.timezone}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
      <div className="sticky bottom-0 p-20">
        {loading && (
          <div className="flex justify-center">
            <div style={{ width: '20%', height: '0', paddingBottom: '100%', position: 'relative' }}>
              <iframe src="https://giphy.com/embed/gJ3mEToTDJn3LT6kCT" width="100%" height="100%" style={{ position: 'absolute' }} frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CitiesTable;



















