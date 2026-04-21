import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { ProgramOption } from '../../model/types';

type ProgramSelectSectionProps = {
    options: ProgramOption[];
};

const ProgramSelectSection: React.FC<ProgramSelectSectionProps> = ({ options }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors.programIds?.message as string | undefined;

    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label className="text-right">Программа</label>

            <Controller
                control={control}
                name="programIds"
                render={({ field }) => (
                    <div className="w-full">
                        <select
                            className={`add_input ${error ? 'red' : ''}`}
                            value={field.value?.[0] ?? ''}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                field.onChange(value ? [value] : []);
                            }}
                        >
                            <option value="">Выберите программу</option>
                            {options.map((program) => (
                                <option key={program.id} value={program.id}>
                                    {program.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            />
        </div>
    );
};

export default ProgramSelectSection;