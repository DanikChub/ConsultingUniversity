// ---------- Theme ----------
import type {Punct} from "../../punct/model/type";
import type {File} from "../../file/model/type";

export interface Theme {
    id: number;
    kind: 'theme';
    programId: number;
    title: string;
    order_index: number;
    puncts?: Punct[];
    files?: File[];
}
