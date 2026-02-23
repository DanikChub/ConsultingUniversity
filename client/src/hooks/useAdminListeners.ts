import { useEffect, useState } from "react";
import { User, UsersAPIResponse, PaginationItem } from "../entities/user/model/type";
import { getAllUsersWithPage, searchUsers, deleteUser } from "../entities/user/api/user.api";
import {generateFakeUsers, getUsersPage} from "../shared/utils/generateFakeUsers";

export const useAdminListeners = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [countUsers, setCountUsers] = useState<PaginationItem[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [sortType, setSortType] = useState<number>(0);
    const [sortDown, setSortDown] = useState<boolean>(true);
    const [activePage, setActivePage]  = useState(0)
    const sortTypeVariations = ["statistic", "name", "createdAt"];


    const generatePagination = (totalCount: number) => {
        const pages: PaginationItem[] = [];
        for (let i = 0; i < Math.ceil(totalCount / 10); i++) {
            pages.push({ number: i + 1, class: i === 0 ? 'active' : '' });
        }
        setCountUsers(pages);
    };

    const fetchUsers = async (page: number = 1, search?: string) => {
        try {
            setLoading(true);

            let data: UsersAPIResponse;

            if (search) {
                data = await searchUsers(page, search);
            } else {
                data = await getAllUsersWithPage(
                    page,
                    sortTypeVariations[sortType],
                    sortDown ? 'DESC' : 'ASC'
                );
            }
            // const data = getUsersPage(page)

            generatePagination(data.count);

            const userList = data.rows;


            if (search) {
                userList.forEach(u => (u.yellow_value = search));
            }

            setUsers(userList);
            setFilteredUsers(userList);

        } catch (error: any) {
            console.error('fetchUsers error:', error);

            // сообщение пользователю
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Ошибка загрузки пользователей';

            alert(message)

        } finally {
            setLoading(true);
        }
    };

    const destroyUser = async (id: number) => {
        setLoading(false);
        await deleteUser(id);
        fetchUsers(1);
    };

    const handleSearchInput = (value: string) => {
        if (/[^а-яА-Яa-zA-Z0-9\s]/.test(value)) return;
        setSearchInput(value);
        fetchUsers(1, value || undefined);
    };

    const handleSortButton = (type: number) => {
        setSortType(type);
        localStorage.setItem('sort_type', type.toString());
        setSearchInput('');
        fetchUsers(1);
    };

    const handleSortDown = () => {
        setSortDown(prev => !prev);
        localStorage.setItem('sort_down', Number(!sortDown).toString());
        setSearchInput('');
        fetchUsers(1);
    };

    const handleClickPagination = (pageIndex: number) => {
        const updated = countUsers.map((item, i) => ({ ...item, class: i === pageIndex ? 'active' : '' }));
        setCountUsers(updated);
        setActivePage(pageIndex);
        fetchUsers(pageIndex + 1);
    };

    useEffect(() => {
        const savedSortType = Number(localStorage.getItem('sort_type')) || 0;
        const savedSortDown = Boolean(Number(localStorage.getItem('sort_down')));
        setSortType(savedSortType);
        setSortDown(savedSortDown);
        fetchUsers(1);
    }, []);

    return {
        users,
        filteredUsers,
        loading,
        countUsers,
        searchInput,
        sortType,
        sortDown,
        handleSearchInput,
        handleSortButton,
        handleSortDown,
        handleClickPagination,
        destroyUser,
        activePage
    };
};
