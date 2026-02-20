import { ProgramProgress } from './type'

export const getContentKey = (
    type: 'file' | 'test',
    id: number
) => `${type}-${id}`

export const getContentProgress = (
    progress: ProgramProgress | null,
    type: 'file' | 'test',
    id: number
) => {
    if (!progress) return undefined
    return progress.byContent[getContentKey(type, id)]
}

export const isContentCompleted = (
    progress: ProgramProgress | null,
    type: 'file' | 'test',
    id: number
) => {
    const item = getContentProgress(progress, type, id)
    return item?.status === 'completed'
}

export const getContentStatus = (
    progress: ProgramProgress | null,
    type: 'file' | 'test',
    id: number
) => {
    const item = getContentProgress(progress, type, id)
    return item?.status ?? 'not_started'
}