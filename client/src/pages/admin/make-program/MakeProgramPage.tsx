import {useNavigate, useParams} from "react-router-dom";
import {useModals} from "../../../hooks/useModals";
import {useProgram} from "../../../entities/program/model/useProgram";
import {useEditProgram} from "../../../features/program/edit/useEditProgram";
import {usePublishProgram} from "../../../features/program/publish/usePublishProgram";
import AppContainer from "../../../components/ui/AppContainer";
import {useImportProgram} from "../../../features/program/import/useImportProgram";
import ProgramImportProgressModal from "../../../modals/ProgramImportProgressModal";
import ProgramHeader from "./components/ProgramHeader";
import ThemeList from "./components/ThemeList";
import LoadingAlert from "../../../components/ui/LoadingAlert";
import {ADMIN_PROGRAMS_ROUTE} from "../../../shared/utils/consts";
import {createTest} from "../../../entities/test/api/test.api";
import React, {useState} from "react";
import type {Test} from "../../../entities/test/model/type";
import Button from "../../../shared/ui/buttons/Button";
import {FaClipboardCheck} from "react-icons/fa";
import ButtonRemove from "../../../shared/ui/buttons/ButtonRemove";

const MakeProgramPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { openModal } = useModals();

    const { program, setProgram, loading, error } = useProgram(Number(id));
    const { updateField, updateProgramImage, deleteProgramImage, createFinalTest, destroyFinalTest } = useEditProgram(Number(id), setProgram);
    const { importFromZip, importing, progress, dataVersion } = useImportProgram(Number(id), setProgram);
    const { publish, publishError  } = usePublishProgram(Number(id));


    const handleImportProgram = async () => {
        const res = await openModal('uploadProgramZip', {});
        if (res) await importFromZip(res.file, res.resetProgram);
    };

    const handlePublicate = async () => {
        const result = await publish();
        if (result.success) {
            navigate(ADMIN_PROGRAMS_ROUTE);
        }
    };

    const handleCreateFinalTest = async () => {
        await createFinalTest()

    };

    const handleOpenFinalTest = async () => {
        if (!program.test) return;

        await openModal('editTest', {
            testId: program.test.id,
            onDelete: async (id) => destroyFinalTest(id),
        });
    };

    if (loading) {
        return (
            <AppContainer>
                <LoadingAlert show={loading}/>
            </AppContainer>
        );
    }

    if (error) {
        return (
            <AppContainer>
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="bg-blue-100 text-blue-800 px-6 py-4 rounded-lg shadow-md max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-2">Программа не найдена</h2>
                        <p className="text-sm">Возможно, она была удалена или неверно указан ID.</p>
                    </div>
                </div>
            </AppContainer>
        );
    }

    return (
        <AppContainer>

            <ProgramImportProgressModal open={importing} progress={progress}/>

            <ProgramHeader
                program={program}
                onChange={updateField}
                updateProgramImage={updateProgramImage}
                deleteProgramImage={deleteProgramImage}
                onImportProgram={handleImportProgram}
            />

            <ThemeList key={dataVersion} program={program}/>

            {/* ===== Финальный тест ===== */}

            <div className="pt-4 mt-8 border-t border-gray-100 rounded-lg bg-white shadow-sm transition-shadow">

                {!program.test && (
                    <div className="px-4 py-4">
                        <Button
                            onClick={handleCreateFinalTest}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                            Добавить финальный тест
                        </Button>
                    </div>
                )}

                {program.test && (
                    <div
                        onClick={handleOpenFinalTest}
                        className={`
                        flex items-center justify-between px-4 py-4 cursor-pointer transition-colors
                        ${program?.test?.status == 'draft' ? 'bg-gray-50 hover:bg-gray-100' : ''}
                        ${program?.test?.status == 'published' ? 'bg-green-50 hover:bg-green-100' : ''}
                        `}
                    >
                        <div className="flex items-center  gap-3">
                            <FaClipboardCheck className="text-gray-500"/>
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <b className="text-gray-800 mr-5">
                                        Финальный тест
                                    </b>

                                    <span
                                        className={`text-sm font-medium ${program?.test?.status == 'draft' ? 'text-gray-500' : 'text-green-700'}`}>
                                        {program?.test?.status == 'draft' ? 'Черновик' : program?.test?.status == 'published'  ? 'Проверен' : ''}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Сформирован автоматически из случайных вопросов
                                </span>
                            </div>
                        </div>

                        <ButtonRemove onClick={() => destroyFinalTest(program.test.id)} message="Вы уверены, что хотите удалить тест?"/>
                    </div>
                )}

            </div>

            {/* ===== Публикация ===== */}

            <div className="flex justify-between items-center mt-10">
                <div className="text-sm text-red-600 font-medium">
                    {publishError}
                </div>

                <button
                    onClick={handlePublicate}
                    className="bg-[#2980B9] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                >
                    Опубликовать
                </button>
            </div>

        </AppContainer>
    );
};

export default MakeProgramPage;
