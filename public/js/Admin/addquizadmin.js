import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from "../allmodule.js";

// khung tĩnh
const divRoot = document.getElementById('root');
divRoot.innerHTML = `

<div class="dv-addquiz">
    <h4 class="dv-title-filter">Add Quiz</h4>
    <div class="dv-box dv-box-1">
        <form action="" id="dv-form-addquiz">
            <div class="choose-course-lesson">
                <div class="form-group">
                    <label for="txtSearch">Courses</label>
                    <select class="form-control" name="idClass" id="id-course-filter">
                        <option value="" disabled selected>Please choose class</option>
                    </select>
                </div>
                <div class="form-group" id="box-lesson">
                    <label for="txtSearch">Lessons</label>
                    <select class="form-control" name="idClass" id="id-lesson-filter">
                        <option value="" disabled selected>Please choose lesson</option>
                    </select>
                </div>
            </div>
            <div class="dv-quiz-name">
                <div class="form-group">
                    <label for="txtSearch">Quiz Name</label>
                    <input type="text" name="question" id="quiz-name" class="form-control"
                        placeholder="Enter Quiz Name">
                </div>
            </div>

            <div class="choose-quiz-media">
                <div class="left">
                    <hr>
                    <span>Media</span>
                    <hr>
                </div>
                <div class="right">
                    <div class="form-group">
                        <select class="form-control" name="idClass" id="select-type-media">
                            <option value="">None</option>
                            <option value="0">Audio</option>
                            <option value="1">Text</option>
                            <option value="2">Audio Drive</option>
                            <option value="3">Video YouTube</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-primary" id="btn-type-media">Add Media</button>
                </div>
            </div>

            <div class="dv-quiz-media" id="box-media">
            </div>
            <div class="dv-title-question">
                <hr>
                <span>Questions</span>
                <hr>
            </div>

            <div class="dv-list-question" id="quiz-list-question">
            </div>
            <div class="dv-btn-add-question">
                <button type="button" class="btn btn-primary" id="btn-add-question-choose">Add Question Choose</button>
                <button type="button" class="btn btn-primary" id="btn-add-question-truefalse">Add Question
                    True/False</button>
                <button type="button" class="btn btn-primary" id="btn-add-question-write">Add Question Write</button>
            </div>
            <div class="dv-quiz-btn-submit">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
</div>
`;

// variable global

const Quizzes = {
    idLesson: null,
    quizName: null,
    media: null,
    questions: []
};

let questionIdCounter = 0;

// lấy khóa học và bài học
(async () => {
    let divLoading = document.querySelector('.choose-course-lesson');
    const EselectCourse = document.getElementById('id-course-filter');
    try {
        mbLoading(true, divLoading);
        const courses = await mbFetch('admin/quizzes/getCourses');

        const fragment = document.createDocumentFragment();
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.courseName;
            fragment.appendChild(option);
        });
        EselectCourse.appendChild(fragment);
        EselectCourse.addEventListener('change', changeCourses);
    }
    catch (error) {
        console.log(error);
    } finally {
        mbLoading(false, divLoading);
    }
})();

async function changeCourses(e) {
    Quizzes.idLesson = null;
    let divLoading = document.querySelector('.choose-course-lesson');
    const EselectLesson = document.getElementById('id-lesson-filter');
    emptyElement(EselectLesson);
    if (isNaN(e.target.value)) return;
    const idCourse = parseInt(e.target.value);
    const url = `admin/quizzes/getLessonByCourseId/${idCourse}`;
    const optiondefault = document.createElement('option');
    optiondefault.value = '';
    optiondefault.selected = true;
    optiondefault.disabled = true;
    try {
        mbLoading(true, divLoading);
        const lessons = await mbFetch(url);
        if (lessons.length === 0) {
            optiondefault.textContent = 'No lesson';
            EselectLesson.appendChild(optiondefault);
            return;
        } else {
            optiondefault.textContent = 'Please choose lesson';
            EselectLesson.appendChild(optiondefault);
        }
        const fragment = document.createDocumentFragment();
        lessons.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson.id;
            option.textContent = lesson.lessonName;
            fragment.appendChild(option);
        });
        EselectLesson.appendChild(fragment);
        EselectLesson.addEventListener('change', changeLessons);
    } catch (error) {
        console.log(error);
    } finally {
        mbLoading(false, divLoading);
    }
}

function changeLessons(e) {
    const idLesson = e.target.value || null;
    Quizzes.idLesson = parseInt(idLesson);
}

// add quiz name 

(() => {
    const quizName = document.getElementById('quiz-name');
    quizName.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.quizName = value || null;
    }
})();

// add media

(() => {
    const boxMedia = document.getElementById('box-media');
    const EselectMedia = document.getElementById('select-type-media');
    const btnMedia = document.getElementById('btn-type-media');
    btnMedia.addEventListener('click', () => {
        const typeMedia = EselectMedia.value;
        if (typeMedia == '') {
            Quizzes.media = null;
            emptyElement(boxMedia);
            return;
        }
        const media = {
            title: null,
            type: null,
            content: null
        }
        if (typeMedia == 0) {
            media.type = 0;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 0) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(componentMediaAudio());
        } else if (typeMedia == 1) {
            media.type = 1;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 1) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(componentMediaText());
        } else if (typeMedia == 2) {
            media.type = 2;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 2) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(compoentMediaAudioDrive());
        } else if (typeMedia == 3) {
            media.type = 3;
            if (Quizzes.media !== null) {
                if (Quizzes.media.type === 3) {
                    return;
                }
                emptyElement(boxMedia);
            }
            Quizzes.media = media;
            boxMedia.appendChild(compoentMediaVideoYtb());
        }
    });
})();

// add question

(() => {

    const boxQuestion = document.getElementById('quiz-list-question');
    const btnChoose = document.getElementById('btn-add-question-choose');
    const btnTrueFalse = document.getElementById('btn-add-question-truefalse');
    const btnWrite = document.getElementById('btn-add-question-write');

    btnChoose.addEventListener('click', () => {
        boxQuestion.appendChild(componentQuestionChoose());
    });

    btnTrueFalse.addEventListener('click', () => {
        boxQuestion.appendChild(componentQuestionTrueFalse());
    });

    btnWrite.addEventListener('click', () => {
        boxQuestion.appendChild(componentQuestionWrite());
    });

})();

const removeBorderRed = (e) => {
    const arrBorderRed = document.querySelectorAll('.dv-border-red');
    arrBorderRed.forEach((item) => {
        item.classList.remove('dv-border-red');
    });
    document.removeEventListener('click', removeBorderRed);
}

// submit

const formAddQuiz = document.getElementById('dv-form-addquiz');
formAddQuiz.addEventListener('submit', async function (e) {
    e.preventDefault();
    // console.log(Quizzes);
    // validate Quizzes để gửi lên server
    if (Quizzes.idLesson === null) {
        mbNotification('Warrning', 'Please choose lesson', 3, 2);
        const boxlesson = document.getElementById('id-lesson-filter');
        boxlesson.scrollIntoView({ behavior: 'smooth', block: 'center' });
        boxlesson.classList.add('dv-border-red');
        document.addEventListener('click', removeBorderRed);
        return;
    }

    if (Quizzes.quizName === null) {
        mbNotification('Warrning', 'Please enter quiz name', 3, 2);
        const quizName = document.getElementById('quiz-name');
        quizName.scrollIntoView({ behavior: 'smooth', block: 'center' });
        quizName.classList.add('dv-border-red');
        document.addEventListener('click', removeBorderRed);
        return;
    }

    if (Quizzes.media !== null) {
        const typeMedia = Quizzes.media.type;
        const obmesaage = {
            0: 'Please choose file audio',
            1: 'Please enter content text',
            2: 'Please enter link audio drive',
            3: 'Please enter iframe video youtube'
        }
        const mesaage = obmesaage[typeMedia];
        if (Quizzes.media.content === null) {
            mbNotification('Warrning', mesaage, 3, 2);
            const boxMedia = document.querySelector('#box-media');
            boxMedia.scrollIntoView({ behavior: 'smooth', block: 'center' });
            boxMedia.classList.add('dv-border-red');
            document.addEventListener('click', removeBorderRed);
            return;
        }
    }

    if (Quizzes.questions.length === 0) {
        mbNotification('Warrning', 'Please add question', 3, 2);
        return;
    }

    for (let i = 0; i < Quizzes.questions.length; i++) {
        const question = Quizzes.questions[i];
        const boxQuestion = document.getElementById('box-question-' + question.idtmp);
        if (question.questionName === null) {
            mbNotification('Warrning', 'Please enter question name', 3, 2);
            boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            boxQuestion.classList.add('dv-border-red');
            document.addEventListener('click', removeBorderRed);
            return;
        }

        if (question.typeAnswers === 0) {
            let isCorrect = false;
            for (let j = 0; j < question.answers.length; j++) {
                const answer = question.answers[j];
                if (answer.answerName === null) {
                    mbNotification('Warrning', 'Please enter answer name', 3, 2);
                    boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    boxQuestion.classList.add('dv-border-red');
                    document.addEventListener('click', removeBorderRed);
                    return;
                }
                if (answer.isCorrect) {
                    isCorrect = true;
                }
            }
            if (!isCorrect) {
                mbNotification('Warrning', 'Please choose answer correct', 3, 2);
                boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                boxQuestion.classList.add('dv-border-red');
                document.addEventListener('click', removeBorderRed);
                return;
            }
        } else if (question.typeAnswers === 1) {
            if (question.answers.answerName === null) {
                mbNotification('Warrning', 'Please enter answer name', 3, 2);
                boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                boxQuestion.classList.add('dv-border-red');
                document.addEventListener('click', removeBorderRed);
                return;
            }
            if (question.answers.answerName === null) {
                mbNotification('Warrning', 'Please enter answer name', 3, 2);
                boxQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                boxQuestion.classList.add('dv-border-red');
                document.addEventListener('click', removeBorderRed);
                return;
            }
        }
    }

    // gửi lên server

    const main = document.querySelector('main');
    try {
        mbLoading(true);
        const dataRes = await mbFetch('admin/quizzes/addQuiz', Quizzes);
        if (dataRes.error) {
            console.error('DuyVan: ', dataRes.error);
            mbNotification('Error', dataRes.error, 2, 2.5);
            return;
        }
        mbNotification('Success', dataRes.message, 1, 2.5);
        resetPage();
    } catch (error) {
        console.log(error);
    } finally {
        mbLoading(false);
    }



});



// reset new quiz

function resetPage() {
    Quizzes.quizName = null;
    Quizzes.media = null;
    Quizzes.questions = [];
    questionIdCounter = 0;
    const boxMedia = document.getElementById('box-media');
    emptyElement(boxMedia);
    const boxQuestion = document.getElementById('quiz-list-question');
    emptyElement(boxQuestion);
    const form = document.getElementById('dv-form-addquiz');
    form.reset();
}


// compoent
function componentMediaAudio() {
    const div = document.createElement('div');
    div.classList.add('div-media-audio');
    const html = `
                <div class="form-group">
                    <label for="">Title media</label>
                    <input type="text" name="title-audio" id="" class="form-control" placeholder="Enter title Audio">
                </div>
                <div class="file-audio">
                    <div class="file-audio-input">
                        <label for="file-audio">Choose Audio</label>
                        <input type="file" name="file-audio" id="file-audio" class="form-control">
                    </div>
                    <div class="file-audio-preview">
                        <audio controls>
                            <source src="#" type="audio/mpeg">
                        </audio>
                    </div>
                </div>
    `;
    div.innerHTML = html;

    const titleAudio = div.querySelector('input[name=title-audio]');
    titleAudio.oninput = function (e) {
        const value = e.target.value;
        Quizzes.media.title = value;
    }

    const fileAudio = div.querySelector('input[type=file]');
    fileAudio.onchange = function (e) {
        const file = e.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            const reader = new FileReader();
            // Đọc file dưới dạng base64 (hoặc có thể là binary)
            reader.onload = function (event) {
                // Gán nội dung file vào object Quizzes
                Quizzes.media.content = event.target.result;
                // Hiển thị file âm thanh đã chọn (tùy chọn)
                const audioPreview = div.querySelector('.file-audio-preview audio source');
                audioPreview.src = URL.createObjectURL(file);
                audioPreview.parentElement.load(); // Tải lại để phát tệp mới
            };
            reader.readAsDataURL(file);
        } else {
            mbNotification('Warrning', 'Not Type MP3', 3, 2);
        }
    };
    return div;
}

function componentMediaText() {
    const div = document.createElement('div');
    div.classList.add('dv-media-text');
    const html = `
                        <div class="form-group">
                    <label for="">Title media</label>
                    <input type="text" name="titletext" id="" class="form-control" placeholder="Enter title text">
                </div>
                <div class="form-group">
                    <label for="">Content Media</label>
                    <div class="textarea" contentEditable="true"></div>
                </div>
    `;
    div.innerHTML = html;

    const titleText = div.querySelector('input[name=titletext]');
    titleText.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.media.title = value;
    }
    const contentText = div.querySelector('.textarea');
    contentText.oninput = function (e) {
        let value = e.target.innerHTML;
        Quizzes.media.content = value || null;
    }
    return div;
}

function compoentMediaAudioDrive() {
    const div = document.createElement('div');
    div.classList.add('dv-media-audio-drive');
    div.innerHTML = `
                <a href="https://docs.google.com/document/d/1bwcO5BRMi4yIYxxchLxG5jtEtxWXMmBQ/edit?usp=drive_link&ouid=103986830156427311078&rtpof=true&sd=true" class="huongdanmb" target="_blank">Totorial</a>
                <div class="form-group">
                    <label for="">Title media</label>
                    <input type="text" name="titleaudiodrive" class="form-control" placeholder="Enter title text">
                </div>
                <div class="form-group">
                    <label for="">Content Media</label>
                    <input type="text" name="contentdrive" placeholder="Enter link audio drive">
                </div>
                <div class="preview"></div>
    `;

    const preview = div.querySelector('.preview');
    const title = div.querySelector('input[name=titleaudiodrive]');
    title.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.media.title = value || null;
    }

    const content = div.querySelector('input[name=contentdrive]');

    content.oninput = function (e) {
        const link = e.target.value;
        const regex = /\/d\/(.+?)\//;
        const match = link.match(regex);
        if (match && match[1]) {
            const fileId = match[1];
            // Tạo URL nhúng cho iframe
            const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
            Quizzes.media.content = embedUrl;
            // Tạo iframe và đặt URL nhúng
            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.allow = "autoplay";  // Cho phép phát tự động nếu cần
            iframe.frameBorder = "0";
            // Xóa iframe cũ nếu có và thêm iframe mới vào div
            emptyElement(preview);
            preview.appendChild(iframe);  // Thêm iframe vào div
        } else {
            mbNotification('Warrning', 'Not link drive', 3);
            emptyElement(preview);
            Quizzes.media.content = null;
        }
    }

    return div;
}

function compoentMediaVideoYtb() {
    const div = document.createElement('div');
    div.classList.add('dv-media-video-ytb');
    div.innerHTML = `
                <a href="https://docs.google.com/document/d/1TKp2lBRqdLk7yLNFqYOoeixxRmZ1dYO8/edit?usp=drive_link&ouid=103986830156427311078&rtpof=true&sd=true" class="huongdanmb" target="_blank">Totorial</a>
                <div class="form-group">
                    <label for="">Title media</label>
                    <input type="text" name="title"  class="form-control" placeholder="Enter title">
                </div>
                <div class="form-group">
                    <label for="">Content Media</label>
                    <input type="text" name="contentytb" placeholder="Enter iframe video youtube">
                </div>
                <div class="preview"></div>
    `;

    const title = div.querySelector('input[name=title]');
    title.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        Quizzes.media.title = value || null;
    }

    const content = div.querySelector('input[name=contentytb]');
    content.oninput = function (e) {
        const preview = div.querySelector('.preview');
        let textIframe = e.target.value;
        textIframe = textIframe.trim();
        console.log(textIframe);

        const firstString = "<iframe";
        const lastString = "</iframe>";

        // Tìm vị trí của thẻ mở và thẻ đóng
        const startIdx = textIframe.indexOf(firstString);
        const endIdx = textIframe.indexOf(lastString);
        let stringIframe = null;
        if (startIdx !== -1 && endIdx !== -1) {
            // Lấy nội dung từ thẻ mở đến thẻ đóng
            stringIframe = textIframe.slice(startIdx, endIdx + lastString.length);
        } else {
            mbNotification('Warrning', 'Not iframe youtube', 3);
            emptyElement(preview);
            Quizzes.media.content = null;
            return;
        }
        Quizzes.media.content = stringIframe;
        emptyElement(preview);
        const preview1 = document.createElement('div');
        preview1.classList.add('preview1');
        preview1.innerHTML = stringIframe;
        preview.appendChild(preview1);
    }
    return div;
}

function componentQuestionChoose() {

    const stt = getOdinal();
    const currentId = ++questionIdCounter;

    const question = {
        idtmp: currentId,
        questionName: null,
        typeAnswers: 0,
        answers: [
            {
                answerName: null,
                isCorrect: false
            },
            {
                answerName: null,
                isCorrect: false
            },
            {
                answerName: null,
                isCorrect: false
            },
            {
                answerName: null,
                isCorrect: false
            }
        ]
    };

    Quizzes.questions.push(question);

    const div = document.createElement('div');
    div.classList.add('dv-question-choose');
    div.id = 'box-question-' + currentId;
    const html = `
                <div class="dv-question-info">
                    <span>${stt}. Question Choose</span>
                    <div class="dv-question-option">
                        <button type="button" class="btn btn-danger" name="del-question" >Delete</button>
                    </div>
                </div>
                <input type="text" placeholder="Question Name" name="name">
                <div class="answers">
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="">
                        <input type="text" placeholder="Answer 1">
                    </div>
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="">
                        <input type="text" placeholder="Answer 2">
                    </div>
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="">
                        <input type="text" placeholder="Answer 3">
                    </div>
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="">
                        <input type="text" placeholder="Answer 4">
                    </div>
                </div>
    `;
    div.innerHTML = html;

    const questioninput = div.querySelector('input[name=name]');
    questioninput.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        question.questionName = value || null;
    }

    const answersName = div.querySelectorAll('.answers input[type=text]');
    answersName.forEach((ans, index) => {
        ans.oninput = function (e) {
            let value = e.target.value;
            value = value.trim();
            question.answers[index].answerName = value || null;
        }
    });

    const inputradio = div.querySelectorAll('.answers input[type=radio]');
    inputradio.forEach((radio, index) => {
        radio.onchange = function (e) {
            question.answers.forEach((ans, i) => {
                ans.isCorrect = i === index;
            });
        }
    });

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = function (e) {
        Quizzes.questions = Quizzes.questions.filter(q => q.idtmp !== currentId);
        div.remove();
    }


    return div;
}

function componentQuestionTrueFalse() {

    const stt = getOdinal();

    const currentId = ++questionIdCounter;

    const question = {
        idtmp: currentId,
        questionName: null,
        typeAnswers: 0,
        answers: [
            {
                answerName: "True",
                isCorrect: false
            },
            {
                answerName: "False",
                isCorrect: false
            }
        ]
    };

    Quizzes.questions.push(question);

    const div = document.createElement('div');
    div.classList.add('dv-question-choose', 'true-false');
    div.id = 'box-question-' + currentId;
    const html = `
                <div class="dv-question-info">
                    <span>${stt}. Question True/False</span>
                    <div class="dv-question-option">
                        <button type="button" class="btn btn-danger" name='del-question' >Delete</button>
                    </div>
                </div>
                <input type="text" placeholder="Question Name" name="question">
                <div class="answers">
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="" value="1">
                        <input type="text" placeholder="Answer 1" value="True" disabled>
                    </div>
                    <div class="group-answer">
                        <input type="radio" name="answer_${currentId}" id="" value="0">
                        <input type="text" placeholder="Answer 2" value="False" disabled>
                    </div>
                </div>
    `;
    div.innerHTML = html;

    const questioninput = div.querySelector('input[name=question]');
    questioninput.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        question.questionName = value || null;
    }

    const inputradio = div.querySelectorAll('input[type=radio]');
    inputradio.forEach((radio, index) => {
        radio.onchange = function (e) {
            question.answers.forEach((ans, i) => {
                ans.isCorrect = i === index;
            });
        }
    });

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = function (e) {
        Quizzes.questions = Quizzes.questions.filter(q => q.idtmp !== currentId);
        div.remove();
    }
    return div;
}

function componentQuestionWrite() {

    const stt = getOdinal();

    const currentId = ++questionIdCounter;

    const question = {
        idtmp: currentId,
        questionName: null,
        typeAnswers: 1,
        answers:
        {
            answerName: null,
            isCorrect: true
        }
    }

    Quizzes.questions.push(question);

    const div = document.createElement('div');
    div.classList.add('dv-question-write');
    div.id = 'box-question-' + currentId;
    const html = `
                <div class="dv-question-info">
                    <span>${stt}. Question Write</span>
                    <div class="dv-question-option">
                        <button type="button" class="btn btn-danger" name="del-question" >Delete</button>
                    </div>
                </div>
                <input type="text" placeholder="Question Name" name="name">
                <input type="text" placeholder="Answer" name="answer">
    `;
    div.innerHTML = html;

    const name = div.querySelector('input[name=name]');
    name.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        question.questionName = value || null;
    }
    const answer = div.querySelector('input[name=answer]');
    answer.oninput = function (e) {
        let value = e.target.value;
        value = value.trim();
        question.answers.answerName = value || null;
    }

    const btnDel = div.querySelector('button[name=del-question]');
    btnDel.onclick = function (e) {
        Quizzes.questions = Quizzes.questions.filter(q => q.idtmp !== currentId);
        div.remove();
    }

    return div;
}

function getOdinal(){
    let total = Quizzes.questions.length;
    return total + 1;
}

// library
function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
