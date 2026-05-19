import React from "react";

import type { ProgramWithStats } from "../../../../features/listener-profile/model/types";
import ListenerProgramCard from "./ListenerProgramCard";

interface ListenerProgramsSectionProps {
    userId: number;
    programs: ProgramWithStats[];
    onOpenGradeBook: (program: ProgramWithStats) => void;
    onChanged: () => void;
}

const ListenerProgramsSection: React.FC<ListenerProgramsSectionProps> = ({
                                                                             userId,
                                                                             programs,
                                                                             onOpenGradeBook,
                                                                             onChanged,
                                                                         }) => {
    if (programs.length === 0) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 shadow-md">
                <div className="text-base font-medium text-gray-700">
                    У слушателя пока нет выданных программ
                </div>

                <p className="mt-2 text-sm text-gray-400">
                    Нажмите “Выдать программу”, чтобы открыть доступ к обучению.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {programs.map(program => (
                <ListenerProgramCard
                    key={program.enrollmentId}
                    userId={userId}
                    program={program}
                    onOpenGradeBook={() => onOpenGradeBook(program)}
                    onChanged={onChanged}
                />
            ))}
        </div>
    );
};

export default ListenerProgramsSection;