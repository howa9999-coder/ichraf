//========Elements and Objects
const localStorageObj ={
    groups: JSON.parse(localStorage.getItem('groups')) || [],
    groupIndex: JSON.parse(localStorage.getItem('groupIndex')) || 0,
    studentIndex: JSON.parse(localStorage.getItem('groupIndex')) || 0
}
const group = localStorageObj.groups[localStorageObj.groupIndex]
const cardsElements = {
    groupName: document.querySelector('.group-name'),
    addCardBtn: document.querySelector('#add-card'),
    selectInput: document.querySelector('#names'),
    cardsContainer: document.querySelector('.cards-container'),
    addCard: document.querySelector('#add-card'),
    clearCards: document.querySelector('#clear-cards')
}
cardsElements.selectInput.innerHTML = ''
cardsElements.groupName.innerHTML = ` مجموعة <b>${group.name}</b> `
//=========== Feed the select input 

group.logs.forEach((log, index) => {
    cardsElements.selectInput.innerHTML += `<option value="${index}" >${log.name}</option>`
});

let studentCards = group.cards[localStorageObj.studentIndex].cards
let studentName = group.cards[localStorageObj.studentIndex].name
/* Load All Cards if available */
cardsElements.selectInput.value = localStorageObj.studentIndex

//================= Function to display cards from the cards array, then to be used for delete 
function cardsLoad(){
    cardsElements.cardsContainer.innerHTML=''
    studentCards.forEach((card, cardIndex) => {
        renderCard(localStorageObj.studentIndex, studentName, cardIndex)
    });
}
cardsLoad()


//==================== Render card 
function renderCard(index, studentName, cardIndex){
    //console.log(studentName)
    const studentCard = studentCards[cardIndex]
    //console.log(studentCard)
    const newCard = `
        <div class="card" id= "card-${studentName}-${cardIndex}">
            <!-- Card Header -->
            <div class="card-header">
                <div class="card-number">${cardIndex+1}</div>
                <button id="delete-btn-card" class="btn close-btn" onclick="deleteCard(${index}, ${cardIndex}, event)" >X</button>          
            </div>
            <!-- Card Body -->
            <div class="select-container">
                <label for="c-session">الدورة</label>
                <select id="c-session-${studentName}-${cardIndex}">
                    <option value="1" ${studentCard.session == 1? 'selected' : ''}>عادية</option>
                    <option value="2" ${studentCard.session == 2? 'selected' : ''}>إستدراك</option>                    
                </select>
            </div>
            <div class="select-container">
                <label for="c-hifz">الحفظ:</label>
                <select id="c-hifz-${studentName}-${cardIndex}">
                    <option value="0" ${studentCard.hifz == 0? 'selected' : ''}>لا</option>
                    <option value="0.5" ${studentCard.hifz == 0.5 || studentCard.hifz == 0.25? 'selected' : ''}>نعم</option>                    
                </select>
            </div> 
            <div class="select-container">
                <label for="c-tafsir">التفسير:</label>
                <select id="c-tafsir-${studentName}-${cardIndex}">
                    <option value="0" ${studentCard.tafsir == 0? 'selected' : ''}>لا</option>
                    <option value="0.5" ${studentCard.tafsir == 0.5 || studentCard.tafsir == 0.25? 'selected' : ''}>نعم</option>   
                </select>
            </div>
            <div class="select-container">
                <label for="c-review">المراجعة:</label>
                <select id="c-review-${studentName}-${cardIndex}">
                    <option value="0" ${studentCard.review == 0? 'selected' : ''}>لا</option>
                    <option value="1" ${studentCard.review == 1 || (studentCard.review == 0.5 && studentCard.session == 2)? 'selected' : ''}>نعم</option>  
                    <option value="0.75" ${studentCard.review == 0.75 || studentCard.review == 0.375? 'selected' : ''}>تغيير</option>
                    <option value="0.5" ${(studentCard.review == 0.5 && studentCard.session == 1) || studentCard.review == 0.25 ? 'selected' : ''}>نقصان</option>
                </select>
            </div>   
            <div class="select-container">
                <label for="c-company">الرفيقة:</label>
                <select id="c-company-${studentName}-${cardIndex}">
                    <option value="0" ${studentCard.company == 0? 'selected' : ''}>لا</option>
                    <option value="1" ${studentCard.company == 1? 'selected' : ''}>نعم</option>  
                </select>
            </div> 
            <div class='btns-container'>
                <button id="save-btn-card" class="btn save-btn" onclick="saveChanges(${index}, '${studentName}', ${cardIndex}, event)" >حفظ</button>          
            </div>
        </div>        
        `
    cardsElements.cardsContainer.insertAdjacentHTML('afterbegin', newCard)
}

//================ FUNCTION for select change EVENT FOR DISPLAYING CARDS OF THE SELECTED STUDENT AND SAME ITS INDEX AS INDEX VARIABLE

cardsElements.selectInput.addEventListener('change', function(){
    /* log the index */
    cardsElements.cardsContainer.innerHTML=''
    localStorageObj.studentIndex = cardsElements.selectInput.value
    localStorage.setItem('studentIndex', JSON.stringify(localStorageObj.studentIndex));
    studentCards = group.cards[localStorageObj.studentIndex].cards
    studentName = group.cards[localStorageObj.studentIndex].name
    cardsLoad()
})

/* Add new card */
function addCardFunction(e){
    const cardEntry = {
        session: 1,
        hifz: 0,
        tafsir: 0,
        review: 0,
        company: 0,
    }

    studentCards.push(cardEntry)
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups));
    //let indexOfCard = card.length - 1
    cardsLoad()   
    handleClick(e, 'flash-success-btn', 50)
}

/* Clear All Cards of a Known Student */
function clearCardFunction(e){
    studentCards=[]
    group.cards[localStorageObj.studentIndex].cards = []
    group.logs[localStorageObj.studentIndex].hifz = 0
    group.logs[localStorageObj.studentIndex].tafsir = 0
    group.logs[localStorageObj.studentIndex].review = 0
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups));
    cardsLoad()    
    handleClick(e, 'flash-warning-btn', 65)     
}
//=============== Delete a Specific Card 
function deleteCard(index, cardIndex, e){
    handleClick(e, 'flash-warning-btn', 65)
    removePoints(index, cardIndex)
    studentCards.splice(cardIndex, 1)
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups)) 
    cardsLoad()
}
//STOP================ Save changes function 
function saveChanges(index, studentName,cardIndex, e){
    console.log(index)
    let card = studentCards[cardIndex]
    // IF THE SESSION WAS NORMAL THEN THE STUDENT KEEP THE WHOLE POINT, IF IT IS NOT HE KEEP ONLY THE HALF OF IT
    let sessionValue = document.getElementById(`c-session-${studentName}-${cardIndex}`).value
    card.session = sessionValue
    card.hifz = document.getElementById(`c-hifz-${studentName}-${cardIndex}`).value / sessionValue
    card.tafsir = document.getElementById(`c-tafsir-${studentName}-${cardIndex}`).value / sessionValue
    card.review = document.getElementById(`c-review-${studentName}-${cardIndex}`).value / sessionValue
    card.company = document.getElementById(`c-company-${studentName}-${cardIndex}`).value 
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups));  
    addPoints(index)
    handleClick(e, 'flash-success-btn', 50)
}

//FUNCTION TO ADD NEW POINTS TO LOG
function addPoints(studentIndex){
    const log = group.logs[studentIndex]
    // Reset all to 0, then start counting
    log.hifz = 0
    log.tafsir = 0
    log.review = 0
    log.hifzCatchUp = 0
    log.tafsirCatchUp = 0
    log.reviewCatchUp = 0
    log.fullReview = 0
    studentCards.forEach(card => {
        if(card.session == 1){
            log.hifz += Number(card.hifz)
            log.tafsir += Number(card.tafsir)
            log.review += Number(card.review) 
            log.fullReview += Number(card.review) 
        }
        if(card.session == 2){
            log.hifzCatchUp += Number(card.hifz)
            log.tafsirCatchUp += Number(card.tafsir)
            log.reviewCatchUp += Number(card.review) 
        }
   
    }) 
    companyEffect(studentIndex, studentCards) 
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups))
}

// TO DELETE POINTS WHEN THE THE USER DELETE THE CARD
function removePoints(studentIndex, cardIndex){
    const card = studentCards[cardIndex]
    const log = group.logs[studentIndex]
    if(card.session == 1){
        log.hifz -= Number(card.hifz)
        log.tafsir -= Number(card.tafsir)
        log.review -= Number(card.review)
        log.fullReview = Number(log.fullReview) - 1
    }
    if(card.session == 2){
        log.hifzCatchUp -= Number(card.hifz)
        log.tafsirCatchUp -= Number(card.tafsir)
        log.reviewCatchUp -= Number(card.review)
    }
    localStorage.setItem('groups', JSON.stringify(localStorageObj.groups))
}


// COMPANY EFFECT FUNCTION, TO REMOVE 1 OR 0.5 POINT FROM REVIEW POINTS IF THE STUDENT DIDNT REVIEW WITH A COMPANY OVER 3 TIMES
//=== RE READ THE COMPANY EFFECT FUNCTION END RE DO TO FIT THE NEW VARIABLES
/*
*******************************************************
*********************************************************
************************************************************* 
 */
function companyEffect(studentIndex, studentCards){

    const matchingCatchup = studentCards.filter(obj => obj.session == 2)

    // COUNT THEM
    const countCatchup = matchingCatchup.length

    // sum
    const sumCatchupCompany = matchingCatchup.reduce((acc, obj)=> Number(acc) + Number(obj.company), 0)

    if(countCatchup >= 3 && sumCatchupCompany < 3){
        group.logs[studentIndex].reviewCatchUp = group.logs[studentIndex].reviewCatchUp - 0.5
    }

    //==============================
    // GET ONLY OBJECTS WHERE SESSION == 2
    const matchingNormal = studentCards.filter(obj => obj.session == 1)

    // COUNT THEM
    const countNormal = matchingNormal.length

    // sum
    const sumNormalCompany = matchingNormal.reduce((acc, obj)=> Number(acc) + Number(obj.company), 0)

    if(countNormal >= 3 && sumNormalCompany < 3){
        group.logs[studentIndex].review = group.logs[studentIndex].review - 1
    }

}

//THIS FUNCTION TO HANDLE CLICK EVENT, CLASS AND TIME OF VIBRATION ARE THE PARAMETERS
function handleClick(e, cssClass, num){
    console.log('click')
     if('vibrate' in navigator){
        navigator.vibrate(num) // 50 ms ... 30 - 100
        // success = 50 / warning = 65
    }
    const btn = e.currentTarget
    btn.classList.add(cssClass)
    setTimeout(() => btn.classList.remove(cssClass), 250)
} 

