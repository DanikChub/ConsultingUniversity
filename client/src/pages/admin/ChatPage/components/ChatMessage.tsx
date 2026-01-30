import { useEffect, useRef, useState } from 'react';

type ChatMessageProps = {
    text: string;
    time: string;
    isOwn: boolean;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ text, time, isOwn }) => {
    const [expanded, setExpanded] = useState(false);
    const [overflow, setOverflow] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setOverflow(el.scrollHeight > el.clientHeight);
    }, [text]);

    return (
        <div className={`flex w-full mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`
          max-w-[70%]  rounded-xl px-4 py-2 text-sm
          ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}
        `}
            >
                <div
                    ref={textRef}
                    className={`
            whitespace-pre-wrap break-words
            ${!expanded ? 'line-clamp-3' : ''}
          `}
                >
                    {text}
                </div>

                {overflow && (
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="mt-1 text-xs opacity-70 hover:opacity-100"
                    >
                        {expanded ? 'Свернуть' : 'Показать ещё'}
                    </button>
                )}

                <div className="text-[10px] opacity-60 text-right mt-1">
                    {time}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;