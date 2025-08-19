import React, { useEffect, useState } from 'react';
import {  useForm, useWatch } from 'react-hook-form';
import useInsuranceCalculator from '../hooks/useInsuranceCalculator';
import InputField from '../components/form/FormInputField';
import axios, { AxiosError } from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { ApiError, ApiResponse } from '../api/types';
import { getApiUrl } from '../api/utils';

type FormInputs = {
  type: string;
  coverageAmount: number;
  startDate: string;
  policyDuration: number;
};

type FormStateType = 'ready' | 'submitting' | 'error';

const fieldNames = ['type', 'coverageAmount', 'startDate', 'policyDuration'] as const;

const Form: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors, isValid, isDirty }, watch } = useForm<FormInputs>({ mode: 'onChange' });
  const watched = useWatch({ name: fieldNames, control });
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
    const values = watch()
    if (isDirty && isValid && !calculatedCost) {
      handleEstimateCost(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isValid, calculatedCost, ...watched]);

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
          <LoadingSpinner className="mt-4 justify-center" label="Calculating..." />
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