import React from 'react';
import { FaPlus, FaTrashAlt, FaClipboardList } from "react-icons/fa";
import type { Punct } from "../../../../entities/program/model/type";
import { useModals } from "../../../../hooks/useModals";
import { useTest } from "../../../../hooks/useTest";

type Props = {
    punct: Punct;
};

const TestList: React.FC<Props> = ({ punct }) => {
    const { tests, addTest, updateTestInList, destroyTest } = useTest(punct);
    const { openModal } = useModals();



    const handleEditTest = async (testId: number) => {
        const newTest = await openModal('editTest', {
            testId: testId,
            onDelete: async (id) => destroyTest(id),
        });
        console.log(newTest)
        updateTestInList(newTest)
    };

    return (
        <div className="mt-4 space-y-3">

            {/* Красивая кнопка "Добавить тест" */}
            <button
                onClick={addTest}
                className="flex items-center gap-1 bg-[#2980B9] hover:bg-[#2C3E50] active:bg-[#2C3E50] text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            >
                <FaPlus size={14}/>
                <span>Добавить тест</span>
            </button>


            {tests.length === 0 && (
                <div className="text-gray-400 text-sm italic">Тесты пока не созданы</div>
            )}

            {tests.map((test, index) => {
                const isDraft = test.status === 'draft';
                const isPublished = test.status === 'published';

                return (
                    <div
                        key={test.id}
                        onClick={() => handleEditTest(test.id)}
                        className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                ${isDraft ? 'bg-gray-50 hover:bg-gray-100' : ''}
                ${isPublished ? 'bg-green-50 hover:bg-green-100' : ''}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <FaClipboardList size={22} className={`${isDraft ? 'text-gray-400' : 'text-green-600'}`} />

                            <div className="flex flex-col">
                                <div className="font-medium text-gray-800">
                                    {test.title || `Тест #${index + 1}`}
                                </div>
                                <div className={`text-sm font-medium ${isDraft ? 'text-gray-500' : 'text-green-700'}`}>
                                    {isDraft ? 'Черновик' : isPublished ? 'Проверен' : ''}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                destroyTest(test.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md"
                            title="Удалить тест"
                        >
                            <FaTrashAlt size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default TestList;
