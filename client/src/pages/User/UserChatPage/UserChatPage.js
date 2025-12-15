import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import { deleteMessages, getMessages, sendMessage } from '../../../http/chatAPI';
import { getOneProgram } from '../../../http/programAPI';
import { getUserById } from '../../../http/userAPI';
import { USER_ROUTE } from '../../../utils/consts';
import { Context } from '../../../index';
import './UserChatPage.css'


  
function makeTime(time) {
    let date = new Date(time)
    let hours = date.getHours()
    let minuts = date.getMinutes()
    return `${hours}:${minuts}`
}

const UserChatPage = () => {
    const userContext = useContext(Context);
    const [chatItems, setChatItems] = useState([])
    const [input, setInput] = useState('');
    const [classState, setClassState] = useState('');
    const [contextMenuClass, setContextMenuClass] = useState();

    const [user, setUser] = useState({name: ''})
    const [program, setProgram] = useState({title: ''})

    useEffect(() => {
        if (input.length > 0) {
            setClassState('block')
        } else {
            setClassState('')
        }
    }, [input])

    useEffect(() => {
        getUserById(userContext.user.user.id)
        .then(data => {setUser(data); getOneProgram(data.programs_id[0]).then(program => setProgram(program))})

        getMessages(userContext.user.user.id)
        .then(messages => {
            console.log(messages)
            if (messages) {
                if (messages.length > 0) {
                    setChatItems(messages)
                }
            }
          
        })
        
        
    }, [])

    const handleSendClick = (e) => {
        e.preventDefault();
        setInput('')
        sendMessage(input, user.id, 'user')
        .then(messages => {
            setChatItems(messages)
        })

        
    }

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        setContextMenuClass(id)
    }

    const handleDeleteMessageClick = (id) => {
        deleteMessages(id).then(messages => {
            setChatItems(messages)
        })
    }
    return (
        <div className="content">
        <div className="container">
            
            <div className="admin_inner">
  
                <div className="admin_container">
                    
                    <div className='admin_chat user'>
                        <div className='admin_user_panel'>
                            <div>{user.name}</div>
                            <div>{program.title}</div>
                        </div>
                        <div onClick={() => setContextMenuClass()} className='admin_chat_container'>
                            {
                                chatItems.map((chatItem, i) => 
                              
                                    <div onContextMenu={(e) => handleContextMenu(e, chatItem.id)} id={`chat_message_${chatItem.id}`} className={`admin_chat_message_container ${chatItem.role == 'user'? 'admin' : 'user'} ${contextMenuClass==chatItem.id? 'open_menu' : ''}`}>
                                        <div className='chat_context_menu'>
                                            <div onClick={() => handleDeleteMessageClick(chatItem.id)} className='chat_context_menu_button'>Удалить</div>
                                        </div>
                                        <div className='admin_chat_message'>
                                            {chatItem.text}
                                            <span className='admin_chat_message_time'>{makeTime(chatItem.createdAt)}</span>
                                        </div>
                                        <svg width="9" height="20" class="admin_chat_admin_svg"><defs><filter x="-50%" y="-14.7%" width="200%" height="141.2%" filterUnits="objectBoundingBox" id="messageAppendix"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#000" filter="url(#messageAppendix)"></path><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#fff" class="corner"></path></g></svg>

                                        <svg width="9" height="20" class="admin_chat_user_svg"><defs><filter x="-50%" y="-14.7%" width="200%" height="141.2%" filterUnits="objectBoundingBox" id="messageAppendix"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><path d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z" fill="#000" filter="url(#messageAppendix)"></path><path d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z" fill="#2980B9" class="corner"></path></g></svg>
                                        
                                    </div>
                                      
                                    
                                )
                            }
                            
                        </div>
                        <form onSubmit={(e) => handleSendClick(e)} className='admin_chat_input_container'>
                            <input onChange={(e) => setInput(e.target.value)} value={input} className='admin_chat_input' placeholder='Сообщение...'/>
                            <button className={`admin_chat_send ` + classState} type="submit">{`->`}</button>
                        </form>
                        
                    </div>
                </div>
                
            </div>
            
        </div>
        
    </div>
    );
};

export default UserChatPage;