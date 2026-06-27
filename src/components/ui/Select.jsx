import { forwardRef } from 'react';

export const Select = forwardRef(({
  className = '',
  label,
  options,
  error,
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          transition-colors duration-200 bg-white
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        `}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});
