import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOneProgram } from '../../../entities/program/api/program.api';
import { getStatistic } from '../../../entities/statistic/api/statistic.api';

import { Context } from '../../../index';

import './StatementPage.css'
import UserContainer from "../../../components/ui/UserContainer";
import {FiArrowLeft, FiCheckCircle} from "react-icons/fi";
import type {Program} from "../../../entities/program/model/type";
import type {Theme} from "../../../entities/theme/model/type";
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;
import {getEnrollmentProgress} from "../../../entities/progress/api/progress.api";
import type {ProgramProgress} from "../../../entities/progress/model/type";
import ButtonBack from "../../../shared/ui/buttons/ButtonBack";

interface ThemeWithCompletion {
    theme: Theme;
    completed: boolean;
}

const StatementPage = () => {
    const userContext = useContext(Context);
    const navigate = useNavigate();
    const [program, setProgram] = useState<Program | null>(null)
    const [progress, setProgress] = useState<ProgramProgress | null>(null)
    useEffect(() => {
        async function load() {
            try {
                if (userContext.user.user.programs) {
                    let program = userContext.user.user.programs[0]

                    const enrollmentId = program.enrollment.id;

                    // --- GET FULL PROGRAM WITH THEMES & TESTS ---
                    const fullProgram = await getOneProgram(program.id);
                    setProgram(fullProgram)


                    // --- GET PROGRESS ---
                    const progress = await getEnrollmentProgress(enrollmentId);
                    setProgress(progress)
                }
            } catch (e) {
                console.error(e);
            }

        }
        load();
     }, [])


    if (!program) return <UserContainer>Загрузка...</UserContainer>
    if (!progress) return <UserContainer>Загрузка...</UserContainer>

    const themesWithCompletion: ThemeWithCompletion[] = program.themes?.map(theme => {
        let allContentCompleted = true;

        theme.puncts?.forEach(punct => {

            punct.tests?.forEach(test => {
                const key = `test-${test.id}`;
                const status = progress.byContent[key]?.status;
                if (status !== "completed") allContentCompleted = false;
            });
        });

        return {
            theme,
            completed: allContentCompleted,
        };
    }) || [];
    return (
        <UserContainer loading={true}>
            <ButtonBack/>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 mt-6">
                <h2 className="text-xl font-bold text-gray-800">Зачётная книжка: {program.title}</h2>
            </div>

            {/* CONTENT */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">

                {themesWithCompletion.map(({theme, completed}) => (
                    <div
                        key={theme.id}
                        className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-gray-50"
                    >
                        <span className="font-medium text-gray-700">{theme.title}</span>
                        {completed && (
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                                <FiCheckCircle/> Зачёт
                            </div>
                        )}
                    </div>
                ))}

                {themesWithCompletion.every(t => !t.completed) && (
                    <div className="text-center text-gray-500 py-10">
                        Пока нет пройденных тем
                    </div>
                )}

            </div>


        </UserContainer>
    );
};

export default StatementPage;