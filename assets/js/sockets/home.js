socket.emit("getOnlineFriends", myId);

socket.on("onlineFriends", friends => {
    let div = document.getElementById("onlineFriends");
    if (friends.length === 0) {
        div.innerHTML = `
            <p class="alert alert-danger">No online friends</p>
        `;
    } else {
        let html = `
            <div class="row">
        `;
        for (let friend of friends) {
            html += `
                <div class="col col-12 col-md-6 col-lg-4 bg-primary">
                    <img class="user-image" src="/${friend.image}">
                    <div class="user-data">
                        <h3>
                            <a href="/profile/${friend.id}">${friend.name}</a>
                        </h3>
                        <a href="/chat/${friend.chatId}" class="btn btn-success">Chat</a>
                    </div>
                </div>
            `;
        }
        html += "</div>";
        div.innerHTML = html;
    }
});
