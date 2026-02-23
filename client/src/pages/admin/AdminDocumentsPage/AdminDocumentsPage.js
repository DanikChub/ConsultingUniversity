import React, { useEffect, useState } from 'react';
import { deleteUser, getAllUsers, getAllUsersGraduation, getAllUsersWithPage, searchUsers } from '../../../entities/user/api/user.api';
import { ADMIN_REGISTRATE_USER } from '../../../shared/utils/consts';

import { Link, useNavigate } from 'react-router-dom';

import pencil from '../../../assets/imgs/pencil.png'

import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import { getStatistic } from '../../../entities/statistic/api/statistic.api';

import arrow_down from '../../../assets/imgs/arrow_down.png'
import arrow_up from '../../../assets/imgs/arrow_up.png'
import ListenersSkeleton from '../AdminListeners/components/ListenersSkeleton';
import AppContainer from '../../../components/ui/AppContainer';
import ProgressBar from "../AdminListeners/components/ProgressBar";

function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
}


const AdminDocumentsPage = () => {
    const [users, setUsers] = useState([]);
    const [countUsers, setCountUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {


      
        getAllUsersGraduation()
            .then(users => {
                setUsers(users);
                setLoading(true);
            })
            .catch(error => {
                console.error('fetchUsers error:', error);

                // сообщение пользователю
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    'Ошибка загрузки пользователей';

                alert(message)
            }).finally (data => {
                setLoading(true);
            })

        
    }, [])

   
    const copyTextToClipboard = async (text) => {
        console.log(text)
        try {
          await navigator.clipboard.writeText(text);
          console.log('Текст успешно скопирован в буфер обмена!');
        } catch (err) {
          console.error('Ошибка:', err);
        }
      };
    const handleSearchInput = (value) => {

    }
   
    return (
        <AppContainer>
            <input onChange={(e) => handleSearchInput(e.target.value)} value={searchInput} className='SearchInput' placeholder='Поиск'/>

            <div className="w-full mt-4 min-h-[410px]">
                {/* Шапка */}
                <div
                    className="
                    grid
                    grid-cols-[20px_1fr_1fr_2fr_2fr_1fr_1fr]
                    gap-[40px]
                    items-center
                    font-semibold
                    pb-2
                "
                >
                    <div>#</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">ФИО</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">Номер телефона</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">Организация</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">Программа</div>

                    <div className="text-sm text-[#2C3E50] font-semibold">Дата начала</div>
                    <div className="text-sm text-[#2C3E50] font-semibold">Дата окончания</div>

                </div>

                {/* Строки */}
                {!loading ? (
                    <ListenersSkeleton/>
                ) : <>
                    {users.map((user) => {
                        const program = user.programs?.[0];

                        return (
                            <div
                                key={user.id}
                                className="
                                grid
                                grid-cols-[20px_1fr_1fr_2fr_2fr_1fr_1fr]
                                gap-[40px]
                                items-center
                                py-2
                                hover:bg-gray-100
                                relative
                              "
                            >
                                <div className="text-sm text-[#2C3E50]">{user?.id}.</div>

                                <div className="text-sm text-[#2C3E50]">
                                    <Link className="hover:text-blue-700" to={`/admin/listeners/${user?.id}`}>
                                        {user?.name}
                                    </Link>
                                </div>
                                <div className="text-sm text-[#2C3E50]">
                                    <a href={`tel:${user?.number}`} className="hover:text-blue-700">
                                        {user?.number}
                                    </a>
                                </div>

                                <div className="text-sm text-[#2C3E50]">
                                    {user?.organization?.length > 21
                                        ? `${user.organization.slice(0, 21)}...`
                                        : user.organization}
                                </div>

                                <div className="text-sm text-[#2C3E50]">
                                    {program ? (
                                        <Link
                                            className="hover:text-blue-700"
                                            to={`/admin/programs/${program.id}`}
                                        >
                                            {program?.short_title}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400 italic">Нет программы</span>
                                    )}
                                </div>


                                <div className="text-sm text-[#2C3E50]">
                                    {dateToString(user?.createdAt)}
                                </div>
                                <div className="text-sm text-[#2C3E50]">
                                    {dateToString(user?.programs[0]?.completed_at)}
                                </div>


                            </div>
                        );
                    })}


                </>


                }


            </div>
        </AppContainer>
    );
};

export default AdminDocumentsPage;