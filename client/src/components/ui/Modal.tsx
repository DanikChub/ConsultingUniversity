import React, { useEffect, useRef } from "react";
import closeIcon from "../../assets/imgs/UI/close.png"; // путь к иконке можно поменять

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: string;
    showCloseButton?: boolean; // показывать кнопку закрытия
    closeButtonPosition?: "top-right" | "top-left"; // позиция кнопки
}

const Modal: React.FC<ModalProps> = ({
                                         open,
                                         onClose,
                                         children,
                                         width = "350px",
                                         showCloseButton = true,
                                         closeButtonPosition = "top-right",
                                     }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    // клик вне модалки
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm z-[1000] flex items-center justify-center animate-fadeIn">
            <div
                ref={ref}
                style={{width}}
                className="bg-white rounded-md shadow-lg max-h-[80vh] overflow-y-auto animate-fadeIn relative p-4"
            >
                {/* Кнопка закрытия */}
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className={`absolute p-1 rounded-sm hover:bg-red-400 hover:text-white transition ${
                            closeButtonPosition === "top-right" ? "top-2 right-2" : "top-2 left-2"
                        }`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>

                )}

                {children}
            </div>
        </div>
    );
};

export default Modal;
