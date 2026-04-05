/**
 * Triggers hourly weather fetch on mount / when coordinates change.
 * Delegates HTTP to fetchHourlyForecast in WeatherData.ts.
 */

import { useCallback, useEffect, useRef } from "react";
import {
  fetchHourlyForecast,
  fetchOpenMeteoHourlyCloudCover,
  type NwsHourlyForecast,
  type OpenMeteoHourlyCloud,
} from "./WeatherData";

type Props = {
  latitude: number;
  longitude: number;
  onFetchStart?: () => void;
  onFetchError?: (message: string) => void;
  onDataFetched: (data: NwsHourlyForecast) => void;
  onCloudMeteoFetched?: (data: OpenMeteoHourlyCloud) => void;
};

const DataFetcher = ({
  latitude,
  longitude,
  onFetchStart,
  onFetchError,
  onDataFetched,
  onCloudMeteoFetched,
}: Props) => {
  const requestIdRef = useRef(0);

  const runFetch = useCallback(
    async (lat: number, lon: number) => {
      const requestId = ++requestIdRef.current;
      const isStale = () => requestId !== requestIdRef.current;

      onFetchStart?.();
      try {
        const hourlyData = await fetchHourlyForecast(lat, lon);
        if (isStale()) return;
        onDataFetched(hourlyData);
      } catch (error: unknown) {
        if (isStale()) return;
        const message =
          error instanceof Error ? error.message : "Unknown fetch error";
        onFetchError?.(message);
        return;
      }
      try {
        const cloudMeteo = await fetchOpenMeteoHourlyCloudCover(lat, lon);
        if (isStale()) return;
        onCloudMeteoFetched?.(cloudMeteo);
      } catch {
        /* NWS data already shown; cloud % stays cleared or previous */
      }
    },
    [onCloudMeteoFetched, onDataFetched, onFetchError, onFetchStart],
  );

  useEffect(() => {
    runFetch(latitude, longitude);
  }, [latitude, longitude, runFetch]);

  return null;
};

export default DataFetcher;
