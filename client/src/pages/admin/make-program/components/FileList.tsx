import React from 'react';
import { FaPlus } from "react-icons/fa";
import FileItem from "./FileItem";

import { useModals } from "../../../../hooks/useModals";
import { useFile } from "../../../../features/file/edit/useEditFile";

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import type {Punct} from "../../../../entities/punct/model/type";
import type {Theme} from "../../../../entities/theme/model/type";

type Props = {
    target: Punct | Theme;
    targetType: 'theme' | 'punct';
};

const FileList: React.FC<Props> = ({ target, targetType }) => {
    const { files, addFile, destroyFile, moveOneFile, editFileName  } = useFile(target, targetType);
    const { openModal } = useModals();

    // ----------------- drag & drop -----------------
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return; // перетащили за пределы

        if (destination.index === source.index) return; // позиция не изменилась

        // получаем id файла из draggableId
        const fileId = Number(draggableId.replace('file-', ''));

        moveOneFile(fileId, destination.index);
    };


    const handleAddFile = async () => {
        const file = await openModal('uploadFile', {});
        if (file) await addFile(file);
    };

    // ----------------- render -----------------
    return (
        <div className="mt-4 flex w-full gap-2 flex-wrap items-stretch">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`files-${target.id}`} direction="horizontal">
                    {(provided) => (
                        <div
                            className="flex space-x-2 "
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <button
                                onClick={handleAddFile}
                                className="flex flex-col h-full items-center justify-center py-3 w-40
                                bg-gray-200 rounded border border-gray-300 hover:bg-gray-300 text-gray-600 font-medium cursor-pointer"
                            >
                                <FaPlus className="w-4 h-4"/>
                                <span className="text-xs mt-1">Добавить файл</span>
                            </button>
                            {files.map((file, index) => (
                                <Draggable
                                    key={file.id}
                                    draggableId={`file-${file.id}`} // важно чтобы был строкой
                                    index={index}

                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}

                                        >
                                            <FileItem
                                                file={file}
                                                onDelete={destroyFile}
                                                renameFile={editFileName}
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

        </div>
    );
};

export default FileList;
