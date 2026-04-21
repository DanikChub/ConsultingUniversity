import { useMemo } from 'react';

type Props = {
    videoId: string;
    onComplete?: () => void;
};

export default function RutubePlayer({ videoId }: Props) {
    const embedUrl = useMemo(() => {
        return `https://rutube.ru/play/embed/${videoId}`;
    }, [videoId]);

    return (
        <div className="w-full">
            <div className="relative w-full aspect-video">
                <iframe
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