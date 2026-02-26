import React, {useEffect, useState} from "react";
import { FiSave, FiX } from "react-icons/fi";
import type {Certificate, CertificateStatus} from "../entities/certificate/model/type";
import {updateCertificate} from "../entities/certificate/api/certificate.api";
import {ModalContainer} from "./ModalContainer";


type Props = {
    certificate: Certificate;
    onClose: () => void;
    onUpdated: () => void;
};

const deliveryTypeLabels: Record<
    "post" | "pickup",
    string
> = {
    post: "Почтовая доставка",
    pickup: "Самовывоз",
};

const statusLabels: Record<
    CertificateStatus,
    string
> = {
    pending_contact: "Ожидает связи",
    contacted: "Связались",
    waiting_delivery: "Подготовка к отправке",
    shipped: "Отправлен",
    picked_up: "Забран",
    delivered: "Доставлен",
};

export const EditCertificateModal: React.FC<Props> = ({
                                                          certificate,
                                                          onClose,
                                                          onUpdated,
                                                      }) => {
    const [editableCert, setEditableCert] =
        useState<Certificate>(certificate);

    useEffect(() => {
        console.log(certificate)
    }, [certificate]);

    const saveCertificate = async () => {
        const updated = await updateCertificate(
            certificate.id,
            editableCert
        );

        onUpdated();
        onClose();
    };

    return (
        <ModalContainer size="lg" onClose={() => {
            onUpdated(); // обновляем страницу только при закрытии
            onClose();
        }}>

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold">
                        Редактирование диплома
                    </div>

                    <button onClick={() => {
                        onUpdated();
                        onClose();
                    }}>
                        <FiX />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4">

                    {/* Тип доставки */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">
                            Тип доставки
                        </label>

                        <select
                            value={
                                editableCert?.delivery_type || ""
                            }
                            onChange={(e) =>
                                setEditableCert({
                                    ...editableCert,
                                    delivery_type:
                                        e.target.value as
                                            | "post"
                                            | "pickup",
                                })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="">
                                Не выбран
                            </option>

                            {Object.entries(
                                deliveryTypeLabels
                            ).map(([key, label]) => (
                                <option
                                    key={key}
                                    value={key}
                                >
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Адрес */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">
                            Адрес доставки
                        </label>

                        <input
                            value={
                                editableCert?.address || ""
                            }
                            onChange={(e) =>
                                setEditableCert({
                                    ...editableCert,
                                    address:
                                    e.target.value,
                                })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                    </div>

                    {/* Трек номер */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">
                            Трек-номер
                        </label>

                        <input
                            value={
                                editableCert?.tracking_number ||
                                ""
                            }
                            onChange={(e) =>
                                setEditableCert({
                                    ...editableCert,
                                    tracking_number:
                                    e.target.value,
                                })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                    </div>

                    {/* Статус */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">
                            Статус
                        </label>

                        <select
                            value={editableCert?.status}
                            onChange={(e) =>
                                setEditableCert({
                                    ...editableCert,
                                    status:
                                        e.target
                                            .value as CertificateStatus,
                                })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            {Object.entries(
                                statusLabels
                            ).map(
                                ([key, label]) => (
                                    <option
                                        key={key}
                                        value={key}
                                    >
                                        {label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Footer */}
                    <button
                        onClick={saveCertificate}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                        <FiSave size={14} />
                        Сохранить изменения
                    </button>
                </div>

        </ModalContainer>
    );
};