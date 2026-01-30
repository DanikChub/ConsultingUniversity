import Dropdown from "../../components/ui/Dropdown";
import {useEffect} from "react";
import Button from "../../shared/ui/buttons/Button";

const ProgramSelector = ({
    programInput,
    handleChangeProgram,
    filteredPrograms,
    selectedPrograms,
    handleSelectProgram,
    datalistActive,
    deleteSelectedProgram,
}: any) => {

    useEffect(() => {
        console.log(selectedPrograms.length == 0)
    }, [selectedPrograms]);

    return (

    <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px] relative">
        <label htmlFor="program" className="text-right">Программа</label>
        <div className="w-full space-y-3">
            {
                selectedPrograms.length != 0 ? selectedPrograms.map(selectedProgram =>
                    <div className="flex flex-col items-end w-full" key={selectedProgram.id}>
                        <Dropdown selectedProgram={selectedProgram} filteredPrograms={filteredPrograms} handleSelectProgram={handleSelectProgram}/>
                        <Button className="mt-3">Добавить программу</Button>
                    </div>

                )
                    :
                    <div>
                        <Dropdown filteredPrograms={filteredPrograms} handleSelectProgram={handleSelectProgram}/>

                    </div>

            }
        </div>






    </div>
)};

export default ProgramSelector;
