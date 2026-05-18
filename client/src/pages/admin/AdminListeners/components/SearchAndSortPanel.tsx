import React from "react";

import SearchInput from "../../../../shared/ui/inputs/SearchInput";
import Button from "../../../../shared/ui/buttons/Button";

import type {
    AdminUsersDeletedFilter,
    AdminUsersEnrollmentStatus,
    AdminUsersHasProgramFilter,
    AdminUsersSortDirection,
    AdminUsersSortField,
} from "../../../../entities/user/api/user.api";

import type { AdminListenersFilters } from "../../../../hooks/useAdminListeners";

interface Props {
    filters: AdminListenersFilters;
    sortField: AdminUsersSortField;
    sortDirection: AdminUsersSortDirection;
    hasActiveFilters: boolean;

    onSearchChange: (value: string) => void;
    onFilterChange: <K extends keyof AdminListenersFilters>(
        key: K,
        value: AdminListenersFilters[K]
    ) => void;
    onSort: (field: AdminUsersSortField) => void;
    onReset: () => void;
}

const SearchAndSortPanel: React.FC<Props> = ({
                                                 filters,
                                                 sortField,
                                                 sortDirection,
                                                 hasActiveFilters,
                                                 onSearchChange,
                                                 onFilterChange,
                                                 onSort,
                                                 onReset,
                                             }) => {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
                <SearchInput
                    value={filters.search}
                    onChange={onSearchChange}
                    placeholder="Поиск: ФИО, email, телефон, организация, логин..."
                />

                <select
                    value={filters.deleted}
                    onChange={e =>
                        onFilterChange(
                            "deleted",
                            e.target.value as AdminUsersDeletedFilter
                        )
                    }
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#2980B9]"
                >
                    <option value="active">Активные</option>
                    <option value="deleted">Удаленные</option>
                    <option value="all">Все</option>
                </select>

                <select
                    value={filters.hasProgram}
                    onChange={e =>
                        onFilterChange(
                            "hasProgram",
                            e.target.value as AdminUsersHasProgramFilter
                        )
                    }
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#2980B9]"
                >
                    <option value="all">Все по программам</option>
                    <option value="yes">Есть программа</option>
                    <option value="no">Без программы</option>
                </select>

                <select
                    value={filters.enrollmentStatus}
                    onChange={e =>
                        onFilterChange(
                            "enrollmentStatus",
                            e.target.value as AdminUsersEnrollmentStatus
                        )
                    }
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#2980B9]"
                >
                    <option value="all">Любой статус</option>
                    <option value="active">Обучается</option>
                    <option value="completed">Завершил</option>
                    <option value="archived">Архив</option>
                    <option value="paused">Пауза</option>
                </select>

                <Button type="button" onClick={onReset} disabled={!hasActiveFilters}>
                    Сбросить
                </Button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <DateInput
                    label="Регистрация от"
                    value={filters.createdFrom}
                    onChange={value => onFilterChange("createdFrom", value)}
                />

                <DateInput
                    label="Регистрация до"
                    value={filters.createdTo}
                    onChange={value => onFilterChange("createdTo", value)}
                />

                <DateInput
                    label="Завершение от"
                    value={filters.completedFrom}
                    onChange={value => onFilterChange("completedFrom", value)}
                />

                <DateInput
                    label="Завершение до"
                    value={filters.completedTo}
                    onChange={value => onFilterChange("completedTo", value)}
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-2 text-sm text-gray-500">Сортировка:</span>

                <SortButton
                    label="Дата"
                    field="createdAt"
                    activeField={sortField}
                    direction={sortDirection}
                    onClick={onSort}
                />

                <SortButton
                    label="ФИО"
                    field="name"
                    activeField={sortField}
                    direction={sortDirection}
                    onClick={onSort}
                />

                <SortButton
                    label="Email"
                    field="email"
                    activeField={sortField}
                    direction={sortDirection}
                    onClick={onSort}
                />

                <SortButton
                    label="Организация"
                    field="organization"
                    activeField={sortField}
                    direction={sortDirection}
                    onClick={onSort}
                />
            </div>
        </div>
    );
};

interface DateInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
    return (
        <label className="block">
            <div className="mb-1 text-xs font-medium text-gray-500">
                {label}
            </div>

            <input
                type="date"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#2980B9]"
            />
        </label>
    );
};

interface SortButtonProps {
    label: string;
    field: AdminUsersSortField;
    activeField: AdminUsersSortField;
    direction: AdminUsersSortDirection;
    onClick: (field: AdminUsersSortField) => void;
}

const SortButton: React.FC<SortButtonProps> = ({
                                                   label,
                                                   field,
                                                   activeField,
                                                   direction,
                                                   onClick,
                                               }) => {
    const active = field === activeField;

    return (
        <button
            type="button"
            onClick={() => onClick(field)}
            className={[
                "rounded-full border px-4 py-2 text-sm transition",
                active
                    ? "border-[#2980B9] bg-[#2980B9] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#2980B9] hover:text-[#2980B9]",
            ].join(" ")}
        >
            {label}
            {active ? ` ${direction === "DESC" ? "↓" : "↑"}` : ""}
        </button>
    );
};

export default SearchAndSortPanel;