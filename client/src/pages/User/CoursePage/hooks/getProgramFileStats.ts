import type { Program } from "../../../../entities/program/model/type"
import type { ProgramProgress } from "../../../../entities/progress/model/type"

type FileStats = {
    total: number
    completed: number
}

export type ProgramFileStats = {
    docx: FileStats
    pdf: FileStats
    video: FileStats
    audio: FileStats
    tests: FileStats
}

export function getProgramFileStats(
    program: Program,
    progress?: ProgramProgress
): ProgramFileStats {

    const stats: ProgramFileStats = {
        docx: { total: 0, completed: 0 },
        pdf: { total: 0, completed: 0 },
        video: { total: 0, completed: 0 },
        audio: { total: 0, completed: 0 },
        tests: { total: 0, completed: 0 },
    }

    if (!program.themes) return stats

    for (const theme of program.themes) {

        // файлы темы
        theme.files?.forEach(file => {
            countFile(file)
        })

        // пункты
        theme.puncts?.forEach(punct => {

            // файлы пункта
            punct.files?.forEach(file => {
                countFile(file)
            })

            // тесты пункта
            punct.tests?.forEach(test => {
                countTest(test)
            })
        })
    }

    function countFile(file: any) {
        if (!stats[file.type]) return

        stats[file.type].total += 1

        const key = `file-${file.id}` as const
        const contentProgress = progress?.byContent[key]

        if (contentProgress?.status === 'completed') {
            stats[file.type].completed += 1
        }
    }

    function countTest(test: any) {
        stats.tests.total += 1

        const key = `test-${test.id}` as const
        const contentProgress = progress?.byContent[key]

        if (contentProgress?.status === 'completed') {
            stats.tests.completed += 1
        }
    }

    return stats
}
