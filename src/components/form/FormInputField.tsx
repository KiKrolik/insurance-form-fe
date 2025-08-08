import React from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import SelectField from './SelectField';

type InputFieldProps = {
  id: string;
  type: string;
  label: string;
  register: UseFormRegisterReturn;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: FieldError | string;
  className?: string;
  options?: { value: string; label: string }[];
};

const InputField: React.FC<InputFieldProps> = ({ id, type, label, register, error, className, options }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {type === 'select' ? (
        <SelectField
          id={id}
          register={register}
          error={error}
          className={className}
          options={options ?? []}
        />
      ) : (
        <input
          type={type || 'text'}
          id={id}
          {...register}
          className={`${className} w-full border rounded p-2 ${error ? 'border-red-500' : ''}`}
        />
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;