import { useEffect, useRef, useState } from 'react';
import type {Punct, File as FileType, Theme} from '../entities/program/model/type';

import type {Test} from "../entities/test/model/type";
import {createPunct, deleteFile} from "../entities/program/api/program.api";
import {createTest, deleteTest} from "../entities/test/api/test.api";
import theme = require("tailwindcss/defaultTheme");

export const useTest = (punct: Punct) => {
    const [tests, setTests] = useState<Test[]>(() => punct?.tests || []);


    const addTest = async () => {
        if (!punct) return;

        try {
            const newTest = await createTest(punct.id);
            setTests(prev => [...prev, newTest]);
        } catch (e) {
            console.error('Ошибка создания пункта', e);
        }
    };
    const updateTestInList = (updatedTest: Test) => {
        if (!punct) return;

        setTests(prevTests =>
            prevTests.map(test =>
                test.id === updatedTest.id ? updatedTest : test
            )
        );
    };

    const destroyTest = async (testId: number) => {
        try {
            // optimistic UI
            setTests(prev => prev.filter(p => p.id !== testId));
            await deleteTest(testId);
        } catch (e) {
            console.error('Ошибка удаления пункта', e);
        }
    }

    return {
        tests,
        updateTestInList,
        addTest,
        destroyTest
    };
};
