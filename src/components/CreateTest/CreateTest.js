import React, { useState } from 'react';
import { createTest } from '../../http/testAPI';

import "./CreateTest.css"

const CreateTest = ({show, setShow, themesArray, setThemesArray, counter, setCounter}) => {
    const [testTitle, setTestTitle] = useState("");

    const [testPuncts, setTestPuncts] = useState([{
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


    const addNewQuestion = () => {
        const prevValue = [...testPuncts];

        prevValue.push({
            question: "",
            answers: [
                "",
                "",
                "",
            ],
            correct_answer: [],
            several_answers: false
        },)

        setTestPuncts(prevValue);

    }

    const handlerAnswerInput = (i, j, value) => {
        const prevValue = [...testPuncts]

        prevValue[i].answers[j] = value;

        setTestPuncts(prevValue);
        console.log(testPuncts);
    }

    const handlerQuestionInput = (i, value) => {
        const prevValue = [...testPuncts]

        prevValue[i].question = value;

        setTestPuncts(prevValue);
        console.log(testPuncts);
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

    const saveButtonClick = () => {
 
        createTest(testTitle, testPuncts).then(data => {
                const prevValue = [...themesArray];

                prevValue[show.i].puncts[show.j].test_id = data.testCreate.id;
            });
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
        setCounter(value => value+1);
    }

    return (
        <div className={show.show?"modal show": "modal"}>
            <div className='modal_container test'>
                <button onClick={() => setShow(false)} className='modal_button'>x</button>
                <div className="title">
                    <b>Тест.</b><span> <input onChange={(e) => setTestTitle(e.target.value)} value={testTitle} className='modal_input test' placeholder='Название теста'/></span>
                </div>
                <div className="test_puncts">
            
                    {
                        testPuncts.map((punct, i) => 
                        <div onClick={() => navHandlerClick(i)} className={userAnswers[i]+1 ? 'test_punct active' : 'test_punct'}>{i+1}</div>
                        )
                    }
                    <div onClick={() => addNewQuestion()} className='test_punct'>+</div>
                </div>
                {testPuncts.map((punct, i) => 
                    <div>
                        
                        
                    
                        {numberQuestion == i? 
                        <div>
                            <div className="test_question">{i+1}. <input onChange={(e) => handlerQuestionInput(i, e.target.value)} value={testPuncts[i].question} className='modal_input test' placeholder='Вопрос'/></div>
                            
                            
                            <div className="answer_options">
                                {  
                                    punct.answers.map((answer, j) => 
                                
                                    <div className="answer_option">
                                        <input onChange={(e) => handleAnswerCheck(i, j, e.target.checked)} type="checkbox" id={"answer_" + j} name="1"/>
                                        <input onChange={(e) => handlerAnswerInput(i, j, e.target.value)} className='modal_input test' placeholder='Ответ'/>
                                       
                                    </div>)
                    
                                    
                                }
                                
                            </div>
                        </div>
                        : ""}
                        
                    </div>
                
                )}
                <div onClick={saveButtonClick} className='admin_button'>Сохранить</div>
            </div>
        </div>
    );
};

export default CreateTest;