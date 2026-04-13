import React from 'react';

const AdminSignatureInput = ({ adminSignature, setAdminSignature, params }: any) => {
    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <div className="text-right">
                Подпись
            </div>

            <div>
                <input
                    type="text"
                    value={adminSignature}
                    onChange={(e) => setAdminSignature(e.target.value)}
                    placeholder="Например: Преподаватель СДК"
                    className="add_input"
                />
            </div>
        </div>
    );
};

export default AdminSignatureInput;