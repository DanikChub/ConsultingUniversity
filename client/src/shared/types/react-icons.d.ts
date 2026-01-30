import * as React from 'react';

declare module 'react-icons/*' {
    export type IconType = React.FC<{
        size?: string | number;
        color?: string;
        className?: string;
        style?: React.CSSProperties;
    }>;

    export const FaVideo: IconType;
    export const FaUserAlt: IconType;
    export const FaRubleSign: IconType;
    export const FaFileAlt: IconType;
    export const MdChecklist: IconType;
}
