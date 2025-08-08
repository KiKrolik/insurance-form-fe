import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';

type FormInputs = {
  coverageAmount: number;
  policyDuration: number;
};

const useInsuranceCalculator = () => {
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const calculateCost = (data: FormInputs): number => {
    const baseRate = 10; 

    return baseRate * (data.coverageAmount / 1000) * data.policyDuration;
  };

  const handleEstimateCost: SubmitHandler<FormInputs> = (data) => {
    const cost = Math.round(calculateCost(data));
    setEstimatedCost(cost);
  };

  return { estimatedCost, handleEstimateCost };
};

export default useInsuranceCalculator;