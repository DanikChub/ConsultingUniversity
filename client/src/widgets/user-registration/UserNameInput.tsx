import React from 'react';

interface UserNameInputProps {
    name: string;
    setName: (value: string) => void;
    validate: boolean;
}

const UserNameInput: React.FC<UserNameInputProps> = ({ name, setName, validate }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Разрешаем только буквы + пробелы
        value = value.replace(/[^А-Яа-яЁёA-Za-z\s]/g, '');

        // Удаляем двойные пробелы
        value = value.replace(/\s+/g, ' ');

        // Убираем пробел в начале
        value = value.replace(/^\s/, '');

        // Ограничиваем максимум 3 слова
        const words = value.split(' ').filter(Boolean);
        if (words.length > 3) return;

        setName(value);
    };

    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label htmlFor="name" className="text-right">ФИО</label>

            <input
                value={name}
                onChange={handleChange}
                id="name"
                type="text"
                className={`add_input ${validate && name.split(' ').filter(Boolean).length !== 3 ? 'red' : ''}`}
                placeholder="Введите Фамилию Имя Отчество"
            />
        </div>
    );
};

export default UserNameInput;