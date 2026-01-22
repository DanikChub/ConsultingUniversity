import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { updateTests } from '../../../http/statisticAPI';
import { getOneTest, updateTestStatistic } from '../../../http/testAPI';
import { FINISH_TEST_ROUTE } from '../../../utils/consts';
import CountDown from '../../../components/CountDown/CountDown';
import UserContainer from '../../../components/ui/UserContainer';

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

const TestPage = () => {
    const [test, setTest] = useState({ title: '', puncts: [] });
    const [numberQuestion, setNumberQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [secForEnd, setSecForEnd] = useState(null);

    const params = useParams();
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        getOneTest(params.id).then(data => {
            data.puncts = shuffle(data.puncts);
            setTest(data);
            console.log(data)
            setSecForEnd(data.time_limit);
        });
    }, []);

    const setSingleAnswer = (i, j) => {
        const arr = [...userAnswers];
        arr[i] = [j];
        setUserAnswers(arr);

        console.log(arr)
    };

    const setMultipleAnswer = (i, j, checked) => {
        const arr = [...userAnswers];
        if (!arr[i]) arr[i] = [];

        if (checked) {
            arr[i].push(j);
        } else {
            arr[i] = arr[i].filter(el => el !== j);
        }

        setUserAnswers(arr);

        console.log(arr)
    };

    const finishTest = () => {
        let correct = 0;

        test.puncts.forEach((p, i) => {
            if (!userAnswers[i]) return;
            const a = [...userAnswers[i]].sort();
            const b = [...p.correct_answer].sort();
            if (JSON.stringify(a) === JSON.stringify(b)) correct++;
        });

        updateTestStatistic(
            queryParams.get('user_id'),
            test.id,
            userAnswers
        );

        if (correct / test.puncts.length > 0.75) {
            updateTests(
                queryParams.get('user_id'),
                queryParams.get('program_id'),
                queryParams.get('punct_id'),
                queryParams.get('theme_id')
            );
        }

        navigate(
            `${FINISH_TEST_ROUTE}?questions=${test.puncts.length}&correct_answers=${correct}&test_id=${params.id}`
        );
    };

    const punct = test.puncts[numberQuestion];

    return (
        <UserContainer loading={true}>


                <div className="back_button">
                    <a onClick={() => navigate(-1)}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="30" cy="30" r="30" fill="#DCDCDC"/>
                            <path
                                d="M15.2954 29.2433C14.9036 29.6325 14.9015 30.2657 15.2907 30.6575L21.6331 37.0429C22.0223 37.4348 22.6555 37.4369 23.0473 37.0477C23.4392 36.6585 23.4413 36.0253 23.0521 35.6335L17.4144 29.9576L23.0903 24.3198C23.4821 23.9306 23.4842 23.2975 23.095 22.9056C22.7058 22.5138 22.0727 22.5117 21.6808 22.9009L15.2954 29.2433ZM44.0034 29.0472L16.0035 28.9528L15.9968 30.9528L43.9966 31.0472L44.0034 29.0472Z"
                                fill="#898989"/>
                        </svg>
                    </a>

                    <span>Назад</span>
                </div>

                <h1 className="text-3xl font-bold mb-1">Тест</h1>
                <p className="text-gray-500 mb-6">{test.title}</p>

                {secForEnd ? (
                    <div className="mb-6">
                        <CountDown seconds={secForEnd} checkAllAnswers={finishTest}/>
                    </div>
                ) : ''}

                {/* Навигация по вопросам */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {test.puncts.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setNumberQuestion(i)}
                            className={`
                w-10 h-10 rounded-full font-semibold transition
                ${numberQuestion === i
                                ? 'bg-[#5ec1ff] text-white'
                                : userAnswers[i]
                                    ? 'bg-[#2980B9] text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'}
              `}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* Вопрос */}
                {punct && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-xl font-semibold mb-4">
                            {numberQuestion + 1}. {punct.question}
                        </div>



                        <div className="text-sm text-gray-500 mb-4">
                            {punct.several_answers
                                ? 'Можно выбрать несколько вариантов'
                                : 'Один правильный вариант'}
                        </div>

                        <div className="flex flex-col gap-3">
                            {punct.answers.map((answer, j) => (
                                <label
                                    key={j}
                                    className="
                    flex items-center gap-3 p-4 rounded-xl
                    bg-gray-50 hover:bg-indigo-50 cursor-pointer transition
                  "
                                >
                                    <input
                                        type={punct.several_answers ? 'checkbox' : 'radio'}
                                        checked={
                                            userAnswers[numberQuestion]
                                                ? userAnswers[numberQuestion].includes(j)
                                                : false
                                        }
                                        onChange={(e) =>
                                            punct.several_answers
                                                ? setMultipleAnswer(numberQuestion, j, e.target.checked)
                                                : setSingleAnswer(numberQuestion, j)
                                        }
                                        className="scale-125 accent-blue-500"
                                    />
                                    <span>{answer}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Кнопки */}
                <div className="flex justify-between mt-8">
                    <button
                        disabled={numberQuestion === 0}
                        onClick={() => setNumberQuestion(n => n - 1)}
                        className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                    >
                        Назад
                    </button>

                    <button
                        onClick={finishTest}
                        className="px-6 py-3 rounded-xl bg-[#2980B9] hover:bg-[#2C3E50] text-white font-semibold"
                    >
                        Завершить
                    </button>

                    <button
                        disabled={numberQuestion === test.puncts.length - 1}
                        onClick={() => setNumberQuestion(n => n + 1)}
                        className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                    >
                        Далее
                    </button>
                </div>


        </UserContainer>
    );
};

export default TestPage;
