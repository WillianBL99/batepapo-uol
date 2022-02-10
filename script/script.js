
let user = {name: ''};
let connectedInterval = null;
let loadMessageInterval = null;

let lastMessage = null;

function loginUser(){
    user.name = document.querySelector('.login input').value;
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', user);
    loading();
    promise.catch(userError);
    promise.then(verifyUser);
}

function verifyUser(answer){
    console.log(answer.status)
    if(answer.status == 200) {
        loadMessage();
        setTimeout(hideLogin, 100);        
        connectedInterval = setInterval(keepConnected, 5000);
        loadMessageInterval = setInterval(loadMessage, 3000);
    }
}


function userError(answer){
    const inputLogin = document.querySelector('.login input');
    inputLogin.setAttribute('placeholder','Usuário já existe');
    inputLogin.value = '';
    inputLogin.classList.add('erro');
    loading();
}


function keepConnected(){
    const repositorio = 'https://mock-api.driven.com.br/api/v4/uol/status';
    const promise = axios.post(repositorio, user);
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

function showMessage(answer){
    console.log(answer);
    const messageList = answer.data;
    const mesageArea = document.querySelector('main');
    let auxMessageList='';
    for(let i = 0; i < messageList.length; i++){
        //console.log('carregando...' + i)
        const objMsg = messageList[i];   
        auxMessageList += assemblemessage(objMsg);
    }
    
    mesageArea.innerHTML = auxMessageList;
    const recentMessage = document.querySelector('main article:last-child');
    recentMessage.scrollIntoView();    
}

function assemblemessage(objMsg){
    let message = '';
    if(objMsg.type === 'message'){
        message = `<article>
                        <time>(${objMsg.time})</time>
                        <p>
                            <strong id="fromUser">${objMsg.from}</strong>
                            <p>para</p>
                            <strong id="toUser">${objMsg.to}</strong>
                            <p>: ${objMsg.text}</p>
                        </p>
                    </article>`;
    }

    else if(objMsg.type === 'status') {
        message = `<article class="in-out-msg">
                        <time>(${objMsg.time})</time>
                        <p>
                            <strong id="fromUser">${objMsg.from}</strong>
                            <p>${objMsg.text}</p>
                        </p>
                    </article>`;
    }

    else {
        message = `<article class="reserved-msg">
                        <time>(${objMsg.time})</time>
                        <p>
                            <strong id="fromUser">${objMsg.from}</strong>
                            <p>para</p>
                            <strong id="toUser">${objMsg.to}</strong>
                            <p>: ${objMsg.text}</p>
                        </p>
                    </article>`;
    }
    return message;
}

function sendMessage(){
    const labelMessage = document.querySelector('footer input');
    
    const message = {
        from: user.name,
        to: 'Todos',
        text: labelMessage.value,
        type: 'message'
    }

    labelMessage.value = '';

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', message);
    promise.then(()=>{
        clearInterval(loadMessageInterval);
        loadMessage();
        loadMessageInterval = setInterval(loadMessage, 3000);
    });
    promise.catch(()=>{window.location.reload});
}


function sidebar(status){
    const sidebarBG = document.querySelector('.sidebar');
    const nav = document.querySelector('nav');
    if(status){
        sidebarBG.classList.remove('hide');
        setTimeout(() => {
            sidebarBG.classList.add('sidebar-expand');
            nav.classList.add('nav-expand');
        }, 100);

    } else {
        sidebarBG.classList.remove('sidebar-expand');
        nav.classList.remove('nav-expand');
        setTimeout(() => {
            sidebarBG.classList.add('hide');
        }, 100);
    }
}