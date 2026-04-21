import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import BaseUserFields from './sections/BaseUserFields';
import ListenerFields from './sections/ListenerFields';
import ProgramSelectSection from './sections/ProgramSelectSection';
import DocumentsSection from './sections/DocumentsSection';
import ProfileImageSection from './sections/ProfileImageSection';
import SubmitSection from './sections/SubmitSection';

import {
    listenerCreateSchema,
    listenerEditSchema,
} from '../model/userUpsert.schemas';
import type { ListenerFormDefaultValues, ProgramOption } from '../model/types';
import { useListenerAssets } from '../model/useListenerAssets';
import type { UserDocument } from '../../../entities/user/model/type';

type ListenerUpsertFormProps = {
    mode: 'create-listener' | 'edit-listener';
    defaultValues: ListenerFormDefaultValues;
    programOptions: ProgramOption[];
    existingDocuments: UserDocument[];
    currentProfileImg: string | null;
    onSubmit: (payload: {
        values: ListenerFormDefaultValues;
        newDocuments: File[];
        profileImg: File | null;
    }) => Promise<void>;
};

const ListenerUpsertForm: React.FC<ListenerUpsertFormProps> = ({
                                                                   mode,
                                                                   defaultValues,
                                                                   programOptions,
                                                                   existingDocuments,
                                                                   currentProfileImg,
                                                                   onSubmit,
                                                               }) => {
    const isEdit = mode === 'edit-listener';

    const methods = useForm<ListenerFormDefaultValues>({
        resolver: zodResolver(isEdit ? listenerEditSchema : listenerCreateSchema),
        defaultValues,
        mode: 'onSubmit',
    });

    const {
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;

    const assets = useListenerAssets({
        initialDocuments: existingDocuments,
        initialProfileImg: currentProfileImg,
    });

    const submitLabel = isEdit ? 'Сохранить изменения' : 'Создать слушателя';

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(
                    async (values) => {
                        console.log('VALID SUBMIT', values);

                        await onSubmit({
                            values,
                            newDocuments: assets.newDocuments,
                            profileImg: assets.profileImg,
                        });
                    },
                    (errors) => {
                        console.log('FORM ERRORS', errors);
                    }
                )}
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
                <BaseUserFields isEdit={isEdit}/>
                <ListenerFields/>
                <ProgramSelectSection options={programOptions}/>

                <DocumentsSection
                    existingDocuments={assets.existingDocuments}
                    newDocuments={assets.newDocuments}
                    onAddDocuments={assets.handleDocumentsChange}
                    onRemoveNewDocument={assets.removeNewDocument}
                    onDeleteExistingDocument={assets.handleDeleteExistingDocument}
                />



                <SubmitSection
                    submitLabel={submitLabel}
                    loading={isSubmitting}
                />
            </form>
        </FormProvider>
    );
};

export default ListenerUpsertForm;