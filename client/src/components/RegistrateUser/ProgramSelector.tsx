import Dropdown from "../ui/Dropdown";

const ProgramSelector = ({
    programInput,
    handleChangeProgram,
    filteredPrograms,
    selectedPrograms,
    handleSelectProgram,
    datalistActive,
    deleteSelectedProgram,
}: any) => (
    <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px] relative">
        <label htmlFor="program" className="text-right">Программа</label>


        <Dropdown filteredPrograms={filteredPrograms} handleSelectProgram={handleSelectProgram}/>




    </div>
);

export default ProgramSelector;
