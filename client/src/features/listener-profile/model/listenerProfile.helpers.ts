import type { Program } from "../../../entities/program/model/type";
import type { Test } from "../../../entities/test/model/type";

export const extractAllTests = (program: Program) => {
    const tests: Test[] = [];

    program.themes?.forEach(theme => {
        theme.puncts?.forEach(punct => {
            tests.push(...(punct.tests || []));
        });
    });

    if (program.test) {
        tests.push(program.test);
    }

    return tests;
};

export function getTotalContent(program: Program): number {
    if (!program.themes) return 0;

    return program.themes.reduce((themeAcc, theme) => {
        const themeFilesCount = theme.files?.length ?? 0;

        const punctsTotal =
            theme.puncts?.reduce((punctAcc, punct) => {
                const filesCount = punct.files?.length ?? 0;
                const testsCount = punct.tests?.length ?? 0;

                return punctAcc + filesCount + testsCount;
            }, 0) ?? 0;

        return themeAcc + themeFilesCount + punctsTotal;
    }, 0);
}

export const isImageFile = (name?: string, mime?: string | null) => {
    if (mime?.startsWith("image/")) return true;
    if (!name) return false;

    const lower = name.toLowerCase();

    return (
        lower.endsWith(".png") ||
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".webp")
    );
};

export const isPdfFile = (name?: string, mime?: string | null) => {
    if (mime === "application/pdf") return true;
    if (!name) return false;

    return name.toLowerCase().endsWith(".pdf");
};