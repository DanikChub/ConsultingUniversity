import React from 'react';

type Props = {
    passport: string;
    setPassport: (value: string) => void;
};

const UserPassportInput: React.FC<Props> = ({ passport, setPassport }) => {
    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label className="text-right">
                Паспорт
            </label>

            <input
                type="text"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                placeholder="Введите паспортные данные"
                className="add_input"
            />
        </div>
    );
};

export default UserPassportInput;