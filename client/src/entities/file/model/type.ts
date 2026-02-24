export interface FileAsset {
    id: number;
    fileId: number;
    type: 'html';
    content: string;
}

// ---------- File ----------
export interface File {
    id: number;
    original_name: string;
    stored_name?: string;
    mime_type?: string;
    url?: string;
    size?: number;
    type: 'docx' | 'pdf' | 'audio' | 'video';
    order_index: number;
    status: 'uploading' | 'idle' | 'error';
    progress?: number;
    storage: 'local' | 's3' | 'vimeo';
    themeId?: number | null;
    punctId?: number | null;
    file_asset?: FileAsset | null;
}
