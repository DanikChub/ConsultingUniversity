import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeftMenu from '../../../components/LeftMenu/LeftMenu';
import AppContainer from '../../../components/ui/AppContainer';
import { deleteEvents, getAllEvents } from '../../../entities/event/api/event.api';
import { getAllPrograms } from '../../../entities/program/api/program.api';
import { getStatistic } from '../../../entities/statistic/api/statistic.api';
import { getAllUsers } from '../../../entities/user/api/user.api';
import { ADMIN_LISTENERS_ROUTE, ADMIN_PROGRAMS_ROUTE } from '../../../shared/utils/consts';
import './AdminPage.css';


function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
}

const AdminPage = () => {

   const [events, setEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [accordeonIndex, setAccordeonIndex] = useState(0)
   const [selected, setSelected] = useState([])

    useEffect(() => {
        setLoading(true)
        getAllEvents()
        .then(data => {
            let prevCreatedAt = null;
            let new_arr = [];
            let arrIndex = -1;
            data.forEach((event, i) => {
                console.log(prevCreatedAt == dateToString(event.createdAt))
                if (prevCreatedAt == dateToString(event.createdAt)) {
                    new_arr[arrIndex].array_of_events.push(event);
                    
                } else {
                    arrIndex++;
                    new_arr.push({date: dateToString(event.createdAt), array_of_events: []})
                    new_arr[arrIndex].array_of_events.push(event);
                    
                }
                

                
                prevCreatedAt = dateToString(event.createdAt);
            })
            setEvents(new_arr)
            console.log(new_arr.array_of_events)
            setLoading(false)
        })
    }, [])
   
      
        
    const handleDateClick = (i) => {
        if (accordeonIndex == i) {
            setAccordeonIndex(-1)
        } else {
            setAccordeonIndex(i)
        }
        
    } 
        
        
    const handleSelect = (id) => {
        if (selected.indexOf(id) == -1) {
          
            let prev = selected;
            prev.push(id)
            setSelected(prev)
          
        } else {
          
            let prev = selected;
            prev = prev.filter(el => el != id)
            setSelected(prev)
          
        }
        
    }

    const handleDelete = () => {
        const formData = new FormData()
        formData.append('ids', selected)
        deleteEvents(formData)

        setLoading(true)
        getAllEvents()
        .then(data => {
            let prevCreatedAt = null;
            let new_arr = [];
            let arrIndex = -1;
            data.forEach((event, i) => {
                console.log(prevCreatedAt == dateToString(event.createdAt))
                if (prevCreatedAt == dateToString(event.createdAt)) {
                    new_arr[arrIndex].array_of_events.push(event);
                    
                } else {
                    arrIndex++;
                    new_arr.push({date: dateToString(event.createdAt), array_of_events: []})
                    new_arr[arrIndex].array_of_events.push(event);
                    
                }
                

                
                prevCreatedAt = dateToString(event.createdAt);
            })
            setEvents(new_arr)
            console.log(new_arr.array_of_events)
            setLoading(false)
        })
    }

    const handleSelectAll = () => {
      
    }
      
    return (
        <AppContainer>
            
            <div className='AdminPageTitle'>Последние события:</div>
            
            <div className='flex start'>
                <div onClick={() => handleSelectAll()} className='admin_button mr-2' style={{display: 'flex', alignItems: 'center'}}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7.5" cy="7.5" r="7" stroke="#828282"/>
                        <path d="M11 6L7.49997 11L4 6" stroke="#898989" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    <span style={{marginLeft: '10px'}}>Выбрать все</span>
                </div>
                <div onClick={() => handleDelete()} className='admin_button red' style={{display: 'flex', alignItems: 'center'}}>
                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.09091 5.9375V11.5625C5.09091 11.6536 5.06108 11.7285 5.00142 11.7871C4.94176 11.8457 4.86553 11.875 4.77273 11.875H4.13636C4.04356 11.875 3.96733 11.8457 3.90767 11.7871C3.84801 11.7285 3.81818 11.6536 3.81818 11.5625V5.9375C3.81818 5.84635 3.84801 5.77148 3.90767 5.71289C3.96733 5.6543 4.04356 5.625 4.13636 5.625H4.77273C4.86553 5.625 4.94176 5.6543 5.00142 5.71289C5.06108 5.77148 5.09091 5.84635 5.09091 5.9375ZM7.63636 5.9375V11.5625C7.63636 11.6536 7.60653 11.7285 7.54688 11.7871C7.48722 11.8457 7.41098 11.875 7.31818 11.875H6.68182C6.58902 11.875 6.51278 11.8457 6.45312 11.7871C6.39347 11.7285 6.36364 11.6536 6.36364 11.5625V5.9375C6.36364 5.84635 6.39347 5.77148 6.45312 5.71289C6.51278 5.6543 6.58902 5.625 6.68182 5.625H7.31818C7.41098 5.625 7.48722 5.6543 7.54688 5.71289C7.60653 5.77148 7.63636 5.84635 7.63636 5.9375ZM10.1818 5.9375V11.5625C10.1818 11.6536 10.152 11.7285 10.0923 11.7871C10.0327 11.8457 9.95644 11.875 9.86364 11.875H9.22727C9.13447 11.875 9.05824 11.8457 8.99858 11.7871C8.93892 11.7285 8.90909 11.6536 8.90909 11.5625V5.9375C8.90909 5.84635 8.93892 5.77148 8.99858 5.71289C9.05824 5.6543 9.13447 5.625 9.22727 5.625H9.86364C9.95644 5.625 10.0327 5.6543 10.0923 5.71289C10.152 5.77148 10.1818 5.84635 10.1818 5.9375ZM11.4545 13.0078V3.75H2.54545V13.0078C2.54545 13.151 2.56866 13.2829 2.61506 13.4033C2.66146 13.5238 2.70952 13.6117 2.75923 13.667C2.80895 13.7223 2.84375 13.75 2.86364 13.75H11.1364C11.1562 13.75 11.1911 13.7223 11.2408 13.667C11.2905 13.6117 11.3385 13.5238 11.3849 13.4033C11.4313 13.2829 11.4545 13.151 11.4545 13.0078ZM4.77273 2.5H9.22727L8.75 1.35742C8.7036 1.29883 8.64725 1.26302 8.58097 1.25H5.42898C5.36269 1.26302 5.30634 1.29883 5.25994 1.35742L4.77273 2.5ZM14 2.8125V3.4375C14 3.52865 13.9702 3.60352 13.9105 3.66211C13.8509 3.7207 13.7746 3.75 13.6818 3.75H12.7273V13.0078C12.7273 13.5482 12.5715 14.0153 12.2599 14.4092C11.9484 14.8031 11.5739 15 11.1364 15H2.86364C2.42614 15 2.05161 14.8096 1.74006 14.4287C1.4285 14.0479 1.27273 13.5872 1.27273 13.0469V3.75H0.318182C0.225379 3.75 0.149148 3.7207 0.0894886 3.66211C0.0298295 3.60352 0 3.52865 0 3.4375V2.8125C0 2.72135 0.0298295 2.64648 0.0894886 2.58789C0.149148 2.5293 0.225379 2.5 0.318182 2.5H3.39062L4.08665 0.869141C4.18608 0.628255 4.36506 0.423177 4.62358 0.253906C4.8821 0.0846357 5.14394 0 5.40909 0H8.59091C8.85606 0 9.1179 0.0846357 9.37642 0.253906C9.63494 0.423177 9.81392 0.628255 9.91335 0.869141L10.6094 2.5H13.6818C13.7746 2.5 13.8509 2.5293 13.9105 2.58789C13.9702 2.64648 14 2.72135 14 2.8125Z" fill="#ECF0F1"/>
                    </svg>

                    <span style={{marginLeft: '10px'}}>Удалить</span>
                </div>
             </div>
            <div>
                {events.map((event, i) => 
                    <div>
                        <div onClick={() => handleDateClick(i)} className={`admin_events_date ${accordeonIndex==i?'open':''}`}>
                            <span>{event.date}</span>
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0.334046" y1="12.8756" x2="7.54015" y2="6.40974" stroke="#404040"/>
                                <path d="M0.602617 0.459377L7.49142 6.56756" stroke="#404040"/>
                            </svg>

                        </div>
                        <table className={`admin_events_table ${accordeonIndex==i?'open':''}`}>
                            
                            
                
                            <tbody>
                                {   
                                
                                    events[i].array_of_events.map((ev, j) => 
                                        
                                        <tr>
                                            <td><input onChange={() => handleSelect(ev.id)} selected={selected.indexOf(ev.id)!=-1} type="checkbox"/></td>
                                            <td>
                                                {ev.event_text}
                                            </td>
                                            <td>
                                                {ev.name}
                                            </td>
                                        
                                            <td>{ev.organization}</td>
                                            
                                            
                                        </tr>
                                        )
                                }
                                
                        
                            </tbody>
                            
                        </table>
                    </div>
                )}
            </div>
                
                    
          
        </AppContainer> 
    );
};

export default AdminPage;