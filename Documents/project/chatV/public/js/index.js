import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, child, push, set, onChildAdded } from "firebase/database";

//Note: using functional approach to initialize firebase which is different from the v9 firebase SDK in lab06
const app = initializeApp({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASE,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
});
const auth = getAuth(app);
const database = getDatabase(app);

function getTime(){
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if(h<10)
        h = '0'+h;
    if(m<10)
        m = '0'+m;
    if(s<10)
        s = '0'+s;
    let now = h+':'+m+':'+s;
    return now;
}


const init = () => {
    const menu = document.getElementById("dynamic-menu");
    const profilePic = document.getElementById("dropdown01 profile-pic");
    const postList = document.getElementById("public_list");
    const sendButton = document.getElementById("post_btn");
    const message = document.getElementById("newMessage");
    const resetIcon = document.getElementById("resetIcon");
    const newRoomName = document.getElementById("newRoomName");
    const newRoomButton = document.getElementById("newRoom");
    const roomList = document.getElementById("roomList");
    const addFriendButton = document.getElementById("addFriend");
    const defaultPhotoUrl = "https://www.w3schools.com/howto/img_avatar.png";

    const allPosts = [];
    let currentRoomName = null, currentRoomId = null;
    let currentPostListener = null;

    onAuthStateChanged(auth, (user) => { //user-->null: logged out, user-->object: logged in
        if (user) {
            let user_email = user.email;
            let photoURL = user.photoURL ? user.photoURL : defaultPhotoUrl;
            menu.innerHTML = `<span class = 'dropdown-item' id ='getUID'><span class="material-symbols-outlined">passkey </span> Click to copy your chatV ID.</span><span class='dropdown-item'>${user_email}</span><span class='dropdown-item' id='logout-btn'>Sign out</span>`;
            if (photoURL) {
                profilePic.innerHTML = `<img src="${photoURL}" alt="profile picture" style="height: 3.5vh; border-radius: 50%; margin-right: 5px;"></div>`;
            }
            const logoutbtn = document.getElementById("logout-btn");
            const profilebtn = document.getElementById("profile-btn");
            const getUID = document.getElementById("getUID");
            profilebtn.addEventListener("click", () => {
                window.location.href = "profile.html";
            });
            getUID.addEventListener("click", () => {
                navigator.clipboard.writeText(user.uid);
                alert(`Your chatV ID:${user.uid} has been copied to the clipboard.`);
            });
            logoutbtn.addEventListener("click", () => {
                signOut(auth)
                    .then(() => {
                        alert("You are signed out!");
                    })
                    .catch((error) => {
                        alert("Sign out failed!");
                    });
            });
            onChildAdded(getUserPrivateRoomListRef(auth.currentUser.uid), (x) => {
                const roomName = x.key;
                const roomId = x.val();
                addPrivateRoom(roomName, roomId);
            });

            switchChatroom(null, null);
        } else {
            // User is signed out
            resetIcon.innerHTML = `<a class="nav-link dropdown-toggle" id="dropdown01 profile-pic" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="material-symbols-outlined">account_circle</span>
                    </a>
                    <div id="dynamic-menu" class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown01">
                        <a class="dropdown-item" href="signin.html">Login</a>
                    </div>`;
            postList.innerHTML = ""; //clear post list
        }
    });

    sendButton.addEventListener("click", sendMessage);

    message.addEventListener("keypress", (event) => {
        if (event.key === "Enter")
            sendMessage();
    });
    
    function sendMessage() {
        if (message.value !== "") {
            const postData = {
                data: message.value,
                email: auth.currentUser.email,
                uid: auth.currentUser.uid,
                photo: auth.currentUser.photoURL || defaultPhotoUrl,
                time: getTime()
            };

            const postListRef = currentRoomId==null
                ? ref(database, "com_list")
                : getPrivateRoomRef(currentRoomId);
            const newPostRef = push(postListRef);
            set(newPostRef, postData);
            message.value = "";
            console.log(currentRoomId, postData);
        } else {
            alert("Don't send empty message!");
        }
    }

    newRoomButton.addEventListener("click", () => {
        if (newRoomName.value !== "") {
            const roomName = newRoomName.value;
            newRoomName.value = "";
            createNewPrivateRoom(roomName);
        } else {
            alert("Don't name a empty chatroom!");
        }
    });

    function addPrivateRoom(roomName, roomId) {
        console.log('addPrivateRoom: ' + roomName);
        roomList.innerHTML += `
            <a href="#" class="list-group-item" data-name="${roomName}" data-id="${roomId}">
                <span class="material-symbols-outlined" style="width:50px;color:#102C57;">lock</span>
                <div class = "space"></div>
                <div class="d-flex w-100 align-items-center justify-content-between">
                    <strong class="mb-1" style="color:#102C57;">${roomName}</strong>
                </div>
            </a>`
    }

    function createNewPrivateRoom(roomName) {
        const roomInfoRef = getUserPrivateRoomIdRef(auth.currentUser.uid, roomName);
        const roomId = push(ref(database)).key;
        set(roomInfoRef, roomId).then(()=>switchChatroom(roomName, roomId));
    }

    function addUserToPrivateRoom(userUid, roomName, roomId) {
        console.log('addUserToPrivateRoom: ' + userUid + ' ' + roomName);
        const roomUidRef = getUserPrivateRoomIdRef(userUid, roomName);
        set(roomUidRef, roomId);
    }

    function getUserPrivateRoomListRef(userUid) {
        return child(ref(database, 'user_list'), userUid);
    }

    function getUserPrivateRoomIdRef(userUid, roomName) {
        return child(ref(database, 'user_list'), userUid + '/' + roomName.replace(/\//g, ''));
    }

    function getPrivateRoomRef(roomId) {
        return child(ref(database, 'private_list'), roomId);
    }

    roomList.addEventListener("click", (event) => {
        let target = event.target;
        if (target.id==='public' || target.dataset.id!==undefined) {
            roomList.getElementsByClassName("active")[0].classList.remove("active");
            target.classList.add("active");
            if(target.id==='public')
                switchChatroom(null, null);
            else
                switchChatroom(target.dataset.name, target.dataset.id);
        }
    });

    addFriendButton.addEventListener("click", () => {
        let userUid = prompt("Type in your friends' uid：");
        addUserToPrivateRoom(userUid, currentRoomName, currentRoomId);
    });

    let initScroll = false;
    function switchChatroom(roomName, roomId) {
        console.log('switchChatroom: ' + roomName + ' ' + roomId);
        postList.innerHTML = "";
        allPosts.length = 0;
        currentRoomName = roomName;
        currentRoomId = roomId;
        if (currentPostListener) currentPostListener();
        if (roomName == null)
            currentPostListener = onChildAdded(ref(database, "com_list"), (x) => appendPost(x.val()));
        else
            currentPostListener = onChildAdded(getPrivateRoomRef(roomId), (x) => appendPost(x.val()));
        initScroll = true;
    }

    function appendPost(x) {
        allPosts[allPosts.length] = `
            <div class="rounded box-shadow text-right" style="height:min-content;flex-wrap: wrap;margin-bottom:3%;">
                <h6 class="border-bottom border-gray pb-2 mb-0 text-right">${x.time}</h6>
                    <div class="media text-muted pt-3">
                    <img src="${x.photo}" alt="" class="mr-2 rounded" style="height:32px;width:32px;"/>
                    <p class="media-body pb-2 mb-0 small border-bottom style=">${x.email}
                        <strong class="d-block h5">${x.data}</strong>
                    </p>
                </div>
            </div>`;

        postList.innerHTML = allPosts.join("");
        postList.scrollTop = postList.scrollHeight;
    }
};

window.onload = function () {
    init();
};