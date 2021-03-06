// CLIENT: javascript with jQuery for app functionality, has calls to the server routes

// * Global Variables
// var taskArray = [];
var taskCount = 0;

// * jQuery loads after DOM is loaded
$(document).ready(function(){

  // console.log('Works!');

  getTasks();
  $('.submit').on('click', createTask);
  $('.task-list').on('click', '.remove', removeTask);
  $('.task-list').on('click', '.completed', completeTask);

  console.log('Here is the Task Count: ', taskCount);

});


// * FUNCTIONS

// Pulls information from DB
function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks/get',
    success: function(data) {
      // console.log('GET was successful here is data: ', data);
      // taskArray.push(data);
      appendTasks(data);
    }
  });
}

// Appends tasks to DOM at task-list div
function appendTasks(data) {
  $('.task-list').empty();
  var $el = $('.task-list').last();

  for(var i = 0; i < data.length; i++) {

    var idData = data[i].id;
    var completedData = data[i].completed;
    // console.log('!!!: ', completed);
    $el.append('<div class=" task task' + idData + '" data-divID="' + idData + '"><p>' + data[i].task_name +
    '<br />' + data[i].task_description + '</p>' +
    '<br /> <button class="remove" data-index="' + idData + '">Remove</button>' +
    '<button class="completed" data-index="' + data[i].id + '" data-complete="' + completedData + '"' +
    '">Completed</button></div>').slideDown('slow');
    // console.log('DATA: ', data[i]);
    lookCompleted(completedData, idData);
  }
}

// Processes the form, serializes it into an array of objects and sends through server to DB
function createTask() {
  event.preventDefault();
  var task = {};

  $.each($('#task-form').serializeArray(), function(i, field){
    task[field.name] = field.value;
  });
  console.log(task);
  postTasks(task);
  $('#task-form').find('input[type=text]').val('');
  $('#task-form').find('textarea').val('');
}

// Posts information to DB
function postTasks(task) {
  $.ajax({
    type: 'POST',
    url: '/tasks/post',
    data: task,
    success: function() {
      console.log('POST successful, here is the data: ', task);
      getTasks();
    }
  });
}

// Removes task from DOM completely and deletes from DB
function removeTask() {
  var index = $(this).data();
  console.log('Here is the deleted items data: ', index);
  deleteTask(index);
  $(this).parent().remove();

}

// ajax request to server to delete task from DB
function deleteTask(index){
  $.ajax({
    type: 'DELETE',
    url: '/tasks/delete',
    data: index,
    success: function(index) {
      console.log('Task deleted: ', index);
      getTasks();
    }
  });
}

// Removes task from DOM completely and deletes from DB
function completeTask() {
  var index = $(this).data();
  console.log('* -->>> Here is the updated complete items data: ', index);
  updateComplete(index);
  // $(this).parent().remove();  //This needs to change the color

}

// ajax request to server to delete task from DB
function updateComplete(index){
  $.ajax({
    type: 'PUT',
    url: '/tasks/put',
    data: index,
    success: function(index) {
      console.log('Task updated: ', index);
      getTasks();
      // appendTasks(index);
    }
  });
}

// Checks to see if task completed = true from DB, if so, adds class chaning the look
function lookCompleted(data, index) {
  console.log('Completed status in lookCompleted: ', data);
  if (data == true) {
    $('.task' + index).addClass('highlight');
  }
}

// Converts boolean completed value from DB into a string
// function boolString (booleanData) {
//   var boolean = booleanData;
//   var string = boolean.toString();
//   console.log(string);
//   return string;
// }


// END _-_-_-_-_|



// Code not used:


// Initiates DOM
// function initDom() {
//   getTasks();
//   appendTasks(taskArray);
// }
