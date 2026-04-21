import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useUserUpsertPage} from "../../../features/user-upsert/model/useUserUpsertPage";
import AppContainer from "../../../components/ui/AppContainer";

import {
    submitCreateAdmin, submitCreateListener,
    submitUpdateAdmin,
    submitUpdateListener
} from "../../../features/user-upsert/model/userUpsert.submit";
import {ADMIN_ADMINISTRATORS_ROUTE, ADMIN_LISTENERS_ROUTE} from "../../../shared/utils/consts";
import ListenerUpsertForm from "../../../features/user-upsert/ui/ListenerUpsertForm";
import AdminUpsertForm from "../../../features/user-upsert/ui/AdminUpsertForm";



const UserUpsertPage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const pageData = useUserUpsertPage();
    const [serverError, setServerError] = useState('');

    if (pageData.loading) {
        return (
            <AppContainer>
                <div className="relative w-full h-full">
                    Загрузка...
                </div>
            </AppContainer>
        );
    }

    if (pageData.isAdmin) {
        return (
            <AppContainer>
                <AdminUpsertForm
                    mode={pageData.mode as 'create-admin' | 'edit-admin'}
                    defaultValues={pageData.adminDefaultValues}
                    currentProfileImg={pageData.currentProfileImg}
                    serverError={serverError}
                    onSubmit={async ({ values, profileImg }) => {
                        try {
                            setServerError('');

                            if (pageData.isEdit) {
                                await submitUpdateAdmin({
                                    id: Number(params.id),
                                    values,
                                    profileImg,
                                });
                            } else {
                                await submitCreateAdmin({
                                    values,
                                    profileImg,
                                });
                            }

                            navigate(ADMIN_ADMINISTRATORS_ROUTE);
                        } catch (err: any) {
                            setServerError(err?.response?.data?.message || 'Ошибка сохранения');
                        }
                    }}
                />
            </AppContainer>
        );
    }

    return (
        <AppContainer>
            <ListenerUpsertForm
                mode={pageData.mode as 'create-listener' | 'edit-listener'}
                defaultValues={pageData.listenerDefaultValues}
                programOptions={pageData.programOptions}
                existingDocuments={pageData.existingDocuments}
                currentProfileImg={pageData.currentProfileImg}
                onSubmit={async ({ values, newDocuments, profileImg }) => {
                    try {
                        setServerError('');

                        if (pageData.isEdit) {
                            await submitUpdateListener({
                                id: Number(params.id),
                                values,
                                newDocuments,
                                profileImg,
                            });
                        } else {
                            await submitCreateListener({
                                values,
                                newDocuments,
                                profileImg,
                            });
                        }

                        navigate(ADMIN_LISTENERS_ROUTE);
                    } catch (err: any) {
                        setServerError(err?.response?.data?.message || 'Ошибка сохранения');
                    }
                }}
            />
        </AppContainer>
    );
};

export default UserUpsertPage;