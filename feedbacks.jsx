"use client";

import React, { useState, useEffect } from "react";
import { useFetchFeedbacks } from "@/hooks/feedbacks/actions";
import { toast, Toaster } from "react-hot-toast";

const AdminDashboard = () => {
  const [formType, setFormType] = useState("");
  const [rideType, setRideType] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupByFormType, setGroupByFormType] = useState(false);
  const [page, setPage] = useState(1);

  // Build query params dynamically, only for set filters
  const buildQueryParams = () => {
    const params = {};
    if (formType) params.form_type = formType;
    if (rideType) params.ride_type = rideType;
    if (date) params.date = date;
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    if (groupByFormType) params.group_by_form_type = "true";
    return params;
  };

  const queryParams = buildQueryParams();
  const {
    data: rawFeedbacks = [],
    isLoading,
    refetch,
    error,
  } = useFetchFeedbacks(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  useEffect(() => {
    refetch();
    if (error) {
      toast.error(
        "Authentication failed or server error. Please log in again."
      );
      console.error("Fetch error:", error);
    }
  }, [
    formType,
    rideType,
    date,
    startDate,
    endDate,
    groupByFormType,
    refetch,
    error,
  ]);

  const handleFilterChange = (setter) => (e) => setter(e.target.value);
  const handleDateChange = (setter) => (e) => setter(e.target.value);
  const toggleGroupBy = () => setGroupByFormType(!groupByFormType);

  // Flatten grouped data if group_by_form_type is true
  const feedbacks = Array.isArray(rawFeedbacks)
    ? rawFeedbacks
    : [
        ...(rawFeedbacks.dhow || []),
        ...(rawFeedbacks.village || []),
        ...(rawFeedbacks.restaurant || []),
      ];

  const totalPages = Math.ceil(feedbacks.length / 10);
  const paginatedFeedbacks = feedbacks.slice((page - 1) * 10, page * 10);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Admin Dashboard
        </h1>
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={formType}
              onChange={handleFilterChange(setFormType)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">All Form Types</option>
              <option value="dhow">Dhow</option>
              <option value="village">Village</option>
              <option value="restaurant">Restaurant</option>
            </select>
            <select
              value={rideType}
              onChange={handleFilterChange(setRideType)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">All Ride Types</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={handleDateChange(setDate)}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={startDate}
              onChange={handleDateChange(setStartDate)}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={handleDateChange(setEndDate)}
              className="p-2 border border-gray-300 rounded"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={groupByFormType}
                onChange={toggleGroupBy}
                className="mr-2"
              />
              Group by Form Type
            </label>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">
            Error loading feedback. Please try again.
          </p>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">No feedback available.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Form Type</th>
                    <th className="p-2">Guest Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Reference</th>
                    <th className="p-2">Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFeedbacks.map((feedback) => (
                    <tr key={feedback.reference} className="border-t">
                      <td className="p-2">{feedback.form_type}</td>
                      <td className="p-2">{feedback.guest_name}</td>
                      <td className="p-2">{feedback.guest_email}</td>
                      <td className="p-2">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">{feedback.reference}</td>
                      <td className="p-2">
                        <details>
                          <summary className="cursor-pointer text-blue-500">
                            View Responses
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded">
                            {JSON.stringify(
                              feedback.village_responses ||
                                feedback.dhow_responses ||
                                feedback.restaurant_responses ||
                                [],
                              null,
                              2
                            )}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
