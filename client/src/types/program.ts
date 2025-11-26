export interface Punct {
    punct_id: number;
    title: string;
    video_src: File | null;
    lection_src: File | null;
    lection_id: number | null;
    lection_title: string | null;
    test_id: number | null;
    test_title: string | null;
    practical_work: File | null;
    practical_work_task: string | null;
  }
  
  export interface Theme {
    theme_id: number;
    have_test: boolean;
    lection_src: File | null;
    lection_id: number | null;
    lection_title: string | null;
    title: string;
    hide: boolean;
    presentation_src: File | null;
    presentation_id: number | null;
    presentation_title?: string | null;
    puncts: Punct[];
  }
  
  export interface Program {
    id: number;
    title: string;
    short_title: string;
    price: string;
    img: string | File;
    themes: Theme[];
    number_of_test: number;
    yellow_value?:string;
  }