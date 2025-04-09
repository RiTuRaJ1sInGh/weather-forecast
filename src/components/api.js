import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const FORECAST_URL = import.meta.env.VITE_FORECAST_URL;

export const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchForecastData = async (city) => {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        cnt: 40,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
