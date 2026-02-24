import React, { ReactNode, HTMLAttributes } from 'react';
import LoadingAlert from "./LoadingAlert";
import CourseSidebar from "../CourseSidebar/CourseSidebar";
import type {Program} from "../../entities/program/model/type";
import type {ProgramProgress} from "../../entities/progress/model/type";
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;



interface AppContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    loading?: boolean;
    isLeftPanel?: boolean;
    skeleton?: ReactNode;
}

const UserContainer: React.FC<AppContainerProps> = ({ children, loading, isLeftPanel, skeleton, ...rest }) => {
    return (
        <div className="">
            {/*<div className="fixed top-[200px] left-0">*/}
            {/*    {*/}
            {/*        isLeftPanel && <CourseSidebar/>*/}
            {/*    }*/}
            {/*</div>*/}
            <div className="w-full mb-[121px] mt-[95px]" {...rest}>

                <div className="min-h-[55vh]">

                    <div className="w-full m-auto max-w-[1209px]">
                        {
                            loading ?
                                <div>{children}</div>
                                :
                                skeleton ?
                                    <div>{skeleton}</div>
                                    :
                                    <div>Загрузка...</div>
                        }
                    </div>

                </div>

            </div>
        </div>

    );
};

export default UserContainer;