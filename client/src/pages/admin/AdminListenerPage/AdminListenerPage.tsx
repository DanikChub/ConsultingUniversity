import React from "react";

import AppContainer from "../../../components/ui/AppContainer";
import { useListenerProfilePage } from "../../../features/listener-profile/model/useListenerProfilePage";

import ListenerHeader from "./components/ListenerHeader";
import ListenerInfoGrid from "./components/ListenerInfoGrid";
import ListenerDocumentsCard from "./components/ListenerDocumentsCard";
import ListenerProgramsSection from "./components/ListenerProgramsSection";



const AdminListenerPage: React.FC = () => {
    const {
        user,
        programs,
        documents,
        loading,
        error,
        reload,
        handleSendMessage,
        handleOpenGradeBook,
        handleUserFieldUpdated,
    } = useListenerProfilePage();

    if (loading) {
        return (
            <AppContainer>
                <div className="py-20 text-gray-500">Загрузка...</div>
            </AppContainer>
        );
    }

    if (error) {
        return (
            <AppContainer>
                <div className="py-20 text-red-500">{error}</div>
            </AppContainer>
        );
    }

    if (!user) {
        return (
            <AppContainer>
                <div className="py-20 text-red-500">Пользователь не найден</div>
            </AppContainer>
        );
    }

    return (
        <AppContainer>
            <div className="space-y-12">
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
                    <ListenerHeader
                        user={user}
                        onSendMessage={handleSendMessage}
                    />

                    <div className="mt-8">
                        <ListenerInfoGrid
                            user={user}
                            onFieldUpdated={handleUserFieldUpdated}
                        />
                    </div>

                    <ListenerDocumentsCard
                        userId={user.id}
                        documents={documents}
                        onDocumentsChanged={reload}
                    />
                </div>

                <ListenerProgramsSection
                    programs={programs}
                    onOpenGradeBook={handleOpenGradeBook}
                />
            </div>
        </AppContainer>
    );
};

export default AdminListenerPage;