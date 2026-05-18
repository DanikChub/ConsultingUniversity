import React from "react";
import { useNavigate } from "react-router-dom";

import {
    ADMIN_ENROLLMENTS_ROUTE,
    ADMIN_REGISTRATE_USER,
    CHAT_USERS_PAGE_ROUTE,
} from "../../../shared/utils/consts";

import { useAdminListeners } from "../../../hooks/useAdminListeners";
import { useModals } from "../../../hooks/useModals";

import AppContainer from "../../../components/ui/AppContainer";
import Button from "../../../shared/ui/buttons/Button";

import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import SearchAndSortPanel from "./components/SearchAndSortPanel";

import { createChat } from "../../../entities/chat/api/chat.api";
import type { AdminUserListItem } from "../../../entities/user/api/user.api";

const AdminListeners: React.FC = () => {
    const navigate = useNavigate();
    const { openModal } = useModals();

    const {
        users,
        loading,

        countUsers,
        activePage,
        totalCount,

        filters,
        sortField,
        sortDirection,
        hasActiveFilters,

        updateFilter,
        resetFilters,
        handleSearchInput,
        handleSort,
        handleClickPagination,

        destroyUser,
        recoverUser,
    } = useAdminListeners();

    const handleOpenUser = (userId: number) => {
        navigate(`/admin/listeners/${userId}`);
    };

    const handleOpenEnrollments = (userId: number) => {
        navigate(ADMIN_ENROLLMENTS_ROUTE.replace(":userId", String(userId)));
    };

    const handleOpenProgram = (programId?: number | null) => {
        if (!programId) return;
        navigate(`/admin/programs/${programId}`);
    };

    const handleSendMessage = async (userId: number) => {
        const chat = await createChat(userId);
        navigate(CHAT_USERS_PAGE_ROUTE + `?chatId=${chat.id}`);
    };

    const handleDeleteUser = async (user: AdminUserListItem) => {
        const confirmed = await openModal("confirm", {
            title: "Удалить слушателя?",
            description: `Слушатель "${user.name}" будет скрыт из активного списка. Его можно будет восстановить через фильтр "Удаленные".`,
            confirmText: "Удалить",
            variant: "danger",
        });

        if (!confirmed) return;

        await destroyUser(user.id);
    };

    const handleRestoreUser = async (user: AdminUserListItem) => {
        const confirmed = await openModal("confirm", {
            title: "Восстановить слушателя?",
            description: `Слушатель "${user.name}" снова появится в активном списке.`,
            confirmText: "Восстановить",
            variant: "default",
        });

        if (!confirmed) return;

        await recoverUser(user.id);
    };

    return (
        <AppContainer>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2C3E50]">
                            Слушатели
                        </h1>

                        <div className="mt-1 text-sm text-gray-500">
                            Найдено: {totalCount}
                        </div>
                    </div>

                    <Button to={ADMIN_REGISTRATE_USER} checkRole="ADMIN">
                        Добавить слушателя
                    </Button>
                </div>

                <SearchAndSortPanel
                    filters={filters}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    hasActiveFilters={hasActiveFilters}
                    onSearchChange={handleSearchInput}
                    onFilterChange={updateFilter}
                    onSort={handleSort}
                    onReset={resetFilters}
                />

                <UserTable
                    users={users}
                    loading={loading}
                    onOpenUser={handleOpenUser}
                    onOpenEnrollments={handleOpenEnrollments}
                    onOpenProgram={handleOpenProgram}
                    onSendMessage={handleSendMessage}
                    onDelete={handleDeleteUser}
                    onRestore={handleRestoreUser}
                />

                <Pagination
                    pages={countUsers}
                    onClick={handleClickPagination}
                    activePage={activePage}
                />
            </div>
        </AppContainer>
    );
};

export default AdminListeners;