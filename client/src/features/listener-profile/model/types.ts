import type { User } from "../../../entities/user/model/type";
import type { Program } from "../../../entities/program/model/type";
import type { ProgramProgress } from "../../../entities/progress/model/type";

export interface TestStat {
    testId: number;
    title?: string;
    attemptsCount: number;
    passedCount: number;
    bestScore: number | null;
    lastAttemptDate: string | null;
}

export interface ProgramWithStats {
    programId: number;
    title?: string;
    enrollmentId: number;
    progress: ProgramProgress;
    testStats: TestStat[];
    totalContent: number;
    fullProgram: Program;
}

export interface ExistingDocument {
    id: number;
    original_name: string;
    file_name: string;
    file_path: string;
    mime_type?: string | null;
    size?: number | null;
    document_type?: string | null;
}

export interface ListenerProfileState {
    user: User | null;
    programs: ProgramWithStats[];
    loading: boolean;
    error: string;
}