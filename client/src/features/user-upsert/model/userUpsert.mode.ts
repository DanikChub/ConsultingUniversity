import type { UserUpsertMode } from './types';

type ResolveModeParams = {
    id?: string;
    isAdminQuery: boolean;
};

export function resolveUserUpsertMode({
                                          id,
                                          isAdminQuery,
                                      }: ResolveModeParams): UserUpsertMode {
    const isEdit = Boolean(id);

    if (isEdit && isAdminQuery) return 'edit-admin';
    if (isEdit && !isAdminQuery) return 'edit-listener';
    if (!isEdit && isAdminQuery) return 'create-admin';

    return 'create-listener';
}