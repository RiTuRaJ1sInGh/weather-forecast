import { useState } from "react";
import { fetchForecastData, fetchWeatherData } from "./api";
import ErrorMessage from "./components/ErrorMessage";
import ForecastDisplay from "./components/ForecastDisplay";
import Loader from "./components/Loader";
import RecentSearches from "./components/RecentSearches";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const appContainerStyle = {
    minHeight: "100vh",
    padding: "1rem",
    transition: "all 0.3s ease",
    backgroundColor: "#111827",
    color: darkMode ? "#f3f4f6" : "#1f2937",
  };

  const contentContainerStyle = {
    maxWidth: "56rem",
    margin: "0 auto",
    position: "relative",
  };

  const titleStyle = {
    fontSize: "1.875rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2rem",
    color: "#ffffff",
  };

  const themeToggleStyle = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    padding: "0.5rem",
    borderRadius: "9999px",
    backgroundColor: darkMode ? "#374151" : "#e5e7eb",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const handleSearch = async (city) => {
    if (!city) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [currentWeather, forecast] = await Promise.all([
        fetchWeatherData(city),
        fetchForecastData(city),
      ]);

      setWeatherData(currentWeather);
      setForecastData(forecast);

      setRecentSearches((previousSearches) => {
        const updatedSearches = [
          city,
          ...previousSearches.filter((item) => item !== city),
        ];
        return updatedSearches.slice(0, 5);
      });
    } catch (problem) {
      setError(
        problem.response?.data?.message ||
          "Something went wrong fetching the weather."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={appContainerStyle}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={themeToggleStyle}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div style={contentContainerStyle}>
        <h1 style={titleStyle}>Weather Dashboard</h1>

        <SearchBar onSearch={handleSearch} darkMode={darkMode} />

        {loading && <Loader darkMode={darkMode} />}

        {error && <ErrorMessage message={error} darkMode={darkMode} />}

        {weatherData && (
          <WeatherDisplay data={weatherData} darkMode={darkMode} />
        )}

        {forecastData && (
          <ForecastDisplay forecastData={forecastData} darkMode={darkMode} />
        )}

        {recentSearches.length > 0 && (
          <RecentSearches
            searches={recentSearches}
            onSearch={handleSearch}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
