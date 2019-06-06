const taskData = [
  { id: new Date().getTime(), description: "task1" },
    { id: new Date().getTime(), description: "task2" }
];

let db;

function initDatabase() {

   window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

   window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

   window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

      //if a variant wasn't found, let the user know
   if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
   }

  var request = window.indexedDB.open("tasks", 4);

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    
    db.onerror = function(event) {
      console.log("Error in upgrade")
    };

    const objectStore = db.createObjectStore("tasks", { keyPath: "id" });

  };

   request.onerror = function(event) {
      console.log(event);
      console.log("Error" + event)
   };

   request.onsuccess = function(event) { 
      db = request.result;
      console.log("success: " + db);
   };

   console.log(request)
}

function add() {
   let task = document.querySelector("#task").value;

   console.dir(db.transaction(['tasks']))
   //create a transaction and attempt to add data
   let transaction = db.transaction(['tasks'], 'readwrite');

   transaction.oncomplete = function(event) {
      console.log("transaction complete")
   };

   transaction.onerror = function(event) {
    console.log(event)
  };

   transaction
   .objectStore("tasks")
   .add({ id: new Date().getTime(), description: task });

   readAll()
}

function read() {
   var transaction = db.transaction(["task"]);
   
   var objectStore = transaction.objectStore("task");

   var request = objectStore.get("00-03");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      if(request.result) {
         alert("Task: " + request.result.task);
      }
      
      else {
         alert("Task couldn't be found in your database!");
      }
   };
}
var iDiv;
function addEntry() {
  let task = document.querySelector("#newTask").value;
  if (task != "") {
    document.querySelector("#newTask").value = "";
  }
  iDIV = document.createElement('DIV');
  iDIV.innerHTML = "<input id='todo${item.itemid}' type='checkbox'/>&nbsp;" + task;
  document.querySelector('#entries').appendChild(iDIV);

   // object.onclick = function(){myScript};
}

function clearList() {
      let entries = document.querySelector("#entries");
      entries.innerHTML = "";
}

//reads all the data in the database
function readAll() {
     clearList();
     
   var objectStore = db.transaction("tasks").objectStore("tasks");
   
   //creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         console.log("Task: " + cursor.value.description);
          addEntry(cursor.value.description);
          cursor.continue();
      }
   };
}

function clearAll() {
 var checkBox = document.getElementById("entries");
 let inputData = document.getElementById("newTask");
 // if (checkBox.checked == true){
 // document.getElementById("todo${item.itemid}").innerHTML = "";
 // }
}

function checkbox() {
  var checkBox = document.getElementById("entries");
  var text = document.getElementById("todo${item.itemid}");
  if (checkBox.checked == true){
    text.style.display = "none";
  } else {
     text.style.display = "block";
  }
}

initDatabase();