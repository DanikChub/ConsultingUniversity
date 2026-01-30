

// types/modal.ts
import type {Test} from "../entities/test/model/type";
import type {File as ProgramFile} from "../entities/file/model/type";

export type ModalType =
        | 'uploadFile'
        | 'fileInfo'
        | 'uploadProgramZip'
        | 'createTest'
        | 'editTest'
        | 'viewTest'

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
};

export type ModalResultMap = {
    uploadFile: File | null;
    fileInfo: 'close' | 'deleted';
    uploadProgramZip: { file: File; resetProgram: boolean } | null; // 👈 изменили
    createTest: Test;
    editTest: Test;
    viewTest: 'close' | 'deleted';
};
