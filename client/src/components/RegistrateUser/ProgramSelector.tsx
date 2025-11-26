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

        {selectedPrograms.length === 0 ? (
            <input
                value={programInput}
                onChange={e => handleChangeProgram(e.target.value)}
                onClick={() => handleChangeProgram(programInput)}
                id="program"
                type="text"
                className="add_input"
                placeholder="Введите наименование программы"
            />
        ) : (
            selectedPrograms.map(p => (
                <div key={p.id} className="selected_program">
                    <span>{p.title}</span>
                    <button
                        onClick={deleteSelectedProgram}
                        className="selected_program_delete"
                    >
                        ×
                    </button>
                </div>
            ))
        )}


    

        {datalistActive && (
            <div className="datalist">
                {filteredPrograms.map((p: any) => (
                    <div
                        key={p.id}
                        onClick={() => handleSelectProgram(p)}
                        className="datalist_item"
                        dangerouslySetInnerHTML={{
                            __html: p.title.replace(
                                p.yellow_value || '',
                                `<b class="background-yellow">${p.yellow_value || ''}</b>`
                            ),
                        }}
                    />
                ))}
            </div>
        )}
    </div>
);

export default ProgramSelector;
