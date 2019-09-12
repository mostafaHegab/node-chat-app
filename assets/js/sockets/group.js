const chatId = document.getElementById("chatId").value;
const msg = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const msgContainer = document.getElementById("messages-container");
msgContainer.scrollTop = msgContainer.scrollHeight;

socket.emit("joinChat", chatId);

sendBtn.onclick = () => {
    let content = msg.value;
    socket.emit(
        "sendGroupMessage",
        {
            group: chatId,
            content: content,
            sender: myId
        },
        () => {
            msg.value = "";
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
    );
};

socket.on("newGroupMessage", msg => {
    msgContainer.innerHTML += `
        <span class="msg ${msg.sender === myId ? "left" : "right"}">
            ${msg.content}
        </span>
    `;
    msgContainer.scrollTop = msgContainer.scrollHeight;
});
