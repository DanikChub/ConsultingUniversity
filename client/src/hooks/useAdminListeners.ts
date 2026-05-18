import { useCallback, useEffect, useMemo, useState } from "react";

import {
    getAdminUsersList,
    restoreUser,
    softDeleteUser,
    type AdminUserListItem,
    type AdminUsersDeletedFilter,
    type AdminUsersEnrollmentStatus,
    type AdminUsersHasProgramFilter,
    type AdminUsersSortDirection,
    type AdminUsersSortField,
} from "../entities/user/api/user.api";

import type { PaginationItem } from "../entities/user/model/type";

export interface AdminListenersFilters {
    search: string;
    deleted: AdminUsersDeletedFilter;
    hasProgram: AdminUsersHasProgramFilter;
    programId: string;
    enrollmentStatus: AdminUsersEnrollmentStatus;
    createdFrom: string;
    createdTo: string;
    completedFrom: string;
    completedTo: string;
}

const DEFAULT_FILTERS: AdminListenersFilters = {
    search: "",
    deleted: "active",
    hasProgram: "all",
    programId: "",
    enrollmentStatus: "all",
    createdFrom: "",
    createdTo: "",
    completedFrom: "",
    completedTo: "",
};

const DEFAULT_LIMIT = 10;

export const useAdminListeners = () => {
    const [users, setUsers] = useState<AdminUserListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [countUsers, setCountUsers] = useState<PaginationItem[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [filters, setFilters] = useState<AdminListenersFilters>(() => {
        const saved = localStorage.getItem("admin_listeners_filters");

        if (!saved) return DEFAULT_FILTERS;

        try {
            return {
                ...DEFAULT_FILTERS,
                ...JSON.parse(saved),
            };
        } catch {
            return DEFAULT_FILTERS;
        }
    });

    const [sortField, setSortField] = useState<AdminUsersSortField>(
        (localStorage.getItem("admin_listeners_sort_field") as AdminUsersSortField) ||
        "createdAt"
    );

    const [sortDirection, setSortDirection] = useState<AdminUsersSortDirection>(
        (localStorage.getItem("admin_listeners_sort_direction") as AdminUsersSortDirection) ||
        "DESC"
    );

    const generatePagination = useCallback((total: number, pageIndex: number) => {
        const pages: PaginationItem[] = [];

        for (let i = 0; i < Math.ceil(total / DEFAULT_LIMIT); i++) {
            pages.push({
                number: i + 1,
                class: i === pageIndex ? "active" : "",
            });
        }

        setCountUsers(pages);
    }, []);

    const fetchUsers = useCallback(
        async (
            page: number = activePage + 1,
            nextFilters: AdminListenersFilters = filters,
            nextSortField: AdminUsersSortField = sortField,
            nextSortDirection: AdminUsersSortDirection = sortDirection
        ) => {
            try {
                setLoading(true);

                const data = await getAdminUsersList({
                    page,
                    limit: DEFAULT_LIMIT,
                    search: nextFilters.search,
                    deleted: nextFilters.deleted,
                    hasProgram: nextFilters.hasProgram,
                    programId: nextFilters.programId || undefined,
                    enrollmentStatus: nextFilters.enrollmentStatus,
                    createdFrom: nextFilters.createdFrom || undefined,
                    createdTo: nextFilters.createdTo || undefined,
                    completedFrom: nextFilters.completedFrom || undefined,
                    completedTo: nextFilters.completedTo || undefined,
                    sortField: nextSortField,
                    sortDirection: nextSortDirection,
                });

                setUsers(data.rows);
                setTotalCount(data.count);
                setActivePage(data.page - 1);
                generatePagination(data.count, data.page - 1);
            } catch (error: any) {
                console.error("fetchUsers error:", error);

                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Ошибка загрузки пользователей";

                alert(message);
            } finally {
                setLoading(false);
            }
        },
        [activePage, filters, sortField, sortDirection, generatePagination]
    );

    const saveFilters = (nextFilters: AdminListenersFilters) => {
        setFilters(nextFilters);
        localStorage.setItem("admin_listeners_filters", JSON.stringify(nextFilters));
    };

    const updateFilter = async <K extends keyof AdminListenersFilters>(
        key: K,
        value: AdminListenersFilters[K]
    ) => {
        const nextFilters = {
            ...filters,
            [key]: value,
        };

        saveFilters(nextFilters);
        await fetchUsers(1, nextFilters);
    };

    const handleSearchInput = async (value: string) => {
        if (/[^а-яА-Яa-zA-Z0-9\s@._+\-()]/.test(value)) return;

        await updateFilter("search", value);
    };

    const resetFilters = async () => {
        saveFilters(DEFAULT_FILTERS);
        await fetchUsers(1, DEFAULT_FILTERS);
    };

    const handleSort = async (field: AdminUsersSortField) => {
        const nextDirection: AdminUsersSortDirection =
            sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";

        setSortField(field);
        setSortDirection(nextDirection);

        localStorage.setItem("admin_listeners_sort_field", field);
        localStorage.setItem("admin_listeners_sort_direction", nextDirection);

        await fetchUsers(1, filters, field, nextDirection);
    };

    const handleClickPagination = async (pageIndex: number) => {
        await fetchUsers(pageIndex + 1);
    };

    const destroyUser = async (id: number) => {
        try {
            setLoading(true);

            await softDeleteUser(id);
            await fetchUsers(activePage + 1);
        } catch (error: any) {
            console.error("destroyUser error:", error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Ошибка удаления пользователя";

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const recoverUser = async (id: number) => {
        try {
            setLoading(true);

            await restoreUser(id);
            await fetchUsers(activePage + 1);
        } catch (error: any) {
            console.error("recoverUser error:", error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Ошибка восстановления пользователя";

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasActiveFilters = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
    }, [filters]);

    return {
        users,
        loading,

        countUsers,
        activePage,
        totalCount,

        filters,
        searchInput: filters.search,

        sortField,
        sortDirection,

        hasActiveFilters,

        fetchUsers,
        updateFilter,
        resetFilters,
        handleSearchInput,
        handleSort,
        handleClickPagination,

        destroyUser,
        recoverUser,
    };
};