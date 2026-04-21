import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    getAllPublishedPrograms,
    getUserById,
} from '../api/userUpsert.api';
import { resolveUserUpsertMode } from './userUpsert.mode';
import {
    createEmptyAdminDefaults,
    createEmptyListenerDefaults,
    mapUserToAdminDefaults,
    mapUserToListenerDefaults,
} from './userUpsert.mappers';
import type { ProgramOption, UserUpsertPageData } from './types';

export function useUserUpsertPage(): UserUpsertPageData {
    const params = useParams();
    const [searchParams] = useSearchParams();

    const mode = resolveUserUpsertMode({
        id: params.id,
        isAdminQuery: Boolean(searchParams.get('admin')),
    });

    const isEdit = mode === 'edit-listener' || mode === 'edit-admin';
    const isAdmin = mode === 'create-admin' || mode === 'edit-admin';

    const [loading, setLoading] = useState(true);
    const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
    const [existingDocuments, setExistingDocuments] = useState([]);
    const [currentProfileImg, setCurrentProfileImg] = useState<string | null>(null);
    const [listenerDefaultValues, setListenerDefaultValues] = useState(createEmptyListenerDefaults());
    const [adminDefaultValues, setAdminDefaultValues] = useState(createEmptyAdminDefaults());

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                if (!isAdmin) {
                    const programs = await getAllPublishedPrograms();
                    setProgramOptions(programs || []);
                }

                if (params.id) {
                    const user = await getUserById(params.id);

                    setCurrentProfileImg(user.img || null);

                    if (isAdmin) {
                        setAdminDefaultValues(mapUserToAdminDefaults(user));
                    } else {
                        setListenerDefaultValues(mapUserToListenerDefaults(user));
                        setExistingDocuments(user.documents || []);
                    }
                }
            } catch (e) {
                console.error('useUserUpsertPage load error:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [params.id, isAdmin]);

    return {
        mode,
        isEdit,
        isAdmin,
        loading,
        programOptions,
        existingDocuments,
        currentProfileImg,
        listenerDefaultValues,
        adminDefaultValues,
    };
}