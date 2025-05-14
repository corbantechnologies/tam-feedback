"use client";

import { apiActions } from "@/tools/api";


export const getQuestions = async (formtype) => {
  if (!formtype) throw new Error("formtype is required");
  try {
    const response = await apiActions?.get(
      `/api/v1/questions/?form_type=${formtype}`
    );
    return response?.data?.results || [];
  } catch (error) {
    console.error(`Failed to fetch questions for ${formtype}:`, error);
    throw error;
  }
};

export const getQuestion = async (slug) => {
  const response = await apiActions?.get(`/api/v1/questions/${slug}/`);
  return response?.data || {};
};

// authenticated
export const createQuestion = async (values, axios) => {
  await apiActions?.post("/api/v1/questions/", values, axios);
};

export const updateQuestion = async (slug, values, axios) => {
  await apiActions?.patch(`/api/v1/questions/${slug}/`, values, axios);
};

export const deleteQuestion = async (slug, axios) => {
  await apiActions?.delete(`/api/v1/questions/${slug}/`, axios);
};
