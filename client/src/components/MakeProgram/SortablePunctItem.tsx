import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PunctItem from "./PunctItem";

const SortablePunctItem = ({ id, punct, i, j, themesArray, setThemesArray, deletePunct, setShowAddTask, openModal }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2">
            {/*<div*/}
            {/*    {...attributes}*/}
            {/*    {...listeners}*/}
            {/*    className="cursor-grab active:cursor-grabbing px-1 text-gray-500 select-none"*/}
            {/*>*/}
            {/*    ⠿*/}
            {/*</div>*/}

            <PunctItem
                punct={punct}
                i={i}
                j={j}
                themesArray={themesArray}
                setThemesArray={setThemesArray}
                deletePunct={deletePunct}
                setShowAddTask={setShowAddTask}
                openModal={openModal}
            />
        </div>
    );
};

export default SortablePunctItem;