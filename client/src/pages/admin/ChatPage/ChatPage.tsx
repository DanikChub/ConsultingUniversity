import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getMessages,
    markChatAsRead,
    sendMessage
} from '../../../entities/chat/api/chat.api';
import { Context } from '../../../index';
import AutoResizeTextarea from '../../../components/ui/AutoResizeTextarea';
import ChatMessage from "./components/ChatMessage";
import AppContainer from "../../../components/ui/AppContainer";
import ButtonBack from "../../../shared/ui/buttons/ButtonBack";
import {useModals} from "../../../hooks/useModals";

const makeTime = (time: string) => {
    const date = new Date(time);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const ChatPage: React.FC = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const params = useParams();

    const [chatItems, setChatItems] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const {openModal} = useModals()


    // ref на контейнер чата
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // прокрутка вниз только внутри контейнера
    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    useEffect(() => {
        setLoading(true);
        if (params.id) {
            markChatAsRead(params.id, 'ADMIN');
            getMessages(params.id).then(messages => {
                setChatItems(messages);
                setTimeout(scrollToBottom, 50);
            });
        }
    }, [params.id]);

    const userRole = useContext(Context).user.user.role;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (userRole ==  'ADMIN') {
            try {
                const messages = await sendMessage(input, params.id, 'admin');
                setChatItems(messages);
                setInput('');
                setTimeout(scrollToBottom, 50);
            } catch(e) {
                alert(e.response.data.message)
            }
        } else if (userRole == 'VIEWER') {
            await openModal("alert", {
                title: "Недостаточно прав доступа",
                description:
                    "У вас нет прав для выполнения этого действия. Если вы считаете, что это ошибка, обратитесь к администратору платформы.",
                buttonText: "Понятно",
            });
        }


    };

    return (
        <AppContainer loading={loading}>
            {/* Header */}
            <ButtonBack/>

            {/* Chat container */}
            <div
                ref={chatContainerRef}
                className="flex flex-col border rounded-xl p-4 space-y-2 h-[500px] max-h-[70vh] overflow-y-auto bg-white mt-4"
            >
                {chatItems.map(msg => (
                    <ChatMessage
                        key={msg.id}
                        text={msg.text}
                        time={makeTime(msg.createdAt)}
                        isOwn={msg.role === 'admin'}
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
                    className="
            h-10 px-4 rounded-xl
            bg-blue-500 text-white
            disabled:opacity-50
          "
                >
                    ➤
                </button>
            </form>
        </AppContainer>
    );
};

export default ChatPage;
