"use client";

import { apiActions } from "@/tools/api";

export const createFeedback = async (values) => {
  try {
    const response = await apiActions.post("/api/v1/feedback/", values);
    return response.data;
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    throw error;
  }
};
// authenticated
// Today
export const getTodayFeedbacks = async (axios) => {
  const response = await apiActions?.get("/api/v1/feedback/list/", axios);
  return response || [];
};

export const getTodayFeedbacksByRideType = async (axios) => {
  const response = await apiActions?.get(
    "/api/v1/feedback/list?group_by_ride_type=true",
    axios
  );
  return response || {};
};

export const getTodayFeedbacksBySpecificRide = async (axios, ride) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/list?ride_type=${ride}`,
    axios
  );
  return response || [];
};

// All
export const getAllFeedbacks = async (axios) => {
  const response = await apiActions?.get("/api/v1/feedback/all/", axios);
  return response || [];
};

export const getAllFeedbacksByRideType = async (axios) => {
  const response = await apiActions?.get(
    "/api/v1/feedback/all?group_by_ride_type=true",
    axios
  );
  return response || {};
};

export const getAllFeedbacksBySpecificRide = async (axios, ride) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/all?ride_type=${ride}`,
    axios
  );
  return response || [];
};
