/* 
loginUser(prompt('Seu nome'));

function loginUser(name){
    const user = {name: "Astrofonildo"};
    const promise = axios.post('http://mock-api.driven.com.br/api/v4/uol/participants', user);
    promise.then(userIsApproved);
} */

/* function userIsApproved(answer){
    console.log(answer.data);
    if(answer == 200) alert('foi aprovado');
    else {
     alert('não foi aprovado');
     loginUser(prompt('Seu nome'));
    }
} */

loadMessage();

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



/* function sendmessage(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
    {
        from: 'Joãozinho',
        to: ''
    })
} */