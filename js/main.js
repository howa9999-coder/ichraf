// ============================================================
// PWA INSTALL BUTTON LOGIC
// ============================================================

// Select the install button
const installBtn = document.querySelector('#install-btn');

// Store the deferred prompt so we can trigger it later
 let deferredPrompt = null; 

// Listen for the "beforeinstallprompt" event
window.addEventListener("beforeinstallprompt", (installEvent) => {
    // Prevent the browser from automatically showing the prompt
    installEvent.preventDefault();

    // Remove "display: none" inline style to show the button
    installBtn.style.removeProperty('display');

    // Save the event for later use
    deferredPrompt = installEvent;
}); 

// When the user clicks the install button
installBtn.addEventListener("click", () => {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user's choice
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === "accepted") {
                console.log('User accepted installation');
                // Hide the install button after install
                installBtn.style.display = "none";
            } else {
                console.log('User refused installation');
            }
        });

        // Reset the deferred prompt
        deferredPrompt = null;
    }
}); 

// ============================================================
// SERVICE WORKER REGISTRATION
// ============================================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./sw.js")
        .then((reg) => {
            console.log("Service Worker registered:", reg);
        })
        .catch((err) => {
            console.log("Service Worker registration failed:", err);
        });
}


const elements = {
    tableBody : document.getElementById('tableBody'),
    name : document.getElementById('name'),
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
    logs : JSON.parse(localStorage.getItem('logs')) || [],
    cards: JSON.parse(localStorage.getItem('cards')) || [],
    groupName : JSON.parse(localStorage.getItem('groupName')) || null,
    teacher : JSON.parse(localStorage.getItem('teacher')) || null,
    admin : JSON.parse(localStorage.getItem('admin')) || null,
    week : JSON.parse(localStorage.getItem('week')) || null,
    index : JSON.parse(localStorage.getItem('index')) || 0,

}

let index = null
elements.groupInput.value = localStorageObj.groupName 
elements.teacherInput.value = localStorageObj.teacher 
elements.adminInput.value = localStorageObj.admin 
elements.weekInput.value = localStorageObj.week 

if(localStorageObj.logs.length>0){
    renderTable()
}
/* Add new student */
function addStudent() {
    const entry = {
        name: elements.name.value,
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
        name: elements.name.value,
        cards: []
    }
    localStorageObj.logs.push(entry);
    localStorage.setItem('logs', JSON.stringify(localStorageObj.logs));
    localStorageObj.cards.push(entryCards);
    localStorage.setItem('cards', JSON.stringify(localStorageObj.cards));
    renderTable();
    elements.name.value= ''
    elements.entryModal.close();
}
/* Reset Data */
elements.refreshBtn.addEventListener('click', ()=>{
    localStorageObj.logs.forEach(student => {
        for(let key in student){
            if(key != 'name'){
                student[key] = 0
            }
        }
    })
    localStorage.setItem('logs', JSON.stringify(localStorageObj.logs))
    localStorageObj.cards.forEach(studentCards => {
        studentCards.cards = []
    })
    localStorage.setItem('cards', JSON.stringify(localStorageObj.cards))
    renderTable()
})
/* Clear table: delete all students */
elements.clearTable.addEventListener('click', ()=>{
    localStorageObj.logs = []
    localStorage.removeItem('logs')
    localStorageObj.cards = []
    localStorage.removeItem('cards')
    localStorage.removeItem('index')
    renderTable()
})

/*  Display Table with data */
function renderTable() {
    elements.tableBody.innerHTML = '';
    
    localStorageObj.logs.forEach((log, index) => {
        const row = elements.tableBody.insertRow();
        const cardsNum = localStorageObj.cards[index].cards.length
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
/* Student card: disply, edit, delete */
function showDetails(index) {
    const students = localStorageObj.logs
    const student = students[index];
    const cards = localStorageObj.cards
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
    elements.howToUse.classList.add('hidden')
    elements.saveBtn.onclick = ()=>{
        students[index].name = elements.studentInput.value
        students[index].course = elements.course.value
        students[index].tajwid = elements.tajwid.value
        students[index].tajwidCatchUp = elements.tajwidCatchUp.value
        localStorage.setItem('logs', JSON.stringify(students));
    }
    elements.deleteBtn.onclick = ()=>{
        /* delete an element from an array */
        students.splice(index, 1)
        localStorage.setItem('logs', JSON.stringify(students))
        cards.splice(index, 1)
        localStorage.setItem('cards', JSON.stringify(cards))
        console.log(Number(localStorageObj.index))
        // TO CHANGE INDEX VALUE IN LOCALSTORAGE IF IT IS HIGHER THAN CARDS LENGTH - 1
        if(cards.length-1<Number(localStorageObj.index)){
            localStorageObj.index = 0
            localStorage.setItem('index', JSON.stringify(localStorageObj.index))
        }
    }
}

function showList() {
    elements.listReview.classList.remove('hidden');
    elements.inputsContainer.classList.remove('hidden')
    elements.detailView.classList.add('hidden');
    elements.howToUse.classList.remove('hidden')
    renderTable();
}

 elements.groupInput.addEventListener('input', function(){
    localStorage.setItem('groupName', JSON.stringify(elements.groupInput.value));
 })
 elements.teacherInput.addEventListener('input', function(){
    localStorage.setItem('teacher', JSON.stringify(elements.teacherInput.value));
 })
  elements.adminInput.addEventListener('input', function(){
    localStorage.setItem('admin', JSON.stringify(elements.adminInput.value));
 })
  elements.weekInput.addEventListener('input', function(){
    localStorage.setItem('week', JSON.stringify(elements.weekInput.value));
 })

// TO COPY REPORT 
// add an other for moaaskar report
elements.copyBtn.addEventListener('click', ()=>{
    let logs = localStorageObj.logs
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
    let teacher = localStorageObj.teacher
    let admin = localStorageObj.admin
    let week = localStorageObj.week
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