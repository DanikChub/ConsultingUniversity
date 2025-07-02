import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import './RegistrateUser.css'

import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getAllPrograms, getOneProgram } from '../../http/programAPI';
import { getUserById, registrateAdmin, registrateUser, remakeAdmin, remakeUser } from '../../http/userAPI';
import { ADMIN_ADMINISTRATORS_ROUTE, ADMIN_LISTENERS_ROUTE } from '../../utils/consts';

const RegistrateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [org, setOrg] = useState('');
    const [inn, setInn] = useState('');
    const [phone, setPhone] = useState('');
    const [program, setProgram] = useState('');
    const [userProgramId, setUserProgramId] = useState([]);

    const [diplom, setDiplom] = useState(false);
    const [address, setAddress] = useState('');

    const [datalistActive, setDatalistActive] = useState('');

    const params = useParams();
    const [queryParams] = useSearchParams();

    const navigate = useNavigate();

    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [validate, setValidate] = useState(false);
    const [serverMessage, setServerMessage] = useState('');
    

    useEffect(() => {
        if (params.id) {
            getUserById(params.id).then(user => {
                setName(user.name)
                setEmail(user.email)
              
                setInn(user.inn)
                setOrg(user.organiztion)
                setPhone(user.number)
                setDiplom(user.diplom)
                setAddress(user.address)
                if (!queryParams.get('admin')) {
                    getOneProgram(user.programs_id[0]).then(data => setSelectedPrograms([data]))
                }
                
                setUserProgramId(user.programs_id)
            })
        } 
        setName(queryParams.get('name'));
        setEmail(queryParams.get('email'));
        setPhone(queryParams.get('number'));
        
        getAllPrograms().then(data => {
            setPrograms(data)
            setFilteredPrograms(data);
        })
        
    }, [])

    const handleClickInput = () => {
        setDatalistActive('active');
    }
    const handleClickBody =() => {
        if (datalistActive) {
            setDatalistActive('');
        }
        
    }

    const handleChangeOption = (value) => {

        if (value.length > 0) {
            setDatalistActive('active');
        } else {
            setDatalistActive('');
        }
        
        setProgram(value);

        let programs_prev_arr = programs.filter(program => program.title.toLowerCase().includes(value.toLowerCase()))
        programs_prev_arr.forEach(program => {
            program['yellow_value'] = value;

        })
        setFilteredPrograms(programs_prev_arr)


      
        

        
       
    }

    const handleClickOption = (program) => {
        
        setSelectedPrograms([program])
        setDatalistActive('');
        setUserProgramId([program.id]);
    }

    const [addressClass, setAddressClass] = useState(false)

    const handleDiplomCheck = (value) => {
  
        setDiplom(value);
        if (value) {
            setAddress('')
        }
    }

    const createUser = () => {
        
        
            if (params.id) {
                if (queryParams.get('admin')) {
                    if (name && email && phone) {
                        remakeAdmin(params.id, email, password, name, phone)
                        .then(data => navigate(ADMIN_ADMINISTRATORS_ROUTE))
                        .catch(e => setServerMessage(e.response.data.message))
                    } else {
                        setValidate(true);
                    }
                } else {
                    if (name && email && phone && userProgramId[0]) {
                        remakeUser(params.id, email, password, "USER", name, phone, org, userProgramId, diplom, inn, address)
                        .then(data => navigate(ADMIN_LISTENERS_ROUTE))
                        .catch(e => setServerMessage(e.response.data.message))
                    } else {
                        setValidate(true);
                    }
                }
                

            } else {
                if (queryParams.get('admin')) {
                    if (name && email && phone && password) {
                        registrateAdmin(email, password, "ADMIN", name, phone)
                        .then(data => navigate(ADMIN_ADMINISTRATORS_ROUTE))
                        .catch(e => setServerMessage(e.response.data.message))
                    } else {
                        setValidate(true);
                    }
                } else {
                    if (name && email && phone && password && userProgramId[0]) {
                        registrateUser(email, password, "USER", name, phone, org, userProgramId, diplom, inn, address)
                        .then(data => navigate(ADMIN_LISTENERS_ROUTE))
                        .catch(e => setServerMessage(e.response.data.message))
                    } else {
                        setValidate(true);
                    }
                }
                
    
            }
       

    }

    const deleteSelectedProgram = () => {
        setSelectedPrograms([])
    }

    return (
        
        <div onClick={() => handleClickBody()} className="content">
        <div className="container">
            {
                queryParams.get('admin') ?
                <div className="admin_inner">
                <LeftMenu active_arr={['', '', '', '', '', '', 'active', '',]}/>
                <div className="admin_container">
                    <div className="admin_path">Главная / Администраторы / <b>{params.id?'Изменить администратора':'Новый администратор'}</b></div>
                    
                    <div className="add_input_items">
                        <div className="add_input_item">
                            <label htmlFor="name" className="add_input_label">ФИО </label>
                            <input onChange={(e) => setName(e.target.value)} value={name} id="name" type="text" className={`add_input ${validate?' red':''}`} placeholder="Введите ФИО администратора"/>
                        </div>
                        <div className="add_input_item">
                            <label htmlFor="email" className="add_input_label">e-mail </label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="text" className={`add_input ${validate?' red':''}`} placeholder="Введите e-mail администратора"/>
                        </div>
                        <div className="add_input_item">
                            <label htmlFor="password" className="add_input_label">Пароль</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} id="password" type="text" className={`add_input ${validate && !Boolean(params.id)?' red':''}`} placeholder={params.id ? 'Чтобы не менять пароль не трогайте это поле!' : "Введите пароль администратора"}/>
                        </div>
                        
                        
                        <div className="add_input_item">
                            <label htmlFor="phone" className="add_input_label">Телефон</label>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} id="phone" type="text" className={`add_input ${validate?' red':''}`} placeholder="Введите телефон администратора"/>
                        </div>
                       

                    </div>
                    <div className='login_form_message'>{serverMessage}</div>
                    <div className="add_input_button_container">
                        
                        <div onClick={() => navigate(-1)} className="add_input_button back admin_button">Отменить</div>
                        <div onClick={() => createUser()} className="add_input_button admin_button">{params.id?'Сохранить изменения':'Создать администратора'}</div>
                    </div>
                  
                    
                </div>
                
                </div>      
                :
                <div className="admin_inner">
                    <LeftMenu active_arr={['', 'active', '', '', '', '', '', '',]}/>
                    <div className="admin_container">
                        <div className="admin_path">Главная / Слушатели / <b>{params.id?'Изменить слушателя':'Новый слушатель'}</b></div>
                        
                        <div className="add_input_items">
                            <div className="add_input_item">
                                <label htmlFor="name" className="add_input_label">ФИО </label>
                                <input onChange={(e) => setName(e.target.value)} value={name} id="name" type="text" className={`add_input ${validate?' red':''}`} placeholder="Введите ФИО пользователя"/>
                            </div>
                            <div className="add_input_item">
                                <label htmlFor="email" className="add_input_label">e-mail </label>
                                <input onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="text" className={`add_input ${validate?' red':''}`} placeholder="Введите e-mail пользователя"/>
                            </div>
                            <div className="add_input_item">
                                <label htmlFor="password" className="add_input_label">Пароль</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} id="password" type="text" className={`add_input ${validate && !Boolean(params.id)?' red':''}`} placeholder={params.id ? 'Чтобы не менять пароль не трогайте это поле!' : "Введите пароль пользователя"}/>
                            </div>
                            
                            <div className="add_input_item">
                                <label htmlFor="org" className="add_input_label">Организация</label>
                                <input onChange={(e) => setOrg(e.target.value)} value={org} id="org" type="text" className="add_input" placeholder="Введите наименование организации"/>
                                <label htmlFor="inn" className="add_input_label">ИНН</label>
                                <input onChange={(e) => setInn(e.target.value)} value={inn} id="inn" type="text" className="add_input" placeholder="Введите ИНН организации"/>
                            </div>
                            
                            <div className="add_input_item">
                                <label htmlFor="phone" className="add_input_label">Телефон</label>
                                <input onChange={(e) => setPhone(e.target.value)} value={phone} id="phone" type="text" className={`add_input ${validate?' red':''}`} placeholder="Введите телефон пользователя"/>
                            </div>
                            <div className="add_input_item relative">
                                <label htmlFor="program" className="add_input_label">Программа</label>
                                
                                
                                {selectedPrograms.length == 0 ? <input list='programs' onClick={(e) => handleClickInput()} onChange={(e) => handleChangeOption(e.target.value)} value={program} id="program" type="text" className="add_input" placeholder="Введите наименование программы обучения"/> 
                                : selectedPrograms.map(program => 
                                        <div className="selected_program">
                                            <span>{program.title}</span>
                                            <button onClick={() => deleteSelectedProgram()} class="selected_program_delete">x</button>
                                        </div>
                                    )}
                                
                                <div className={"datalist " + datalistActive} id="programs">
                                    {filteredPrograms.map(program => 
                                        <div onClick={() => handleClickOption(program)} className="datalist_item" dangerouslySetInnerHTML={{__html: program.title.replace(program.yellow_value, "<b class=\"background-yellow\">"+program.yellow_value+"</b>")}}/>
                                    )}
                                    
                                </div>
                            </div>

                            
                            
                            <div className="add_input_item">
                                <div className='add_input_item_left'>
                                <div className="add_input_label">Диплом</div>
                                    <div class="add_input_item_flex">
                                        <label className="checkbox_label" htmlFor="diploma">Заберет сам</label>
                                        <input id="diploma" onChange={(e) => handleDiplomCheck(e.target.checked)} checked={diplom} type="checkbox" className="add_checkbox" value="заберет сам"/>
                                        
                                    </div>
                                </div>
                                
                                <div className='add_input_item_right'>
                                    <label htmlFor="address" className="add_input_label" style={{minWidth: 'max-content'}}>Отправить почтой России по адресу:</label>
                                    <input onChange={(e) => setAddress(diplom?'': e.target.value)} style={{width: "100%"}} value={address} id="address" type="text"  placeholder="Введите адрес"/>
                                </div>
                                
                            </div>
                            
                        </div>
                        <div className='login_form_message'>{serverMessage}</div>
                        <div className="add_input_button_container">
                            
                            <div onClick={() => navigate(-1)} className="add_input_button back admin_button">Отменить</div>
                            <div onClick={() => createUser()} className="add_input_button admin_button">{params.id?'Сохранить изменения':'Создать пользователя'}</div>
                        </div>
                    
                        
                    </div>
                    
                </div>
            }
        </div>
    </div>
    );
};

export default RegistrateUser;