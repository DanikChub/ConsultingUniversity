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
    stored_name: string;
    mime_type: string;
    size: number;
    type: 'docx' | 'pdf' | 'audio';
    order_index: number;
    status: 'uploading' | 'idle' | 'error';
    progress?: number;
    storage: 'local' | 's3';
    themeId?: number | null;
    punctId?: number | null;
    file_asset?: FileAsset | null;
}
