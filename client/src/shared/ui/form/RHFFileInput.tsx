import React from 'react';

type RHFFileInputProps = {
    label: string;
    multiple?: boolean;
    accept?: string;
    onChange: (files: FileList | null) => void;
};

const RHFFileInput: React.FC<RHFFileInputProps> = ({
                                                       label,
                                                       multiple = false,
                                                       accept,
                                                       onChange,
                                                   }) => {
    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <label className="text-right">{label}</label>

            <input
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={(e) => onChange(e.target.files)}
                className="add_input"
            />
        </div>
    );
};

export default RHFFileInput;