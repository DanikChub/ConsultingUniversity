import React, { useRef, useState, useEffect } from "react";

import audio_png from "../../assets/imgs/music.png"
import pause from "../../assets/imgs/pause.png"


interface CustomAudioPlayerProps {
    audioSrc: string;
    setPlayerActive: (active: boolean) => void;
    setActiveTrack: (track: { i: number; j: number | null; active: boolean }) => void;
    className?: string;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ audioSrc,  className, setPlayerActive, setActiveTrack }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(100);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        audioRef.current.play();
    }, []);

    // Play / Pause
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

    // Обновление текущего времени
    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    // Смена позиции через ползунок
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(Number(e.target.value));
        }
    };

    const handleVolume = (e) => {
        if (audioRef.current) {
            audioRef.current.volume = e.target.value/100;
            setVolume(e.target.value)
        }
    }

    // Сохраняем длительность
    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    // Форматируем секунды в mm:ss
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };
    const handleClosePlayer = () => {
        setPlayerActive(false)
        setActiveTrack({i: null, j: null, active: false})
    }

    return (
        <div className={'bg-[#b8c0c6] fixed bottom-0 left-0 w-full h-[92px] flex items-center' + className}>
            <div className="absolute right-0 top-0 flex justify-center cursor-pointer bg-red-500 items-center w-8 h-8 text-white" onClick={handleClosePlayer}>x</div>

                <div className="w-[1100px] m-auto flex justify-between">
                    {/* Play/Pause */}
                    <div
                        onClick={togglePlay}
                        className="w-[48px] h-[48px] flex items-center justify-center bg-[#D9D9D9] text-gray-600 rounded-full hover:bg-[#D9D9D9] transition-colors cursor-pointer"
                    >
                        {isPlaying ? <img src={pause} className="w-[30px]"/> :
                            <svg className="translate-x-[3px]" width="19" height="24" viewBox="0 0 19 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.1944 10.8848C18.8059 11.2786 18.8059 12.1726 18.1944 12.5663L1.54142 23.2903C0.875945 23.7189 7.70174e-07 23.2411 8.04773e-07 22.4496L1.74229e-06 1.00159C1.77689e-06 0.210075 0.875946 -0.267703 1.54142 0.16084L18.1944 10.8848Z"
                                    fill="#2C3E50"/>
                            </svg>}
                    </div>

                    {/* Полоса прогресса */}
                    <div className="flex items-center w-1/2 gap-2">
                        <span className="text-base w-12 text-right text-[#2C3E50] font-semibold">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-[10px] rounded-none bg-gray-300 accent-blue-500 cursor-pointer"
                        />
                        <span className="text-base w-12 text-right text-[#2C3E50] font-semibold">
                            {formatTime(duration)}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <img src={audio_png}/>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={volume}
                            onChange={handleVolume}
                            className="flex-1 h-[2px] rounded-none bg-gray-400 accent-[#2C3E50] cursor-pointer"
                        />
                    </div>


                </div>

            {/* Сам audio элемент (скрыт) */}
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