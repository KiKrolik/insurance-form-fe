import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

type SelectFieldProps = {
  id: string;
  register: UseFormRegisterReturn;
  error?: FieldError | string;
  className?: string;
  options: { value: string; label: string }[];
};

const SelectField: React.FC<SelectFieldProps> = ({ id, register, error, className, options }) => (
  <div>
    <select
      id={id}
      {...register}
      className={`${className ?? ''} w-full border rounded p-2 ${error ? 'border-red-500' : ''}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;