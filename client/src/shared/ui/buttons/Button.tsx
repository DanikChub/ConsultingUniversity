import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {Context} from "../../../index";
import {useModals} from "../../../hooks/useModals";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "red" | "blue";
  icon?: string;
  to?: string;
  checkRole?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                         variant = "blue",
                                         icon,
                                         children,
                                         className,
                                         to,
                                         checkRole,
                                         ...props
                                       }) => {
  const userRole = useContext(Context).user.user.role;
  const { openModal } = useModals();

  const baseStyles =
      "flex items-center gap-2 px-4 py-1 max-w-max bg-[#D9D9D9] rounded-[7px] font-medium text-sm text-gray-700 hover:text-white transition-colors duration-200";

  const variantStyles = {
    red: "hover:bg-red-600",
    blue: "hover:bg-[#2D91CB]",
  };

  const handleNoAccess = async () => {
    await openModal("alert", {
      title: "Недостаточно прав доступа",
      description:
          "У вас нет прав для выполнения этого действия. Если вы считаете, что это ошибка, обратитесь к администратору платформы.",
      buttonText: "Понятно",
    });
  };

  if (checkRole && checkRole !== userRole) {
    return (
        <button
            type="button"
            className={clsx(baseStyles, variantStyles[variant], className)}
            onClick={handleNoAccess}
        >
          {icon && <img src={icon} alt="icon" className="h-4 w-4" />}
          {children}
        </button>
    );
  }

  if (to) {
    return (
        <Link
            to={to}
            className={clsx(baseStyles, variantStyles[variant], className)}
        >
          {icon && <img src={icon} alt="icon" className="h-4 w-4" />}
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
