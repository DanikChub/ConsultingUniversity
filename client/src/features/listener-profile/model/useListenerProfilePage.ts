import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {blockUser, getUserById, unblockUser} from "../../../entities/user/api/user.api";
import { getOneProgram } from "../../../entities/program/api/program.api";
import { getEnrollmentProgress } from "../../../entities/progress/api/progress.api";
import { getAllTestAttempts } from "../../../entities/test/api/test.api";
import { createChat } from "../../../entities/chat/api/chat.api";

import type { User } from "../../../entities/user/model/type";
import type { TestAttempt } from "../../../entities/test/model/type";

import { CHAT_USERS_PAGE_ROUTE } from "../../../shared/utils/consts";
import { useModals } from "../../../hooks/useModals";

import type { EditableListenerField } from "../../../entities/user/api/user.api";

import {
    extractAllTests,
    getTotalContent,
} from "./listenerProfile.helpers";

import type {
    ExistingDocument,
    ProgramWithStats,
    TestStat,
} from "./types";

export const useListenerProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { openModal } = useModals();

    const [user, setUser] = useState<User | null>(null);
    const [programs, setPrograms] = useState<ProgramWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [blockActionLoading, setBlockActionLoading] = useState(false);

    const listenerId = Number(id);

    const load = useCallback(async () => {
        if (!listenerId) return;

        try {
            setLoading(true);
            setError("");

            const userData = await getUserById(listenerId);
            setUser(userData);

            const enrichedPrograms: ProgramWithStats[] = [];

            if (userData.programs) {
                for (const program of userData.programs) {
                    if (!program.enrollment) continue;

                    const enrollmentId = program.enrollment.id;

                    const fullProgram = await getOneProgram(program.id);

                    console.log(fullProgram);
                    const totalContent = getTotalContent(fullProgram);
                    const tests = extractAllTests(fullProgram);
                    const progress = await getEnrollmentProgress(enrollmentId);

                    const testStats: TestStat[] = await Promise.all(
                        tests.map(async test => {
                            const attempts: TestAttempt[] =
                                await getAllTestAttempts(test.id, enrollmentId);

                            if (attempts.length === 0) {
                                return {
                                    testId: test.id,
                                    title: test.title,
                                    attemptsCount: 0,
                                    passedCount: 0,
                                    bestScore: null,
                                    lastAttemptDate: null,
                                };
                            }

                            const bestAttempt = attempts.reduce((max, current) =>
                                current.score > max.score ? current : max
                            );

                            const passedCount = attempts.filter(a => a.passed).length;

                            const lastAttempt = attempts.reduce((latest, current) =>
                                new Date(current.createdAt) > new Date(latest.createdAt)
                                    ? current
                                    : latest
                            );

                            return {
                                testId: test.id,
                                title: test.title,
                                attemptsCount: attempts.length,
                                passedCount,
                                bestScore: bestAttempt.score,
                                lastAttemptDate: lastAttempt.createdAt,
                            };
                        })
                    );
                    const enrollment = program.enrollment;

                    if (!enrollment) continue;


                    enrichedPrograms.push({
                        programId: program.id,
                        title: program.title,
                        enrollmentId: enrollment.id,
                        status: enrollment.status,

                        progress,
                        testStats,
                        totalContent,
                        fullProgram,
                    });
                }
            }

            setPrograms(enrichedPrograms);
        } catch (e) {
            console.error(e);
            setError("Ошибка загрузки слушателя");
        } finally {
            setLoading(false);
        }
    }, [listenerId]);

    useEffect(() => {
        load();
    }, [load]);

    const documents = useMemo(
        () => (user?.documents as ExistingDocument[] | undefined) || [],
        [user]
    );

    const handleSendMessage = async () => {
        if (!user) return;

        const chat = await createChat(user.id);
        navigate(CHAT_USERS_PAGE_ROUTE + `?chatId=${chat.id}`);
    };

    const handleOpenGradeBook = (program: ProgramWithStats) => {
        openModal("viewGradeBook", {
            program: program.fullProgram,
            progress: program.progress,
        });
    };

    const handleUserFieldUpdated = (
        field: EditableListenerField,
        value: string | null
    ) => {
        setUser(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                [field]: value,
            };
        });
    };

    const handleBlockUser = async () => {
        if (!user || blockActionLoading) return;

        const result = await openModal("blockUser", {
            userName: user.name,
        });

        if (!result) return;

        try {
            setBlockActionLoading(true);

            await blockUser(user.id, {
                reason: result.reason,
                durationMinutes: result.durationMinutes,
            });

            await load();
        } catch (e) {
            console.error(e);

            await openModal("alert", {
                title: "Ошибка",
                description: "Не удалось заблокировать слушателя",
            });
        } finally {
            setBlockActionLoading(false);
        }
    };

    const handleUnblockUser = async () => {
        if (!user || blockActionLoading) return;

        const confirmed = await openModal("confirm", {
            title: "Разблокировать слушателя?",
            description: `Доступ пользователя «${user.name}» будет восстановлен.`,
            confirmText: "Разблокировать",
            cancelText: "Отмена",
        });

        if (!confirmed) return;

        try {
            setBlockActionLoading(true);

            await unblockUser(user.id);
            await load();
        } catch (e) {
            console.error(e);

            await openModal("alert", {
                title: "Ошибка",
                description: "Не удалось разблокировать слушателя",
            });
        } finally {
            setBlockActionLoading(false);
        }
    };

    return {
        user,
        programs,
        documents,
        loading,
        error,
        blockActionLoading,
        reload: load,
        handleSendMessage,
        handleBlockUser,
        handleUnblockUser,
        handleOpenGradeBook,
        handleUserFieldUpdated,
    };
};