import React from "react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "red" | "blue";  // выбор цвета
  icon?: string;              // путь к изображению
  to?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = "blue", icon, children, className, to, ...props }) => {
  const navigate = useNavigate();
  const baseStyles = "flex items-center gap-2 px-4 py-1 max-w-max bg-[#D9D9D9] rounded-[7px] font-medium text-sm text-gray-700  hover:text-white transition-colors duration-200";
  const variantStyles = {
    red: "hover:bg-red-600",
    blue: "hover:bg-[#2D91CB]"
  };

  if (to) {
    // Если передан "to", используем Link
    return (
      <Link to={to} className={clsx(baseStyles, variantStyles[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {icon && <img src={icon} alt="icon" className="h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;