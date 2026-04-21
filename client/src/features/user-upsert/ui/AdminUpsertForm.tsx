import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AdminFields from './sections/AdminFields';
import ProfileImageSection from './sections/ProfileImageSection';
import SubmitSection from './sections/SubmitSection';

import {
    adminCreateSchema,
    adminEditSchema,
} from '../model/userUpsert.schemas';
import type { AdminFormDefaultValues } from '../model/types';
import { useListenerAssets } from '../model/useListenerAssets';

type AdminUpsertFormProps = {
    mode: 'create-admin' | 'edit-admin';
    defaultValues: AdminFormDefaultValues;
    currentProfileImg: string | null;
    onSubmit: (payload: {
        values: AdminFormDefaultValues;
        profileImg: File | null;
    }) => Promise<void>;
    serverError?: string;
};

const AdminUpsertForm: React.FC<AdminUpsertFormProps> = ({
                                                             mode,
                                                             defaultValues,
                                                             currentProfileImg,
                                                             onSubmit,
                                                             serverError,
                                                         }) => {
    const isEdit = mode === 'edit-admin';

    const methods = useForm<AdminFormDefaultValues>({
        resolver: zodResolver(isEdit ? adminEditSchema : adminCreateSchema),
        defaultValues,
        mode: 'onSubmit',
    });

    const {
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;


    const assets = useListenerAssets({
        initialDocuments: [],
        initialProfileImg: currentProfileImg,
    });

    const submitLabel = isEdit ? 'Сохранить изменения' : 'Создать администратора';

    React.useEffect(() => {
        const firstErrorField = Object.keys(errors)[0];
        if (!firstErrorField) return;

        const element = document.getElementById(firstErrorField);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errors]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(async (values) => {
                    await onSubmit({
                        values,
                        profileImg: assets.profileImg,
                    });
                })}
                className="mt-[30px] w-full"
            >
                {Object.keys(errors).length > 0 ? (
                    <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
                        <div className="font-semibold">Исправьте ошибки в форме:</div>
                        <ul className="mt-2 list-disc pl-5">
                            {Object.entries(errors).map(([fieldName, error]) => (
                                <li key={fieldName}>
                                    {String(error?.message || 'Некорректное значение')}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <AdminFields isEdit={isEdit} />

                <ProfileImageSection
                    currentProfileImg={assets.currentProfileImg}
                    onSelectImage={assets.setProfileImg}
                />

                <SubmitSection
                    submitLabel={submitLabel}
                    loading={isSubmitting}
                    serverError={serverError}
                />
            </form>
        </FormProvider>
    );
};

export default AdminUpsertForm;