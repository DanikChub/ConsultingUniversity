import React from "react";

interface Page {
    number: number | string;
    class?: string;
    active?: boolean;
    disabled?: boolean;
}

interface Props {
    pages: Page[];
    onClick: (index: number) => void;
    activePage: number;
}

const Pagination: React.FC<Props> = ({ pages, onClick, activePage }) => {
    if (pages.length <= 1) return null;

    return (
        <ul className="mt-4 flex select-none items-center gap-2">
            {pages.map((p, i) => {
                const isActive = activePage === i || p.class === "active";

                const base =
                    "px-3 py-1 rounded-md text-sm font-medium border transition-all duration-150";

                const active =
                    "bg-[#2980B9] text-white border-[#2980B9] cursor-default";

                const disabled =
                    "opacity-40 pointer-events-none border-blue-200 text-blue-300";

                const normal =
                    "text-[#2980B9] border-[#2980B9] hover:bg-blue-50 hover:border-blue-400 cursor-pointer";

                let finalClass = base;

                if (p.disabled) finalClass += " " + disabled;
                else if (isActive) finalClass += " " + active;
                else finalClass += " " + normal;

                return (
                    <li
                        key={i}
                        className={finalClass}
                        onClick={() => !p.disabled && !isActive && onClick(i)}
                    >
                        {p.number}
                    </li>
                );
            })}
        </ul>
    );
};

export default Pagination;