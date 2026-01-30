// ---------- FileAsset ----------
import type {Test} from "../../test/model/type";
import type {Theme} from "../../theme/model/type";



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
