import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type RHFTextareaProps = {
    name: string;
    label: string;
    placeholder?: string;
    rows?: number;
};

const RHFTextarea: React.FC<RHFTextareaProps> = ({
                                                     name,
                                                     label,
                                                     placeholder,
                                                     rows = 3,
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
                    <textarea
                        {...field}
                        id={name}
                        rows={rows}
                        value={field.value ?? ''}
                        className={`add_input min-h-[110px] resize-none ${error ? 'red' : ''}`}
                        placeholder={placeholder}
                    />
                )}
            />
        </div>
    );
};

export default RHFTextarea;