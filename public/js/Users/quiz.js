import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

const divRoot = document.getElementById('root');
divRoot.innerHTML = `

<div class="dv-content-quiz">
    <div class="dv-content-quiz-box boxinfo">
    </div>
    <div class="dv-content-quiz-box quizzes">
        <form action="" id="formQuizzes">
            <div class="title">
                <h3 class="quiz-title"></h3>
            </div>
            <div class="quizmedia">
            </div>
            <div class="quizListQuestions">
            </div>
        </form>
    </div>
</div>

`;

// variable global

const dataPage = {
    idClass: null,
    idLesson: null,
    idQuiz: null,
};


let quizResult = {
    idQuizzesCMS: null,
    idClasses: null,
    idLesson: null,
    score: 0,
    answers: []
}

let quizzes = null;
let firstResult = false;
let scoreResult = null;
let detailResult = [];

// kiểm tra có param idCourse không thì gắn vào dataPage
const urlParams = new URLSearchParams(window.location.search);
let idClass = urlParams.get('class');
let idLesson = urlParams.get('unit');
let idQuiz = urlParams.get('quiz');
// kiểm tra nếu param là số thì gắn vào dataPage
if (!isNaN(idClass)) {
    dataPage.idClass = idClass;
}
if (!isNaN(idLesson)) {
    dataPage.idLesson = idLesson;
}
if (!isNaN(idQuiz)) {
    dataPage.idQuiz = idQuiz;
}


const STTABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const formQuizzes = document.getElementById('formQuizzes');
const quizTitle = formQuizzes.querySelector('.quiz-title');
const quizMedia = formQuizzes.querySelector('.quizmedia');
const listQuestions = formQuizzes.querySelector('.quizListQuestions');
const score = formQuizzes.querySelector('.quize-score');

// lấy dữ liệu quiz

getQuiz();

async function getQuiz() {
    // kiểm tra các thuộc tính của dataPage, nếu có thuộc tính null thì cho dừng lại
    if (dataPage.idClass === null || dataPage.idLesson === null || dataPage.idQuiz === null) {
        mbNotification('Error', 'Wrong link, please go back', 2, 3);
        return;
    }

    const url = `quizzes/getQuestionByIdQuiz/${dataPage.idClass}/${dataPage.idLesson}/${dataPage.idQuiz}`;
    try {
        mbLoading(true);
        quizzes = await mbFetch(url);
        if (quizzes.result !== null) {
            scoreResult = quizzes.result.score;
            detailResult = quizzes.result.detail;
            firstResult = true;
        }
        renderScore(quizzes.idClass, quizzes.className, quizzes.idLesson, quizzes.lessonName, quizzes.scoreUnit);
        renderQuizzes(quizzes);
    } catch (err) {
        console.log(err);
    } finally {
        mbLoading(false);
    }
}


function renderScore(idClass, className, idLesson, lessonName, scorePercent) {
    const box2 = document.querySelector('.dv-content-quiz-box.boxinfo');
    handlEmptyChildren(box2);
    const divTop = document.createElement('div');
    divTop.classList.add('dv-top');
    divTop.innerHTML = `<a href="quizzes?class=${idClass}">${className}:</a> <a href="quizzes?class=${idClass}&lesson=${idLesson}">${lessonName}</a>`;
    const divBottom = document.createElement('div');
    divBottom.classList.add('dv-bottom');
    divBottom.innerHTML = `
    <div class="progress" id="progress" style="--score: ${scorePercent}%">
        <div class="progress_bar"></div>
    </div>
    <div id="show_Percent">${scorePercent}% Learnt</div>
    `;
    box2.append(divTop, divBottom);
}

function renderQuizzes(data) {
    quizResult = {
        idClasses: data.idClass,
        idQuizzesCMS: data.idQuiz,
        idLesson: data.idLesson,
        score: 0,
        answers: []
    }
    quizTitle.textContent = data.quizName;
    listQuestions.classList.remove('showResult');
    handlEmptyChildren(quizMedia);
    const mediaElement = hanldMediaComponent(data.mediaCMS)
    if (mediaElement) {
        quizMedia.appendChild(mediaElement);
    }
    const questions = data.questionsCMS;
    handlEmptyChildren(listQuestions);
    questions.forEach((question, index) => {

        const answer = {
            type: 0,
            idQuestion: question.id,
            idAnswer: null,
            isCorrect: false,
            answer: null
        };

        quizResult.answers.push(answer);

        let questionComponent = null;
        if (question.typeAnswers == 0) {
            questionComponent = quizChoiceComponent(question, index, answer);
        } else if (question.typeAnswers == 1) {
            questionComponent = quizWriteComponent(question, index, answer);
        }
        if (questionComponent) {
            listQuestions.appendChild(questionComponent);
        }
    });
    const submitBox = formQuizzes.querySelector('.submit-box');
    if (submitBox) {
        submitBox.remove();
    }
    if(firstResult){
        formQuizzes.appendChild(tryAgainCompoent());
    }else{
        formQuizzes.appendChild(submitCompoent());
    }

    return;

}

function renderQuizzesResult() {
    const questions = listQuestions.querySelectorAll('.question-box');
    const resultQuestions = quizResult.answers;
    questions.forEach((question) => {
        const indexQuestion = parseInt(question.getAttribute('data-indexQuestion'));
        const resultQuestion = resultQuestions[indexQuestion].isCorrect;
        question.classList.remove('isCorrectTrue', 'isCorrectFalse');
        if (resultQuestion === null) {
            return;
        }
        question.classList.add(resultQuestion ? 'isCorrectTrue' : 'isCorrectFalse');
    });

    const submitBox = formQuizzes.querySelector('.submit-box');
    if (submitBox) {
        const btnold = submitBox.querySelector('.btn-submit-quiz');
        const newbtn = document.createElement('button');
        newbtn.classList.add('btn', 'btn-primary', 'btn-submit-quiz', 'tryagain');
        newbtn.textContent = 'Try Again';
        newbtn.type = 'button';
        newbtn.addEventListener('click', function () {
            renderQuizzes(quizzes);
        });
        btnold.replaceWith(newbtn);
    }
}

function tryAgainCompoent() {
    firstResult = false;
    const submitBox = formQuizzes.querySelector('.submit-box');
    if (submitBox) {
        submitBox.remove();
    }
    listQuestions.classList.add('showResult');
    const divBox = document.createElement('div');
    divBox.classList.add('submit-box');
    divBox.innerHTML = `
    <div class="quize-score">Your Score: ${scoreResult}/10</div>
    <button type="button" class="btn btn-primary btn-submit-quiz tryagain">Try Again</button>
    `;
    const btn = divBox.querySelector('.tryagain');
    btn.addEventListener('click', function () {
        listQuestions.classList.remove('showResult');
        formQuizzes.appendChild(submitCompoent());
    });
    return divBox;
}

function submitCompoent() {
    const submitBox = formQuizzes.querySelector('.submit-box');
    if (submitBox) {
        submitBox.remove();
    }
    const divBox = document.createElement('div');
    divBox.classList.add('submit-box');
    divBox.innerHTML = `
    <div class="quize-score"></div>
    <button type="Submit" class="btn btn-primary btn-submit-quiz">Submit</button>
    `;
    return divBox;
}

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

    // guiwr du lieu len server
    try {
        mbLoading(true);
        const url = 'admin/quizzes/submitQuiz';
        const dataRes = await mbFetch(url, quizResult);
        if (dataRes.error) {
            mbNotification('Error', dataRes.error, 2, 3);
            return;
        }
        const progress = document.getElementById('progress');
        const showPercent = document.getElementById('show_Percent');
        showPercent.textContent = `${dataRes.scoreUnit}% Learnt`;
        progress.style.setProperty('--score', `${dataRes.scoreUnit}%`);
        mbNotification('Success', 'Submit success', 1, 2);
    } catch (err) {
        console.log(err);
        return;
    } finally {
        mbLoading(false);
    }
    scoreResult = score;
    renderQuizzesResult();
    formQuizzes.appendChild(tryAgainCompoent());

    
});

function hanldMediaComponent(data) {
    if (!data) {
        return null;
    }
    if (data.type == 0) {
        return mediaAudioComponent(data);
    } else if (data.type == 1) {
        return mediaTextComponent(data);
    } else if (data.type == 2) {
        return mediaDriveAudio(data);
    } else if (data.type == 3) {
        return mediaYoutubeVideo(data);
    }
}

function mediaAudioComponent(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('media-audio');
    divBox.innerHTML = `
                <span>${data.title}</span>
                <audio controls>
                    <source src="public/media/${data.content}" type="audio/mpeg">
                </audio>
`;
    return divBox;
}

function mediaTextComponent(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('media-text');
    divBox.innerHTML = `
    <span>${data.title}</span>
    <div class="textContents">${data.content}</div>
`;
    return divBox;
}

function mediaDriveAudio(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('mediaDriveAudio');
    divBox.innerHTML = `
    <span>${data.title}</span>
    <iframe src="${data.content}" frameborder="0"></iframe>
    `;
    return divBox;
}

function mediaYoutubeVideo(data) {
    const divBox = document.createElement('div');
    divBox.classList.add('mediaYoutubeVideo');
    divBox.innerHTML = `
                <span>${data.title}</span>
                <div class="preview">
                    <div class="preview1">
                        ${data.content}
                    </div>
                </div>
    `;
    return divBox;
}

function quizChoiceComponent(questions, indexQuestion, answer_original) {
    const divBox = document.createElement('div');
    divBox.classList.add('question-box', 'question-choice');
    divBox.setAttribute('data-indexQuestion', indexQuestion);
    const stringIsCorrect = {
        0: 'isCorrectFalse',
        1: 'isCorrectTrue'
    }
    const idQuestion = questions.id;
    const oldAnswer = detailResult[idQuestion];
    if(oldAnswer){
        answer_original.idAnswer = oldAnswer.idAnswersCMS;
        answer_original.isCorrect = oldAnswer.isCorrect == 1;
        divBox.classList.add(stringIsCorrect[oldAnswer.isCorrect]);
    }
    answer_original.type = 0;

    divBox.innerHTML = `
                    <p class="question-title">${indexQuestion + 1}. ${questions.questionName}</p>
                <div class="answers-choice-group"></div>
`;

    const answers = questions.answersCMS;
    const answersGroup = divBox.querySelector('.answers-choice-group');
    answers.forEach((answer, index) => {
        let checked = '';
        if (oldAnswer && oldAnswer.idAnswersCMS == answer.id) {
            checked = 'checked';
        }
        const label = document.createElement('label');
        label.classList.add('answers-choice-label');
        label.innerHTML = `
        <input type="radio" name="question_${questions.id}" id="question_${questions.id}" value="${answer.id}" ${checked}>
        <span>${STTABC[index]}. ${answer.answerName}</span>
    `;

        label.querySelector('input').addEventListener('change', function (e) {
            const idAnswer = parseInt(e.target.value);
            answer_original.idAnswer = idAnswer;
            answer_original.isCorrect = answer.isCorrect;
        });
        answersGroup.appendChild(label);
    });

    return divBox;
}

function quizWriteComponent(Question, indexQuestion, answer_original) {
    const divBox = document.createElement('div');
    divBox.classList.add('question-box', 'question-write');
    divBox.setAttribute('data-indexQuestion', indexQuestion);
    answer_original.type = 1;
    answer_original.isCorrect = null;
    const stringIsCorrect = {
        0: 'isCorrectFalse',
        1: 'isCorrectTrue'
    }
    const idQuestion = Question.id;
    const oldAnswer = detailResult[idQuestion];
    let oldValueInput = '';
    if(oldAnswer){
        answer_original.idAnswer = oldAnswer.idAnswersCMS;
        answer_original.isCorrect = oldAnswer.isCorrect == 1;
        divBox.classList.add(stringIsCorrect[oldAnswer.isCorrect]);
        oldValueInput = oldAnswer.userAnswer;
    }
    
    divBox.innerHTML = `
    <p class="question-title">${indexQuestion + 1}. ${Question.questionName}</p>
    `;
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your answer';
    input.value = oldValueInput;
    input.addEventListener('input', function (e) {
        answer_original.idAnswer = Question.answersCMS.id;
        const truValue = Question.answersCMS.answerName.trim();
        const saveValue = e.target.value;
        const userValue = saveValue.trim();
        if (userValue == '') {
            answer_original.answer = null;
            answer_original.isCorrect = null;
            return;
        }
        const resultBoolean = truValue.toLowerCase() == userValue.toLowerCase();
        answer_original.answer = saveValue;
        answer_original.isCorrect = resultBoolean;
    });
    divBox.appendChild(input);
    return divBox;
}

function handlEmptyChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

