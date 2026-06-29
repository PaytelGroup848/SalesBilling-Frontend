import { forwardRef } from "react";

export const Input = forwardRef(
  ({ className = "", label, error, prefix, ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-colors duration-200
            ${prefix ? "pl-9" : ""}
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
          `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
