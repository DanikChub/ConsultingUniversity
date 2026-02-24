import { useEffect, useRef } from "react";
import Player from "@vimeo/player";

type Props = {
    videoId: string;
    onComplete: () => void;
};

export default function VimeoPlayer({ videoId, onComplete }: Props) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!iframeRef.current) return;

        const player = new Player(iframeRef.current);


        // 🔥 Можно отслеживать прогресс
        player.on("timeupdate", (data) => {
            const percent = data.percent; // 0 → 1
            console.log(percent)
            if (percent >= 0.95) {
                onComplete();
            }
        });

        return () => {
            player.destroy();
        };
    }, [videoId]);

    return (
        <div className="w-full">
            <div className="relative w-full aspect-video">
            <iframe
                ref={iframeRef}
                src={`https://player.vimeo.com/video/${videoId}`}
                className="absolute inset-0 w-full h-full rounded-xl"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                />
            </div>
        </div>
    );
}
