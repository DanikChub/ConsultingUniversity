import React, {useState} from 'react';
import PunctItem from "./PunctItem";
import Button from "../../../../shared/ui/buttons/Button";
import { usePunct } from "../../../../features/punct/edit/useEditPunct";
import type { Theme } from "../../../../entities/program/model/type";

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type Props = {
    theme: Theme;
    isHide: boolean;
};

const PunctList: React.FC<Props> = ({ theme, isHide }) => {
    const {
        puncts,
        updateTitlePunct,
        updateDescriptionPunct,
        addPunct,
        destroyPunct,
        moveOnePunct,
    } = usePunct(theme);

    const [disableDrag, setDisableDrag] = useState<boolean>(true)

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination || source.index === destination.index) return;

        const punctId = puncts[source.index].id;
        moveOnePunct(punctId, destination.index);
    };

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isHide ? 'max-h-10 opacity-0' : 'max-h-[5000px] opacity-100'
            }`}
        >
            <div className="px-4 mt-4 space-y-4 mb-4">


                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={`puncts-${theme.id}`} direction="vertical">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                {puncts.map((punct, index) => (
                                    <Draggable
                                        key={punct.id}
                                        draggableId={`punct-${punct.id}`}
                                        index={index}
                                        isDragDisabled={disableDrag}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}

                                            >
                                                <PunctItem
                                                    punct={punct}
                                                    punctIndex={index}
                                                    updateTitlePunct={updateTitlePunct}
                                                    updateDescriptionPunct={updateDescriptionPunct}
                                                    destroyPunct={destroyPunct}
                                                    setDisableParentDrag={setDisableDrag}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <Button
                    onClick={addPunct}
                    className="mt-4 ml-10 bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                    Добавить пункт
                </Button>
            </div>
        </div>
    );
};

export default PunctList;
