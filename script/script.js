
loginUser(prompt('Seu nome'));

function loginUser(name){
    const obj = {name: name};
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', obj);
    promise.then(userIsApproved)
}

function userIsApproved(answer){
    console.log(answer.status);
    if(answer.status == 200) {
        loadMessage();
    }
    else {
     alert('não foi aprovado');
     loginUser(prompt('Seu nome'));
    }
}

function loadMessage(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promise.then(showMessage);
}

function showMessage(answer){
    const messageList = answer.data;
    const mesageArea = document.querySelector('main');
    for(let i = 0; i < messageList.length; i++){
        const objMsg = messageList[i];        
        mesageArea.innerHTML += assemblemessage(objMsg);
    }
}

function assemblemessage(objMsg){
    let message = '';
    console.log(objMsg.type);
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

    else {
        message = `<article>
                        <time>(${objMsg.time})</time>
                        <p>
                            <strong id="fromUser">${objMsg.from}</strong>
                            <p>${objMsg.text}</p>
                        </p>
                    </article>`;
    }
    return message;
}



function sendMessage(){
    const userName = document.querySelector('input').value;
    const obj = {name: userName};
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',
           obj);
    /* const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
    {
        from: 'Joãozinho',
        to: 'Todos',
        text: 'Testando aqui...',
        type: 'message'
    }) */
    console.log(promise);
    promise.then(function(r){console.log(r)});
}