// ---------- Punct ----------
import type {Test} from "../../test/model/type";
import type {File} from "../../file/model/type";

export interface Punct {
    id: number;
    kind: 'punct';
    themeId: number;
    title: string;
    order_index: number;
    files?: File[];
    tests?: Test[];
}