"use client";

export const getAnalytics = async (axios) => {
  const response = await apiActions?.get("/api/v1/analytics/", axios);
  return response || {};
};

export const getAnalyticsByDate = async (date, axios) => {
  const response = await apiActions?.get(
    `/api/v1/analytics/?date_filter=${date}`,
    axios
  );
  return response || {};
};

export const getAnalyticsByRideType = async (rideType, axios) => {
  const response = await apiActions?.get(
    `/api/v1/analytics/?ride_type=${rideType}`,
    axios
  );
  return response || {};
};

export const getAnalyticsByRideTypeAndDate = async (rideType, date, axios) => {
  const response = await apiActions?.get(
    `/api/v1/analytics/?date_filter=${date}&ride_type=${rideType}`,
    axios
  );
  return response || {};
};
