import React, {useEffect, useMemo, useState} from "react";
import type {
    Certificate,
    CertificateStatus,
} from "../entities/certificate/model/types";
import {
    updateCertificateStatus,
    setCertificatePostDelivery,
    setCertificatePickup,
    markCertificateShipped,
    markCertificateDelivered, setCertificateIssued,
} from "../entities/certificate/api/certificate.api";
import { ModalContainer } from "./ModalContainer";
import type {User} from "../entities/user/model/type";
import type {Program} from "../entities/program/model/type";
import {FiBook, FiCopy, FiEdit, FiMail, FiMapPin, FiPhone, FiSave, FiUser} from "react-icons/fi";

type Props = {
    certificate: Certificate;
    onClose: () => void;
    onUpdated: () => void; // теперь вызываем только при закрытии
};

const statusOrder: CertificateStatus[] = [
    "waiting_issue_date",
    "pending_contact",
    "contacted",
    "waiting_delivery",
    "shipped",
    "delivered",

];

const deliveryTypeLabels: Record<
    "post" | "pickup",
    string
> = {
    post: "Почтовая доставка",
    pickup: "Самовывоз",
};

const statusLabels: Record<CertificateStatus, string> = {
    waiting_issue_date: "Диплом не выдан",
    pending_contact: "Ожидает связи",
    contacted: "Связались",
    waiting_delivery: "Подготовка к отправке",
    shipped: "Отправлен",
    picked_up: "Забран",
    delivered: "Доставлен",
};

const CertificateDeliveryModal: React.FC<Props> = ({
                                                       certificate,
                                                       onClose,
                                                       onUpdated,
                                                   }) => {
    const [currentCert, setCurrentCert] =
        useState<Certificate>(certificate);
    const [user, setUser] = useState<User | null>(null)
    const [program, setProgram] = useState<Program | null>(null)



    useEffect(() => {
        setUser(certificate.enrollment?.user)
        setProgram(certificate.enrollment?.program)
    }, []);

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(
        currentCert.address || user?.address || ""
    );
    const [tracking, setTracking] = useState(
        currentCert.tracking_number || ""
    );

    const [issuedAt, setIssuedAt] = useState(
        currentCert.issued_at
            ? currentCert.issued_at.slice(0, 10)
            : ""
    );

    const currentStepIndex = useMemo(() => {
        return statusOrder.indexOf(currentCert.status);
    }, [currentCert.status]);

    const handleAction = async (
        action: () => Promise<Certificate>
    ) => {
        try {
            setLoading(true);
            const updated = await action();
            setCurrentCert(updated); // 🔥 обновляем локально
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (value?: string | null) => {
        if (!value) return;
        navigator.clipboard.writeText(value);
    };

    return (
        <ModalContainer size="lg" onClose={() => {
            onUpdated(); // обновляем страницу только при закрытии
            onClose();
        }}>
            <div className="space-y-6">

                {/* HEADER */}
                <div>
                    <div className="flex justify-between items-center">

                        <h2 className="text-xl font-semibold">
                            Управление дипломом

                        </h2>


                        <button
                            onClick={() => {
                                onUpdated();
                                onClose();
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        № {currentCert.certificate_number}
                    </p>
                </div>

                {/* USER CARD */}
                <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-4">

                    <div className="flex items-center gap-3">
                        <div
                            className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl relative overflow-hidden">
                            {
                                user?.img ?
                                    <img
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover w-full h-full"
                                        src={process.env.REACT_APP_API_URL + user?.img}/>
                                    :
                                    <FiUser/>
                            }


                        </div>

                        <div>
                            <div className="font-semibold text-base">
                                {user?.name}
                            </div>
                            {program?.title && (
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <FiBook size={14}/>
                                    {program.title}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

                        {user?.number && (
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FiPhone size={14}/>
                                    {user.number}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user.number)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiCopy size={14}/>
                                </button>
                            </div>
                        )}

                        {user?.email && (
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FiMail size={14}/>
                                    {user.email}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user.email)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiCopy size={14}/>
                                </button>
                            </div>
                        )}

                        {(currentCert.address || user?.address) && (
                            <div
                                className="md:col-span-2 flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FiMapPin size={14}/>
                                    {currentCert.address || user?.address}
                                </div>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            currentCert.address || user?.address
                                        )
                                    }
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiCopy size={14}/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* STEPPER */}
                <div className="flex items-center justify-between">
                    {statusOrder.map((step, index) => {
                        const isActive = index <= currentStepIndex;

                        return (
                            <div key={step} className="flex-1 flex items-center">
                                <div
                                    className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold
                                    ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-500"}`}
                                >
                                    {index + 1}
                                </div>

                                {index < statusOrder.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 
                                        ${index < currentStepIndex
                                            ? "bg-blue-600"
                                            : "bg-gray-200"}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CURRENT STATUS */}
                <div className="text-sm">
                    <b>Текущий статус:</b>{" "}
                    {statusLabels[currentCert.status]}
                </div>

                {/* WORKFLOW */}
                {currentCert.status === "waiting_issue_date" && (
                    <div className="space-y-3">
                        <input
                            type="date"
                            value={issuedAt}
                            onChange={(e) => setIssuedAt(e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />

                        <button
                            disabled={!issuedAt || loading}
                            onClick={() =>
                                handleAction(() =>
                                    setCertificateIssued(currentCert.id, issuedAt)
                                )
                            }
                            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            Назначить дату выдачи
                        </button>
                    </div>
                )}

                {currentCert.status === "pending_contact" && (
                    <button
                        disabled={loading}
                        onClick={() =>
                            handleAction(() =>
                                updateCertificateStatus(
                                    currentCert.id,
                                    "contacted"
                                )
                            )
                        }
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                        Связались с учеником
                    </button>
                )}

                {currentCert.status === "contacted" && (
                    <div className="space-y-3">
                        <input
                            value={address}
                            onChange={(e) =>
                                setAddress(e.target.value)
                            }
                            placeholder="Введите адрес доставки"
                            className="w-full border px-3 py-2 rounded-lg"
                        />

                        <button
                            disabled={!address || loading}
                            onClick={() =>
                                handleAction(async () => {
                                    await setCertificatePostDelivery(
                                        currentCert.id,
                                        address
                                    );
                                    return updateCertificateStatus(
                                        currentCert.id,
                                        "waiting_delivery"
                                    );
                                })
                            }
                            className="w-full bg-purple-600 text-white py-2 rounded-lg"
                        >
                            Оформить отправку почтой
                        </button>

                        <button
                            disabled={loading}
                            onClick={() =>
                                handleAction(async () => {
                                    await setCertificatePickup(
                                        currentCert.id
                                    );
                                    return updateCertificateStatus(
                                        currentCert.id,
                                        "waiting_delivery"
                                    );
                                })
                            }
                            className="w-full bg-gray-700 text-white py-2 rounded-lg"
                        >
                            Самовывоз
                        </button>
                    </div>
                )}

                {currentCert.status === "waiting_delivery" &&
                    currentCert.delivery_type === "post" && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span className="font-semibold">Фамилия:</span>
                                    {user?.name.split(' ')[0]}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user?.name.split(' ')[0])}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiCopy size={14}/>
                                </button>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span className="font-semibold">Имя: </span>
                                    {user?.name.split(' ')[1]}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user?.name.split(' ')[1])}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiCopy size={14}/>
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span className="font-semibold">Отчество: </span>
                                    {user?.name.split(' ')[2]}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user?.name.split(' ')[2])}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiCopy size={14}/>
                                </button>
                            </div>
                            <input
                                value={tracking}
                                onChange={(e) =>
                                    setTracking(e.target.value)
                                }
                                placeholder="Введите трек-номер"
                                className="w-full border px-3 py-2 rounded-lg"
                            />

                            <button
                                disabled={!tracking || loading}
                                onClick={() =>
                                    handleAction(() =>
                                        markCertificateShipped(
                                            currentCert.id,
                                            tracking
                                        )
                                    )
                                }
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg"
                            >
                                Отметить как отправленный
                            </button>
                        </div>
                    )}

                {currentCert.status === "waiting_delivery" &&
                    currentCert.delivery_type === "pickup" && (
                        <button
                            disabled={loading}
                            onClick={() =>
                                handleAction(() =>
                                    updateCertificateStatus(
                                        currentCert.id,
                                        "picked_up"
                                    )
                                )
                            }
                            className="w-full bg-gray-900 text-white py-2 rounded-lg"
                        >
                            Диплом забран
                        </button>
                    )}

                {currentCert.status === "shipped" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="font-semibold">Трек-номер:</span>
                                {currentCert.tracking_number}
                            </div>
                            <button
                                onClick={() => copyToClipboard(currentCert.tracking_number)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiCopy size={14}/>
                            </button>
                        </div>
                        <button
                            disabled={loading}
                            onClick={() =>
                                handleAction(() =>
                                    markCertificateDelivered(
                                        currentCert.id
                                    )
                                )
                            }
                            className="w-full bg-green-600 text-white py-2 rounded-lg"
                        >
                            Подтвердить доставку
                        </button>
                    </div>

                )}

                {currentCert.status === "delivered" && (
                    <div className="text-center text-green-600 font-medium">
                        Диплом успешно доставлен ✅
                    </div>
                )}
                {currentCert.status === "picked_up" && (
                    <div className="text-center text-green-600 font-medium">
                        Диплом успешно доставлен ✅
                    </div>
                )}

            </div>
        </ModalContainer>
    );
};

export default CertificateDeliveryModal;