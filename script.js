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

    // Create an objectStore for this database
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

function addEntry(task) {
  var img = document.createElement("IMG");
  img.setAttribute("src", "Trash.png");
  img.setAttribute("width", "20");
  img.setAttribute("height", "20");
   var node = document.createElement("LI");
   var textnode = document.createTextNode(task);
   node.appendChild(img);
   node.appendChild(textnode);
   node.onclick = "remove()";
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
   }};


initDatabase();