import React from 'react';
import RHFFileInput from '../../../../shared/ui/form/RHFFileInput';

type ProfileImageSectionProps = {
    currentProfileImg: string | null;
    onSelectImage: (file: File | null) => void;
};

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
                                                                     currentProfileImg,
                                                                     onSelectImage,
                                                                 }) => {
    return (
        <>
            <RHFFileInput
                label="Фото"
                accept=".png,.jpg,.jpeg"
                onChange={(files) => onSelectImage(files?.[0] || null)}
            />

            {currentProfileImg && (
                <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
                    <div />
                    <div>
                        <img
                            src={`${process.env.REACT_APP_API_URL}/${currentProfileImg}`}
                            alt="profile"
                            className="w-[140px] h-[140px] object-cover rounded"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileImageSection;