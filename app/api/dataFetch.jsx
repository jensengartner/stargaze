// Get weather for current location
const getCurrentLocationWeather = async (lat, lon) => {
  console.log("in getCurrentLocationWeather");
  //using national weather service
  //https://api.weather.gov/points/{latitude},{longitude}
  //For example: https://api.weather.gov/points/39.7456,-97.0892

  try {
    const response = await fetch(
      `https://api.weather.gov/points/${lat},${lon}`
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};

// Get astronomy info for current location

// Get satellite info for current location
