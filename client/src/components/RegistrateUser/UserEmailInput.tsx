import React from "react";

interface UserEmailInputProps {
    email: string;
    setEmail: (email: string) => void;
    validate: boolean;
}

const UserEmailInput: React.FC<UserEmailInputProps> = ({ email, setEmail, validate }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Убираем пробелы
        value = value.replace(/\s+/g, "");

        // Разрешаем только допустимые символы email
        value = value.replace(/[^A-Za-z0-9@._\-]/g, "");

        // Приводим к нижнему регистру
        value = value.toLowerCase();

        setEmail(value);
    };

    // Проверка правильного формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    // margin-left: 30px;
    // border: none;
    // outline: none;
    // font-size: 14px;
    // font-weight: 400;
    // width: 80%;
    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label htmlFor="email" className="text-right">E-mail</label>

            <input
                value={email}
                onChange={handleChange}
                id="email"
                type="text"
                className={`add_input ${validate && !isValid ? "text-red-700" : ""}`}
                placeholder="Введите e-mail пользователя"
            />
        </div>
    );
};

export default UserEmailInput;