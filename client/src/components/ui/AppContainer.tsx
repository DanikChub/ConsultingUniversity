import React, { ReactNode, HTMLAttributes } from 'react';
import LeftMenu from '../LeftMenu/LeftMenu';
import AdminPath from './AdminPath';

interface AppContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children, ...rest }) => {
    return (
        <div className="h-full" {...rest}>
            <div className="w-full max-w-[1536px] m-auto">
                <div className="flex items-stretch min-h-[635px] w-full">
                    <LeftMenu />
                    <div className="mt-[35px] ml-[70px] mb-[30px] w-[80%]">
                        <AdminPath />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppContainer;