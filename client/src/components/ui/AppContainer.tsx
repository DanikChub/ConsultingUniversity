import React, { ReactNode, HTMLAttributes } from 'react';
import LeftMenu from '../LeftMenu/LeftMenu';
import AdminPath from './AdminPath';

interface AppContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children, ...rest }) => {
    return (

        <div {...rest}>
            <div className="w-full">
                <div className="flex items-start w-full relative">

                    <div className="absolute left-0 top-0 h-full bg-[#D9D9D9] w-52 z-0"/>

                    <aside className="sticky top-0 self-start">
                        <LeftMenu/>
                    </aside>

                    <div className="mt-[35px] ml-[70px] mb-[30px] w-[80%] min-h-[650px]">
                        <AdminPath/>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppContainer;