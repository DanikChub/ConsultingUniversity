import React, { useRef, useState, useEffect } from "react";
import { FiPlay, FiPause, FiVolume2 } from "react-icons/fi";
import { MdClose } from "react-icons/md";

interface Props {
    audioSrc: string;
    setPlayerActive: (active: boolean) => void;
    className?: string;
}

const CustomAudioPlayer: React.FC<Props> = ({ audioSrc, setPlayerActive, className }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
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
        setPlayerActive(false);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div
            className={`bg-gradient-to-r from-blue-50 via-indigo-50 to-indigo-100 fixed bottom-0 left-0 w-full h-[96px] flex items-center px-6 shadow-xl border-t border-gray-200 ${className}`}
        >
            {/* Close button */}
            <div
                className="absolute right-4 top-1/2 -translate-y-1/2 flex justify-center items-center w-8 h-8 text-white bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition"
                onClick={handleClosePlayer}
            >
                <MdClose size={20} />
            </div>

            <div className="flex justify-between items-center w-full max-w-[1100px] m-auto gap-6">
                {/* Play/Pause */}
                <div
                    onClick={togglePlay}
                    className="w-[48px] h-[48px] flex items-center justify-center bg-white text-blue-600 rounded-full shadow hover:scale-105 transition cursor-pointer"
                >
                    {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-[2px]" />}
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm text-gray-600 w-12 text-right font-medium">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 h-2 rounded-full bg-gray-300 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 w-12 text-left font-medium">{formatTime(duration)}</span>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 w-40">
                    <FiVolume2 className="text-gray-600" size={20} />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={handleVolume}
                        className="flex-1 h-2 rounded-full bg-gray-300 accent-blue-500 cursor-pointer"
                    />
                </div>
            </div>

            {/* Hidden audio */}
            <audio
                ref={audioRef}
                src={process.env.REACT_APP_API_URL + audioSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

export default CustomAudioPlayer;
