

// types/modal.ts
import type {File as ProgramFile} from "./program";
import type {Test} from "./test";

export type ModalType =
        | 'uploadFile'
        | 'fileInfo'
        | 'uploadProgramZip'
        | 'createTest'
        | 'editTest'

export type ModalPayloadMap = {
    uploadFile: {

    };
    fileInfo: {
        file: ProgramFile;
        onDelete?: (fileId: number) => Promise<void>;
        onDownload?: (file: File) => void;
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
};

export type ModalResultMap = {
    uploadFile: File | null;
    fileInfo: 'close' | 'deleted';
    uploadProgramZip: { file: File; resetProgram: boolean } | null; // 👈 изменили
    createTest: Test;
    editTest: Test;
};
