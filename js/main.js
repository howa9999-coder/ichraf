const elements = {
    tableBody : document.getElementById('tableBody'),
    studentName : document.getElementById('name'),
    inputsContainer : document.querySelector('.inputs-container'),
    groupInput: document.querySelector('#group-name'),
    teacherInput: document.querySelector('#teacher'),
    adminInput : document.querySelector('#admin'),
    weekInput : document.querySelector('#week'),
    refreshBtn: document.querySelector('#refresh-btn'),
    clearTable: document.querySelector('#clear-table'),
    studentInput : document.querySelector('#dName'),
    hifz: document.getElementById('dHifz'),
    tafsir: document.getElementById('dTafsir'),
    review: document.getElementById('dReview'),
    course: document.getElementById('dCourse'),
    tajwid: document.getElementById('dTajwid'),
    hifzCatchUp: document.getElementById('dHifzCatchUp'),
    tafsirCatchUp: document.getElementById('dTafsirCatchUp'),
    reviewCatchUp: document.getElementById('dReviewCatchUp'),
    tajwidCatchUp: document.getElementById('dTajwidCatchUp'),
    listReview: document.getElementById('listView'),
    detailView: document.getElementById('detailView'),
    saveBtn: document.querySelector('#save-btn'),
    deleteBtn: document.querySelector('#delete-btn'),
    copyBtn: document.querySelector('#copy-btn'),
    entryModal: document.getElementById('entryModal'),
    howToUse: document.querySelector('.how-to-use')
}

let localStorageObj = {
    groups : JSON.parse(localStorage.getItem('groups')) || null,
    admin : JSON.parse(localStorage.getItem('admin')) || null,
    groupIndex : JSON.parse(localStorage.getItem('groupIndex')) || 0,
}

const group = localStorageObj.groups[localStorageObj.groupIndex]
/* INPUTS ELEMENTS AND VALUES */
elements.groupInput.value = group.name 
elements.teacherInput.value = group.teacher
/* elements.adminInput.value = localStorageObj.admin || null */
elements.weekInput.value = group.week || null 
elements.teacherInput.addEventListener('change', ()=>{
    group.teacher = elements.teacherInput.value
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups))
})
elements.weekInput.addEventListener('change', ()=>{
    group.week = elements.weekInput.value
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups))
})

/* ADD NEW STUDENT AND DISPLAY ALL STUDENT IN THE TABLE */
function addStudent() {
    const entry = {
        name: elements.studentName.value,
        hifz: 0,
        tafsir: 0,
        review: 0,
        course: 0,
        tajwid: 0,
        hifzCatchUp: 0,
        tafsirCatchUp: 0,
        reviewCatchUp: 0,
        tajwidCatchUp: 0,
        fullReview: 0
    };
    const entryCards = {
        name: elements.studentName.value,
        cards: []
    }
    group.logs.push(entry);
    group.cards.push(entryCards);
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups));
    renderTable();
    elements.studentName.value= '';
    elements.entryModal.close();
}
/*  Display Table with data */
function renderTable() {
    elements.tableBody.innerHTML = '';
    
    group.logs.forEach((log, index) => {
        const row = elements.tableBody.insertRow();
        const cardsNum = group.cards[index].cards.length
        row.innerHTML = `<td>${cardsNum}</td><td>${log.name}</td>
        <td class='cell'><strong>${log.hifz}</strong> + ${log.hifzCatchUp}</td>
        <td class='cell'><strong>${log.tafsir}</strong> + ${log.tafsirCatchUp}</td>
        <td class='cell'><strong>${log.review}</strong> + ${log.reviewCatchUp}</td>       
        <td class='cell'><strong>${log.tajwid}</strong> + ${log.tajwidCatchUp}</td>
        <td class='cell'>${log.course}</td>
        <td class='cell'>${log.fullReview}</td>
        `;
        row.onclick = () => showDetails(index);
    });
}
renderTable()
//================> continue edit student, delete student, refresh btn, go to cards
/* Student card: disply, edit, delete */
function showDetails(index) {
    const students = group.logs
    const student = students[index];
    const cards = group.cards
    index = index
    //DO: ADD CATCHUP TO INPUT (HOW TO ADD TWO VALUES AT SAME TIME TO INPUT) OR CHANGE TAG
    elements.studentInput.value = student.name;
    elements.hifz.value = student.hifz;
    elements.tafsir.value = student.tafsir;
    elements.review.value = student.review ; 
    elements.course.value = student.course;       
    elements.tajwid.value = student.tajwid;
    elements.hifzCatchUp.value = student.hifzCatchUp;
    elements.tafsirCatchUp.value = student.tafsirCatchUp;
    elements.reviewCatchUp.value = student.reviewCatchUp ;
    elements.tajwidCatchUp.value = student.tajwidCatchUp;
    elements.listReview.classList.add('hidden');
    elements.detailView.classList.remove('hidden');
    elements.inputsContainer.classList.add('hidden')
    elements.saveBtn.addEventListener('click', ()=> saveStudentChanges(students, cards, index))

    elements.deleteBtn.addEventListener('click', ()=> deleteStudent(students, cards, index))
}

//WHY WHEN  CLICK ON CHANGE THE SECOND TIME ALL ROWS BECOMES SIMILAR TO THE CHANGED ONE
function saveStudentChanges(students,cards, index){
    students[index].name = elements.studentInput.value
    cards[index].name = elements.studentInput.value
    students[index].course = elements.course.value
    students[index].tajwid = elements.tajwid.value
    students[index].tajwidCatchUp = elements.tajwidCatchUp.value
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups));
}

function deleteStudent(students, cards, index){
        students.splice(index, 1)
        cards.splice(index, 1)
        localStorage.setItem('groups', JSON.stringify(localStorageObj.groups))
        // TO CHANGE INDEX VALUE IN LOCALSTORAGE IF IT IS HIGHER THAN CARDS LENGTH - 1
/*         if(cards.length-1<Number(localStorageObj.index)){
            localStorageObj.index = 0
            localStorage.setItem('index', JSON.stringify(localStorageObj.index))
        } */
       renderTable()
}

function showList() {
    elements.listReview.classList.remove('hidden');
    elements.inputsContainer.classList.remove('hidden')
    elements.detailView.classList.add('hidden');
    //elements.howToUse.classList.remove('hidden')
    renderTable();
}

/* Reset Data */
elements.refreshBtn.addEventListener('click', ()=>{
    group.logs.forEach(student => {
        for(let key in student){
            if(key != 'name'){
                student[key] = 0
            }
        }
    })
    group.cards.forEach(studentCards => {
        studentCards.cards = []
    })
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups))
    renderTable()
})
/* Clear table: delete all students */
elements.clearTable.addEventListener('click', ()=>{
    group.logs = []
    group.cards = []
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups))   
    renderTable()
})

// TO COPY REPORT 
// add an other for moaaskar report
elements.copyBtn.addEventListener('click', ()=>{
    let logs = group.logs
    const header = reportHeader()
    let body =``
    logs.forEach(student=>{
        body += `
        _${student.name}:_
        - الحفظ: ${student.hifz} + ${student.hifzCatchUp}
        - التفسير: ${student.tafsir} + ${student.tafsirCatchUp}
        - المراجعة: ${student.review} + ${student.reviewCatchUp}
        - الحصة: ${student.course}
        - التجويد: ${student.tajwid} + ${student.tajwidCatchUp}
        -------------------------
        `
    })

    reportCopied(header, body)

})
function reportHeader(){
    let teacher = group.teacher
    let admin = localStorageObj.admin
    let week = group.week
    const header = `
    الأسبوع: ${week}
    المشرفة: ${admin}
    الأستاذة: ${teacher}
    ----------------------
    \n
    `
    return header
}
function reportCopied(header, body){
    navigator.clipboard.writeText(header + body).then(()=>{
        alert('تم نسخ التقرير بنجاح!')
    }).catch(err =>{
        alert('failed to copy: ', err)
    })
}
