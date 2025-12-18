import { useRef, useLayoutEffect, ChangeEvent } from 'react';

type AutoResizeTextareaProps = {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    minRows?: number;
    maxRows?: number;
    className?: string;
};

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
                                                                   value,
                                                                   onChange,
                                                                   placeholder = 'Введите сообщение…',
                                                                   minRows = 1,
                                                                   maxRows = 6,
                                                                   className = ''
                                                               }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const resize = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';

        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = parseInt(computedStyle.lineHeight, 10);

        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;

        textarea.style.height =
            Math.min(
                Math.max(textarea.scrollHeight, minHeight),
                maxHeight
            ) + 'px';
    };

    useLayoutEffect(() => {
        resize();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={minRows}
            className={className}
            style={{
                resize: 'none',
                overflow: 'hidden'
            }}
        />
    );
};

export default AutoResizeTextarea;