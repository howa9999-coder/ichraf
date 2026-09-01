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
    groupsContainer: document.getElementById('groupsContainer'),
    teacherNameInput: document.getElementById('teacher-name'),
    groupNameInput: document.getElementById('group-name'),
    adminInput: document.getElementById('admin-name'),
    addGroupBtn: document.getElementById('addGroupBtn')
}
elements.addGroupBtn.addEventListener('click', ()=> {
    addGroup()
    elements.groupNameInput.value = ''
    elements.teacherNameInput.value = ''
})
const groupsContainer = elements.groupsContainer
const groups = JSON.parse(localStorage.getItem('groups')) || []
const varLocalStorage= { 
    adminName: JSON.parse(localStorage.getItem('admin')) || null,
    GroupName: groups.name || null,
    teacherName: groups.teacher || null
}
elements.adminInput.value = varLocalStorage.adminName
elements.adminInput.addEventListener('change', ()=>{
    const adminName = elements.adminInput.value
    localStorage.setItem('admin', JSON.stringify(adminName))
})
//DISPLAY ALL STORED GROUPS AND ADD & DELETE A GROUP
function addGroup(){
    const groupEntry ={
        name: elements.groupNameInput.value,
        teacher: elements.teacherNameInput.value,
        week: null,
        creationDate: new Date().toISOString().split('T')[0],
        cards:[],
        logs:[]
    }
    groups.push(groupEntry)
    localStorage.setItem('groups', JSON.stringify(groups))
    displayCards()
}
displayCards()
function displayCards(){
    groupsContainer.innerHTML=''
    groups.forEach((group, index) => {
        cardGroup(group.name, index, group.logs.length, group.creationDate)  
    });
}
function cardGroup(groupName, groupIndex, arrayLength, creationDate){
    const newGroupCard = `
        <div class="group-card">
            <button class="close-btn" aria-label="إغلاق" onclick="deleteGroup(${groupIndex})">&times;</button>
            <h2 class="group-title" onclick="displayGroup(event)" data-index =${groupIndex}> ${groupName} </h2>
            <div class="card-info">
                <div class="info-row">
                    <span class="info-label">عدد الطلاب:</span>
                    <span class="students-badge">${arrayLength} طالب</span>
                </div>
                <div class="info-row">
                    <span class="info-label">تاريخ الإنشاء:</span>
                    <span class="date-badge">${creationDate}</span>
                </div>
            </div>
        </div>
    `
    groupsContainer.insertAdjacentHTML('afterbegin', newGroupCard)

}
function deleteGroup(groupIndex){
    groups.splice(groupIndex, 1)
    localStorage.setItem('groups', JSON.stringify(groups))
    displayCards()
}

function displayGroup(e){
    const btn = e.target
    const indexGroup = btn.dataset.index
    //console.log(indexGroup)
    localStorage.setItem('groupIndex', JSON.stringify(indexGroup))
    window.location.href='/group.htm'
}
