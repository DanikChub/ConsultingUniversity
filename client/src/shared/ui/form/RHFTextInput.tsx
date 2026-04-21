import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type RHFTextInputProps = {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    transform?: (value: string) => string;
};

const RHFTextInput: React.FC<RHFTextInputProps> = ({
                                                       name,
                                                       label,
                                                       placeholder,
                                                       type = 'text',
                                                       transform,
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
                        {...field}
                        id={name}
                        type={type}
                        value={field.value ?? ''}
                        onChange={(e) => {
                            const nextValue = transform
                                ? transform(e.target.value)
                                : e.target.value;
                            field.onChange(nextValue);
                        }}
                        className={`add_input ${error ? 'red' : ''}`}
                        placeholder={placeholder}
                    />
                )}
            />
        </div>
    );
};

export default RHFTextInput;