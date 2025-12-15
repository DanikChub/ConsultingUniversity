import React, { ReactNode, HTMLAttributes } from 'react';
import LoadingAlert from "./LoadingAlert";



interface AppContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;

    loading: boolean;
}

const UserContainer: React.FC<AppContainerProps> = ({ children, loading, ...rest }) => {
    return (
        <div className="mb-[121px] mt-[95px]" {...rest}>

                <div className="min-h-[55vh]">
                    {
                        loading &&

                        <div className="w-full m-auto max-w-[1209px]">


                            {children}

                        </div>

                    }
                </div>

        </div>
    );
};

export default UserContainer;