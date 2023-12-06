'use sctrict';


let currentPage = 1;
let blockButtons = document.querySelector(".block-buttons");
let totalCount = 180;
let countOfText = document.querySelector("#count_select");
let perPage;
//-----------------------------------------------------------//
let searchBtn = document.querySelector(".btn_search");

let listboxHint = document.querySelector(".listbox-hint");
let add_hint = true;
let hint_massive = [];
function addResponseRecordToArray(records) {
    let ready_hint_massive = new Set();
    for (let i = 0; i < records.length; i++) {
        let words = records[i].text.split(" ");

        for (let j = 0; j < words.length; j++) {
            ready_hint_massive.add(words[j]);
        }
    }
    ready_hint_massive.forEach(value => hint_massive.push(value));
}

//-----------------------------------------------------------//
let blocks = document.querySelector(".blocks");
function clearBlocks() {
    blocks.innerHTML = '';
}
function updatePaginationButtons() {
    let buttons = document.querySelectorAll(".btn-number");
    buttons.forEach(button => {
        if (+button.textContent === currentPage) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}
//-----------------------------------------------------------//

//-----------------------------------------------------------//
function drawButtons() {
    let begin = Math.max(currentPage - 2, 1);

    let end = Math.min(totalCount, currentPage + 2);
    console.log(begin, end, currentPage);

    let div = document.querySelector(".block-buttons-number");

    div.innerHTML = "";

    for (let i = begin; i <= end; i++) {
        let btn = document.createElement("button");
        btn.classList.add("btn-number");
        btn.textContent = i;
        div.append(btn);
    }
    updatePaginationButtons();
}
//-----------------------------------------------------------//

//-----------------------------------------------------------//
let template = document.querySelector("#template-container");
function fillPage(records) {
    for (let i = 0; i < records.length; i++) {
        let block = template.content.cloneNode(true);
        let mainContent = block.querySelector(".main-content");
        mainContent.textContent = records[i].text;
        let author = block.querySelector(".autor");
        // let firstName = records[i].user?.name?.first || "Guest";
        // let lastName = records[i].user?.name?.last || "";
        let firstName;
        if (records[i] && records[i].user 
            && records[i].user.name && records[i].user.name.first) {
            firstName = records[i].user.name.first;
        } else {
            firstName = "Guest";
        }
        let lastName;
        if (records[i] && records[i].user 
            && records[i].user.name && records[i].user.name.last) {
            lastName = records[i].user.name.last;
        } else {
            lastName = "";
        }
        author.textContent = firstName + " " + lastName;
        let count = block.querySelector(".count");
        count.textContent = records[i].upvotes;
        blocks.append(block);

    }
    if (currentPage == 1) {
        document.querySelector(".prev-page").classList.add("hide-btn");
    } else {
        document.querySelector(".prev-page").classList.remove("hide-btn");
    }
    if (currentPage == totalCount) {
        document.querySelector(".next-page").classList.add("hide-btn");
    } else {
        document.querySelector(".next-page").classList.remove("hide-btn");
    }


}

//-----------------------------------------------------------//
function pagesInfo(totalCount) {
    let since = document.querySelector(".since");
    since.textContent = currentPage * perPage - perPage + 1;
    let last = document.querySelector(".last");
    last.textContent = currentPage * perPage;
    let allAmount = document.querySelector(".all_amount");
    allAmount.textContent = totalCount;


}

//-----------------------------------------------------------//
function getRequest(hint_parameter = '') {
    //-------------------------------------------------------------//    
    if (add_hint == true) {
        let xhr = new XMLHttpRequest();
        let urlstr = `http://cat-facts-api.std-900.ist.mospolytech.ru/facts`;
        let url = new URL(urlstr);
        url.searchParams.set("per-page", 1000);
        xhr.open("GET", url);
        xhr.send();
        xhr.onload = function () {
            let response = JSON.parse(xhr.response);
            addResponseRecordToArray(response.records);
        };
        add_hint = false;
    }
    //-------------------------------------------------------------//   
    let xhr = new XMLHttpRequest();
    let q = hint_parameter;
    let urlstr = `http://cat-facts-api.std-900.ist.mospolytech.ru/facts`;
    let url = new URL(urlstr);
    url.searchParams.set("q", q);
    url.searchParams.set("page", currentPage);
    url.searchParams.set("per-page", perPage);
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function () {
        clearBlocks();
        let response = JSON.parse(xhr.response);
        totalCount = response._pagination.total_pages;
        drawButtons();
        fillPage(response.records);

        pagesInfo(response._pagination.total_count);
    };


}
//-----------------------------------------------------------//


searchBtn.addEventListener("click", () => {
    let inputField = document.querySelector(".text");
    listboxHint.style.visibility = "hidden";
    getRequest(inputField.value);
});
//-----------------------------------------------------------//
countOfText.addEventListener("change", () => {
    perPage = countOfText.value;
    getRequest();
});


window.onload = () => {
    perPage = countOfText.value || 5;
    getRequest();
};
//-----------------------------------------------------------//


let activebtn = document.querySelector(".btn-number");
//-----------------------------------------------------------//
function blockButtonsClick(event) {
    let target = event.target;
    if (target.classList.contains("next-page")) {
        if (currentPage + 1 > totalCount) {
            return;
        }
        currentPage += 1;
    } else if (target.classList.contains("prev-page")) {
        if (currentPage - 1 < 1) {
            return;
        }
        currentPage -= 1;
    } else if (target.classList.contains("btn-number")) {
        if (+target.textContent === currentPage) {
            return;
        }
        currentPage = +target.textContent;

    }
    getRequest();
}
//-----------------------------------------------------------//
function clearBlocks() {
    blocks.innerHTML = '';
}
function updatePaginationButtons() {
    let buttons = document.querySelectorAll(".btn-number");
    buttons.forEach(button => {
        if (+button.textContent === currentPage) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

blockButtons.addEventListener('click', blockButtonsClick);

//-----------------------------------------------------------//
let x = document.querySelector(".list");
let y = document.querySelector(".text");
x.addEventListener("click", (e) => {
    y.value = e.target.textContent;
    listboxHint.style.visibility = "hidden";
});
//-----------------------------------------------------------//
function createBlockForhints(data) {
    let list = document.querySelector(".list");
    list.innerHTML = "";

    for (let i = 0; i < 6 && i < data.length; i++) {
        let li = document.createElement("li");
        li.classList.add("hint-elements");
        li.textContent = data[i];
        list.append(li);
    }
}


//-----------------------------------------------------------//

function handleInput() {
    listboxHint.style.visibility = "visible";

    let input = document.querySelector(".text");
    let value = input.value.toLowerCase();

    let res = hint_massive.filter(word => {
        return word.toLowerCase().startsWith(value);
    }
    );
    createBlockForhints(res);

}
function handleKeyDown() {
    listboxHint.style.visibility = "hidden";
}
function changeinput() {

}
//-----------------------------------------------------------//

