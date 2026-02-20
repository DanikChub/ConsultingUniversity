// entities/progress/model/types.ts

export type ContentType = 'file' | 'test'

export type ProgressStatus =
    | 'not_started'
    | 'in_progress'
    | 'completed'
    | 'failed'

export interface ContentProgress {
    id: number
    enrollmentId: number
    contentType: ContentType
    contentId: number
    status: ProgressStatus
    score?: number | null
    completedAt?: string | null
}

export type ProgressMap = Record<
    `${ContentType}-${number}`,
    ContentProgress
>

export interface ProgramProgress {
    byContent: ProgressMap
    percent: number
}
