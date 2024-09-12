const apiKey = "b7c9744634e1eb8cdd4334835a4db934";
const weatherapiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const forecastapiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
        
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(weatherapiUrl + city + '&appid=' + apiKey + '&units=metric');
    const data = await response.json();
    
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        document.querySelector(".error").style.display = "none";
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h"
        const temperature = Math.round(data.main.temp);

        if (temperature > 30) {
            weatherIcon.src = "images/clear.png";
        } else if (temperature > 20 && temperature <= 30) {
            weatherIcon.src = "images/clouds.png";
        } else if (temperature > 10 && temperature <= 20) {
            weatherIcon.src = "images/mist.png";
        } else if (temperature > 0 && temperature <= 10) {
            weatherIcon.src = "images/drizzle.png";
        } else if (temperature > -10 && temperature <= 0) {
            weatherIcon.src = "images/rain.png";
        } else {
            weatherIcon.src = "images/snow.png";
        }
    }
}

async function checkForecast(city) {
    const response = await fetch(forecastapiUrl + city + '&appid=' + apiKey + '&units=metric');
    //const response = await fetch(`forecastapiUrl${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    hourlyForecast(data);
    weeklyForecast(data);
}

function hourlyForecast(data) {
    const hourlySection = document.querySelector('.hourly-forecast');
    hourlySection.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const hourlyData = data.list[i];
        const time = new Date(hourlyData.dt_txt).getHours();
        const temp = hourlyData.main.temp;
        const description = hourlyData.weather[0].description

        let iconSrc;
        if (temp > 30) {
            iconSrc = "images/clear.png";
        } else if (temp > 20 && temp <= 30) {
            iconSrc = "images/clouds.png";
        } else if (temp > 10 && temp <= 20) {
            iconSrc = "images/mist.png";
        } else if (temp > 0 && temp <= 10) {
            iconSrc = "images/drizzle.png";
        } else if (temp > -10 && temp <= 0) {
            iconSrc = "images/rain.png";
        } else {
            iconSrc = "images/snow.png";
        }


        hourlySection.innerHTML += `
            <div class="hour">
                <p>${time}:00</p>
                <img src="${iconSrc}" class="forecast-icon">
                <p>${temp}°C</p>
                <p>${description}</p>
            </div>
        `;
    }
}

function weeklyForecast(data) {
    const dailySection = document.querySelector('.weekly-forecast');
    dailySection.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const dailyData = data.list[i];
        const date = new Date(dailyData.dt_txt).toDateString();
        const temp = dailyData.main.temp;
        const description = dailyData.weather[0].description;

        let iconSrc;
        if (temp > 30) {
            iconSrc = "images/clear.png";
        } else if (temp > 20 && temp <= 30) {
            iconSrc = "images/clouds.png";
        } else if (temp > 10 && temp <= 20) {
            iconSrc = "images/mist.png";
        } else if (temp > 0 && temp <= 10) {
            iconSrc = "images/drizzle.png";
        } else if (temp > -10 && temp <= 0) {
            iconSrc = "images/rain.png";
        } else {
            iconSrc = "images/snow.png";
        }

        dailySection.innerHTML += `
            <div class="day">
                <p>${date}</p>
                <img src="${iconSrc}" class="forecast-icon">
                <p>${temp}°C</p>
                <p>${description}</p>
            </div>
        `;
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
    checkForecast(searchBox.value);
});

searchBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
        checkForecast(searchBox.value);
    }
});


/*Todo Section*/
//document.getElementById('addTaskBtn').addEventListener('click', addTask);
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const addTaskBtn = document.querySelector('#addTaskBtn');
const taskProgress = document.querySelector('#taskProgress')
let tasks = [];

addTaskBtn.addEventListener('click', addTask);


function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(task);
        taskInput.value = '';
        renderTasks();
        saveTasks();
    }
}
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
    saveTasks();
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveTasks();
}
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    let filteredTasks = tasks;

    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }
        const span = document.createElement('span');
        span.textContent = task.text;
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '\u2714';
        toggleBtn.addEventListener('click', () => toggleTaskCompletion(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '\u274C';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        const div = document.createElement('div');
        div.appendChild(toggleBtn);
        div.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(div);

        taskList.appendChild(li);
    });

    updateTaskProgress();
}
function updateTaskProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    taskProgress.innerHTML = `${completedTasks} out of ${tasks.length} tasks completed`;
}
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [];
    }
        renderTasks();
}
document.getElementById('all').addEventListener('click', () => renderTasks('all'));
document.getElementById('pending').addEventListener('click', () => renderTasks('pending'));
document.getElementById('completed').addEventListener('click', () => renderTasks('completed'));

loadTasks();