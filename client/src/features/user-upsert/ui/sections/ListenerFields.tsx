import React from 'react';
import RHFCheckbox from '../../../../shared/ui/form/RHFCheckbox';
import RHFTextInput from '../../../../shared/ui/form/RHFTextInput';
import RHFTextarea from '../../../../shared/ui/form/RHFTextarea';

const ListenerFields: React.FC = () => {
    return (
        <>
            <RHFTextInput
                name="organization"
                label="Организация"
                placeholder="Введите организацию"
            />

            <RHFTextInput
                name="inn"
                label="ИНН"
                placeholder="Введите ИНН"
            />

            <RHFTextInput
                name="address"
                label="Адрес"
                placeholder="Введите адрес"
            />

            <RHFCheckbox
                name="diplom"
                label="Нужен диплом"
            />

            <RHFTextInput
                name="passport"
                label="Паспорт"
                placeholder="Введите паспортные данные"
            />

            <RHFTextInput
                name="education_document"
                label="Док. об обр."
                placeholder="Введите данные документа об образовании"
            />

            <RHFTextInput
                name="snils"
                label="СНИЛС"
                placeholder="Введите СНИЛС"
            />
        </>
    );
};

export default ListenerFields;