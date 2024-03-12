import {
  form,
  taskInput,
  taskList,
  emptyList,
} from './vars.js'


form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);


let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  tasks.forEach((task) => renderTask(task))
}
checkEmptyList();

function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  }
  renderTask(newTask)

  tasks.push(newTask)

  taskInput.value = '';
  taskInput.focus();
  checkEmptyList();
  saveToLS();
}

function deleteTask(e) {
  if (e.target.dataset.action !== 'delete') return;
  const parentNode = event.target.closest('.list-group-item')
  const id = Number(parentNode.id)

  tasks = tasks.filter((task) => task.id !== id)

  parentNode.remove()
  checkEmptyList();
  saveToLS();
}

function doneTask(e) {
  if (e.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.list-group-item');
  const id = Number(parentNode.id)
  const task = tasks.find((task) => task.id === id)
  task.done = !task.done

  const childrenNode = parentNode.querySelector('.task-title');
  childrenNode.classList.toggle('task-title--done');
  saveToLS();
}

function saveToLS() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
      <li id="emptyList" class="list-group-item empty-list">
        <img src="./assets/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
      </li>
    `
    taskList.insertAdjacentHTML('afterbegin', emptyListHTML)
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList')
    emptyListEl ? emptyListEl.remove() : null
  }
}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

  const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${task.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./assets/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./assets/cross.svg" alt="Done" width="18" height="18">
        </button>
      </div>
    </li>
  `

  taskList.insertAdjacentHTML('beforeend', `${taskHTML}`)
}