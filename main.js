// getting the HTML elements into the JavaScript file to be able to use them
let creatorInput = document.getElementById("Creator");
let descriptionInput = document.getElementById("Description");
let assignedToInput = document.getElementById("AssignedTo");
let dueDateInput = document.getElementById("DueDate");
let statusInput = document.getElementById("Status");
let addTaskButton = document.getElementById("addTaskButton");
let inputCardsHere = document.getElementById("inputCardsHere");
let inputListItemsHere = document.getElementById("inputListItemsHere");




// initialising all user inputs as false so they can be set to true if they pass the validation check below
let creatorCheck = false;
let descriptionCheck = false;
let assignedCheck = false;
let dueDateCheck = false;
let statusCheck = false;
let validationPassed = false;





// just a bunch of simple if and else statements to check user inputs against criteria
function validateTaskForm(creatorInput, descriptionInput, assignedToInput, dueDateInput, statusInput) {
  if ((creatorInput !== "") && (creatorInput.length > 4)) {
    creatorCheck = true;
  } else {
    creatorCheck = false;
  }

  if ((descriptionInput !== "") && (descriptionInput.length > 10)) { 
    descriptionCheck = true;
  } else {
    descriptionCheck = false;
  }

  if ((assignedToInput !== "") && (assignedToInput.length > 4)) {
    assignedCheck = true;
  } else {
    assignedCheck = false;
  }

  if (dueDateInput !== "") {
    dueDateCheck = true;
  } else {
    dueDateCheck = false;
  } 

  if (statusInput !== "") {
    statusCheck = true;
  } else {
    statusCheck = false;
  }

  if (creatorCheck && descriptionCheck && assignedCheck && dueDateCheck && statusCheck === true) {
    validationPassed = true;
  } else {
    validationPassed = false;
  }
  
  return validationPassed;
}




// array of all the already existing tasks (as objects), starts with nothing inside but will get objects pushed into it
let existingTasks = [];





// function to create a new task object with the users inputs
function createTaskObject(creator, description, assignedTo, dueDate, status) {
  let taskObject = {
    "creator": creator,
    "description": description,
    "assignedTo": assignedTo,
    "dueDate": dueDate,
    "status": status,
    "ID": `${existingTasks.length + 1}`
  }
  existingTasks.push(taskObject);
  localStorage.setItem("arrayOfTasks", JSON.stringify(existingTasks));
}




// function to add a card template into the HTML file with the users inputs inside of it along with the unique ID
function createCardAndList(arrayOfObjects) {
  
  let card = `<div id="${arrayOfObjects.ID}" class="col-md-4">
  <div class="card mx-auto" style="width: 18rem;">
    <div class="card-header">
      Task <button type="button" class="btn btn-danger position deleteButton" deleteID="${arrayOfObjects.ID}" job="delete">Delete</button>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><b>Assigned to:</b><br> ${arrayOfObjects.creator}</li>
      <li class="list-group-item"><b>Task:</b><br> ${arrayOfObjects.description}</li>
      <li class="list-group-item"><b>Assigned by:</b><br> ${arrayOfObjects.assignedTo}</li>
      <li class="list-group-item"><b>Due date:</b><br> ${arrayOfObjects.dueDate}</li>
      <li class="list-group-item"><b>Status:</b><br> ${arrayOfObjects.status}</li>
    </ul>
  </div>
</div>`

inputCardsHere.insertAdjacentHTML('beforeend', card);

  
  let list = `<a id="${arrayOfObjects.ID}" href="#${arrayOfObjects.ID}" class="list-group-item list-group-item-action">
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">Task for ${arrayOfObjects.assignedTo}</h5>
    <small class="text-muted">Due ${arrayOfObjects.dueDate}</small>
  </div>
  <p class="mb-1">Click to go to task</p>
  <small class="text-muted">Assigned by ${arrayOfObjects.creator}</small>
</a>`

inputListItemsHere.insertAdjacentHTML('afterbegin', list);


};


//limiter to the content list group (CLG) section so that it can only have 5 items 
let limiterForCLG = 5;
let currentNum = 0;

function addTask() {
  
    console.log(validateTaskForm(creatorInput.value, descriptionInput.value, assignedToInput.value, dueDateInput.value, statusInput.value));
  
    if (validationPassed == false) {
      
      alert("Error in creating a task, please make sure that you have filled out every field and that it meets the criteria: 'Creator' and 'Assigned to' name has to be over 4 characters and 'Description' has to be over 10 characters")
      
      console.log("Error in creating a task, please make sure that you have filled out every field and that it meets the criteria: 'Creator' and 'Assigned to' name has to be over 4 characters and 'Description' has to be over 10 characters");
  
    } else {
      console.log("Task created");
      
      createTaskObject(creatorInput.value, descriptionInput.value, assignedToInput.value, dueDateInput.value, statusInput.value);
     
      let indexOfTaskToBeAdded = existingTasks.length - 1;
      
      createCardAndList(existingTasks[indexOfTaskToBeAdded]);
  
      console.log(existingTasks);
    }
}


// event listner for a delete button on a card



document.addEventListener('click', function(event){
  const isButton = (event.target.nodeName == 'BUTTON');
  if(isButton) {
      const element = event.target;
      let job = element.attributes.job.value;
      if (job == "delete") {
        deleteTask(element);
      } else if (job == "addTask") {
        addTask();
      }
  }  

});

//function to delete a card
function deleteTask(element) {

  let thistaskID = element.parentNode.parentNode.parentNode.attributes.id.value;
    
// deletes object from array

  for(i=0; i < existingTasks.length; i++){
        if(existingTasks[i].ID == thistaskID){
            existingTasks.splice(i,1);
        }
        localStorage.setItem("arrayOfTasks", JSON.stringify(existingTasks));
    };


// deletes the card

element.parentNode.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode.parentNode);

// deletes the list content thingy

let elementsA = document.getElementsByTagName('a');
    for(let i=0; i < elementsA.length; i++){
        element = elementsA[i];
        if(element.attributes.id.value == thistaskID){
            element.parentNode.removeChild(element);



        }
      }
    };

// get array of tasks back from local storage
let returnedArray = localStorage.getItem("arrayOfTasks");

if (returnedArray) {
  existingTasks = JSON.parse(returnedArray);
  populatePage(existingTasks);
} else {
  existingTasks = [];
}


function populatePage(theArrayOfTaskObjects) {
  for (i = 0; i < theArrayOfTaskObjects.length; i++) {
    createCardAndList(theArrayOfTaskObjects[i]);
    
  }
};









// task manager class to do task stuff
class TaskManager {
  constructor(array) {
    this.array = array;
  
  function getAllTasks() {

  };
  function getTasksWithStatus(status) {

  };
  function addTask(task) {

  };
  function deleteTask(task) {

  };
  function updateTaskStatus(taskID, status) {

  };
  function changeWhoTaskIsAssignedTo(taskID, newAssignedPerson) {

  };
  }

}
