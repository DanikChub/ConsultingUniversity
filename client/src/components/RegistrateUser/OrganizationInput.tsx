import React from "react";

interface OrganizationInputProps {
    org: string;
    setOrg: (v: string) => void;
    inn: string;
    setInn: (v: string) => void;
}

const OrganizationInput: React.FC<OrganizationInputProps> = ({ org, setOrg, inn, setInn }) => {

    // Проверка: строго 12 цифр
    const isInnValid = /^\d{12}$/.test(inn);

    // Формируем маску: XXX-XXX-XXX-XXX
    const formatInnMask = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 12);

        let masked = "";
        for (let i = 0; i < digits.length; i++) {
            masked += digits[i];
            if (i === 2 || i === 5 || i === 8) masked += "-";
        }

        return masked;
    };

    const handleInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 12);
        setInn(rawDigits);
    };

    const maskedInn = formatInnMask(inn);

    return (
        <div className="grid grid-cols-[118px_auto_118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label htmlFor="org" className="text-right">Организация</label>
            <input
                value={org}
                onChange={e => setOrg(e.target.value)}
                id="org"
                type="text"
                className="add_input"
                placeholder="Введите наименование организации"
            />

            <label htmlFor="inn" className="text-right">ИНН</label>
            <div className="relative w-1/2">
                <input
                    value={maskedInn}
                    onChange={handleInnChange}
                    id="inn"
                    type="text"
                    className={`add_input ${inn && !isInnValid ? "red" : ""}`}
                    placeholder="XXX-XXX-XXX-XXX"
                />

                {/* Подсказка при неверном ИНН */}
                {inn && !isInnValid && (
                    <div className="absolute top-[100%] bg-white left-0 p-2 rounded-sm" style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
                        ИНН должен содержать ровно 12 цифр
                    </div>
                )}
            </div>
                
           
            
        </div>
    );
};

export default OrganizationInput;
