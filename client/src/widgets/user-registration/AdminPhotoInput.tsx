import React, { useMemo } from 'react';

const AdminPhotoInput = ({ profileImg, setProfileImg, currentProfileImg }: any) => {
    const previewUrl = useMemo(() => {
        if (!profileImg) return null;
        return URL.createObjectURL(profileImg);
    }, [profileImg]);

    const savedImgUrl = currentProfileImg
        ? `${process.env.REACT_APP_API_URL}${currentProfileImg}`
        : null;

    const finalPreview = previewUrl || savedImgUrl;

    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <div className="text-right">
                Фото
            </div>

            <div className="flex items-center gap-4">
                <label className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#C7C7C7] bg-[#F8FAFC] cursor-pointer hover:bg-[#EEF2F7] transition">
                    Выбрать фото
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setProfileImg(file);
                        }}
                        className="hidden"
                    />
                </label>

                {finalPreview && (
                    <div className="flex items-center gap-3">
                        <img
                            src={finalPreview}
                            alt="preview"
                            className="w-[72px] h-[72px] rounded-full object-cover border border-[#C7C7C7]"
                        />
                        {profileImg && (
                            <button
                                type="button"
                                onClick={() => setProfileImg(null)}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Удалить
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPhotoInput;