import React from 'react';

type SubmitSectionProps = {
    submitLabel: string;
    loading?: boolean;
    serverError?: string;
};

const SubmitSection: React.FC<SubmitSectionProps> = ({
                                                         submitLabel,
                                                         loading = false,
                                                         serverError,
                                                     }) => {
    return (
        <div className="p-[25px]">
            {serverError ? (
                <div className="login_form_message mb-4">{serverError}</div>
            ) : null}

            <button
                type="submit"
                disabled={loading}
                className="login_form_button"
            >
                {loading ? 'Сохранение...' : submitLabel}
            </button>
        </div>
    );
};

export default SubmitSection;