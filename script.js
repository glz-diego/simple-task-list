//some sample data
const taskData = [
   { id: new Date().getTime(), description: "task1" },
   { id: new Date().getTime(), description: "task2" }
];

//the database reference
let db;

//initializes the database
function initDatabase() {

   //create a unified variable for the browser variant
   window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

   window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

   window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

      //if a variant wasn't found, let the user know
   if (!window.indexedDB) {
         window.alert("Your browser doesn't support a stable version of IndexedDB.")
   }

   //attempt to open the database
   let request = window.indexedDB.open("tasks", 1);
   request.onerror = function(event) {
      console.log(event);
   };

   //map db to the opening of a database
   request.onsuccess = function(event) { 
      db = request.result;
      console.log("success: " + db);
   };

   //if no database, create one and fill it with data
   request.onupgradeneeded = function(event) {
      db = event.target.result;
      var objectStore = db.createObjectStore("tasks", {keyPath: "id"});
      
      for (var i in taskData) {
         objectStore.add(taskData[i]);
      }
   }
}

//adds a record as entered in the form
function add() {
   //get a reference to the fields in html
   let task = document.querySelector("#task").value;

   //alert(id + name + email + age);
   
   //create a transaction and attempt to add data
   var request = db.transaction(["tasks"], "readwrite")
   .objectStore("tasks")
   .add({ id: new Date().getTime(), description: task });

   //when successfully added to the database
   request.onsuccess = function(event) {
      alert(`${task} has been added to your database.`);
      readAll();
   };

   //when not successfully added to the database
   request.onerror = function(event) {
   alert(`Unable to add data\r\n${task} is already in your database! `);
   }
}

//not used in code example
//reads one record by id
function read() {
   //get a transaction
   var transaction = db.transaction(["task"]);
   
   //create the object store
   var objectStore = transaction.objectStore("task");

   //get the data by id
   var request = objectStore.get("00-03");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
         alert("Task: " + request.result.task);
      }
      
      else {
         alert("Task couldn't be found in your database!");
      }
   };
}

function addEntry(task) {
   var node = document.createElement("LI");
   var textnode = document.createTextNode(task);
   node.appendChild(textnode);
   document.getElementById("entries").appendChild(node);
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

//deletes a record by id
function remove() {
   let delid = document.querySelector("#delid").value;
   var request = db.transaction(["tasks"], "readwrite")
   .objectStore("tasks")
   .delete(parseInt(delid));
   
   request.onsuccess = function(event) {
      alert("Entry has been removed from your database.");
   };
}

initDatabase();