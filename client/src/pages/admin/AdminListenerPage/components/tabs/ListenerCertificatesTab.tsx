import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {Certificate, CertificateStatus} from "../../../../../entities/certificate/model/type";
import {useModals} from "../../../../../hooks/useModals";
import {getCertificatesByUserId} from "../../../../../entities/certificate/api/certificate.api";



function dateToString(date?: string | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ru-RU");
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

const ListenerCertificatesTab: React.FC = () => {
    const { id } = useParams();
    const userId = Number(id);

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    const { openModal } = useModals();

    const loadCertificates = async () => {
        try {
            setLoading(true);
            const data = await getCertificatesByUserId(userId);
            setCertificates(data);
        } catch (e: any) {
            alert(e?.response?.data?.message || "Ошибка загрузки дипломов");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadCertificates();
        }
    }, [userId]);

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <h2 className="text-left text-lg font-semibold text-gray-800">
                Дипломы
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Управление дипломами слушателя: адрес, отправка, трек-номер и доставка.
            </p>

            <div className="mt-6">
                {loading ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-400">
                        Загрузка дипломов...
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-400">
                        Пока у слушателя нет дипломов для обработки.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {certificates.map((cert) => {
                            const program = cert.enrollment?.program;

                            return (
                                <div
                                    key={cert.id}
                                    className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 items-center rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4"
                                >
                                    <div>
                                        <div className="text-sm text-gray-400">
                                            Номер диплома
                                        </div>
                                        <div className="font-medium text-gray-800">
                                            {cert.certificate_number}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-400">
                                            Программа
                                        </div>
                                        <div className="font-medium text-gray-800">
                                            {program?.short_title || program?.title || "-"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-400">
                                            Дата выдачи
                                        </div>
                                        <div className="font-medium text-gray-800">
                                            {dateToString(cert.issued_at)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[cert.status]}`}
                                        >
                                            {statusLabels[cert.status]}
                                        </span>

                                        <button
                                            onClick={async () => {
                                                const result = await openModal(
                                                    "certificateDelivery",
                                                    { certificate: cert }
                                                );

                                                if (result === "updated") {
                                                    loadCertificates();
                                                }
                                            }}
                                            className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        >
                                            Управление
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListenerCertificatesTab;