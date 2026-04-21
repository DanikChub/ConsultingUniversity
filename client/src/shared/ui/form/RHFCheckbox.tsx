import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type RHFCheckboxProps = {
    name: string;
    label: string;
};

const RHFCheckbox: React.FC<RHFCheckboxProps> = ({ name, label }) => {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <div />
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(field.value)}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <span>{label}</span>
                    </label>
                )}
            />
        </div>
    );
};

export default RHFCheckbox;