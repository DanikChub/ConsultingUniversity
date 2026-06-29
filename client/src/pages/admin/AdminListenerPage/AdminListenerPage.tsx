import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import AppContainer from "../../../components/ui/AppContainer";
import { useListenerProfilePage } from "../../../features/listener-profile/model/useListenerProfilePage";

import ListenerHeader from "./components/ListenerHeader";
import ListenerTabs, { type ListenerTab } from "./components/ListenerTabs";

import ListenerPersonalTab from "./components/tabs/ListenerPersonalTab";
import ListenerProgramsTab from "./components/tabs/ListenerProgramsTab";
import ListenerCertificatesTab from "./components/tabs/ListenerCertificatesTab";
import ListenerMessagesTab from "./components/tabs/ListenerMessagesTab";
import ListenerHistoryTab from "./components/tabs/ListenerHistoryTab";

const allowedTabs: ListenerTab[] = [
    "personal",
    "programs",
    "certificates",
    "messages",
    "history",
];

const AdminListenerPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

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

    const activeTab = useMemo<ListenerTab>(() => {
        const tab = searchParams.get("tab") as ListenerTab | null;

        if (tab && allowedTabs.includes(tab)) {
            return tab;
        }

        return "personal";
    }, [searchParams]);

    const handleTabChange = (tab: ListenerTab) => {
        setSearchParams({ tab });
    };

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
            <div className="space-y-8">
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
                    <ListenerHeader
                        user={user}
                        onSendMessage={handleSendMessage}
                    />

                    <ListenerTabs
                        activeTab={activeTab}
                        onChange={handleTabChange}
                    />
                </div>

                {activeTab === "personal" && (
                    <ListenerPersonalTab
                        user={user}
                        documents={documents}
                        onFieldUpdated={handleUserFieldUpdated}
                        onDocumentsChanged={reload}
                    />
                )}

                {activeTab === "programs" && (
                    <ListenerProgramsTab
                        userId={user.id}
                        programs={programs}
                        onOpenGradeBook={handleOpenGradeBook}
                        onChanged={reload}
                    />
                )}

                {activeTab === "certificates" && <ListenerCertificatesTab />}

                {activeTab === "messages" && (
                    <ListenerMessagesTab userId={user.id} />
                )}

                {activeTab === "history" && <ListenerHistoryTab />}
            </div>
        </AppContainer>
    );
};

export default AdminListenerPage;