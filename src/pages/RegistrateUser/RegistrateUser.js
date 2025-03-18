import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getAllPrograms, getOneProgram } from '../../http/programAPI';
import { getUserById, registrateUser, remakeUser } from '../../http/userAPI';
import { ADMIN_LISTENERS_ROUTE } from '../../utils/consts';

const RegistrateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [org, setOrg] = useState('');
    const [phone, setPhone] = useState('');
    const [program, setProgram] = useState('');
    const [userProgramId, setUserProgramId] = useState([]);

    const params = useParams();

    const navigate = useNavigate();

    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        if (params.id) {
            getUserById(params.id).then(user => {
                setName(user.name)
                setEmail(user.email)
              
                console.log(user);
                setOrg(user.organiztion)
                setPhone(user.number)

                getOneProgram(user.programs_id[0]).then(data => setProgram(data.title))
                setUserProgramId(user.programs_id)
            })
        } 
        getAllPrograms().then(data => {
            setPrograms(data)
            
        })
        
    }, [])

    const handleChangeOption = (value) => {
        setProgram(value);
        

        let id_c = programs.filter(program => program.title == value)[0];

        let arr = [...userProgramId]


        if (id_c) {
            arr = [id_c.id]
        }
        console.log(arr);
        setUserProgramId(arr);
       
    }

    const createUser = () => {
     
        if (params.id) {
            remakeUser(params.id, email, password, "USER", name, phone, org, userProgramId, true).then(data => navigate(ADMIN_LISTENERS_ROUTE))
        } else {
            registrateUser(email, password, "USER", name, phone, org, userProgramId, true).then(data => navigate(ADMIN_LISTENERS_ROUTE))
        }
        


    }

    return (
        <div className="content">
        <div className="container">
            <div className="admin_inner">
                <LeftMenu/>
                <div className="admin_container">
                    <div className="admin_path">Главная / Слушатели / <b>{params.id?'Изменить слушателя':'Новый слушатель'}</b></div>
                    
                    <div className="add_input_items">
                        <div className="add_input_item">
                            <label htmlFor="name" className="add_input_label">ФИО</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} id="name" type="text" className="add_input" placeholder="Введите ФИО пользователя"/>
                        </div>
                        <div className="add_input_item">
                            <label htmlFor="email" className="add_input_label">e-mail</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="text" className="add_input" placeholder="Введите e-mail пользователя"/>
                        </div>
                        <div className="add_input_item">
                            <label htmlFor="password" className="add_input_label">Пароль</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} id="password" type="text" className="add_input" placeholder={params.id ? 'Чтобы не менять пароль не трогайте это поле!' : "Введите пароль пользователя"}/>
                        </div>
                        
                        <div className="add_input_item">
                            <label htmlFor="org" className="add_input_label">Организация</label>
                            <input onChange={(e) => setOrg(e.target.value)} value={org} id="org" type="text" className="add_input" placeholder="Введите наименование организации"/>
                        </div>
                        
                        <div className="add_input_item">
                            <label htmlFor="phone" className="add_input_label">Телефон</label>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} id="phone" type="text" className="add_input" placeholder="Введите телефон пользователя"/>
                        </div>
                        <div className="add_input_item">
                            <label htmlFor="program" className="add_input_label">Программа</label>
                            <input list='programs' onChange={(e) => handleChangeOption(e.target.value)} value={program} id="program" type="text" className="add_input" placeholder="Введите наименование программы обучения"/>
                            <datalist id="programs">
                                {programs.map(program => 
                                    <option value={program.title} />
                                )}
                                
                            </datalist>
                        </div>
                        
                        <div className="add_input_item">
                            <label htmlFor="diploma" className="add_input_label">Диплом</label>
                            <input id="diploma" type="text" className="add_input" placeholder="Заберет сам"/>
                        </div>
                    </div>
                    <div className="add_input_button_container">
                        <div  className="add_input_button back admin_button">Отменить</div>
                        <div onClick={() => createUser()} className="add_input_button admin_button">{params.id?'Сохранить изменения':'Создать пользователя'}</div>
                    </div>
                
                    
                </div>
                
            </div>
        </div>
    </div>
    );
};

export default RegistrateUser;