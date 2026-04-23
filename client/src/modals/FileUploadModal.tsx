import { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
    onClose: () => void;
    onSubmit: (
        payload:
            | { type: 'file'; file: File }
            | { type: 'video'; url: string }
    ) => void;
};

type ParsedRutubeVideo = {
    videoId: string | null;
    accessKey: string | null;
    isRutube: boolean;
};

function parseRutubeVideo(url: string): ParsedRutubeVideo {
    const trimmed = url.trim();

    if (!trimmed) {
        return {
            videoId: null,
            accessKey: null,
            isRutube: false,
        };
    }

    try {
        const parsedUrl = new URL(trimmed);
        const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();

        if (!hostname.includes('rutube.ru')) {
            return {
                videoId: null,
                accessKey: null,
                isRutube: false,
            };
        }

        const path = parsedUrl.pathname;

        const match =
            path.match(/^\/video\/private\/([a-zA-Z0-9_-]+)\/?$/i) ||
            path.match(/^\/video\/([a-zA-Z0-9_-]+)\/?$/i) ||
            path.match(/^\/play\/embed\/([a-zA-Z0-9_-]+)\/?$/i);

        return {
            videoId: match?.[1] ?? null,
            accessKey: parsedUrl.searchParams.get('p'),
            isRutube: true,
        };
    } catch {
        return {
            videoId: null,
            accessKey: null,
            isRutube: false,
        };
    }
}

function buildRutubeEmbedUrl(videoId: string, accessKey?: string | null): string {
    const base = `https://rutube.ru/play/embed/${videoId}/`;

    if (!accessKey) {
        return base;
    }

    return `${base}?p=${encodeURIComponent(accessKey)}`;
}

const FileUploadModal = ({ onClose, onSubmit }: Props) => {
    const [mode, setMode] = useState<'file' | 'video'>('file');
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoValid, setVideoValid] = useState(false);

    const parsedVideo = useMemo(() => parseRutubeVideo(videoUrl), [videoUrl]);

    const embedUrl = useMemo(() => {
        if (!parsedVideo.videoId) return null;

        return buildRutubeEmbedUrl(parsedVideo.videoId, parsedVideo.accessKey);
    }, [parsedVideo.videoId, parsedVideo.accessKey]);

    const videoError = useMemo(() => {
        if (!videoUrl.trim()) return null;

        if (!parsedVideo.isRutube) {
            return 'Ссылка должна вести на Rutube.';
        }

        if (!parsedVideo.videoId) {
            return 'Не удалось определить ID видео. Проверьте ссылку.';
        }

        return null;
    }, [videoUrl, parsedVideo]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'audio/*': ['.mp3', '.wav'],
        },
        onDrop: (files) => setFile(files[0] ?? null),
    });

    const handleSubmit = async () => {
        if (loading) return;

        try {
            setLoading(true);

            if (mode === 'file' && file) {
                onSubmit({ type: 'file', file });
                return;
            }

            if (mode === 'video' && videoUrl.trim() && parsedVideo.videoId) {
                onSubmit({
                    type: 'video',
                    url: videoUrl.trim(),
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const canSubmitFile = !!file && !loading;
    const canSubmitVideo =
        !!videoUrl.trim() &&
        !!parsedVideo.videoId &&
        !videoError &&
        !loading;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Добавить материал</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setMode('file')}
                        className={`rounded px-4 py-2 ${
                            mode === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}
                    >
                        Файл
                    </button>

                    <button
                        onClick={() => setMode('video')}
                        className={`rounded px-4 py-2 ${
                            mode === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}
                    >
                        Видео (Rutube)
                    </button>
                </div>

                {mode === 'file' && (
                    <>
                        <div className="mb-4">
                            <div className="mt-2 overflow-hidden rounded-md border-l-4 border-blue-400 bg-blue-50 px-4 py-2 text-sm text-gray-700 transition-all duration-500">
                                <p>
                                    Для корректной работы программы в архиве допускаются{' '}
                                    <strong>только определённые типы файлов</strong>.
                                </p>

                                <div className="ml-4 mt-2">
                                    <p className="font-semibold text-gray-800">Поддерживаемые форматы:</p>
                                    <ul className="ml-4 list-disc space-y-1">
                                        <li>
                                            <span className="font-medium text-purple-600">.docx</span> — текстовые
                                            документы
                                        </li>
                                        <li>
                                            <span className="font-medium text-red-600">.pdf</span> — PDF-файлы
                                        </li>
                                        <li>
                                            <span className="font-medium text-green-600">.mp3</span> — аудиофайлы
                                        </li>
                                        <li>
                                            <span className="font-medium text-green-600">.wav</span> — аудиофайлы
                                        </li>
                                    </ul>
                                </div>

                                <p className="mt-2 text-gray-700">
                                    <strong className="font-semibold text-red-600">Важно:</strong> Внутри модулей и
                                    пунктов программы должны находиться{' '}
                                    <strong>только файлы указанных форматов</strong>. Все остальные типы файлов
                                    могут отображаться неправильно.
                                </p>
                            </div>
                        </div>

                        <div
                            {...getRootProps()}
                            className={`cursor-pointer rounded-lg border-2 border-dashed px-6 py-10 text-center transition ${
                                isDragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            <input {...getInputProps()} />

                            {!file ? (
                                <>
                                    <p className="text-sm font-medium text-gray-700">Перетащите файл сюда</p>
                                    <p className="mt-1 text-xs text-gray-500">или нажмите для выбора</p>
                                </>
                            ) : (
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(1)} МБ
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={!canSubmitFile}
                            onClick={handleSubmit}
                            className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {loading ? 'Загрузка...' : 'Добавить файл'}
                        </button>
                    </>
                )}

                {mode === 'video' && (
                    <>
                        <div className="mb-4">
                            <div className="mt-2 overflow-hidden rounded-md border-l-4 border-blue-400 bg-blue-50 px-4 py-2 text-sm text-gray-700 transition-all duration-500">
                                <p>
                                    Для добавления видео в программу необходимо{' '}
                                    <strong>вставить ссылку на видео Rutube</strong>.
                                </p>

                                <div className="ml-4 mt-2">
                                    <p className="font-semibold text-gray-800">Как получить ссылку:</p>
                                    <ul className="ml-4 list-disc space-y-1">
                                        <li>Откройте видео на Rutube в браузере.</li>
                                        <li>Скопируйте URL из адресной строки.</li>
                                        <li>
                                            Вставьте ссылку в поле ниже. Если это приватное видео «по ссылке»,
                                            ключ доступа подтянется автоматически из URL.
                                        </li>
                                    </ul>
                                </div>

                                <p className="mt-2 text-gray-700">
                                    <strong className="font-semibold text-red-600">Важно:</strong> ссылка должна
                                    вести непосредственно на видео Rutube.
                                </p>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Вставьте ссылку Rutube"
                            value={videoUrl}
                            onChange={(e) => {
                                setVideoUrl(e.target.value);
                                setVideoValid(false);
                            }}
                            className="w-full rounded-lg border p-2 outline-none"
                        />



                        {videoError && (
                            <p className="mt-2 text-sm font-medium text-red-600">{videoError}</p>
                        )}


                        {embedUrl && !videoError && (
                            <div className="my-4 flex w-full justify-center">
                                <iframe
                                    key={embedUrl}
                                    src={embedUrl}
                                    width="640"
                                    height="360"
                                    frameBorder="0"
                                    allow="clipboard-write; autoplay; fullscreen"
                                    allowFullScreen
                                    onLoad={() => setVideoValid(true)}
                                    style={{ backgroundColor: '#000' }}
                                />
                            </div>
                        )}

                        {!!embedUrl && !videoError && !videoValid && (
                            <p className="mb-2 text-sm text-gray-500">Загружаем превью видео...</p>
                        )}

                        <button
                            disabled={!canSubmitVideo}
                            onClick={handleSubmit}
                            className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {loading ? 'Загрузка...' : 'Добавить видео'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUploadModal;