const DiplomSection = ({ diplom, handleDiplomCheck, address, setAddress }: any) => (
    <div className="grid grid-cols-[118px_180px_308px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
       
            <div className="text-right">Диплом</div>

            <div className="add_input_item_flex ">
                <label htmlFor="diploma">Заберет сам</label>
                <input
                    id="diploma"
                    type="checkbox"
                    checked={diplom}
                    onChange={e => handleDiplomCheck(e.target.checked)}
                    className="add_checkbox"
                />
            </div>
     

     
            <label htmlFor="address" className="text-right">
                Отправить почтой России по адресу:
            </label>

            <input
                id="address"
                type="text"
                disabled={diplom}
                value={diplom ? '' : address}
                onChange={e => setAddress(e.target.value)}
                style={{ width: '100%' }}
                placeholder="Введите адрес"
            />
        
    </div>
);

export default DiplomSection;
