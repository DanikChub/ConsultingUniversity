import React from 'react';

type UserRole = 'ADMIN' | 'VIEWER';

interface Props {
    role: UserRole;
    handleSelectRole: (role: UserRole) => void;
}

const roles = [
    {
        value: 'ADMIN',
        title: 'Администратор',
        description: 'Полный доступ ко всем функциям'
    },
    {
        value: 'VIEWER',
        title: 'Просмотр',
        description: 'Только просмотр данных'
    }
];

const UserRoleSelect: React.FC<Props> = ({ role, handleSelectRole }) => {
    return (
        <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
            <div className="text-right">
                Роль
            </div>

            <div className="grid grid-cols-1 gap-3">
                {roles.map(r => (
                    <button
                        key={r.value}
                        type="button"
                        onClick={() => handleSelectRole(r.value as UserRole)}
                        className={`
                            p-4 rounded-xl border text-left transition
                            ${role === r.value
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-gray-900">
                                    {r.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {r.description}
                                </div>
                            </div>

                            <div
                                className={`
                                    w-4 h-4 rounded-full border-2
                                    ${role === r.value
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'}
                                `}
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserRoleSelect;