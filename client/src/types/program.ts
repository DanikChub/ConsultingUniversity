// ---------- FileAsset ----------
import type {Test} from "./test";

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

// ---------- Punct ----------
export interface Punct {
    id: number;
    kind: 'punct';
    themeId: number;
    title: string;
    order_index: number;
    files?: File[];
    tests?: Test[];
}

// ---------- Theme ----------
export interface Theme {
    id: number;
    kind: 'theme';
    programId: number;
    title: string;
    order_index: number;
    puncts?: Punct[];
    files?: File[];
}

// ---------- Program ----------
export interface Program {
    id: number;
    admin_id: number;
    title: string | null;
    short_title: string | null;
    price: string | null;  // string, как на бэкенде
    img: string | null;
    status: 'draft' | 'published' | 'archived';
    imported?: boolean;
    number_of_practical_work: number;
    number_of_test: number;
    number_of_videos: number;
    themes?: Theme[];
}
