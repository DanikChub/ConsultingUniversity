import React, { ReactNode, HTMLAttributes } from 'react';

interface AppContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    loading?: boolean;
    isLeftPanel?: boolean;
    skeleton?: ReactNode;
}

const PageLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[55vh]">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            </div>

            <div className="mt-6 text-gray-500 text-lg font-light tracking-wide">
                Загружаем данные...
            </div>
        </div>
    );
};

const UserContainer: React.FC<AppContainerProps> = ({
                                                        children,
                                                        loading = false,
                                                        skeleton,
                                                        ...rest
                                                    }) => {
    return (
        <div>
            <div className="w-full mb-[121px] mt-[95px]" {...rest}>
                <div className="min-h-[55vh]">
                    <div className="w-full m-auto max-w-[1209px] px-4">
                        {loading ? children : (skeleton ?? <PageLoader />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserContainer;