
let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: 101,
    title: "Create Login Page",
    assignee: "Rahul",
    status: "In Progress",
    priority: "High",
    tags: ["Frontend", "React"]
  },
  {
    id: 102,
    title: "Create Payment API",
    assignee: "Aman",
    status: "Todo",
    priority: "Medium",
    tags: ["Backend", "API"]
  },
  {
    id: 103,
    title: "Fix Dashboard Bug",
    assignee: "Priya",
    status: "Completed",
    priority: "Low",
    tags: ["Bug", "Frontend"]
  }
];

const totalTasks = document.querySelector(".total-tasks");
const todoTasks = document.querySelector(".todo-tasks");
const progressTasks = document.querySelector(".progress-tasks");
const completedTasks = document.querySelector(".completed-tasks");

const taskList = document.querySelector(".task-list");

const taskIdInput = document.querySelector(".task-id");
const taskTitleInput = document.querySelector(".task-title");
const taskAssigneeInput = document.querySelector(".task-assignee");
const taskStatusInput = document.querySelector(".task-status");
const taskPriorityInput = document.querySelector(".task-priority");
const taskTagsInput = document.querySelector(".task-tags");

const addTaskBtnInput = document.querySelector(".add-task-btn");

const searchInput = document.querySelector(".search-input");
const statusFilter = document.querySelector(".status-filter");
const priorityFilter = document.querySelector(".priority-filter");
const tagFilter = document.querySelector(".tag-filter");
const addTaskText = document.querySelector(".add-task-text");
const addOrEditForm = document.querySelector(".add-or-edit-form");

let editId = null;

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const taskFilter = (status) => {
  return tasks.filter(task => task.status === status);
};

const updateCounts = () => {
  totalTasks.textContent = tasks.length;
  todoTasks.textContent = taskFilter("Todo").length;
  progressTasks.textContent = taskFilter("In Progress").length;
  completedTasks.textContent = taskFilter("Completed").length;
};


const displayTasks = (taskArray) => {
  taskList.innerHTML = taskArray.map(function(task) {
    return `
      <tr>
        <td class="border p-3">${task.id}</td>
        <td class="border p-3">${task.title}</td>
        <td class="border p-3">${task.assignee}</td>
        <td class="border p-3">${task.status}</td>
        <td class="border p-3">${task.priority}</td>
        <td class="border p-3">${task.tags.join(", ")}</td>

        <td class="border p-3">
          <button
            class="bg-blue-500 text-white px-3 py-1 rounded"
            onclick="editTask(${task.id})"
          >
            Edit
          </button>

          <button
            class="bg-red-500 text-white px-3 py-1 rounded"
            onclick="deleteTask(${task.id})"
          >
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join("");
};

const deleteTask = (id) => {
  const index = tasks.findIndex(task => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);
  }
  updateTagFilter();
  saveTasks();
  displayTasks(tasks);
  updateCounts();

};

const editTask = (id) => {
  const task = tasks.find(task => task.id === id);

  editId = id;

  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskAssigneeInput.value = task.assignee;
  taskStatusInput.value = task.status;
  taskPriorityInput.value = task.priority;
  taskTagsInput.value = task.tags.join(", ");
  addTaskText.textContent = "Update Task";
  addTaskBtnInput.textContent = "Update Task";
  
};

const updateTagFilter = () =>{
  const allTags = tasks.flatMap(task => task.tags);
  const uniqueTags = [...new Set(allTags)];
  tagFilter.innerHTML = `<option value="">All Tags</option>`;
  uniqueTags.forEach((tag)=>{
    tagFilter.innerHTML += `<option value="${tag}">${tag}</option>`;
  });
};


addTaskBtnInput.addEventListener("click", function() {
  if (
    taskIdInput.value === "" ||
    taskTitleInput.value === "" ||
    taskAssigneeInput.value === "" ||
    taskTagsInput.value === ""
  ) {
    alert("Please fill all fields");
    return;
  }

  if (editId !== null) {

    const task = tasks.find(task => task.id === editId);

    task.id = Number(taskIdInput.value);
    task.title = taskTitleInput.value;
    task.assignee = taskAssigneeInput.value;
    task.status = taskStatusInput.value;
    task.priority = taskPriorityInput.value;

    task.tags = taskTagsInput.value
      .split(",")
      .map(tag => tag.trim());

    editId = null;

    addTaskBtnInput.textContent = "Add Task";
    addTaskText.textContent = "Add Task";
    
  } else {

    const newTask = {
      id: Number(taskIdInput.value),
      title: taskTitleInput.value,
      assignee: taskAssigneeInput.value,
      status: taskStatusInput.value,
      priority: taskPriorityInput.value,
      tags: taskTagsInput.value
        .split(",")
        .map(tag => tag.trim())
    };



    tasks.push(newTask);
    
  }

  saveTasks();
  displayTasks(tasks);
  updateCounts();
  updateTagFilter();

  taskIdInput.value = "";
  taskTitleInput.value = "";
  taskAssigneeInput.value = "";
  taskStatusInput.value = "Todo";
  taskPriorityInput.value = "High";
  taskTagsInput.value = "";
});

const filterTasks = () => {

  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  const priorityValue = priorityFilter.value;
  const tagValue = tagFilter.value;

  const filteredTasks = tasks.filter(task => {

    const searchMatch =
      task.title.toLowerCase().includes(searchValue) ||
      task.assignee.toLowerCase().includes(searchValue);

    const statusMatch =
      statusValue === "" || task.status === statusValue;

    const priorityMatch =
      priorityValue === "" || task.priority === priorityValue;

    const tagMatch =
      tagValue === "" || task.tags.includes(tagValue);

    return searchMatch &&
           statusMatch &&
           priorityMatch &&
           tagMatch;
  });

  displayTasks(filteredTasks);
};

searchInput.addEventListener("input", filterTasks);
statusFilter.addEventListener("change", filterTasks);
priorityFilter.addEventListener("change", filterTasks);
tagFilter.addEventListener("change", filterTasks);

saveTasks();
displayTasks(tasks);
updateCounts();
updateTagFilter();

