export function parseRutubeVideo(url: string) {
    try {
        const u = new URL(url.trim());
        const path = u.pathname;

        const match =
            path.match(/^\/video\/private\/([a-zA-Z0-9_-]+)\/?$/i) ||
            path.match(/^\/video\/([a-zA-Z0-9_-]+)\/?$/i) ||
            path.match(/^\/play\/embed\/([a-zA-Z0-9_-]+)\/?$/i);

        return {
            videoId: match?.[1] ?? null,
            accessKey: u.searchParams.get('p'),
        };
    } catch {
        return {
            videoId: null,
            accessKey: null,
        };
    }
}

export function buildRutubeEmbedUrl(videoId: string, accessKey?: string | null) {
    const base = `https://rutube.ru/play/embed/${videoId}/`;
    return accessKey ? `${base}?p=${encodeURIComponent(accessKey)}` : base;
}