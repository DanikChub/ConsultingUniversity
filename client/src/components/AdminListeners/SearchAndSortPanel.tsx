import React from "react";
import arrow_down from '../../assets/imgs/arrow_down.png';
import arrow_up from '../../assets/imgs/arrow_up.png';
import Button from "../ui/Button";
import SearchInput from "../ui/SearchInput";

interface Props {
    searchInput: string;
    sortType: number;
    sortDown: boolean;
    onSearchChange: (value: string) => void;
   
}



const SearchAndSortPanel: React.FC<Props> = ({ searchInput, sortType, sortDown, onSearchChange }) => {
    return (
        <div className="flex">
            
            
           
            
        </div>
    );
};

export default SearchAndSortPanel;