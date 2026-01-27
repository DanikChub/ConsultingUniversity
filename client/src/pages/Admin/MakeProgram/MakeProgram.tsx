import {useNavigate, useParams} from 'react-router-dom';
import AppContainer from '../../../components/ui/AppContainer';
import ProgramHeader from '../../../components/MakeProgram/ProgramHeader';
import LoadingAlert from '../../../components/ui/LoadingAlert';
import ThemeList from '../../../components/MakeProgram/ThemeList';
import { useProgram } from '../../../hooks/useProgram';
import { useModals } from '../../../hooks/useModals';

import './MakeProgram.css';
import {ModalProvider} from "../../../providers/ModalProvider";
import ProgramImportProgressModal from "../../../modals/ProgramImportProgressModal";
import {publishProgram} from "../../../http/programAPI";
import {ADMIN_PROGRAMS_ROUTE} from "../../../utils/consts";

const MakeProgram = () => {
    const { id } = useParams();
    const { openModal } = useModals();
    const navigate = useNavigate();
    const {
        program,
        loading,
        updateField,
        updateProgramImage,
        deleteProgramImage,
        importProgramFromZip,
        importing,
        importProgress,
        dataVersion,
        publicateProgram,
        publicateError
    } = useProgram(Number(id));

    const handleImportProgram = async () => {
        const result = await openModal<'uploadProgramZip'>('uploadProgramZip', {});
        if (result) {
            // result: { file, resetProgram }
            await importProgramFromZip(result.file, result.resetProgram);
        }
    };

    const handlePublicate = async () => {
        const result = await publicateProgram()

        if (result.success) {
            navigate(ADMIN_PROGRAMS_ROUTE)
        }
    }



    if (loading) {
        return (
            <AppContainer>
                <LoadingAlert show text="Загрузка программы..." />
            </AppContainer>
        );
    }

    if (!program) return null;

    return (
        <AppContainer>

            <ProgramImportProgressModal
                open={importing}
                progress={importProgress}
            />

            <ProgramHeader
                program={program}
                onChange={updateField}
                updateProgramImage={updateProgramImage}
                deleteProgramImage={deleteProgramImage}
                onImportProgram={handleImportProgram} // 👈 только команда
            />

            <ThemeList key={dataVersion} program={program} />

            <div className="flex justify-between items-center mt-10">
                {/* Сообщение об ошибке */}

                <div className="text-sm text-red-600 font-medium">
                    {publicateError}
                </div>


                {/* Кнопка публикации */}
                <button
                    onClick={handlePublicate}
                    className="
                      bg-[#2980B9] text-white text-sm font-medium px-4 py-2 rounded-lg
                      hover:bg-blue-700 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                    "
                >
                    Опубликовать
                </button>
            </div>

        </AppContainer>
    );
};


export default MakeProgram
