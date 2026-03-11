import React, { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import AppContainer from "../../../components/ui/AppContainer"
import ButtonBack from "../../../shared/ui/buttons/ButtonBack"

import Chat from "../../../widgets/chat/Chat";
import {markMessagesAsRead} from "../../../entities/chat/api/chat.api";



const AdminChatPage: React.FC = () => {
    const { id } = useParams()


    useEffect(() => {
        markMessagesAsRead(Number(id))
    }, []);

    return (
        <AppContainer>
            <ButtonBack />

            <Chat chatId={Number(id)} own="ADMIN"/>
        </AppContainer>
    )
}

export default AdminChatPage