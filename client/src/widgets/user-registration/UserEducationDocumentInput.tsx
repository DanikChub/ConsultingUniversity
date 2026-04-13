import React from 'react';

type Props = {
    educationDocument: string;
    setEducationDocument: (value: string) => void;
};

const UserEducationDocumentInput: React.FC<Props> = ({
                                                         educationDocument,
                                                         setEducationDocument,
                                                     }) => {
    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label className="text-right">
                Документы об образовании
            </label>

            <input
                type="text"
                value={educationDocument}
                onChange={(e) => setEducationDocument(e.target.value)}
                placeholder="Введите данные документа об образовании"
                className="add_input"
            />
        </div>
    );
};

export default UserEducationDocumentInput;