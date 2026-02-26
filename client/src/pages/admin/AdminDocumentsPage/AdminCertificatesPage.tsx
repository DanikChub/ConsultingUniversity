import React, { useEffect, useMemo, useState } from "react";

import AppContainer from "../../../components/ui/AppContainer";
import SearchInput from "../../../shared/ui/inputs/SearchInput";

import type {
    Certificate,
    CertificateStatus,
} from "../../../entities/certificate/model/types";

import {
    getCertificates,
    updateCertificateStatus,
    setCertificatePostDelivery,
    setCertificatePickup,
    markCertificateShipped,
    markCertificateDelivered,
} from "../../../entities/certificate/api/certificate.api";
import {useModals} from "../../../hooks/useModals";
import {FiSettings} from "react-icons/fi";
import {HiOutlineCog} from "react-icons/hi";
import {Link, useNavigate} from "react-router-dom";
import {ADMIN_USER_ROUTE, ADMIN_VIEW_PROGRAM} from "../../../shared/utils/consts";

function dateToString(date?: string | null) {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("ru-RU");
}

const statusLabels: Record<CertificateStatus, string> = {
    pending_contact: "Ожидает связи",
    contacted: "Связались",
    waiting_delivery: "Готов к отправке",
    shipped: "Отправлен",
    picked_up: "Забран",
    delivered: "Доставлен",
};

const statusColors: Record<CertificateStatus, string> = {
    pending_contact: "bg-yellow-100 text-yellow-700",
    contacted: "bg-blue-100 text-blue-700",
    waiting_delivery: "bg-purple-100 text-purple-700",
    shipped: "bg-indigo-100 text-indigo-700",
    picked_up: "bg-gray-200 text-gray-700",
    delivered: "bg-green-100 text-green-700",
};

const AdminCertificatesPage: React.FC = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        CertificateStatus | "all"
    >("all");

    const [editingAddressId, setEditingAddressId] = useState<number | null>(
        null
    );
    const [addressValue, setAddressValue] = useState("");
    const [trackingValue, setTrackingValue] = useState("");

    const { openModal } = useModals();

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            const data = await getCertificates();
            setCertificates(data);
        } catch (e: any) {
            alert(e?.response?.data?.message || "Ошибка загрузки сертификатов");
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return certificates.filter((c) => {
            const fullName = c.enrollment?.user?.name?.toLowerCase() || "";
            const certNumber = c.certificate_number?.toLowerCase() || "";
            const track_number = c.tracking_number?.toLowerCase() || "";

            const matchesSearch =
                fullName.includes(searchInput.toLowerCase()) ||
                certNumber.includes(searchInput.toLowerCase())||
                track_number.includes(searchInput.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || c.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [certificates, searchInput, statusFilter]);

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };


    return (
        <AppContainer>
            <div className="flex justify-between items-center mt-7">
                <SearchInput
                    value={searchInput}
                    onChange={(v) => setSearchInput(v)}
                    placeholder="Поиск по ФИО или номеру диплома"
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value as CertificateStatus | "all"
                        )
                    }
                    className="ml-4 border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="all">Все статусы</option>
                    {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-6 min-h-[500px]">
                <div className="grid grid-cols-[50px_2fr_2fr_2fr_1fr_1fr_1fr] gap-6 font-semibold pb-3 border-b">
                    <div>#</div>
                    <div>ФИО</div>
                    <div>Программа</div>
                    <div>Номер диплома</div>
                    <div>Статус</div>
                    <div>Дата выдачи</div>
                    <div>Действия</div>
                </div>

                {loading ? (
                    <div className="py-10 text-gray-400">Загрузка...</div>
                ) : (
                    filtered.map((cert, index) => {
                        const user = cert.enrollment?.user;
                        const program = cert.enrollment?.program;

                        return (
                            <div
                                key={cert.id}
                                className="grid grid-cols-[50px_2fr_2fr_2fr_1fr_1fr_1fr] gap-6 items-center py-3 border-b hover:bg-gray-50 transition"
                            >
                                <div>{index + 1}</div>

                                <Link className="hover:text-blue-700" to={ADMIN_USER_ROUTE.replace(':id', `${user?.id}`)}>
                                    {user?.name}
                                </Link>



                                <Link className="hover:text-blue-700" to={ADMIN_VIEW_PROGRAM.replace(':id', `${program?.id}`)}>
                                    {program?.short_title}
                                </Link>

                                <div
                                    className="cursor-pointer hover:text-blue-600"
                                    onClick={() =>
                                        copyToClipboard(
                                            cert.certificate_number
                                        )
                                    }
                                >
                                    {cert.certificate_number}
                                </div>

                                <div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[cert.status]}`}
                                    >
                                        {statusLabels[cert.status]}
                                    </span>
                                </div>

                                <div>
                                    {dateToString(cert.issued_at)}
                                </div>

                                {/* ===== ACTIONS ===== */}

                                <div className="flex space-x-3">
                                    <button
                                        onClick={async () => {
                                            const result = await openModal("certificateDelivery", {
                                                certificate: cert,
                                            });

                                            if (result === "updated") {
                                                loadCertificates();
                                            }
                                        }}
                                        className="text-xs px-3 py-1 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-all"
                                    >
                                        Управление
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const result = await openModal("editCertificate", {
                                                certificate: cert,
                                            });

                                            if (result === "updated") {
                                                loadCertificates();
                                            }
                                        }}
                                        className="text-xs px-3 py-1 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-all"
                                    >
                                        <HiOutlineCog size={18}/>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </AppContainer>
    );
};

export default AdminCertificatesPage;