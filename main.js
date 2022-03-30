'use strict';
const root = document.querySelector(':root');
const container = document.querySelector('.container');
const themeBtn = document.querySelector('.theme-btn');
const tasksList = document.querySelector('#tasksList');
const listItem = document.querySelectorAll('#tasksList li');
const newTaskForm = document.querySelector('#new_task_form');
const newTaskInput = document.querySelector('#new_task_input');
const newTaskInputBtn = document.querySelector('#new_task_input_btn');
const clear = document.querySelector('#clear');

// add task
newTaskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (newTaskInput.value === '') {
    alert('Please Enter Task to add!');
    return;
  }

  container.classList.remove('task_list_empty');

  //create li and set its class
  const newTaskItem = document.createElement('li');
  newTaskItem.classList.add('listItem');

  // Create checkbox  element and set its type and  class
  const newCheckBtn = document.createElement('INPUT');
  newCheckBtn.setAttribute('type', 'checkbox');
  newCheckBtn.classList.add('check-item');

  // Create span  element and set its class and add new task input
  const newTaskBio = document.createElement('span');
  newTaskBio.classList.add('task_bio');
  newTaskBio.innerText = newTaskInput.value;

  //edit btn
  let editbtn = document.createElement('button');
  editbtn.innerHTML = 'Edit';
  editbtn.classList.add('edit');

  // append (insert) li tag in Ul
  tasksList.appendChild(newTaskItem);

  // append (insert) checkbox in li
  newTaskItem.appendChild(newCheckBtn);

  // append (insert) newtask in li
  newTaskItem.appendChild(newTaskBio);

  // append (insert) editbtn in li
  newTaskItem.appendChild(editbtn);

  //reset input value
  newTaskInput.value = '';

  // Run this function when task is completed or checknox is checked
  onTaskComplete(newCheckBtn);

  //save on local stroage
  saveTask(newTaskBio.innerText);

  edit(editbtn);
});

// get all items from localstrage
function getAll() {
  const items = { ...localStorage };
  const itemsArr = Object.entries(items);
  const filteredArr = itemsArr.filter(function ([key]) {
    return key !== 'randid';
  });

  if (filteredArr.length > 0) {
    container.classList.remove('task_list_empty');
  }

  filteredArr.forEach(([, value]) => {
    //create li and set its class
    let li = document.createElement('li');
    li.classList.add('listItem');

    // Create checkbox  element and set its type and  class
    const newCheckBtn = document.createElement('INPUT');
    newCheckBtn.setAttribute('type', 'checkbox');
    newCheckBtn.classList.add('check-item');

    // Create span  element and set its class and add new task input
    const newTaskBio = document.createElement('span');
    newTaskBio.classList.add('task_bio');
    newTaskBio.innerText = value;

    //edit btn
    let editbtn = document.createElement('button');
    editbtn.innerHTML = 'Edit';
    editbtn.classList.add('edit');

    // append (insert) li tag in Ul
    tasksList.appendChild(li);
    // append (insert) checkbox in li
    li.appendChild(newCheckBtn);

    // append (insert) newtask in li
    li.appendChild(newTaskBio);

    // append (insert) editbtn in li
    li.appendChild(editbtn);

    // Run this function when task is completed or checknox is checked
    onTaskComplete(newCheckBtn);

    //edit
    edit(editbtn);
  });

  //as array
  // return filteredArr;

  //as objeect
  // const newScore = Object.fromEntries(filteredArr);
}

getAll();

//Save task to LocalStorage
function saveTask(task) {
  const id = document.querySelectorAll('#tasksList li').length;
  localStorage.setItem('task' + id, task);
}

//Delete Task localStroage
function deleteTask(e) {
  const li = e.target.closest('li');
  let nodes = Array.from(li.closest('ul').children);
  let index = nodes.indexOf(li);
  let KeyName = localStorage.key(index);
  if (KeyName === 'randid' && index == 0) {
    index = 1;
    KeyName = window.localStorage.key(index);
    localStorage.removeItem(KeyName);
  } else {
    localStorage.removeItem(KeyName);
  }
}

//update task on local
function update(e, txt) {
  const index = Array.prototype.indexOf.call(
    tasksList.childNodes,
    e.target.closest('.listItem'),
  );
  let keyName = window.localStorage.key(index);
  if (keyName !== 'randid') {
    localStorage.setItem(keyName, txt);
  } else {
    keyName = 'task' + (index + 1);
    localStorage.setItem(keyName, txt);
  }
}

// To remove the completed task
function onTaskComplete(btns) {
  btns.addEventListener('click', function (e) {
    deleteTask(e);
    let parent = e.target.parentElement;
    parent.classList.add('task-completed'); // To slide out the task to the right
    // Now we delete that tast which we have slided out
    setTimeout(() => {
      // Removing Parent Element of checkobx which is Li in 0.5 s
      parent.remove();
    }, 400);
    if (tasksList.childNodes.length === 1) {
      setTimeout(() => {
        container.classList.add('task_list_empty');
      }, 200);
    }
  });
}

function edit(btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    let text = e.target.previousElementSibling;
    if (btn.innerText === 'Edit') {
      newTaskInput.value = text.innerText;
      text.innerText = '';
      btn.innerText = 'save';
      newTaskInputBtn.disabled = true;
    } else if (btn.innerText === 'save') {
      text.innerText = newTaskInput.value;
      newTaskInput.value = '';
      btn.innerText = 'Edit';
      newTaskInputBtn.disabled = false;
      update(e, text.innerText);
    }
  });
}

clear.addEventListener('click', function () {
  const { randid, ...other } = localStorage;
  for (const key in other) {
    localStorage.removeItem(`${key}`);
  }
  deleteAll(tasksList);
  container.classList.add('task_list_empty');
});

// delete all
function deleteAll(ul) {
  ul.innerHTML = '';
}

// Dark mode

themeBtn.addEventListener('click', function () {
  let darkTheme = themeBtn.classList.toggle('dark');

  if (darkTheme) {
    root.style.setProperty('--theme-transition', '1s');
    root.style.setProperty('--primary-color', '#1E1E1E');
    root.style.setProperty('--secondary-color', '#3B3B3B');
    root.style.setProperty('--text-color', '#EAEAEA');
    root.style.setProperty('--task-color', '#3B3B3B');
    root.style.setProperty('--footer-color', '#1E1E1E');
    root.style.setProperty('--theme-btn', `url('assets/Light-theme-btn.svg')`);
    root.style.setProperty('--container-bg', `url('./assets/Dark-empty.svg')`);
    root.style.setProperty('--filter', 'invert()');
  } else {
    root.style.setProperty('transition', '1s');
    root.style.setProperty('--primary-color', 'white');
    root.style.setProperty('--secondary-color', '#1E1E1E');
    root.style.setProperty('--text-color', 'black');
    root.style.setProperty('--task-color', 'white');
    root.style.setProperty('--footer-color', '#1E1E1E');
    root.style.setProperty('--theme-btn', `url('assets/Dark-theme-btn.svg')`);
    root.style.setProperty('--container-bg', `url('./assets/Light-empty.svg')`);
  }
});
