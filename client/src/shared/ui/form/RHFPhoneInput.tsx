import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type RHFPhoneInputProps = {
    name: string;
    label: string;
    placeholder?: string;
};

const normalizePhone = (value: string) => {
    let digits = value.replace(/\D/g, '');

    if (digits.startsWith('8')) {
        digits = '7' + digits.slice(1);
    }

    if (!digits.startsWith('7') && digits.length > 0) {
        digits = '7' + digits;
    }

    digits = digits.slice(0, 11);

    if (digits.length === 0) return '';

    let result = '+7';

    if (digits.length > 1) {
        result += ' (' + digits.slice(1, 4);
    }
    if (digits.length >= 4) {
        result += ') ' + digits.slice(4, 7);
    }
    if (digits.length >= 7) {
        result += '-' + digits.slice(7, 9);
    }
    if (digits.length >= 9) {
        result += '-' + digits.slice(9, 11);
    }

    return result;
};

const RHFPhoneInput: React.FC<RHFPhoneInputProps> = ({
                                                         name,
                                                         label,
                                                         placeholder = '+7 (___) ___-__-__',
                                                     }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label htmlFor={name} className="text-right">
                {label}
            </label>

            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <input
                        id={name}
                        type="text"
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(normalizePhone(e.target.value))}
                        className={`add_input ${error ? 'red' : ''}`}
                        placeholder={placeholder}
                    />
                )}
            />
        </div>
    );
};

export default RHFPhoneInput;