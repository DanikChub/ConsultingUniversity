import { useCallback } from "react";

const PhoneInput = ({ phone, setPhone, validate }: any) => {

    const formatPhone = useCallback((value: string) => {
        // оставляем только цифры
        let digits = value.replace(/\D/g, "");

        // ограничиваем 11 символами
        digits = digits.substring(0, 11);

        // форматируем
        let formatted = "+7";

        if (digits.length > 1) formatted += " (" + digits.substring(1, 4);
        if (digits.length > 4) formatted += ")";
        if (digits.length > 4) formatted += " " + digits.substring(4, 7);
        if (digits.length > 7) formatted += "-" + digits.substring(7, 9);
        if (digits.length > 9) formatted += "-" + digits.substring(9, 11);

        return formatted;
    }, []);

    const handleChange = (e: any) => {
        const inputValue = e.target.value;
        const digits = inputValue.replace(/\D/g, "");
        console.log(inputValue, digits)
        // если стираем — просто применяем отформатированные цифры
        if (digits.length <= phone.replace(/\D/g, "").length) {
            setPhone(formatPhone(digits));
            return;
        }

        // обычный ввод
        setPhone(formatPhone(inputValue));
    };

    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label htmlFor="phone" className="text-right">Телефон</label>

            <input
                value={phone}
                onChange={handleChange}
                id="phone"
                type="text"
                className={`add_input ${validate && phone.replace(/\D/g, "").length !== 11 ? 'red' : ''}`}
                placeholder="+7 (___) ___-__-__"
            />
        </div>
    );
};

export default PhoneInput;
