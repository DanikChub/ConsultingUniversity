interface EditableNoteProps {
    value?: string | null;
    onEdit: () => void;
}

const EditableNote: React.FC<EditableNoteProps> = ({
                                                       value,
                                                       onEdit,
                                                   }) => {
    return (
        <div className="group rounded-xl border border-gray-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <FiMessageSquare className="text-gray-400" />
                    <span>Примечание</span>
                </div>

                <button
                    type="button"
                    onClick={onEdit}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-[#2980B9] md:opacity-0 md:group-hover:opacity-100"
                    title="Изменить примечание"
                >
                    <FiEdit2 />
                </button>
            </div>

            <div className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                {value || (
                    <span className="text-gray-400">
                        Примечание не указано
                    </span>
                )}
            </div>
        </div>
    );
};