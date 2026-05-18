import React from "react";

import type { ProgramWithStats } from "../../../../features/listener-profile/model/types";
import ListenerProgramCard from "./ListenerProgramCard";

interface ListenerProgramsSectionProps {
    programs: ProgramWithStats[];
    onOpenGradeBook: (program: ProgramWithStats) => void;
}

const ListenerProgramsSection: React.FC<ListenerProgramsSectionProps> = ({
                                                                             programs,
                                                                             onOpenGradeBook,
                                                                         }) => {
    if (programs.length === 0) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 text-sm text-gray-500 shadow-md">
                У слушателя пока нет выданных программ.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {programs.map(program => (
                <ListenerProgramCard
                    key={program.programId}
                    program={program}
                    onOpenGradeBook={() => onOpenGradeBook(program)}
                />
            ))}
        </div>
    );
};

export default ListenerProgramsSection;