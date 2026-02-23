

// types/modal.ts
import type {Test} from "../entities/test/model/type";
import type {File as ProgramFile} from "../entities/file/model/type";
import type {Program} from "../entities/program/model/type";
import type {ProgramProgress} from "../entities/progress/model/type";

export type ModalType =
        | 'uploadFile'
        | 'fileInfo'
        | 'uploadProgramZip'
        | 'createTest'
        | 'editTest'
        | 'viewTest'
        | 'viewGradeBook'

export type ModalPayloadMap = {
    uploadFile: {

    };
    fileInfo: {
        file: ProgramFile;
        onDelete?: (fileId: number) => Promise<void>;
        onDownload?: (file: ProgramFile) => void;
        onRename?: (newName: string) => void;
    };
    uploadProgramZip: {

    }
    createTest: {
        punctId: number;
        onDelete?: (testId: number) => Promise<void>;
    }
    editTest: {
        testId: number;
        onDelete?: (testId: number) => Promise<void>;
    }
    viewTest: {
        test: Test;
    }
    viewGradeBook: {
        program: Program;
        progress: ProgramProgress;
    }
};

export type ModalResultMap = {
    uploadFile: File | null;
    fileInfo: 'close' | 'deleted';
    uploadProgramZip: { file: File; resetProgram: boolean } | null; // 👈 изменили
    createTest: Test;
    editTest: Test;
    viewTest: 'close' | 'deleted';
    viewGradeBook: 'close' | 'deleted';
};
