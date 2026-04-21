import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Option = {
    label: string;
    value: string;
};

type RHFSelectProps = {
    name: string;
    label: string;
    options: Option[];
};

const RHFSelect: React.FC<RHFSelectProps> = ({ name, label, options }) => {
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
                    <select
                        {...field}
                        id={name}
                        className={`add_input ${error ? 'red' : ''}`}
                    >
                        <option value="">Выберите</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            />
        </div>
    );
};

export default RHFSelect;