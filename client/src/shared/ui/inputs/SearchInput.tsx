// src/components/ui/SearchInput.tsx
import React from "react";
import clsx from "clsx";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string; // путь к изображению (лупа)
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Поиск", icon, className, ...props }) => {
  return (
    <div className={clsx("relative w-full", className)}>
      {icon && <img src={icon} alt="search-icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          "w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500",
          icon ? "pl-8" : "",
        )}
        {...props}
      />
    </div>
  );
};

export default SearchInput;