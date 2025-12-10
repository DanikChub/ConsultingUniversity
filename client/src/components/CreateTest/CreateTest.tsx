import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { createTest, getOneTest, remakeTest } from "../../http/testAPI";
import { CreateTestProps, TestPunct } from "../../types/test";
import Button from "../ui/Button";

const CreateTest: React.FC<CreateTestProps> = ({
                                                   show,
                                                   setShow,
                                                   themesArray,
                                                   setThemesArray,
                                                   counter,
                                                   setCounter,
                                               }) => {
    const [testTitle, setTestTitle] = useState("");
    const [testPuncts, setTestPuncts] = useState<TestPunct[]>([
        {
            id: 0,
            question: "",
            answers: ["", "", ""],
            correct_answer: [],
            several_answers: false,
        },
    ]);
    const [numberQuestion, setNumberQuestion] = useState(0);
    const [hourInput, setHourInput] = useState("");
    const [minInput, setMinInput] = useState("");
    const [secInput, setSecInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Загрузка теста для редактирования
    useEffect(() => {
        if (show.remake) {
            getOneTest(show.remake).then((data) => {
                setTestTitle(data.title);
                setTestPuncts(data.puncts.sort((a: TestPunct, b: TestPunct) => a.id - b.id));
                setHourInput(Math.floor(data.time_limit / 3600).toString());
                setMinInput(Math.floor((data.time_limit % 3600) / 60).toString());
                setSecInput((data.time_limit % 60).toString());
            });
        } else {
            setTestTitle('');

            setTestPuncts([{
                id: 0,
                question: "",
                answers: ["", "", ""],
                correct_answer: [],
                several_answers: false,
            }]);
            setHourInput('');
            setMinInput('');
            setSecInput('');
        }
    }, [show.remake]);

    // Добавление нового вопроса
    const addNewQuestion = () => {
        const id = testPuncts.length ? testPuncts[testPuncts.length - 1].id + 1 : 0;
        setTestPuncts([
            ...testPuncts,
            { id, question: "", answers: ["", "", ""], correct_answer: [], several_answers: false },
        ]);
        setNumberQuestion(testPuncts.length);
    };

    // Обработчик изменения вопроса
    const handleQuestionChange = (i: number, value: string) => {
        const newPuncts = [...testPuncts];
        newPuncts[i].question = value;
        setTestPuncts(newPuncts);
    };

    // Обработчик изменения ответа
    const handleAnswerChange = (i: number, j: number, value: string) => {
        const newPuncts = [...testPuncts];
        newPuncts[i].answers[j] = value;
        setTestPuncts(newPuncts);
    };

    // Добавление ответа
    const addAnswer = (i: number) => {
        const newPuncts = [...testPuncts];
        newPuncts[i].answers.push("");
        setTestPuncts(newPuncts);
    };

    // Удаление ответа
    const deleteAnswer = (i: number, j: number) => {
        const newPuncts = [...testPuncts];
        newPuncts[i].answers = newPuncts[i].answers.filter((_, idx) => idx !== j);
        setTestPuncts(newPuncts);
    };

    // Удаление вопроса
    const deleteQuestion = (i: number) => {
        setTestPuncts(testPuncts.filter((q) => q.id !== i));
        setNumberQuestion((prev) => Math.max(0, prev - 1));
    };

    // Сохранение
    const saveTest = () => {
        const timeLimit = Number(hourInput) * 3600 + Number(minInput) * 60 + Number(secInput);
        if (show.remake) {
            remakeTest(show.remake!, testTitle, timeLimit, testPuncts)
                .then((data) => {
                    const prevValue = [...themesArray];
                    prevValue[show.i].have_test = true;
                    prevValue[show.i].puncts[show.j].test_title = data.test.title;
                    setTestTitle('');
                    setTestPuncts([{
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
                    setThemesArray(prevValue)
                    setShow({ show: false, i: 0, j: 0 })
                })
                .catch((err) => setErrorMessage(err.response.data.message));
        } else {
            createTest(testTitle, timeLimit, testPuncts)
                .then((data) => {
                    const prevValue = [...themesArray];
                    prevValue[show.i].have_test = true;
                    prevValue[show.i].puncts[show.j].test_id = data.test.id;
                    prevValue[show.i].puncts[show.j].test_title = data.test.title;
                    setTestTitle('');
                    setTestPuncts([{
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
                    setThemesArray(prevValue)
                    console.log(themesArray)
                    setShow({ show: false, i: 0, j: 0 })
                })
                .catch((err) => setErrorMessage(err.response.data.message));
        }
    };

    const handleCancelClick = () => {
        setTestTitle('');
        setTestPuncts([{
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
        setShow({ show: false, i: 0, j: 0 })
    }


    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = "auto";              // сбрасываем текущую высоту
        e.target.style.height = e.target.scrollHeight + "px"; // ставим высоту по контенту
    };

    return (
        <Modal open={show.show} onClose={() => setShow({show: false, i: 0, j: 0})} width="800px">
            <div className="p-4 flex justify-between items-center border-b">
                <div className="text-md font-bold">Тест</div>


            </div>
            <div className="p-4 flex flex-col gap-4">
                {/* Заголовок и время */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <input
                        type="text"
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        placeholder="Название теста"
                        className="border rounded-md p-2 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            maxLength={2}
                            value={hourInput}
                            onChange={(e) => setHourInput(e.target.value)}
                            placeholder="00"
                            className="border rounded-md p-1 w-12 text-center"
                        />
                        :
                        <input
                            type="text"
                            maxLength={2}
                            value={minInput}
                            onChange={(e) => setMinInput(e.target.value)}
                            placeholder="00"
                            className="border rounded-md p-1 w-12 text-center"
                        />
                        :
                        <input
                            type="text"
                            maxLength={2}
                            value={secInput}
                            onChange={(e) => setSecInput(e.target.value)}
                            placeholder="00"
                            className="border rounded-md p-1 w-12 text-center"
                        />
                    </div>
                </div>

                {/* Навигация по вопросам */}
                <div className="flex gap-2 flex-wrap">
                    {testPuncts.map((q, i) => (
                        <div key={q.id} className="flex items-center gap-1 relative">
                            <button
                                onClick={() => setNumberQuestion(i)}
                                className={`w-8 h-8 rounded-md border ${
                                    numberQuestion === i ? "bg-blue-500 text-white" : "bg-gray-100"
                                }`}
                            >
                                {i + 1}
                            </button>
                            <button
                                onClick={() => deleteQuestion(q.id)}
                                className="font-bold absolute -right-1 -top-1 bg-red-500 text-white rounded-full"
                            >
                                <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={addNewQuestion} className="w-8 h-8 rounded-md bg-gray-200 text-white hover:animate-shake">
                        +
                    </button>
                </div>

                {/* Редактор выбранного вопроса */}
                {testPuncts[numberQuestion] && (
                    <div className="flex flex-col gap-2">
            <textarea
                value={testPuncts[numberQuestion].question}
                onChange={(e) => {
                    handleQuestionChange(numberQuestion, e.target.value)
                    autoResize(e);
                }}
                placeholder="Вопрос"
                className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[50px] overflow-hidden"
            />
                        {testPuncts[numberQuestion].answers.map((ans, j) => (
                            <div key={j} className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    checked={testPuncts[numberQuestion].correct_answer.includes(j)}
                                    onChange={(e) => {
                                        const newPuncts = [...testPuncts];
                                        if (e.target.checked) newPuncts[numberQuestion].correct_answer.push(j);
                                        else
                                            newPuncts[numberQuestion].correct_answer = newPuncts[numberQuestion].correct_answer.filter(
                                                (x) => x !== j
                                            );
                                        setTestPuncts(newPuncts);
                                    }}
                                    className="w-4 h-4"
                                />
                                <textarea

                                    value={ans}
                                    onChange={(e) => {
                                        handleAnswerChange(numberQuestion, j, e.target.value)
                                        autoResize(e);
                                    }}
                                    placeholder={`Ответ ${j + 1}`}
                                    className="border rounded-md p-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[50px] overflow-hidden"
                                ></textarea>
                                <button
                                    onClick={() => deleteAnswer(numberQuestion, j)}
                                    className="text-red-500 font-bold"
                                >
                                    -
                                </button>
                            </div>
                        ))}
                        <Button
                            onClick={() => addAnswer(numberQuestion)}

                        >
                            Добавить ответ
                        </Button>
                    </div>
                )}

                {/* Кнопки сохранить/удалить */}
                <div className="flex justify-between items-center">
                    <div className="text-red-500">{errorMessage}</div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            onClick={saveTest}

                        >
                            Сохранить
                        </Button>
                        <Button
                            onClick={handleCancelClick}
                            variant={"red"}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default CreateTest;
