'use strict';

let titles = {
    'create': 'Создание новой задачи',
    'edit': 'Редактирование задачи',
    'show': 'Просмотр задачи'
};

let actionBtnText = {
    'create': 'Создать',
    'edit': 'Сохранить',
    'show': 'Ок'
};

async function moveTask(id, list) {
    //console.info(list)
    let cur_url = new URL(`http://tasks-api.std-900.ist.mospolytech.ru/api/tasks/${id}?api_key=50d2199a-42dc-447d-81ed-d68a443b697e`);
    let taskData = new FormData();
    taskData.append("status", list);
    let send = await fetch(cur_url, {
        method: "PUT",
        body: taskData
    });

}

function moveBtnHandler(event) {
    let taskElement = event.target.closest('.task');
    let currentListElement = taskElement.closest('ul');
    let targetListElement = document.getElementById(currentListElement.id == 'to-do-list' ? 'done-list' : 'to-do-list');

    let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;

    let cur_list = "";
    if (currentListElement.id == 'to-do-list') {
        cur_list = "done";
    } else {
        cur_list = "to-do";
    }

    moveTask(taskElement.id, cur_list);

    targetListElement.append(taskElement);

    tasksCounterElement = targetListElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
}

let url = new URL('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks?api_key=50d2199a-42dc-447d-81ed-d68a443b697e');
let taskCounter = 0;

function showAlert(msg, category = 'success') {
    let alertsContainer = document.querySelector('.alerts');
    let newAlertElement = document.getElementById('alerts-template').cloneNode(true);
    newAlertElement.querySelector('.msg').innerHTML = msg;
    newAlertElement.classList.remove('d-none');
    alertsContainer.append(newAlertElement);
}

function addTaskToPage(task) {
    console.log(task);
    let newTaskElement = document.getElementById('task-template').cloneNode(true);
    newTaskElement.id = task.id;
    newTaskElement.querySelector('.task-name').innerHTML = task.name;
    newTaskElement.querySelector('.task-description').innerHTML = task.desc;
    newTaskElement.classList.remove('d-none');
    for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }
    //return newTaskElement;
    if (task.status == "done") {
        document.querySelector("#done-list").append(newTaskElement);
    } else {
        document.querySelector("#to-do-list").append(newTaskElement);
    }
    return newTaskElement;

}

async function sendNewTask(st, nm, des) {
    let taskData = new FormData();
    taskData.append("status", st);
    taskData.append("name", nm);
    taskData.append("desc", des);
    let send = await fetch(url, {
        method: "POST",
        body: taskData
    });
}

function createTaskElement(form) {
    let newTaskElement = document.getElementById('task-template').cloneNode(true);
    newTaskElement.id = taskCounter++;
    newTaskElement.querySelector('.task-name').innerHTML = form.elements['name'].value;
    newTaskElement.querySelector('.task-description').innerHTML = form.elements['description'].value;
    newTaskElement.classList.remove('d-none');
    for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }
    sendNewTask(form.elements['column'].value, form.elements['name'].value, form.elements['description'].value)
    return newTaskElement;
}

async function updateTask(form, id) {
    let taskElement = document.getElementById(form.elements['task-id'].value);
    console.log(form.elements['task-id'].value);
    let cur_id = form.elements['task-id'].value;
    let new_name = form.elements['name'].value;
    let new_desc = form.elements['description'].value;
    taskElement.querySelector('.task-name').innerHTML = new_name;
    taskElement.querySelector('.task-description').innerHTML = new_desc;
    let cur_url = new URL(`http://tasks-api.std-900.ist.mospolytech.ru/api/tasks/${cur_id}?api_key=50d2199a-42dc-447d-81ed-d68a443b697e`);
    let taskData = new FormData();
    taskData.append("name", new_name);
    taskData.append("desc", new_desc);
    let send = await fetch(cur_url, {
        method: "PUT",
        body: taskData
    });
}

async function deletetask(id) {
    let cur_url = new URL(`http://tasks-api.std-900.ist.mospolytech.ru/api/tasks/${id}?api_key=50d2199a-42dc-447d-81ed-d68a443b697e`);
    let send = await fetch(cur_url, {
        method: "DELETE",
    });

}


function removeTaskBtnHandler(event) {
    console.error("1234");
    let form = event.target.closest('.modal').querySelector('form');
    let taskElement = document.getElementById(form.elements['task-id'].value);

    let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;
    deletetask(form.elements['task-id'].value);
    taskElement.remove();
}

async function updateTaskCount() {
    const toDoCount = document.getElementById('to-do-list').childElementCount;
    const doneCount = document.getElementById('done-list').childElementCount;
    const ergegerg = document.querySelectorAll('.tasks-counter')[0];
    ergegerg.innerText = toDoCount - 1;
    const ergegerg2 = document.querySelectorAll('.tasks-counter')[1];
    ergegerg2.innerText = doneCount;
}


function actionTaskBtnHandler(event) {
    let form, listElement, tasksCounterElement, alertMsg, action;
    form = event.target.closest('.modal').querySelector('form');
    action = form.elements['action'].value;

    if (action == 'create') {
        listElement = document.getElementById(`${form.elements['column'].value}-list`);
        listElement.append(createTaskElement(form));

        tasksCounterElement = listElement.closest('.card').querySelector('.tasks-counter');
        tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;

        alertMsg = `Задача ${form.elements['name'].value} была успешно создана!`;
    } else if (action == 'edit') {
        updateTask(form);

        alertMsg = `Задача ${form.elements['name'].value} была успешно обновлена!`;
    }

    if (alertMsg) {
        showAlert(alertMsg);
    }
}

function resetForm(form) {
    form.reset();
    form.querySelector('select').closest('.mb-3').classList.remove('d-none');
    form.elements['name'].classList.remove('form-control-plaintext');
    form.elements['description'].classList.remove('form-control-plaintext');
}

function setFormValues(form, taskId) {
    let taskElement = document.getElementById(taskId);
    form.elements['name'].value = taskElement.querySelector('.task-name').innerHTML;
    form.elements['description'].value = taskElement.querySelector('.task-description').innerHTML;
    form.elements['task-id'].value = taskId;
}

function prepareModalContent(event) {
    let form = event.target.querySelector('form');
    resetForm(form);

    let action = event.relatedTarget.dataset.action || 'create';

    form.elements['action'].value = action;
    event.target.querySelector('.modal-title').innerHTML = titles[action];
    event.target.querySelector('.action-task-btn').innerHTML = actionBtnText[action];

    if (action == 'show' || action == 'edit') {
        setFormValues(form, event.relatedTarget.closest('.task').id);
        event.target.querySelector('select').closest('.mb-3').classList.add('d-none');
    }

    if (action == 'show') {
        form.elements['name'].classList.add('form-control-plaintext');
        form.elements['description'].classList.add('form-control-plaintext');
    }

}


function moveBtnHandler(event) {
    let taskElement = event.target.closest('.task');
    let currentListElement = taskElement.closest('ul');
    let targetListElement =
    document.getElementById(currentListElement.id ==
         'to-do-list' ? 'done-list' : 'to-do-list');

    let tasksCounterElement = taskElement.closest('.card').
        querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;

    let cur_list = "";
    if (currentListElement.id == 'to-do-list') {
        cur_list = "done";
    } else {
        cur_list = "to-do";
    }

    moveTask(taskElement.id, cur_list);

    targetListElement.append(taskElement);

    tasksCounterElement = targetListElement.closest('.card')
        .querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
}


async function getListOfTasks() {
    // eslint-disable-next-line max-len
    const response = await fetch(url);
    let json = await response.json();
    const tasks = json['tasks'];
    tasks.forEach(task => {
        //console.log(task);
        addTaskToPage(task);


    });
    updateTaskCount();
}

window.onload = function () {
    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;

    document.getElementById('task-modal')
        .addEventListener('show.bs.modal', prepareModalContent);

    document.getElementById('remove-task-modal')
        .addEventListener('show.bs.modal', function (event) {
            let taskElement = event.relatedTarget.closest('.task');
            let form = event.target.querySelector('form');
            form.elements['task-id'].value = taskElement.id;
            event.target.querySelector('.task-name').innerHTML = 
            taskElement.querySelector('.task-name').innerHTML;
        });
    document.querySelector('.remove-task-btn').onclick = removeTaskBtnHandler;
    getListOfTasks();

    for (let btn of document.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }
};