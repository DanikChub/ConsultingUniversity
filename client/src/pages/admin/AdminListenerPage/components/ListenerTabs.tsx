import React from "react";

export type ListenerTab =
    | "personal"
    | "programs"
    | "certificates"
    | "messages"
    | "history";

interface ListenerTabsProps {
    activeTab: ListenerTab;
    onChange: (tab: ListenerTab) => void;
}

const tabs: { key: ListenerTab; label: string }[] = [
    { key: "personal", label: "Личные данные" },
    { key: "programs", label: "Программы" },
    { key: "certificates", label: "Дипломы" },
    { key: "messages", label: "Сообщения" },
    { key: "history", label: "История" },
];

const ListenerTabs: React.FC<ListenerTabsProps> = ({ activeTab, onChange }) => {
    return (
        <div className="mt-8 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange(tab.key)}
                            className={[
                                "rounded-t-xl px-4 py-3 text-sm font-medium transition",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ListenerTabs;