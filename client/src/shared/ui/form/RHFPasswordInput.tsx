import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

type RHFPasswordInputProps = {
    name: string;
    label: string;
    placeholder?: string;
    isEdit?: boolean;
    autoGenerate?: boolean;
};

const generateTemporaryPassword = () => {
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

    let password = "";

    for (let i = 0; i < 10; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    return password;
};

const RHFPasswordInput: React.FC<RHFPasswordInputProps> = ({
                                                               name,
                                                               label,
                                                               placeholder,
                                                               isEdit = false,
                                                               autoGenerate = true,
                                                           }) => {
    const {
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    const regeneratePassword = () => {
        setValue(name, generateTemporaryPassword(), {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    useEffect(() => {
        if (!autoGenerate || isEdit) return;

        const currentValue = getValues(name);

        if (!currentValue) {
            setValue(name, generateTemporaryPassword(), {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [autoGenerate, isEdit, name, getValues, setValue]);

    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label htmlFor={name} className="text-right">
                {label}
                <span className="ml-1 text-red-500">*</span>
            </label>

            <div>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <input
                            {...field}
                            id={name}
                            type="text"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            className={`add_input ${error ? "red" : ""}`}
                            placeholder={placeholder}
                        />
                    )}
                />

                <button
                    type="button"
                    onClick={regeneratePassword}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Сгенерировать пароль
                </button>
            </div>
        </div>
    );
};

export default RHFPasswordInput;