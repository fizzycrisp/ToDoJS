const toDoForm = document.querySelector('.js-toDoForm'),
	toDoInput = toDoForm.querySelector('input'),
	pendingList = document.querySelector('.js-pendingList'),
	finishedList = document.querySelector('.js-finishedList');

const TODOS_LS = 'toDos';
const PENDING_LS = 'PENDING';
const FINISHED_LS = 'FINISHED';

// let toDos = [];
let pending = [];
let finished = [];

function deleteToDo(event) {
	const btn = event.target;
	const li = btn.parentNode;
	const ul = li.parentNode.className;
	if (ul === 'js-pendingList') {
		pendingList.removeChild(li);
		pending = cleanToDos(pending, li);
	} else {
		finishedList.removeChild(li);
		finished = cleanToDos(finished, li);
	}

	saveToDos();
}

function cleanToDos(toDos, li) {
	return toDos.filter(function (toDo) {
		return toDo.id !== parseInt(li.id);
	});
}

function doneToDo(event) {
	const btn = event.target;
	const li = btn.parentNode;
	const ul = li.parentNode.className;
	if (ul === 'js-pendingList') {
		pendingList.removeChild(li);
		pending = cleanToDos(pending, li);
		li.type = 'finished';
		li.lastChild.innerText = '⏪';
		finishedList.appendChild(li);
	} else {
		finishedList.removeChild(li);
		finished = cleanToDos(finished, li);
		li.type = 'pending';
		li.lastChild.innerText = '✅';
		pendingList.appendChild(li);
	}

	const toDoObj = {
		text: li.firstChild.innerText,
		id: parseInt(li.id),
		type: li.type,
	};
	if (ul === 'js-pendingList') {
		finished.push(toDoObj);
	} else {
		pending.push(toDoObj);
	}
	saveToDos();
}

function saveToDos() {
	localStorage.setItem(PENDING_LS, JSON.stringify(pending));
	localStorage.setItem(FINISHED_LS, JSON.stringify(finished));
}

function paintToDo(text, type, id) {
	const li = document.createElement('li');
	const span = document.createElement('span');
	const deleteButton = document.createElement('button');
	const doneButton = document.createElement('button');

	deleteButton.innerText = '❌';
	deleteButton.addEventListener('click', deleteToDo);

	span.innerText = text;
	li.appendChild(span);
	li.appendChild(deleteButton);
	li.appendChild(doneButton);
	li.id = id;
	li.type = type;
	const toDoObj = {
		text: text,
		id: id,
		type: type,
	};
	if (type === 'pending') {
		doneButton.innerText = '✅';
		doneButton.addEventListener('click', doneToDo);
		pendingList.appendChild(li);
		pending.push(toDoObj);
	} else {
		doneButton.innerText = '⏪';
		doneButton.addEventListener('click', doneToDo);
		finishedList.appendChild(li);
		finished.push(toDoObj);
	}
	saveToDos();
}

function loadToDos() {
	const loadedPending = localStorage.getItem(PENDING_LS);
	const loadedFinished = localStorage.getItem(FINISHED_LS);
	if (loadedPending !== null) {
		const parsedPending = JSON.parse(loadedPending);
		parsedPending.forEach(function (toDo) {
			paintToDo(toDo.text, toDo.type, toDo.id);
		});
	}
	if (loadedFinished !== null) {
		const parsedFinished = JSON.parse(loadedFinished);
		parsedFinished.forEach(function (toDo) {
			paintToDo(toDo.text, toDo.type, toDo.id);
		});
	}
}

function handleSubmit(event) {
	event.preventDefault();
	const currentValue = toDoInput.value;
	paintToDo(currentValue, 'pending', Date.now());
	toDoInput.value = '';
}

function init() {
	loadToDos();
	toDoForm.addEventListener('submit', handleSubmit);
}
init();
