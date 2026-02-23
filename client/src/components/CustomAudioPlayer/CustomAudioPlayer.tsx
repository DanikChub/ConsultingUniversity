import React, { useRef, useState, useEffect, useContext } from "react";
import {FiPlay, FiPause, FiVolume2, FiCheck} from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { updateProgress } from "../../entities/progress/api/progress.api";
import { Context } from "../../index";
import type { File } from "../../entities/file/model/type";

interface Props {
    track: File;
    setPlayerActive: (active: boolean) => void;
    progress: any;
    setProgress: React.Dispatch<React.SetStateAction<any>>;
    className?: string;
}

const CustomAudioPlayer: React.FC<Props> = ({
                                                track,
                                                setPlayerActive,
                                                progress,
                                                setProgress,
                                                className
                                            }) => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const completedRef = useRef(false);
    const userContext = useContext(Context);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const audioSrc = `${process.env.REACT_APP_API_URL}/${track.stored_name}`;
    const contentKey = `file-${track.id}`;

    // -----------------------------
    // Плавное появление
    // -----------------------------
    useEffect(() => {
        setTimeout(() => setIsVisible(true), 50);
    }, []);

    // -----------------------------
    // Проверяем текущий прогресс из CoursePage
    // -----------------------------
    useEffect(() => {
        const existing = progress?.byContent?.[contentKey];

        if (!existing) {
            sendInProgress();
        } else if (existing.status === "completed") {
            setIsCompleted(true);
            completedRef.current = true;
        }
    }, [track.id]);

    // -----------------------------
    // Отправить in_progress
    // -----------------------------
    const sendInProgress = async () => {
        try {
            const enrollmentId = userContext.user.enrollmentId;

            const data = await updateProgress({
                enrollmentId,
                contentType: "file",
                contentId: track.id,
                status: "in_progress"
            });

            setProgress((prev: any) => ({
                ...prev,
                byContent: {
                    ...prev.byContent,
                    [contentKey]: data
                }
            }));

        } catch (e) {
            console.error("Ошибка in_progress:", e);
        }
    };

    // -----------------------------
    // Отправить completed
    // -----------------------------
    const sendCompleted = async () => {
        try {
            const enrollmentId = userContext.user.enrollmentId;

            const data = await updateProgress({
                enrollmentId,
                contentType: "file",
                contentId: track.id,
                status: "completed"
            });
            console.log(data);
            setProgress((prev: any) => ({
                ...prev,
                byContent: {
                    ...prev.byContent,
                    [contentKey]: data
                }
            }));

            setIsCompleted(true);

        } catch (e) {
            completedRef.current = false;
            console.error("Ошибка completed:", e);
        }
    };

    // -----------------------------
    // Play toggle
    // -----------------------------
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    // -----------------------------
    // Time update + авто завершение
    // -----------------------------
    const handleTimeUpdate = () => {
        if (!audioRef.current) return;

        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;

        setCurrentTime(current);

        const percent = (current / total) * 100;

        if (percent >= 95 && !completedRef.current) {
            completedRef.current = true;
            sendCompleted();
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = Number(e.target.value);
        if (audioRef.current) audioRef.current.volume = vol / 100;
        setVolume(vol);
    };

    const handleClosePlayer = () => {
        if (audioRef.current) audioRef.current.pause();
        setIsVisible(false);
        setTimeout(() => setPlayerActive(false), 300);
    };

    const formatTime = (time: number) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const progressPercent = duration
        ? Math.round((currentTime / duration) * 100)
        : 0;

    return (
        <div
            className={`fixed bottom-0 left-0 w-full 
            transition-all duration-300 ease-out
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
            bg-white border-t shadow-2xl ${className}`}
        >
            <div className="max-w-[1100px] m-auto px-6 py-4 flex flex-col gap-4">

                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            🎧 {track.original_name}{isCompleted&&<FiCheck className="text-green-500 ml-4"/>}
                        </h3>
                    </div>

                    <div
                        onClick={handleClosePlayer}
                        className="w-8 h-8 flex items-center justify-center text-white bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition"
                    >
                        <MdClose size={18} />
                    </div>
                </div>


                <div className="flex items-center gap-6">
                    <div
                        onClick={togglePlay}
                        className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow hover:scale-105 transition cursor-pointer"
                    >
                        {isPlaying ? <FiPause size={22} /> : <FiPlay size={22} />}
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-gray-600 w-12 text-right">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className={`flex-1 h-2 rounded-full ${isCompleted?'accent-green-500':'accent-blue-600'} cursor-pointer`}
                        />
                        <span className="text-sm text-gray-600 w-12">
                            {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 w-40">
                        <FiVolume2 size={20} className="text-gray-600" />
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={volume}
                            onChange={handleVolume}
                            className="flex-1 h-2 rounded-full accent-blue-600 cursor-pointer"
                        />
                    </div>
                </div>


            </div>

            <audio
                ref={audioRef}
                src={audioSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

export default CustomAudioPlayer;
