    import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

    const Quizdemo = {
    id: 1,
    idClasses: 1,
    totalQuestions: 3,
    title: "Quiz 1",
    mediaCMS: {
        title: "Listen to the following passage and answer the questions",
        type: 0,
        content: "https://dl.dropboxusercontent.com/s/ejcptfmie85ygd4/Lesson1-Whatareyoudoing-Englishcommunication-a.mp3?_=3"
    },
    questionsCMS: [
        {
            id: 1,
            questionName: "She is very______. She always makes me laugh and forget my problems",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 1,
                    answerName: "Sociable",
                    isCorrect: false
                },
                {
                    id: 2,
                    answerName: "serious",
                    isCorrect: false
                },
                {
                    id: 3,
                    answerName: "humorous",
                    isCorrect: true
                },
                {
                    id: 4,
                    answerName: "Friendly",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            questionName: "He has two children: a son and a_______",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 5,
                    answerName: "daughter",
                    isCorrect: true
                },
                {
                    id: 6,
                    answerName: "mother",
                    isCorrect: false
                },
                {
                    id: 7,
                    answerName: "cousins",
                    isCorrect: false
                },
                {
                    id: 8,
                    answerName: "uncle",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            questionName: "Where can I buy some medicine? Is there_______a near here",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 9,
                    answerName: "school",
                    isCorrect: false
                },
                {
                    id: 10,
                    answerName: "pharmacy",
                    isCorrect: true
                },
                {
                    id: 11,
                    answerName: "news-store",
                    isCorrect: false
                },
                {
                    id: 12,
                    answerName: "bank",
                    isCorrect: false
                }
            ]
        },
        {
            id: 9,
            questionName: "Câu hỏi nhập đáp án",
            typeAnswers: 1,
            answersCMS: {
                id: 33,
                answerName: "ok",
                isCorrect: true
            }
        },
        {
            id: 4,
            questionName: "I love listening to live music. Let's go to a_________this weekend",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 13,
                    answerName: "concert",
                    isCorrect: true
                },
                {
                    id: 14,
                    answerName: "hospital",
                    isCorrect: false
                },
                {
                    id: 15,
                    answerName: "party",
                    isCorrect: false
                },
                {
                    id: 16,
                    answerName: "dance",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            questionName: "It's cold outside. I need to wear a_______",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 17,
                    answerName: "jacket",
                    isCorrect: true
                },
                {
                    id: 18,
                    answerName: "skirt",
                    isCorrect: false
                },
                {
                    id: 19,
                    answerName: "shorts",
                    isCorrect: false
                },
                {
                    id: 20,
                    answerName: "sandals",
                    isCorrect: false
                }
            ]
        },
        {
            id: 6,
            questionName: "The meeting is_______Monday morning at 9 o'clock",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 21,
                    answerName: "In",
                    isCorrect: false
                },
                {
                    id: 22,
                    answerName: "on",
                    isCorrect: true
                },
                {
                    id: 23,
                    answerName: "at",
                    isCorrect: false
                },
                {
                    id: 24,
                    answerName: "by",
                    isCorrect: false
                }
            ]
        },
        {
            id: 7,
            questionName: "Based on IPA pronunciation, choose the most suitable sound of beach /b....tf/",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 25,
                    answerName: "/i:/",
                    isCorrect: true
                },
                {
                    id: 26,
                    answerName: "/i/",
                    isCorrect: false
                },
                {
                    id: 27,
                    answerName: "/e/",
                    isCorrect: false
                },
                {
                    id: 28,
                    answerName: "/æ/",
                    isCorrect: false
                }
            ]
        },
        {
            id: 8,
            questionName: "The children are playing______the garden.",
            typeAnswers: 0,
            answersCMS: [
                {
                    id: 29,
                    answerName: "In",
                    isCorrect: true
                },
                {
                    id: 30,
                    answerName: "on",
                    isCorrect: false
                },
                {
                    id: 31,
                    answerName: "at",
                    isCorrect: false
                },
                {
                    id: 32,
                    answerName: "by",
                    isCorrect: false
                }
            ]
        }
    ]
};


    const divRoot = document.getElementById('root');
    divRoot.innerHTML = `
        <div class="dv-content-quiz">

        <div class="dv-content-quiz-box quizzes">
        <form action="" id="formQuizzes">
        <div class="title">
        <h3 class="quiz-title"></h3></div>
        <div class="quizmedia"></div>

        <div class="quizListQuestions"></div>
        </form>
        </div>
        </div>

    `;

    const STTABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    const formQuizzes = document.getElementById('formQuizzes');
    const quizTitle = formQuizzes.querySelector('.quiz-title');
    const quizMedia = formQuizzes.querySelector('.quizmedia');
    const listQuestions = formQuizzes.querySelector('.quizListQuestions');
    const score = formQuizzes.querySelector('.quize-score');

    let quizResult = {
        idQuizzesCMS: null,
        idClasses: null,
        score: 0,
        answers: []
    }

    renderQuizzes(Quizdemo);

    function renderQuizzes(data) {
        quizResult = {
            idQuizzesCMS: null,
            idClasses: null,
            score: 0,
            answers: []
        }
        quizResult.idQuizzesCMS = data.id;
        quizResult.idClasses = data.idClasses;
        quizTitle.textContent = data.title;
        listQuestions.classList.remove('showResult');
        handlEmptyChildren(quizMedia);
        const mediaElement = hanldMediaComponent(data.mediaCMS)
        if (mediaElement) {
            quizMedia.appendChild(mediaElement);
        }
        const questions = data.questionsCMS;
        handlEmptyChildren(listQuestions);
        questions.forEach((question, index) => {
            quizResult.answers.push({
                idQuestionsCMS: question.id,
                idAnswersCMS: null,
                userAnswer: null,
                isCorrect: null,
            });

            let questionComponent = null;
            if (question.typeAnswers == 0) {
                questionComponent = quizChoiceComponent(question, index);
            } else if (question.typeAnswers == 1) {
                questionComponent = quizWriteComponent(question, index);
            }
            if (questionComponent) {
                listQuestions.appendChild(questionComponent);
            }
        });
        const submitBox = formQuizzes.querySelector('.submit-box');
        if (submitBox) {
            submitBox.remove();
        }
        formQuizzes.appendChild(submitCompoent());
        formQuizzes.addEventListener('submit', async function (e) {
            e.preventDefault();
            const confirmSubmit = await mbConfirm('Are you sure you want to submit?');
            if (!confirmSubmit) {
                return;
            }
            const totalQuestion = quizResult.answers.length;
            const maxScore = 10;
            const scoreEachQuestion = maxScore / totalQuestion;
            let score = 0;
            quizResult.answers.forEach(answer => {
                if (answer.isCorrect) {
                    score += scoreEachQuestion;
                }
            });
            score = Math.round(score * 10) / 10;
            quizResult.score = score;
            const boxScore = formQuizzes.querySelector('.quize-score');
            boxScore.textContent = `Your score: ${score}/${maxScore}`;
            renderQuizzesResult();
        });
    }

    function renderQuizzesResult() {
        listQuestions.classList.add('showResult');
        const questions = listQuestions.querySelectorAll('.question-box');
        const resultQuestions = quizResult.answers;
        questions.forEach((question) => {
            const indexQuestion = parseInt(question.getAttribute('data-indexQuestion'));
            const resultQuestion = resultQuestions[indexQuestion].isCorrect;
            if (resultQuestion === null) {
                return;
            }
            question.classList.add(resultQuestion ? 'isCorrectTrue' : 'isCorrectFalse');
            console.log(resultQuestion);
        });

        const submitBox = formQuizzes.querySelector('.submit-box');
        if (submitBox) {
            const btnold = submitBox.querySelector('.btn-submit-quiz');
            const newbtn = document.createElement('button');
            newbtn.classList.add('btn', 'btn-primary', 'btn-submit-quiz', 'tryagain');
            newbtn.textContent = 'Try Again';
            newbtn.type = 'button';
            newbtn.addEventListener('click', function () {
                renderQuizzes(Quizdemo);
            });
            btnold.replaceWith(newbtn);
        }
    }


    function submitCompoent() {
        const divBox = document.createElement('div');
        divBox.classList.add('submit-box');
        divBox.innerHTML = `
        <div class="quize-score"></div>
        <button type="Submit" class="btn btn-primary btn-submit-quiz">Submit</button>
    `;
        return divBox;
    }

    function hanldMediaComponent(data) {
        if (!data) {
            return null;
        }
        if (data.type == 0) {
            return mediaAudioComponent(data);
        } else if (data.type == 1) {
            return mediaTextComponent(data);
        }
    }

    function mediaAudioComponent(data) {
        const divBox = document.createElement('div');
        divBox.classList.add('media-audio');
        divBox.innerHTML = `
                    <span>${data.title}</span>
                    <audio controls>
                        <source src="${data.content}" type="audio/mpeg">
                    </audio>
    `;
        return divBox;
    }

    function mediaTextComponent(data) {
        const divBox = document.createElement('div');
        divBox.classList.add('media-text');
        divBox.innerHTML = `
        <span>${data.title}</span>
        <p>${data.content}</p>
    `;
        return divBox;
    }

    function quizChoiceComponent(questions, indexQuestion) {
        console.log(questions);
        const divBox = document.createElement('div');
        divBox.classList.add('question-box', 'question-choice');
        divBox.setAttribute('data-indexQuestion', indexQuestion);
        divBox.innerHTML = `
                        <p class="question-title">${indexQuestion + 1}. ${questions.questionName}</p>
                    <div class="answers-choice-group"></div>
    `;

        const answers = questions.answersCMS;
        const answersGroup = divBox.querySelector('.answers-choice-group');
        answers.forEach((answer, index) => {
            const label = document.createElement('label');
            label.classList.add('answers-choice-label');
            label.innerHTML = `
            <input type="radio" name="question_${questions.id}" id="question_${questions.id}" value="${answer.id}">
            <span>${STTABC[index]}. ${answer.answerName}</span>
        `;
            // nếu có sự thay đổi radio thì làm gọi hàm handlanserChangeRadio
            label.querySelector('input').addEventListener('change', function (e) {
                // in ra value cuar radio
                // console.log(e.target.value);
                quizResult.answers[indexQuestion].idAnswersCMS = parseInt(e.target.value);
                quizResult.answers[indexQuestion].isCorrect = answer.isCorrect;
            });
            answersGroup.appendChild(label);
        });


        return divBox;
    }

    function quizWriteComponent(Question, indexQuestion) {
        const divBox = document.createElement('div');
        divBox.classList.add('question-box', 'question-write');
        divBox.setAttribute('data-indexQuestion', indexQuestion);
        divBox.innerHTML = `
        <p class="question-title">${indexQuestion + 1}. ${Question.questionName}</p>
    `;
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your answer';
        input.addEventListener('input', function (e) {
            let truValue = Question.answersCMS.answerName.trim();
            let userValue = e.target.value.trim();
            if (userValue == '') {
                quizResult.answers[indexQuestion].userAnswer = null;
                quizResult.answers[indexQuestion].isCorrect = null;
                return;
            }
            quizResult.answers[indexQuestion].userAnswer = userValue;
            const resultBoolean = truValue.toLowerCase() == userValue.toLowerCase();
            quizResult.answers[indexQuestion].isCorrect = resultBoolean;
        });
        divBox.appendChild(input);
        return divBox;
    }

    function handlEmptyChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }


