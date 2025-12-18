import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getMessages,
    markChatAsRead,
    sendMessage
} from '../../../http/chatAPI';
import { Context } from '../../../index';
import AutoResizeTextarea from '../../../components/ui/AutoResizeTextarea';
import ChatMessage from "../../../components/Chat/ChatMessage";
import AppContainer from "../../../components/ui/AppContainer";

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

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messages = await sendMessage(input, params.id, 'admin');
        setChatItems(messages);
        setInput('');
        setTimeout(scrollToBottom, 50);
    };

    return (
        <AppContainer loading={loading}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-gray-200"
                >
                    ←
                </button>
                <span className="text-lg font-medium">Назад</span>
            </div>

            {/* Chat container */}
            <div
                ref={chatContainerRef}
                className="flex flex-col border rounded-xl p-4 space-y-2 h-[500px] max-h-[70vh] overflow-y-auto bg-white"
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
