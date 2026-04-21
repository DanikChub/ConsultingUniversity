import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { getFile } from "../../../entities/file/api/file.api";
import UserContainer from "../../../components/ui/UserContainer";

import { getContentProgress, updateProgress } from "../../../entities/progress/api/progress.api";
import { Context } from "../../../index";
import ButtonBack from "../../../shared/ui/buttons/ButtonBack";
import { FiCheck } from "react-icons/fi";
import type { File } from "../../../entities/file/model/type";
import RutubePlayer from "./components/RutubePlayer";

function extractRutubeVideoId(url: string): string | null {
    const patterns = [
        /rutube\.ru\/video\/([a-zA-Z0-9]+)/i,
        /rutube\.ru\/play\/embed\/([a-zA-Z0-9]+)/i,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match?.[1]) {
            return match[1];
        }
    }

    return null;
}

const VideoPage = () => {
    const { id } = useParams();

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const userContext = useContext(Context);
    const completedRef = useRef(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchFile = async () => {
            try {
                setLoading(false);

                const data = await getFile(id);
                setFile(data);

                const enrollmentId = userContext.user.enrollmentId;

                const existing = await getContentProgress(
                    data.id,
                    "file",
                    enrollmentId
                );

                if (!existing.exists) {
                    await updateProgress({
                        enrollmentId,
                        contentType: "file",
                        contentId: data.id,
                        status: "in_progress",
                    });
                } else {
                    if (existing.progress.status === "completed") {
                        setIsCompleted(true);
                        completedRef.current = true;
                    }
                }

                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            } catch (e) {
                console.error("Ошибка загрузки файла:", e);
            } finally {
                setLoading(true);
            }
        };

        fetchFile();
    }, [id, userContext.user.enrollmentId]);

    const markCompleted = async () => {
        if (!file || completedRef.current) return;

        try {
            completedRef.current = true;

            const enrollmentId = userContext.user.enrollmentId;

            await updateProgress({
                enrollmentId,
                contentType: "file",
                contentId: file.id,
                status: "completed",
            });

            setIsCompleted(true);
        } catch (e) {
            completedRef.current = false;
            console.error("Ошибка обновления прогресса:", e);
        }
    };

    useEffect(() => {
        if (!file) return;
        if (completedRef.current) return;

        timerRef.current = window.setTimeout(() => {
            markCompleted();
        }, 10000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [file]);

    if (!file) return <UserContainer>Загрузка...</UserContainer>;

    const videoId = extractRutubeVideoId(file.url);

    return (
        <UserContainer isLeftPanel={true} loading={loading}>
            <ButtonBack />
            <div className="min-h-[787px] flex flex-col items-center py-8">
                <div className="bg-white shadow-2xl rounded-2xl py-6 px-6 w-full flex flex-col items-center">
                    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-3 md:mb-0 flex items-center">
                            {file.original_name}
                            {isCompleted && <FiCheck className="text-green-500 ml-4" />}
                        </h1>
                    </div>

                    {videoId ? (
                        <RutubePlayer videoId={videoId} />
                    ) : (
                        <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            Некорректная ссылка на видео
                        </div>
                    )}
                </div>
            </div>
        </UserContainer>
    );
};

export default VideoPage;