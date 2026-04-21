import {
    addUserDocuments,
    registrateAdmin,
    registrateUser,
    remakeAdmin,
    remakeUser,
    setUserProfileImg,
} from '../api/userUpsert.api';
import {
    buildCreateAdminPayload,
    buildCreateListenerPayload,
    buildUpdateAdminPayload,
    buildUpdateListenerPayload,
} from './userUpsert.mappers';
import type {
    AdminFormDefaultValues,
    ListenerFormDefaultValues,
} from './types';

type SubmitListenerParams = {
    values: ListenerFormDefaultValues;
    id?: number;
    newDocuments?: File[];
    profileImg?: File | null;
};

type SubmitAdminParams = {
    values: AdminFormDefaultValues;
    id?: number;
    profileImg?: File | null;
};

async function uploadProfileImageIfNeeded(userId: number, profileImg?: File | null) {
    if (!profileImg) return;

    const formData = new FormData();
    formData.append('img', profileImg);
    formData.append('id', String(userId));

    await setUserProfileImg(formData);
}

async function uploadDocumentsIfNeeded(userId: number, newDocuments?: File[]) {
    if (!newDocuments || newDocuments.length === 0) return;
    await addUserDocuments(userId, newDocuments);
}

export async function submitCreateListener({
                                               values,
                                               newDocuments,
                                               profileImg,
                                           }: SubmitListenerParams) {
    const payload = buildCreateListenerPayload(values);
    const response = await registrateUser(payload);

    const createdUserId = response?.user?.id ?? response?.id;

    if (createdUserId) {
        await uploadDocumentsIfNeeded(createdUserId, newDocuments);
        await uploadProfileImageIfNeeded(createdUserId, profileImg);
    }

    return response;
}

export async function submitUpdateListener({
                                               id,
                                               values,
                                               newDocuments,
                                               profileImg,
                                           }: SubmitListenerParams) {
    if (!id) throw new Error('Listener id is required for update');

    const payload = buildUpdateListenerPayload(id, values);
    const response = await remakeUser(payload);

    await uploadDocumentsIfNeeded(id, newDocuments);
    await uploadProfileImageIfNeeded(id, profileImg);

    return response;
}

export async function submitCreateAdmin({
                                            values,
                                            profileImg,
                                        }: SubmitAdminParams) {
    const payload = buildCreateAdminPayload(values);
    const response = await registrateAdmin(
        payload.login,
        payload.email,
        payload.password,
        payload.role,
        payload.name,
        payload.number,
        payload.admin_signature
    );

    const createdUserId = response?.user?.id ?? response?.id;

    if (createdUserId) {
        await uploadProfileImageIfNeeded(createdUserId, profileImg);
    }

    return response;
}

export async function submitUpdateAdmin({
                                            id,
                                            values,
                                            profileImg,
                                        }: SubmitAdminParams) {
    if (!id) throw new Error('Admin id is required for update');

    const payload = buildUpdateAdminPayload(id, values);

    const response = await remakeAdmin(
        payload.id,
        payload.login,
        payload.email,
        payload.password || '',
        payload.role,
        payload.name,
        payload.number,
        payload.admin_signature
    );

    await uploadProfileImageIfNeeded(id, profileImg);

    return response;
}