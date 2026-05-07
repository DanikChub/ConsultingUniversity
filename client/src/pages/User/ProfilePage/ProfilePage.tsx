import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
    FiArrowLeft,
    FiBookOpen,
    FiCalendar,
    FiCheckCircle,
    FiCreditCard,
    FiFileText,
    FiImage,
    FiMail,
    FiMapPin,
    FiPhone,
    FiUser,
    FiShield,
    FiDownload,
    FiBriefcase,
} from "react-icons/fi";

import UserContainer from "../../../components/ui/UserContainer";
import LoadingAlert from "../../../components/ui/LoadingAlert";
import { Context } from "../../../index";
import {
    getUserDocuments,
    setUserProfileImg,
} from "../../../entities/user/api/user.api";

import user_img from "../../../assets/imgs/user.png";
import { COURSE_ROUTE, USER_ROUTE } from "../../../shared/utils/consts";
import type { UserDocument } from "../../../entities/user/model/type";

const ProfilePage = observer(() => {
    const userContext = useContext(Context);

    const user = userContext.user.user;

    const [loading, setLoading] = useState(true);
    const [alertLoading, setAlertLoading] = useState(false);
    const [documents, setDocuments] = useState<UserDocument[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        async function load() {
            try {
                setLoading(false);
                const docs = await getUserDocuments(user.id);
                console.log(docs);
                setDocuments(docs || []);
            } catch (e) {
                console.error("Ошибка загрузки документов пользователя", e);
            } finally {
                setLoading(true);
            }
        }

        load();
    }, [user?.id]);

    const handleProfileImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !user?.id) return;

        const file = e.target.files[0];
        const formData = new FormData();

        formData.append("id", String(user.id));
        formData.append("img", file);

        const localImg = URL.createObjectURL(file);
        userContext.user.setUserImage(localImg);

        setAlertLoading(true);

        setUserProfileImg(formData)
            .catch((e) => {
                console.error("Ошибка загрузки аватарки", e);
            })
            .finally(() => {
                setAlertLoading(false);
            });
    };

    const imgSrc = useMemo(() => {
        if (!user?.img) return user_img;

        if (user.img.startsWith("http") || user.img.startsWith("blob:")) {
            return user.img;
        }

        return process.env.REACT_APP_API_URL + user.img;
    }, [user?.img]);

    const fullName = user?.name || "Пользователь";

    const firstName = useMemo(() => {
        if (!fullName) return "Пользователь";
        const parts = fullName.trim().split(" ");
        return parts[1] || parts[0] || "Пользователь";
    }, [fullName]);

    const formatDate = (value?: string | null) => {
        if (!value) return "—";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getFileUrl = (path?: string | null) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return process.env.REACT_APP_API_URL + path;
    };

    const profileFields = [
        {
            icon: <FiUser size={18} />,
            label: "ФИО",
            value: user?.name || "—",
        },
        {
            icon: <FiShield size={18} />,
            label: "Логин",
            value: user?.login || "—",
        },
        {
            icon: <FiMail size={18} />,
            label: "Email",
            value: user?.email || "—",
        },
        {
            icon: <FiPhone size={18} />,
            label: "Телефон",
            value: user?.number || "—",
        },
        {
            icon: <FiBriefcase size={18} />,
            label: "Организация",
            value: user?.organization || "—",
        },
        {
            icon: <FiCreditCard size={18} />,
            label: "ИНН",
            value: user?.inn || "—",
        },
        {
            icon: <FiMapPin size={18} />,
            label: "Документы об образовании",
            value: user?.diplom ? 'Заберет сам' : "Направить по адресу " + user?.address || "—",
        },

    ];

    const mainDocs = [
        {
            title: "Паспорт",
            text: user?.passport,
        },
        {
            title: "Документ об образовании",
            text: user?.education_document,
        },
        {
            title: "СНИЛС",
            text: user?.snils,
        },
    ];

    return (
        <UserContainer loading={loading}>
            <LoadingAlert show={alertLoading} text="Загружаем фото профиля..." />

            <div className="space-y-8">
                {/* Back */}
                <Link
                    to={USER_ROUTE}
                    className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
                >
                    <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                        <FiArrowLeft size={20} />
                    </div>
                    <span className="text-lg font-medium">Назад</span>
                </Link>

                {/* Header */}
                <div className="relative rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-gray-100 shadow-md overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-8 p-8 lg:p-10">
                        {/* Avatar */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative">
                                <input
                                    id="profile-avatar-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfileImgChange}
                                />

                                <label
                                    htmlFor="profile-avatar-input"
                                    className="relative block w-[150px] h-[150px] rounded-full overflow-hidden bg-gray-200 cursor-pointer group shadow-md"
                                >
                                    <img
                                        src={imgSrc}
                                        alt="Фото профиля"
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-center text-gray-800 text-sm font-medium">
                                        Изменить <br /> фото
                                    </div>
                                </label>
                            </div>

                            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                                <FiImage size={16} />
                                Нажмите на фото, чтобы изменить
                            </div>
                        </div>

                        {/* Main info */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm uppercase tracking-wide text-blue-600 font-semibold">
                                        Личный кабинет
                                    </div>
                                    <h1 className="text-3xl text-left font-bold text-[#2C3E50] mt-2">
                                        {firstName}, это ваш профиль
                                    </h1>
                                </div>

                                <p className="text-gray-600 text-lg max-w-2xl">
                                    Здесь собраны ваши основные данные, документы и программы обучения.
                                </p>

                                <div className="flex flex-wrap gap-3 pt-2">


                                    {user?.createdAt && (
                                        <div className="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 text-sm text-gray-700">
                                            Зарегистрирован:{" "}
                                            <span className="font-semibold">{formatDate(user.createdAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-40" />
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
                    {/* Personal data */}
                    <div className="rounded-3xl bg-white border border-gray-100 shadow-md p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FiUser size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#2C3E50]">Основные данные</h2>
                                <p className="text-gray-500 text-sm">Информация о вашем профиле</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileFields.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4"
                                >
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <span className="text-blue-600">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </div>
                                    <div className="text-[15px] font-medium text-gray-800 break-words">
                                        {item.value || "—"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="rounded-3xl bg-white border border-gray-100 shadow-md p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <FiFileText size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#2C3E50] text-left">Документы</h2>
                                <p className="text-gray-500 text-sm">Загруженные личные документы</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {mainDocs.map((doc) => {

                                return (
                                    <div
                                        key={doc.title}
                                        className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 flex items-center justify-between gap-4"
                                    >
                                        <div>
                                            <div className="text-sm text-gray-500">{doc.title}</div>
                                            <div className="text-base font-medium text-gray-800">
                                                {doc.text ? doc.text : "Не загружен"}
                                            </div>
                                        </div>


                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6">
                            <div className="text-lg font-semibold text-gray-800 mb-3">
                                Документы - Вложения
                            </div>

                            {documents.length > 0 ? (
                                <div className="space-y-3">
                                    {documents.map((doc: any) => {
                                        const url = process.env.REACT_APP_API_URL + doc.file_path

                                        return (
                                            <a
                                                key={doc.id}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition p-4"
                                            >
                                                <div className="min-w-0">
                                                    <div className="text-sm text-gray-500">
                                                        Документ #{doc.id}
                                                    </div>
                                                    <div className="text-base font-medium text-gray-800 truncate">
                                                        {doc.originalName || doc.name || "Файл"}
                                                    </div>
                                                </div>

                                                <div className="text-blue-600 shrink-0">
                                                    <FiDownload size={18} />
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-gray-500">
                                    Дополнительные документы пока не загружены
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </UserContainer>
    );
});

export default ProfilePage;