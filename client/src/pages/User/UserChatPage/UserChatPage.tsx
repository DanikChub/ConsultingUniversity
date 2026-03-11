import React, { useContext, useEffect, useRef, useState } from "react"
import { Context } from "../../../index"


import UserContainer from "../../../components/ui/UserContainer"
import AutoResizeTextarea from "../../../components/ui/AutoResizeTextarea"
import ChatMessage from "../../../widgets/chat/components/ChatMessage"
import ButtonBack from "../../../shared/ui/buttons/ButtonBack"
import type {Message} from "../../../entities/chat/model/type";
import {createChat, getMessages, sendMessage} from "../../../entities/chat/api/chat.api";
import {useSocket} from "../../../hooks/useSocket";
import Chat from "../../../widgets/chat/Chat";

const UserChatPage: React.FC = () => {
    const { user } = useContext(Context)
    const [chatId, setChatId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (!user?.user?.id) return

        const init = async () => {
            setLoading(true)

            // создаст или вернёт существующий чат
            const chat = await createChat(user?.user?.id)
            setChatId(chat.id)



            setLoading(false)
        }

        init()
    }, [user?.user?.id])


    return (
        <UserContainer loading={!loading}>
            <ButtonBack/>
            <div className="mt-4">
                <Chat chatId={chatId} own="USER"/>
            </div>

        </UserContainer>
    )
}

export default UserChatPage