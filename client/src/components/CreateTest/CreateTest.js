import React, { useEffect, useState } from 'react';
import { createTest, getOneTest, remakeTest } from '../../http/testAPI';

import "./CreateTest.css"

const CreateTest = ({show, setShow, themesArray, setThemesArray, counter, setCounter}) => {
    const [testTitle, setTestTitle] = useState("");

    const [testPuncts, setTestPuncts] = useState([{
                                        id: 0,
                                        question: "",
                                        answers: [
                                            "",
                                            "",
                                            "",
                                        ],
                                        correct_answer: [],
                                        several_answers: false
                                    },
                                ])
    const [numberQuestion, setNumberQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [hourInput, setHourInput] = useState("");
    const [minInput, setMinInput] = useState("");
    const [secInput, setSecInput] = useState("");
    const [questionId, setQuestionId] = useState(0)
    
    useEffect(() => {
        if (show.remake) {
          
            getOneTest(show.remake).then(data => {
                setTestTitle(data.title)
                setTestPuncts(data.puncts.sort((a, b) => a.id-b.id))
             
                setHourInput(Math.floor(data.time_limit/(3600)))
                setMinInput(Math.floor((data.time_limit-hourInput*3600)/60))
                setSecInput(data.time_limit-hourInput*3600-minInput*60)
            })
        }
     
    }, [show.remake])

    const addNewQuestion = () => {
        const prevValue = [...testPuncts];
        setQuestionId(prev => prev+=1)
        let prev = questionId + 1
        prevValue.push({
            id: prev,
            question: "",
            answers: [
                "",
                "",
                "",
            ],
            correct_answer: [],
            several_answers: false
        },)

        setNumberQuestion(prevValue.length-1)

        setTestPuncts(prevValue);

    }

    const handlerAnswerInput = (i, j, value) => {
        const prevValue = [...testPuncts]

        prevValue[i].answers[j] = value;

        setTestPuncts(prevValue);
    
    }

    const handlerQuestionInput = (i, value) => {
        const prevValue = [...testPuncts]

        prevValue[i].question = value;

        setTestPuncts(prevValue);
      
    }

    const handleAnswerCheck = (i, j, checked) => {
        const prevValue = [...testPuncts]
        const prevUserAnswers = [...userAnswers]

        if (checked) {
            prevValue[i].correct_answer.push(j);
        } else {
            let newArr = prevValue[i].correct_answer.filter(el => el != j);

            prevValue[i].correct_answer = newArr;
            
        }
        prevValue[i].correct_answer.sort()
      
        if (prevValue[i].correct_answer.length > 1) {
            prevValue[i].several_answers = true;
        } else {
            prevValue[i].several_answers = false;
        }
        
        prevUserAnswers[i] = j;
     
   

        setTestPuncts(prevValue);
        setUserAnswers(prevUserAnswers);
        
   
    }

    const navHandlerClick = (i) => {
        setNumberQuestion(i);
    }

    const addAnswer = (i) => {
        const prevValue = [...testPuncts];

        prevValue[i].answers.push("")



        setTestPuncts(prevValue);
    }

    const deleteAnswer = (i, j) => {
        const prevValue = [...testPuncts];

        let newArr = [];

        prevValue[i].answers.forEach((answer, index) => {
            if (j != index) {
                newArr.push(answer)
            }
            
        })
        prevValue[i].answers = newArr;


        setTestPuncts(prevValue);
    }

    const removeButtonClick = () => {
        const prevValue = [...themesArray];
        prevValue[show.i].have_test = false;
        prevValue[show.i].puncts[show.j].test_title = null;
        prevValue[show.i].puncts[show.j].test_id = null;

        setThemesArray(prevValue);
        setUserAnswers([]);
        setShow({show: false, i: 0, j: 0})
        document.body.style.overflowY = "auto";
        setCounter(value => value-1);
        setTestTitle('');
                setTestPuncts([{
                        question: "",
                        answers: [
                            "",
                            "",
                            "",
                        ],
                        correct_answer: [],
                        several_answers: false
                    },
                ])
    }

    const saveButtonClick = (bool) => {
        let timeLimit = Number(hourInput)*60*60+Number(minInput)*60+Number(secInput) || null;
        if (show.remake) {
            if (bool) {
                remakeTest(show.remake, testTitle, timeLimit, testPuncts).then(data => {
                    const prevValue = [...themesArray];
                    prevValue[show.i].have_test = true;
                    prevValue[show.i].puncts[show.j].test_title = data.testCreate.title;
                    setTestTitle('');
                    setTestPuncts([{
                            question: "",
                            answers: [
                                "",
                                "",
                                "",
                            ],
                            correct_answer: [],
                            several_answers: false
                        },
                    ])
                    setUserAnswers([]);
                    setShow({show: false, i: 0, j: 0})
                    document.body.style.overflowY = "auto";
                
                })
                .catch(e => alert(e.response.data.message))
            } else {
                setTestTitle('');
                setTestPuncts([{
                        question: "",
                        answers: [
                            "",
                            "",
                            "",
                        ],
                        correct_answer: [],
                        several_answers: false
                    },
                ])
                setUserAnswers([]);
                setShow({show: false, i: 0, j: 0})
                document.body.style.overflowY = "auto";
            }

        } else {
            if (bool) {
                
                createTest(testTitle, timeLimit, testPuncts).then(data => {
                    const prevValue = [...themesArray];
                    console.log(prevValue, show)
                    prevValue[show.i].have_test = true;
                    prevValue[show.i].puncts[show.j].test_id = data.testCreate.id;
                    prevValue[show.i].puncts[show.j].test_title = data.testCreate.title;
                    setTestTitle('');
                    setTestPuncts([{
                            question: "",
                            answers: [
                                "",
                                "",
                                "",
                            ],
                            correct_answer: [],
                            several_answers: false
                        },
                    ])
                    setUserAnswers([]);
                    setShow({show: false, i: 0, j: 0})
                    document.body.style.overflowY = "auto";
                    setCounter(value => value+1);
                })
                .catch(e => console.log(e))
                
            } else {
                setTestTitle('');
                setTestPuncts([{
                        question: "",
                        answers: [
                            "",
                            "",
                            "",
                        ],
                        correct_answer: [],
                        several_answers: false
                    },
                ])
                setUserAnswers([]);
                setShow({show: false, i: 0, j: 0})
                document.body.style.overflowY = "auto";
        
            }
            
        }
        
        
    }

  
    const deleteQuestion = (i) => {
        let prevValue = [...testPuncts];

        prevValue = prevValue.filter(el => el.id != i)
        setNumberQuestion(prevValue.length-1)
   
        setTestPuncts(prevValue);
    }

    return (
        <div className={show.show?"modal show": "modal"}>
            <div className='modal_container test'>
                <button onClick={() => saveButtonClick(false)} className='modal_button'>x</button>
                <div className="title">
                    <b>Тест.</b><span>
                    <input onChange={(e) => setTestTitle(e.target.value)} value={testTitle} className='modal_input test' placeholder='Название теста'/>
                    </span>
                    <div className='test_times'>
                        <input value={hourInput} onChange={(e) => setHourInput(e.target.value)}  type="text" maxLength="2" className='modal_input test_time' placeholder='00'/>::
                        <input value={minInput} onChange={(e) => setMinInput(e.target.value)} type="text" maxLength="2" className='modal_input test_time' placeholder='00'/>::
                        <input value={secInput} onChange={(e) => setSecInput(e.target.value)} type="text" maxLength="2" className='modal_input test_time' placeholder='00'/>
                    </div>
                    
                </div>
                
                <div className="test_puncts">
            
                    {
                        testPuncts.map((punct, i) => 
                        <div class="test_punct_container">
                            <button onClick={() => deleteQuestion(punct.id)} class="test_punct_button">x</button>
                            <div onClick={() => navHandlerClick(i)} className={userAnswers[i]+1 ? (numberQuestion == i ? 'test_punct active bordered' : 'test_punct active') : (numberQuestion == i ? 'test_punct bordered' : 'test_punct') }>{i+1}</div>
                        </div>
                        
                        )
                    }
                    <div onClick={() => addNewQuestion()} className='test_punct'>+</div>
                </div>
                {testPuncts.map((punct, i) => 
                    <div>
                        
                        
                    
                        {numberQuestion == i? 
                        <div>
                            
                            <div className="test_question">{i+1}. 
                                <textarea onChange={(e) => handlerQuestionInput(i, e.target.value)} value={testPuncts[i].question} className='modal_input test' placeholder='Вопрос'/>
                                <button onClick={() => addAnswer(i)} className='MakeProgram_Theme_Button'>+</button> 
                            </div>
                              
                        
                            
                           
                            
                            
                            <div className="answer_options">
                                {  
                                    punct.answers.map((answer, j) => 
                                
                                    <div className="answer_option">
                                        <input className='modal_checkbox' onChange={(e) => handleAnswerCheck(i, j, e.target.checked)} checked={punct.correct_answer.indexOf(j)+1 ? true : false} type="checkbox" id={"answer_" + j} name="1"/>
                                        <textarea onChange={(e) => handlerAnswerInput(i, j, e.target.value)} value={answer} className='modal_input test' placeholder='Ответ'/>
                                        <button onClick={() => deleteAnswer(i, j)} className='MakeProgram_Theme_Button red'>-</button>  
                                    </div>)
                    
                                    
                                }
                                
                            </div>
                        </div>
                        : ""}
                        
                    </div>
                
                )}
                <div style={{display: 'flex'}}>
                    <div onClick={removeButtonClick} className='admin_button red'>Удалить</div>
                    <div onClick={saveButtonClick} className='admin_button'>Сохранить</div>
                </div>
                
            </div>
        </div>
    );
};

export default CreateTest;