import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContainer from '../../components/ui/AppContainer';
import { setInitialPassword, getUserById } from '../../entities/user/api/user.api';
import { getEnrollmentByProgram } from '../../entities/enrollment/api/enrollment.api';
import { Context } from '../../index';
import { ADMIN_ROUTE, USER_ROUTE } from '../../shared/utils/consts';
import UserContainer from "../../components/ui/UserContainer";

const SetInitialPasswordPage: React.FC = () => {
    const { user } = useContext(Context);

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setMessage('');

            if (!password.trim()) {
                setMessage('Введите новый пароль');
                return;
            }

            if (password.length < 6) {
                setMessage('Пароль должен быть не короче 6 символов');
                return;
            }

            if (password !== repeatPassword) {
                setMessage('Пароли не совпадают');
                return;
            }

            setLoading(true);

            const data = await setInitialPassword(password);

            const userId = data?.user?.id ?? user.user?.id;
            if (!userId) {
                throw new Error('User id not found after password update');
            }

            const userData = await getUserById(userId);

            user.setUser(userData);
            user.setIsAuth(true);

            if (userData.programs?.length > 0) {
                const programId = userData.programs[0].id;
                const enrollment = await getEnrollmentByProgram(programId, userData.id);

                if (enrollment) {
                    user.setEnrollmentId(enrollment.id);
                }
            }

            if (userData.role === 'USER') {
                navigate(USER_ROUTE);
            } else if (userData.role === 'ADMIN' || userData.role === 'VIEWER') {
                navigate(ADMIN_ROUTE);
            }
        } catch (e: any) {
            setMessage(e?.response?.data?.message || 'Ошибка установки нового пароля');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="mx-auto mt-[150px] mb-[150px] w-[400px] h-max rounded-[10px] bg-white p-[20px] shadow-[2px_2px_10px_2px_rgba(0,0,0,0.181)]">
            <h3>Задайте новый пароль</h3>

            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-[40px] w-full border-b border-[rgb(173,173,173)] p-[10px] text-[16px] outline-none"
                placeholder="Введите новый пароль"
            />

            <input
                id="repeatPassword"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="mt-[20px] w-full border-b border-[rgb(173,173,173)] p-[10px] text-[16px] outline-none"
                placeholder="Повторите новый пароль"
            />

            <div className="mt-[20px] text-[rgb(251,68,68)]">
                {message}
            </div>

            <div
                onClick={handleSubmit}
                className={`mx-auto mt-[40px] rounded-[4px] px-[24px] py-[12px] text-center text-white transition-all duration-200 ${
                    loading
                        ? 'cursor-not-allowed bg-[#7aa7c4]'
                        : 'cursor-pointer bg-[#2980B9] hover:bg-black'
                }`}
            >
                {loading ? 'Сохранение...' : 'Сохранить пароль'}
            </div>
        </div>
    );
};

export default SetInitialPasswordPage;