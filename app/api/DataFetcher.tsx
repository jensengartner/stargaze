import { useCallback, useEffect } from "react";

const DataFetcher = ({ latitude, longitude, onDataFetched }) => {
  const fetchHourlyWeather = useCallback(
    async (lat, lon) => {
      //check if coordinates are valid
      if (!lat || !lon) {
        console.error("DataFetcher: Invalid latitude or longitude received.");
        return;
      }

      // get gridpoint url
      const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;

      try {
        // get gridpoint metedata
        let response = await fetch(pointsUrl);
        // error check
        if (!response.ok) {
          console.error(`DataFetcher: API Error - Status ${response.status}`);
          return; // Simply stop on error for the basic version
        }
        const gridData = await response.json();

        //extract hourly forecast url
        const hourlyForecastUrl = gridData.properties.forecastHourly;

        if (!hourlyForecastUrl) {
          console.error(
            "Could not find the 'forecastHourly' URL in the initial response."
          );
          return;
        }

        // --- STEP 2: Fetch the Hourly Forecast Data ---

        // 2. Fetch the actual hourly forecast using the URL from Step 1
        response = await fetch(hourlyForecastUrl);
        if (!response.ok) {
          console.error(`Step 2 API Error: Status ${response.status}`);
          return;
        }

        const hourlyData = await response.json();

        // SUCCESS: Send the final, detailed data back up to the parent
        onDataFetched(hourlyData);
        console.log(
          "DataFetcher: Hourly forecast data successfully fetched and sent to parent."
        );
        console.log('here it is: ', hourlyData)
      } catch (error) {
        console.error("DataFetcher: Fetch exception:", error.message);
      }
    },
    [onDataFetched]
  );

  useEffect(() => {
    fetchHourlyWeather(latitude, longitude);
  }, [latitude, longitude, fetchHourlyWeather]);

  // This component must return JSX, but it can be minimal/invisible
  return null;
};

export default DataFetcher;
