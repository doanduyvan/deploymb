import { mbNotification, mbConfirm, mbLoading, mbFetch, mbPagination, mbFormData } from '../allmodule.js';

const divRoot = document.getElementById('root');
divRoot.innerHTML = `
<div class="dv-content">
    <div class="dv-content-title">Progress</div>
    <div class="dv-content-box box1">
    </div>

    <div class="dv-content-box box2">
    </div>

</div>
`;

const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get('class');
if (!classId) {
    window.location.href = 'classes/myclass';
}


// get progress

(async () => {
    const url = "classes/getprogressbyclass/" + classId;
    try {
        mbLoading(true);
        const res = await mbFetch(url);
        if (res.error) {
            mbNotification('Error',res.error, 2, 3);
            return;
        }
        renderProgress(res);
    } catch (err) {
        console.log(err);
    } finally {
        mbLoading(false);
    }
})();

function renderProgress(data) {
    const box1 = document.createElement('div');
    box1.classList.add('dv-content-box', 'box1');
    box1.innerHTML = `
            <p class="courseName">Course Name: <span>${data.courseName}</span></p>
    <p class="className">ClassName: <span>${data.className}</span></p>
    <div class="box-progress">
        <div class="progress" id="progress" style="--score: ${data.percentClass}%">
            <div class="progress_bar"></div>
        </div>
        <div id="show_Percent">${data.percentClass}% Learnt</div>
    </div>
    `;

    const box2 = document.createElement('div');
    box2.classList.add('dv-content-box', 'box2');
    data.lessons.forEach(lesson => {
        const boxItem = document.createElement('div');
        boxItem.classList.add('box2-item');
        boxItem.innerHTML = `
               <div class="chart-container">
            <h4 class="chart-title">${lesson.lessonName} <span>(${lesson.percentLesson}%)</span></h4>
            <div class="chart"></div>
        </div>
        `;
        const chart = boxItem.querySelector('.chart');
        lesson.quizzes.forEach(quiz => {
            const div = document.createElement('div');
            const percent = quiz.percentQuiz;
            div.innerHTML = `
                    <div class="bar${percent <= 10 ? ' red' : ''}" style="--width: ${percent}%">. <div>${percent}%</div> </div>
                    <div class="bar-label">${quiz.quizName}</div>
                    <div class="separator"></div>
            `;
            chart.appendChild(div);
        });
        box2.appendChild(boxItem);
    });

    const oldbox1 = document.querySelector('.dv-content-box.box1');
    const oldbox2 = document.querySelector('.dv-content-box.box2');
    oldbox1.replaceWith(box1);
    oldbox2.replaceWith(box2);
}