import React from "react";

interface ListenerMessagesTabProps {
    onSendMessage: () => void;
}

const ListenerMessagesTab: React.FC<ListenerMessagesTabProps> = ({
                                                                     onSendMessage,
                                                                 }) => {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">
                Сообщения
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Здесь позже можно встроить чат прямо в карточку слушателя.
            </p>

            <button
                type="button"
                onClick={onSendMessage}
                className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
                Открыть чат
            </button>
        </div>
    );
};

export default ListenerMessagesTab;