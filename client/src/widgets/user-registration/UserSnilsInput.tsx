import React from 'react';

type Props = {
    snils: string;
    setSnils: (value: string) => void;
};

const UserSnilsInput: React.FC<Props> = ({ snils, setSnils }) => {
    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label className="text-right">
                СНИЛС
            </label>

            <input
                type="text"
                value={snils}
                onChange={(e) => setSnils(e.target.value)}
                placeholder="Введите СНИЛС"
                className="add_input"
            />
        </div>
    );
};

export default UserSnilsInput;