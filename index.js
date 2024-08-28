// Add your code here
const tasksHTML = document.querySelector('.tasksList')
const button = document.querySelector('.buttonAddTask')
const buttonRemove = document.querySelector('.buttonRemoveTasks')
const input = document.querySelector('input')

const buttonTasksToday = document.querySelector('.buttonTasksToday')
const buttonTasksWeek = document.querySelector('.buttonTasksWeek')

const doneTasks = document.querySelector('.doneTask')
const allTasks = document.querySelector('.allTask')
const percent = document.querySelector('.percent')

let isToday = true
let tasks = []
let tasksWeek = []

buttonTasksToday.addEventListener('click', () => {
        isToday = true
        buttonTasksToday.classList.add('active')
        buttonTasksWeek.classList.remove('active')
        countTasks()  
        tasksHTML.innerHTML = ''
        tasks.forEach(task => {
          renderHTMLTask(task)
      })
})

buttonTasksWeek.addEventListener('click', () => {
      isToday = false
      buttonTasksToday.classList.remove('active')
      buttonTasksWeek.classList.add('active')
      countTasks()  
      tasksHTML.innerHTML = ''
      tasksWeek.forEach(task => {
        renderHTMLTask(task)
      })
})

buttonRemove.addEventListener('click', () => {
    if (isToday) {
      tasks = []
      saveTasks()
    } else {
      tasksWeek = []
      saveTasksWeek()
    }
})

button.addEventListener('click', addTask)

tasksHTML.addEventListener('click', removeTask)

tasksHTML.addEventListener('click', doneTask)

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))

  tasks.forEach(task => {
      renderHTMLTask(task)
  })
}

if (localStorage.getItem('tasksWeek')) {
  tasksWeek = JSON.parse(localStorage.getItem('tasksWeek'))

  if (!isToday) {
    tasksWeek.forEach(task => {
    renderHTMLTask(task)
    })
  }
}

function countTasks() {
  let countDoneTasks = 0
  let countDoneTasksWeek = 0

  if(isToday) {
    tasks.forEach(task => {
      if (task.status) {
        countDoneTasks++
      }
    })

    doneTasks.innerHTML = `Выполнено: ${countDoneTasks}`
    allTasks.innerHTML = `Всего: ${tasks.length}`

    if (tasks.length === 0) {
      percent.innerHTML = ''
    } else {
      percent.innerHTML = `Процент выполнения задач: ${Math.round(countDoneTasks*100/tasks.length)} %`
    }
  } else {
    console.log(isToday)
    tasksWeek.forEach(task => {
      if (task.status) {
        countDoneTasksWeek++
      }
    })

    doneTasks.innerHTML = `Выполнено: ${countDoneTasksWeek}`
    allTasks.innerHTML = `Всего: ${tasksWeek.length}`

    if (tasksWeek.length === 0) {
      percent.innerHTML = ''
    } else {
      percent.innerHTML = `${Math.round(countDoneTasksWeek*100/tasksWeek.length)} %`
    }
  }
}

countTasks()   

function addTask(event) {
  event.preventDefault()

  let task = {
    text: input.value,
    status: false,
    id: Date.now()
  }

  let taskWeek = {
    text: input.value,
    status: false,
    id: Date.now()
  }

  if (task.text.trim() !== "") {
    if (isToday) {
      tasks.push(task)
      renderHTMLTask(task)
      saveTasks() 
    } else {
      tasksWeek.push(taskWeek)
      renderHTMLTask(taskWeek)
      saveTasksWeek()
      
    }
  }

  countTasks()
  input.value = ''
  input.focus()
}

function removeTask(event) {
  if (event.target.dataset.action === 'remove') {
    let parentId = Number(event.target.closest('.tasks').id)
    let parent = event.target.closest('.tasks')

    if(isToday) {
        const index = tasks.findIndex(function (task) {
        if (task.id === parentId) {
            return true
        }
    })
    tasks.splice(index,1)
    parent.remove()
    saveTasks() 
    } else {
        const index = tasksWeek.findIndex(function (task) {
        if (task.id === parentId) {
            return true
        }
    })
    tasksWeek.splice(index,1)
    parent.remove()
    saveTasksWeek()
    }
  }
  countTasks()
}

function doneTask(event) {
  if (event.target.dataset.action === 'done') {
    let parent = event.target.closest('li')
    let parentID = Number(event.target.closest('li').id)

    let title = parent.querySelector('.title') 
    let buttonDone = parent.querySelector('.done') 

    if(isToday) {
      tasks.find(task => {
        if (task.id === parentID) {
          task.status = !task.status
          title.classList.toggle('toggle')
          if (task.status) {
            buttonDone.innerHTML = 'Выполнено'
          } else {
            buttonDone.innerHTML = 'Выполнить'
          }
        }
      })
      saveTasks() 
    } else {
      tasksWeek.find(task => {
        if (task.id === parentID) {
          task.status = !task.status
          title.classList.toggle('toggle')
          if (task.status) {
            buttonDone.innerHTML = 'Выполнено'
          } else {
            buttonDone.innerHTML = 'Выполнить'
          }
        }
      })
      saveTasksWeek() 
    }
  }
  countTasks()
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function saveTasksWeek() {
  localStorage.setItem('tasksWeek', JSON.stringify(tasksWeek))
}

function renderHTMLTask(task) {
  let cssClass = task.status ? 'title toggle' : 'title'

  let newTask =
      `
        <li class='tasks' id = '${task.id}'>
          <span class = '${cssClass}'>${task.text}</span>
          <div>
            <button class='done' data-action = 'done'>${task.status ? 'Выполнено' : 'Выполнить'}</button>
            <button class='remove' data-action = 'remove'>Удалить</button>
          </div>
        </li>
      `
  tasksHTML.insertAdjacentHTML("beforeend",newTask)
}
  