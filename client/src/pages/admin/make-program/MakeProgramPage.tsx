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


const MakeProgramPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { openModal } = useModals();

    const { program, setProgram, loading, error } = useProgram(Number(id));
    const { updateField, updateProgramImage, deleteProgramImage } = useEditProgram(Number(id), setProgram);
    const { importFromZip, importing, progress, dataVersion } = useImportProgram(Number(id), setProgram);
    const { publish, publishError  } = usePublishProgram(Number(id));

    const handleImportProgram = async () => {
        const res = await openModal('uploadProgramZip', {});
        if (res) await importFromZip(res.file, res.resetProgram);
    }

    const handlePublicate = async () => {
        const result = await publish()
        if (result.success) { navigate(ADMIN_PROGRAMS_ROUTE) }
    }

    if (loading) return (
        <AppContainer>
            <LoadingAlert show={loading}/>
        </AppContainer>
    );


    if (error) return (
        <AppContainer>
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="bg-blue-100 text-blue-800 px-6 py-4 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-2">Программа не найдена</h2>
                    <p className="text-sm">Возможно, она была удалена или неверно указан ID.</p>
                </div>
            </div>
        </AppContainer>
    );

    return (
        <AppContainer>
            <ProgramImportProgressModal open={importing} progress={progress}/>
            тест
            <ProgramHeader
                program={program}
                onChange={updateField}
                updateProgramImage={updateProgramImage}
                deleteProgramImage={deleteProgramImage}
                onImportProgram={handleImportProgram}
            />

            <ThemeList key={dataVersion} program={program}/>

            <div className="flex justify-between items-center mt-10"> {/* Сообщение об ошибке */}
                <div className="text-sm text-red-600 font-medium"> {publishError} </div>
                {/* Кнопка публикации */}
                <button onClick={handlePublicate}
                        className=" bg-[#2980B9] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 "> Опубликовать
                </button>
            </div>

        </AppContainer>
    );
};

export default MakeProgramPage

