const LOGIN = 'login';
const MAIN = 'main';
const OPC_TO_ALL =  `
    <li class="all" onclick="selectUserSendMessage(this)" data-identifier="participant">
        <i>
            <ion-icon name="people-sharp"></ion-icon>                
            <p>Todos</p>
        </i>
        <ion-icon class="check" name="checkmark-sharp"></ion-icon>    
    </li>`;
const MESSAGE_INTERVAL = 3000;


const BTN_PUBLIC_VISIBILITY = document.querySelector('#message .check');
const BTN_PRIVATE_VISIBILITY = document.querySelector('#private_message .check');

let username;
let connectedInterval = null;
let loadMessageInterval = null;
let selectedUsername = null
let slectedMessageVisibility = 'message';
let currentScreen = LOGIN;

/* Enter Control */


window.addEventListener('keydown',listenToClick);


function listenToClick(e){
    if(e.key === 'Enter'){
        if(currentScreen === LOGIN) loginUser();
        else sendMessage();
    }

    else if(currentScreen === MAIN) {
        requestFocusMessage();
    }

    else{
        requestFocusUser();
    }
}

function requestFocusMessage(){
    const textArea = document.querySelector('footer input');
    textArea.focus();
}

function requestFocusUser(){
    const userLogin = document.querySelector('.login input');
    userLogin.focus();
}

/* Onde a lógica inicia */
function loginUser(){
    username = document.querySelector('.login input').value;
    const objUsername = {name: username};
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', objUsername);
    loading();
    promise.catch(userError);
    promise.then(verifyUser);
}

function verifyUser(answer){
    if(answer.status == 200) {
        loadMessage();
        loadUsers();
        setTimeout(hideLogin, 100);        
        connectedInterval = setInterval(keepConnected, 5000);
        loadMessageInterval = setInterval(loadMessage, MESSAGE_INTERVAL);
        setInterval(loadUsers, 3000);
        currentScreen = MAIN;
    }
}


function userError(){
    const inputLogin = document.querySelector('.login input');
    inputLogin.setAttribute('placeholder','Usuário já existe');
    inputLogin.value = '';
    inputLogin.classList.add('erro');
    loading();
}


function keepConnected(){
    const repositorio = 'https://mock-api.driven.com.br/api/v4/uol/status';
    const promise = axios.post(repositorio, {name: username});
}


function hideLogin(){
    document.querySelector('.loginScreen').classList.add('hide');
}

function loading(){
    const loginScreen = document.querySelector('.login');
    const loadingScreen = document.querySelector('.loading');

    loginScreen.classList.toggle('hide');
    loadingScreen.classList.toggle('hide');
}

function loadMessage(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promise.then(showMessage);
}


function loadUsers(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promise.then(getUsers);
}


function getUsers(userList){
    const users = userList.data;
    const userArea = document.querySelector('.contacts ul');
    userArea.innerHTML = OPC_TO_ALL; // adiciona opção enviar para todos

    let isOnlineYet = false;

    users.forEach(userContact => {
        const isOnline = usernameOptIsOnline(selectedUsername, userContact.name);
        userArea.innerHTML += usernameOpt(userContact.name, isOnline);

        if(isOnline) isOnlineYet = true;
    });

    if(!isOnlineYet){
        selectUserSendMessage(document.querySelector('.all'));
    }   
    
}

function usernameOptIsOnline(selectedUser, user){
    return selectedUser === user;
}

function usernameOpt(name, checked){
    let userContact =`
        <li onclick="selectUserSendMessage(this)" data-identifier="participant">
            <i>
                <ion-icon name="people-sharp"></ion-icon>                
                <p>${name}</p>
            </i>
            <ion-icon class="check ${checked? "selected" : ""}" name="checkmark-sharp"></ion-icon>    
        </li>`

        if(name === username) userContact = '';

    return userContact;
}

function showMessage(answer){
    const messageList = answer.data;
    document.querySelector('main').innerHTML = '';

    messageList.forEach(addMessage);

    const recentMessage = document.querySelector('main article:last-child');
    recentMessage.scrollIntoView();    
}

function addMessage(objMessage){
    const mesageArea = document.querySelector('main');
    mesageArea.innerHTML += assemblemessage(objMessage);
}

function assemblemessage(objMsg){
    switch(objMsg.type){
        case 'status':
            return statusMessage(objMsg.time, objMsg.from, objMsg.text);

        case 'message':
            return normalMessage(objMsg.time, objMsg.from, objMsg.to, objMsg.text); 

        case 'private_message':
            if(objMsg.from === username || objMsg.to === username){
                return privateMessage(objMsg.time, objMsg.from, objMsg.to, objMsg.text);
            }
    }
}

function statusMessage(time, from, text){
    const message = `
        <article class="in-out-msg"  data-identifier="message">
            <span>
                <time>(${time})</time>
                <strong id="fromUser">${from}</strong>
            </span>                
            <p>: ${text}</p>
        </article>`;
    
    return message;
}

function normalMessage(time, from, to, text){
    const message = `
        <article  data-identifier="message">
            <span>
                <time>(${time})</time>
                <strong id="fromUser">${from}</strong>
                <p>para</p>
                <strong id="toUser">${to}</strong>
            </span>                
            <p>: ${text}</p>
        </article>`;
    
    return message;
}

function privateMessage(time, from, to, text){
    const message = `
        <article class="reserved-msg"  data-identifier="message">
            <span>
                <time>(${time})</time>
                <strong id="fromUser">${from}</strong>
                <p>para</p>
                <strong id="toUser">${to}</strong>
            </span>                
            <p>: ${text}</p>
        </article>`;
    
    return message;
}

function sendMessage(){
    const labelMessage = document.querySelector('footer input');

    if(labelMessage.value){
        const message = {
            from: username,
            to: selectedUsername,
            text: labelMessage.value,
            type: slectedMessageVisibility
        }
    
        labelMessage.value = '';
    
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', message);
        promise.then(()=>{
            clearInterval(loadMessageInterval);
            loadMessage();
            loadMessageInterval = setInterval(loadMessage, MESSAGE_INTERVAL);
        });
        promise.catch(()=>{window.location.reload});
    }
    
}


function sidebar(status){
    const sidebarBG = document.querySelector('.sidebar');
    const background = document.querySelector('.sidebar .background');
    const nav = document.querySelector('nav');
    if(status){
        sidebarBG.classList.remove('hide');
        setTimeout(() => {
            background.classList.add('background-expand');
            nav.classList.add('nav-expand');
        }, 100);

    } else {
        background.classList.remove('background-expand');
        nav.classList.remove('nav-expand');
        setTimeout(() => {
            sidebarBG.classList.add('hide');
        }, 100);
    }
}


/* Escolha de destinatário e visibilidade das mensagens */

function selectUserSendMessage(contact){

    selectedUsername = contact.querySelector('p').innerHTML;
    const checkOfContact = contact.querySelector('.check');
    const checkEnable = document.querySelector('.contacts li .check.selected');

    if(checkEnable){
        checkEnable.classList.remove('selected');
    }
    else {
        const allContactsOpc = document.querySelector('.contacts li.all');
        allContactsOpc.classList.add('selected');
    }

    checkOfContact.classList.add('selected');
    conflictVerify();
}


function messageVisibility(opc){
    slectedMessageVisibility = opc.id;
    const checkIcon = document.querySelector('.visibility li .check.selected');
    checkIcon.classList.remove('selected');
    opc.querySelector('.check').classList.add('selected');
    conflictVerify();
}


function conflictVerify(){
    if(selectedUsername === 'Todos'){
        BTN_PUBLIC_VISIBILITY.classList.add('selected');
        BTN_PRIVATE_VISIBILITY.classList.remove('selected')
        slectedMessageVisibility = 'message'
    }
}