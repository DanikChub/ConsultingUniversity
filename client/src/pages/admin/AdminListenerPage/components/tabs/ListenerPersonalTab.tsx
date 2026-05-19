import React from "react";

import type { User } from "../../../../../entities/user/model/type";
import type { EditableListenerField } from "../../../../../entities/user/api/user.api";
import type { ExistingDocument } from "../../../../../features/listener-profile/model/types";

import ListenerInfoGrid from "../ListenerInfoGrid";
import ListenerDocumentsCard from "../ListenerDocumentsCard";

interface ListenerPersonalTabProps {
    user: User;
    documents: ExistingDocument[];
    onFieldUpdated: (field: EditableListenerField, value: string | null) => void;
    onDocumentsChanged: () => void;
}

const ListenerPersonalTab: React.FC<ListenerPersonalTabProps> = ({
                                                                     user,
                                                                     documents,
                                                                     onFieldUpdated,
                                                                     onDocumentsChanged,
                                                                 }) => {
    return (
        <div className="space-y-6">
            <ListenerInfoGrid
                user={user}
                onFieldUpdated={onFieldUpdated}
            />

            <ListenerDocumentsCard
                userId={user.id}
                documents={documents}
                onDocumentsChanged={onDocumentsChanged}
            />
        </div>
    );
};

export default ListenerPersonalTab;