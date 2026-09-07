import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';

export const useDoctors = (params = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async (queryParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorService.getAll(queryParams);
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [JSON.stringify(params)]);

  const getDoctorById = async (doctorId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorService.getById(doctorId);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors,
    getDoctorById,
  };
};
