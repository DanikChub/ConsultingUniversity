// types/modal.ts

import type {Test} from "../entities/test/model/type";
import type {Program} from "../entities/program/model/type";
import type {ProgramProgress} from "../entities/progress/model/type";
import type {File as ProgramFile} from "../entities/file/model/type";

export type ModalType =
    | 'uploadFile'
    | 'fileInfo'
    | 'uploadProgramZip'
    | 'createTest'
    | 'editTest'
    | 'viewTest'
    | 'viewGradeBook'
    | 'alert'
    | 'confirm'

export type ModalPayloadMap = {
    uploadFile: {};
    fileInfo: {
        file: ProgramFile;
        onDelete?: (fileId: number) => Promise<void>;
        onDownload?: (file: ProgramFile) => void;
        onRename?: (newName: string) => void;
    };
    uploadProgramZip: {};
    createTest: {
        punctId: number;
        onDelete?: (testId: number) => Promise<void>;
    };
    editTest: {
        testId: number;
        onDelete?: (testId: number) => Promise<void>;
    };
    viewTest: {
        test: Test;
    };
    viewGradeBook: {
        program: Program;
        progress: ProgramProgress;
    };

    // 🔹 НОВОЕ
    alert: {
        title?: string;
        description?: string;
        buttonText?: string;
    };

    confirm: {
        title?: string;
        description?: string;
        confirmText?: string;
        cancelText?: string;
        variant?: 'default' | 'danger';
    };
};

export type ModalResultMap = {
    uploadFile:
        | { type: 'file'; file: File }
        | { type: 'video'; url: string }
        | null;
    fileInfo: 'close' | 'deleted';
    uploadProgramZip: { file: File; resetProgram: boolean } | null;
    createTest: Test;
    editTest: Test;
    viewTest: 'close' | 'deleted';
    viewGradeBook: 'close' | 'deleted';

    // 🔹 НОВОЕ
    alert: void;
    confirm: boolean;
};
