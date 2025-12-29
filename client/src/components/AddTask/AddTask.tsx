import React from "react";
import Modal from "../ui/Modal";
import closeIcon from "../../assets/imgs/UI/close.png";
import { TaskType } from "../../types/tasks";

interface AddTaskProps {
    show: {
        show: boolean;
        i: number;
        j: number;
        value: string;
        availableTasks: Record<TaskType, boolean>;
    };
    setShow: (value: any) => void;
    setMakeOpen: (...args: any[]) => void;
}

// -------------------------------
// Карта рендера всех кнопок
// -------------------------------
const TASK_RENDER_MAP: Record<
    TaskType,
    {
        label: string;
        isFile?: boolean;
        accept?: string;
    }
> = {
    [TaskType.TEST]: {
        label: "Добавить тест",
    },
    [TaskType.PRESENTATION]: {
        label: "Добавить презентацию",
        isFile: true,
        accept: ".pdf",
    },
    [TaskType.PRACTICAL]: {
        label: "Добавить практическую работу",
    },
    [TaskType.LECTION]: {
        label: "Добавить лекцию (DOCX)",
        isFile: true,
        accept: ".docx",
    },
    [TaskType.VIDEO]: {
        label: "Добавить видео",
    },
    [TaskType.LECTION_PDF]: {
        label: "Добавить лекцию (PDF)",
        isFile: true,
        accept: ".pdf",
    },
    [TaskType.LECTION_PDF]: {
        label: "Добавить лекцию (PDF)",
        isFile: true,
        accept: ".pdf",
    },
    [TaskType.AUDIO]: {
        label: "Добавить аудио",
        isFile: true,
        accept: ".mp3",
    },
};

const AddTask: React.FC<AddTaskProps> = ({ show, setShow, setMakeOpen }) => {
    const close = () =>
        setShow({
            show: false,
            i: 0,
            j: 0,
            value: "",
            availableTasks: {
                [TaskType.TEST]: false,
                [TaskType.PRESENTATION]: false,
                [TaskType.PRACTICAL]: false,
                [TaskType.LECTION]: false,
                [TaskType.VIDEO]: false,
                [TaskType.LECTION_PDF]: false,
            },
        });

    if (!show.show) return null;

    return (
        <Modal open={show.show} onClose={close} width="350px">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b">
                <div className="text-md font-bold">Добавить</div>


            </div>

            {/* Render tasks */}
            <div>
                {Object.entries(show.availableTasks).map(([key, canShow]) => {
                    if (!canShow) return null;

                    const type = key as TaskType;
                    const config = TASK_RENDER_MAP[type];

                    // INPUT FILE
                    if (config.isFile) {
                        const inputId = `task_input_${type}`;

                        return (
                            <div key={type}>
                                <input
                                    id={inputId}
                                    type="file"
                                    className="hidden"
                                    accept={config.accept}
                                    onChange={(e) =>
                                        setMakeOpen(
                                            type,
                                            show.i,
                                            show.j,
                                            e.target.files?.[0]
                                        )
                                    }
                                />
                                <label
                                    htmlFor={inputId}
                                    className="block p-[10px] px-4 hover:bg-gray-100 cursor-pointer bg-white rounded-none"
                                >
                                    {config.label}
                                </label>
                            </div>
                        );
                    }

                    // BUTTON
                    return (
                        <button
                            key={type}
                            className="w-full text-left p-[10px] px-4 hover:bg-gray-100"
                            onClick={() => setMakeOpen(type, show.i, show.j)}
                        >
                            {config.label}
                        </button>
                    );
                })}
            </div>
        </Modal>
    );
};

export default AddTask;
