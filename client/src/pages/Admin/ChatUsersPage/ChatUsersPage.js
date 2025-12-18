import React, { useEffect, useState } from 'react';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import { getAllUsers, getUsersWithLastMessages } from '../../../http/userAPI';

import './ChatUsersPage.css'

import user_png from "../../../assets/imgs/user.png"
import { Link, useNavigate } from 'react-router-dom';
import { CHAR_PAGE_ROUTE } from '../../../utils/consts';
import AppContainer from '../../../components/ui/AppContainer';

function dateToString(date) {

    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }

}

const ChatUsersPage = () => {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [buttonActive, setButtonActive] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        getUsersWithLastMessages()
            .then(data => {setUsers(data);setFilteredUsers(data)})
            .then(data => setLoading(true))
            .catch(e => alert(e))
        console.log(users)
    }, [])

    const handleClickButton = (type) => {

        if (buttonActive == type) {
            setButtonActive('')
            setFilteredUsers(users)
        } else {
            setButtonActive(type)
            if (type == 'inbox') {

                let new_arr = users;
                new_arr = new_arr.filter(el => el.role == 'user')
                setFilteredUsers(new_arr)
            } else if (type == 'outbox') {
                let new_arr = users;
                new_arr = new_arr.filter(el => el.role == 'admin')
                setFilteredUsers(new_arr)
            }
        }


    }
    return (
        <AppContainer>



            <input className='SearchInput' placeholder='Поиск'/>

            <div className='mt-4'>
                <div className='flex start mb-4'>
                    <div onClick={() => handleClickButton('inbox')} className={`admin_button mr-2 ${buttonActive=='inbox'?'active':''}`} style={{display: 'flex', alignItems: 'center'}}>


                        <span style={{marginLeft: '12px'}}>Входящие</span></div>
                    <div onClick={() => handleClickButton('outbox')}  className={`admin_button ${buttonActive=='outbox'?'active':''}`}>


                        <span style={{marginLeft: '12px'}}>Отправленные</span>
                    </div>

                </div>


                {
                    filteredUsers.map((user, i) => {
                            const row_class = user.numberUnReadMessages ? 'text-sm text-[#2C3E50] font-bold' : 'text-sm text-[#2C3E50]'
                            return (<div
                                key={user.id}

                                className={`
                            grid
                            grid-cols-[max-content_2fr_2fr_3fr_1fr]
                            gap-[40px]
                            items-center
                            py-2
                            hover:bg-gray-100
                            relative
                            
                            ${user.numberUnReadMessages ?
                                    'font-bold'
                                    :
                                    ''

                                }
                        `}
                            >
                                <div
                                    className={row_class}><input type='checkbox'/></div>
                                <div className={row_class}>
                                    <Link className='chat_users_link'
                                          to={CHAR_PAGE_ROUTE.replace(':id', user.id)}>{user.name}</Link>
                                </div>
                                <div className={row_class}>
                                    {user.organiztion}
                                </div>
                                <div className={row_class}>
                                    {user.message.length > 33 ? user.message.slice(0, 33) + '...' : user.message}
                                </div>
                                <div className={row_class}>
                                    {dateToString(user.createdAt)}
                                </div>

                            </div>)
                        }
                    )
                }


            </div>

        </AppContainer>
    );
};

export default ChatUsersPage;