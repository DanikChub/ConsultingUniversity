const UserPasswordInput = ({ password, setPassword, validate, params }: any) => (
    <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
        <label htmlFor="password" className="text-right">Пароль</label>
        <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            id="password"
            type="text"
            className={`add_input ${validate && !params.id && !password ? 'red' : ''}`}
            placeholder={
                params.id
                    ? 'Чтобы не менять пароль, оставьте поле пустым'
                    : 'Введите пароль пользователя'
            }
        />
    </div>
);

export default UserPasswordInput;
