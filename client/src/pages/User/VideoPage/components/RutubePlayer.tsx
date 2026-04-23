import { useMemo } from 'react';
import {buildRutubeEmbedUrl} from "../../../../shared/lib/rutube/rutube";


type Props = {
    videoId: string;
    accessKey?: string | null;
    onComplete?: () => void;
};

export default function RutubePlayer({ videoId, accessKey }: Props) {
    const embedUrl = useMemo(() => {
        return buildRutubeEmbedUrl(videoId, accessKey);
    }, [videoId, accessKey]);

    return (
        <div className="w-full">
            <div className="relative w-full aspect-video">
                <iframe
                    key={embedUrl}
                    src={embedUrl}
                    className="absolute inset-0 h-full w-full rounded-xl"
                    frameBorder="0"
                    allow="clipboard-write; autoplay; fullscreen"
                    allowFullScreen
                    style={{ backgroundColor: '#000' }}
                    title="Rutube player"
                />
            </div>
        </div>
    );
}