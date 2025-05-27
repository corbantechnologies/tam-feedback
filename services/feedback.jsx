"use client";

import { apiActions } from "@/tools/api";

export const createFeedback = async (values) => {
  await apiActions?.post("/api/v1/feedback/", values);
};

// authenticated
export const getFeedbacks = async (axios, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await apiActions?.get(
    `/api/v1/feedback/list/?${query}`,
    axios
  );
  return response || [];
};

export const getFeedbackByFormType = async (axios) => {
  const response = await apiActions?.get(
    "/api/v1/feedback/list?form_type=true",
    axios
  );
  return response || [];
};

export const getFeedbackBySpecificFormType = async (axios, formType) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/list?form_type=${formType}`,
    axios
  );
  return response || [];
};

export const getFeedbacksBySpecificRide = async (axios, ride) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/list?form_type=dhow&ride_type=${ride}`,
    axios
  );
  return response || [];
};

export const getGroupedFeedbacksByRide = async (axios) => {
  const response = await apiActions?.get(
    "/api/v1/feedback/list?group_by_ride_type=true",
    axios
  );
  return response || [];
};

export const getFeedbackByDate = async (axios, date) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/list?date=${date}`,
    axios
  );
  return response || [];
};

export const getFeedbackByDateRange = async (axios, startDate, endDate) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/list?start_date=${startDate}&end_date=${endDate}`,
    axios
  );
  return response || [];
};
