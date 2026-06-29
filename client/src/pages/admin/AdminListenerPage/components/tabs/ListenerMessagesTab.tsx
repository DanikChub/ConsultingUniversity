import React, {useEffect, useState} from "react";
import Chat from "../../../../../widgets/chat/Chat";
import type {User} from "../../../../../entities/user/model/type";
import {getChatByUserId} from "../../../../../entities/chat/api/chat.api";

interface ListenerMessagesTabProps {
    userId: number;
}

const ListenerMessagesTab: React.FC<ListenerMessagesTabProps> = ({
                                                                     userId
                                                                 }) => {
    const [chatId, setChatId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                setLoading(true);

                const chat = await getChatByUserId(userId);
                setChatId(chat.id);
            } catch (e) {
                console.error("Failed to fetch chat:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
    }, [userId]);
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <Chat chatId={Number(chatId)} own="ADMIN"/>
            {/*<h2 className="text-lg font-semibold text-gray-800">*/}
            {/*    Сообщения*/}
            {/*</h2>*/}

            {/*<p className="mt-2 text-sm text-gray-500">*/}
            {/*    Здесь позже можно встроить чат прямо в карточку слушателя.*/}
            {/*</p>*/}

            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={onSendMessage}*/}
            {/*    className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"*/}
            {/*>*/}
            {/*    Открыть чат*/}
            {/*</button>*/}
        </div>
    );
};

export default ListenerMessagesTab;