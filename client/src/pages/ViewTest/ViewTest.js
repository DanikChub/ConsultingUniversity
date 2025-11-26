import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CountDown from '../../components/CountDown/CountDown';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import { getOneTest } from '../../http/testAPI';
import { FINISH_TEST_ROUTE } from '../../utils/consts';

function compareArray(arr_1, j) {
    arr_1.forEach(el => {
        if (el == j) return true;
    })
    return false;
}

function shuffle(array) {
    const new_arr = array;
    new_arr.sort(() => Math.random() - 0.5);
    return new_arr
}

const ViewTest = () => {
    const [test, setTest] = useState({title: null, puncts: []});
    const params = useParams();
    const [numberQuestion, setNumberQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([[-1]]);
    const [checkAnswers, setCheckAnswers] = useState();

    const [secForEnd, setSecForEnd] = useState(null);

    
    const navigate = useNavigate();

    useEffect(() => {
  
        getOneTest(params.id).then(data => {
            
            data.puncts = shuffle(data.puncts);
            setTest(data);
            
            setSecForEnd(data.time_limit)
            

        });
        
    }, [])

    const testHadlerClick = (i) => {
        setNumberQuestion(i);
    }

    const newUserAnswer = (i, j) => {
        const prevArr = [...userAnswers];
        if (i >= userAnswers.length) {
            prevArr.push([j])
        } else {
            prevArr[i] = [j];
        }

        setUserAnswers(prevArr);
      
    }

    const newSeveralUserAnswers= (i, j, checked) => {
        let prevArr = [...userAnswers];
        if (checked) {
            if (i >= userAnswers.length) {
                prevArr.push([j])
            } else {
                prevArr[i].push(j);
            }
        } else {
            prevArr[i] = prevArr[i].filter(el => el != j);
        }
        
  
        setUserAnswers(prevArr);
    }

    

    const checkAllAnswers = () => {
        let new_arr = [];
        let correct_answers = 0;

        test.puncts.forEach(el => new_arr.push(el.correct_answer));

    
        userAnswers.forEach((userAnswer, i) => {
            let s = true;
            userAnswer.forEach((el, j) => {
                if (el != new_arr[i][j]) {
                    s *= false
                    
                } 
            })
            if (s) {
                correct_answers+=1;
            }
            
            
        })
        
        
  
        
        
    }

    
    return (
        <div className="content">
            <div className='container'>

            
                <div className='admin_inner'>
                    <LeftMenu  />
                    <div className="admin_container">
                        <div className="back_button">
                            <a onClick={() => navigate(-1)}>
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="30" cy="30" r="30" fill="#DCDCDC"/>
                                    <path d="M15.2954 29.2433C14.9036 29.6325 14.9015 30.2657 15.2907 30.6575L21.6331 37.0429C22.0223 37.4348 22.6555 37.4369 23.0473 37.0477C23.4392 36.6585 23.4413 36.0253 23.0521 35.6335L17.4144 29.9576L23.0903 24.3198C23.4821 23.9306 23.4842 23.2975 23.095 22.9056C22.7058 22.5138 22.0727 22.5117 21.6808 22.9009L15.2954 29.2433ZM44.0034 29.0472L16.0035 28.9528L15.9968 30.9528L43.9966 31.0472L44.0034 29.0472Z" fill="#898989"/>
                                </svg>
                            </a>
                            
                            <span>Назад</span>
                        </div>
                        <div className="title">
                            <b>Тест.</b><span> {test.title}</span>
                        </div>
                        {secForEnd && <CountDown seconds={secForEnd}/>}
                    

                        <div className="test_puncts">
                    
                            {
                                test.puncts.map((punct, i) => 
                                <div onClick={() => testHadlerClick(i)} className={userAnswers[i]+1 ? 'test_punct active' : 'test_punct'}>{i+1}</div>
                                )
                            }
                        </div>
                        {test.puncts.map((punct, i) => 
                            <div>

                                {numberQuestion == i? 
                                <div>
                                    <div className="test_question">{i+1}. {punct.question}</div>
                                    
                                    <div className="test_clue">{punct.several_answers ? "Много вариантов ответа" : "Один верный вариант"}</div>
                                    <div className="answer_options">
                                        { punct.several_answers ?  
                                            punct.answers.map((answer, j) => 
                                        
                                            <div className="answer_option">
                                                <input onChange={(e) => newSeveralUserAnswers(i, j, e.target.checked)} checked={userAnswers[i] ? userAnswers[i].indexOf(j)+1 ? true : false : false} type="checkbox" id={"answer_" + j} name="1"/>
                                                <label htmlFor={"answer_" + j} className="answer_option_text">{answer}</label>
                                            </div>)
                            
                                            :
                                            punct.answers.map((answer, j) => 
                                                                    
                                            <div className="answer_option">
                                                <input onChange={() => newUserAnswer(i, j)} checked={userAnswers[i] == j ? true : false} type="radio" id={"answer_" + j} name="1"/>
                                                <label htmlFor={"answer_" + j} className="answer_option_text">{answer}</label>
                                            </div>)   
                                        }
                                        
                                    </div>
                                </div>
                                : ""}
                                
                            </div>
                        
                        )}
                        <div className='test_button_container'>
                            {test.puncts.length-1 == numberQuestion &&
                                <div onClick={() => setNumberQuestion(prev => prev-1)} className='admin_button'>Предыдущий вопрос</div>
                            }
                            <div onClick={() => checkAllAnswers()} className='admin_button'>Сохранить</div>
                            {test.puncts.length-1 > numberQuestion &&
                                <div onClick={() => setNumberQuestion(prev => prev+1)} className='admin_button'>Следующий вопрос</div>
                            }
                            
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTest;