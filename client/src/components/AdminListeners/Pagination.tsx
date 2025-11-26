import React from "react";
import { PaginationItem } from "../../types/user";

interface Props {
    pages: PaginationItem[];
    onClick: (index: number) => void;
}

const Pagination: React.FC<Props> = ({ pages, onClick }) => (
    <ul className="pagination">
        {pages.map((p, i) => <li key={i} className={p.class} onClick={() => onClick(i)}>{p.number}</li>)}
    </ul>
);

export default Pagination;