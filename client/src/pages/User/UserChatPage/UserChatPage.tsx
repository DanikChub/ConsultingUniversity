import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getMessages,
    markChatAsRead,
    sendMessage
} from '../../../entities/chat/api/chat.api';
import { getOneProgram } from '../../../entities/program/api/program.api';
import { getUserById } from '../../../entities/user/api/user.api';
import { Context } from '../../../index';
import UserContainer from '../../../components/ui/UserContainer';
import AutoResizeTextarea from '../../../components/ui/AutoResizeTextarea';
import ChatMessage from "../../admin/ChatPage/components/ChatMessage";
import ButtonBack from "../../../shared/ui/buttons/ButtonBack";

const makeTime = (time: string) => {
    const date = new Date(time);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const UserChatPage: React.FC = () => {
    const userContext = useContext(Context);
    const navigate = useNavigate();

    const [chatItems, setChatItems] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // Функция автопрокрутки вниз
    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    useEffect(() => {
        setLoading(true);
        if (userContext.user.user.id) {
            console.log(userContext.user.user.id)
            // Получаем данные пользователя и программу (логика оставлена)
            getUserById(userContext.user.user.id)
                .then(data => getOneProgram(data.programs[0].id));

            // Получаем сообщения и помечаем как прочитанные
            getMessages(userContext.user.user.id).then(messages => {
                setChatItems(messages);
                setTimeout(scrollToBottom, 50); // прокрутка после загрузки
            });

            markChatAsRead(userContext.user.user.id, 'USER');
        }


    }, [userContext.user.user.id]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messages = await sendMessage(input, userContext.user.user.id, 'user');
        setChatItems(messages);
        setInput('');
        setTimeout(scrollToBottom, 50); // прокрутка после отправки
    };

    return (
        <UserContainer loading={loading}>
            <div className="flex flex-col h-full">

                {/* Header */}
                <ButtonBack/>

                {/* Chat container */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto border rounded-xl p-4 space-y-2 h-[500px] max-h-[70vh] bg-white mt-4"
                >
                    {chatItems.map(msg => (
                        <ChatMessage
                            key={msg.id}
                            text={msg.text}
                            time={makeTime(msg.createdAt)}
                            isOwn={msg.role === 'user'}
                        />
                    ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="mt-4 flex gap-2 items-end">
                    <AutoResizeTextarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Написать сообщение..."
                        maxRows={8}
                        className="flex-1 border rounded-xl px-4 py-3 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="h-10 px-4 rounded-xl bg-blue-500 text-white disabled:opacity-50"
                    >
                        ➤
                    </button>
                </form>

            </div>
        </UserContainer>
    );
};

export default UserChatPage;
