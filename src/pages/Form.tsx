import React, { useEffect, useState } from 'react';
import {  useForm } from 'react-hook-form';
import useInsuranceCalculator from '../hooks/useInsuranceCalculator';
import InputField from '../components/form/FormInputField';
import axios, { AxiosError } from 'axios';
import type { ApiError, ApiResponse } from '../api/types';
import { getApiUrl } from '../api/utils';

type FormInputs = {
  type: string;
  coverageAmount: number;
  startDate: string;
  policyDuration: number;
};

type FormStateType = 'ready' | 'submitting' | 'error';

const Form: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isValid, isDirty }, watch } = useForm<FormInputs>({ mode: 'onChange' });
  const { estimatedCost, handleEstimateCost } = useInsuranceCalculator();
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [formState, setFormState] = useState<FormStateType>('ready');
  const [error, setError] = useState<string | null>(null);

  const apiUrl = getApiUrl();

  useEffect(() => {
    const subscription = watch((_, { type }) => {
      if (type === 'change') {
        setCalculatedCost(null);
        setFormState('ready');
        setError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isDirty && isValid && !calculatedCost) {
      handleEstimateCost(watch());
    }
  }, [watch, isDirty, isValid]);

  const handleFormSubmit = (data: FormInputs) => {
    setFormState('submitting');
    axios.post<ApiResponse>(`${apiUrl}/insurance/estimate`, data)
      .then((response) => {
        setCalculatedCost(response.data.value ?? null);
        setFormState('ready');
      })
      .catch((error: AxiosError<ApiError>) => {
        setFormState('error');
        const message = error.response?.data.message || 'An error occurred while submitting the form.';
        setError(message);
      });
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <h2 className="text-xl font-bold">Insurance Cost Estimator</h2>

        <InputField
          label="Type of Insurance:"
          id="type"
          type="select"
          register={register('type', { required: 'Insurance Type is required' })}
          error={errors.type?.message}
          className="w-full border rounded p-2"
          options={[
            { value: '', label: 'Select...' },
            { value: 'auto', label: 'Auto' },
            { value: 'health', label: 'Health' },
            { value: 'life', label: 'Life' },
            { value: 'home', label: 'Home' },
          ]}
        />

        <InputField
          label="Coverage Amount ($):"
          id="coverageAmount"
          type="number"
          register={register('coverageAmount', { 
            required: 'Coverage Amount is required', 
            min: { value: 1000, message: 'Coverage must be at least $1000' } 
          })}
          error={errors.coverageAmount?.message}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === '.' || e.key === '-' || e.key === 'e') {
          e.preventDefault();
            }
          }}
          className="w-full border rounded p-2"
        />

        <InputField
          label="Policy Start Date:"
          id="startDate"
          type="date"
          register={register('startDate', { required: 'Policy Start Date is required' })}
          error={errors.startDate?.message}
          className="w-full border rounded p-2"
        />

        <InputField
          label="Policy Duration (Years):"
          id="policyDuration"
          type="number"
          register={register('policyDuration', { 
            required: 'Policy Duration is required', 
            min: { value: 1, message: 'Duration must be at least 1 year' } 
          })}
          error={errors.policyDuration?.message}
          className="w-full border rounded p-2"
        />


        {formState === 'ready' && !calculatedCost && estimatedCost &&
        !errors.type &&
        !errors.coverageAmount &&
        !errors.startDate &&
        !errors.policyDuration && (
        <p className="mt-4 text-green-500">
          Estimated Cost: ${estimatedCost}
        </p>
        )}
        {formState === 'ready' && calculatedCost !== null && (
          <p className="mt-4 text-blue-500">
            Calculated Cost: ${calculatedCost}
          </p>
        )}
        {(formState === 'submitting') && (
          <div className="flex justify-center items-center mt-4">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="ml-2 text-blue-500">Calculating...</span>
          </div>
        )}
        {formState === 'error' && (
          <div className="mt-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full text-white py-2 rounded hover:bg-blue-600"
        >
          Calculate with discounts
        </button>
      </form>

      
    </div>
  );
};

export default Form;