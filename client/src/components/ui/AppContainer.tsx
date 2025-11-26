import React, { ReactNode, HTMLAttributes } from 'react';
import LeftMenu from '../LeftMenu/LeftMenu';
import AdminPath from './AdminPath';

interface AppContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children, ...rest }) => {
    return (
        <div className="min-h-[55vh]" {...rest}>
            <div className="w-full max-w-[1536px] m-auto">
                <div className="flex items-stretch min-h-[635px]">
                    <LeftMenu />
                    <div className="mt-[35px] ml-[70px] mb-[30px] w-full">
                        <AdminPath />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppContainer;