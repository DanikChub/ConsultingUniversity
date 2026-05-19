import React from "react";

const ListenerCertificatesTab: React.FC = () => {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <h2 className="text-left text-lg font-semibold text-gray-800">
                Дипломы
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Здесь будет обработка выпусков: создание диплома, уточнение адреса, отправка, трек-номер и отметка о доставке.
            </p>

            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-400">
                Пока у слушателя нет дипломов для обработки.
            </div>
        </div>
    );
};

export default ListenerCertificatesTab;