import { FC, useRef, useEffect } from "react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const AutoResizeTextarea: FC<Props> = ({ value, onChange, placeholder, className, disabled }) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    const resize = () => {
        if (ref.current) {
            ref.current.style.height = "auto";
            ref.current.style.height = ref.current.scrollHeight + "px";
        }
    };

    useEffect(resize, [value]);

    return (
        <textarea
            disabled={disabled}
            ref={ref}
            value={value}
            onChange={e => onChange(e.target.value)}
            onInput={resize}
            placeholder={placeholder}
            className={` ${className || ""}`}
        />
    );
};