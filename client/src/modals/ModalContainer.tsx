import { ReactNode } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
type ScrollMode = 'inner' | 'auto';

interface ModalContainerProps {
    children: ReactNode;
    onClose?: () => void;
    size?: ModalSize;
    scroll?: ScrollMode;
    className?: string;
}

const SIZE_MAP: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
};

export const ModalContainer = ({
                                   children,
                                   onClose,
                                   size = 'md',
                                   scroll = 'inner',
                                   className = '',
                               }: ModalContainerProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div
                className={`
          w-full ${SIZE_MAP[size]}
          max-h-[calc(100dvh-2rem)]
          rounded-2xl bg-white shadow-2xl
          flex flex-col
          animate-fadeIn
          ${className}
        `}
            >
                {/* Контент */}
                <div
                    className={`
            ${scroll === 'inner' ? 'overflow-y-auto' : ''}
            p-6
          `}
                >
                    {children}
                </div>
            </div>

            {/*/!* Клик по фону *!/*/}
            {/*{onClose && (*/}
            {/*    <div*/}
            {/*        className="absolute inset-0"*/}
            {/*        onClick={onClose}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};
