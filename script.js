//some sample data
const guestData = [
    { email: "glzdiego12@gmail.com", firstname: "Diego", lastname: "Gonzalez", notes: "Hello World" }
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
     let request = window.indexedDB.open("guests", 1);
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
       var db = event.target.result;
       var objectStore = db.createObjectStore("guest", {keyPath: "task"});
       
       for (var i in guestData) {
          objectStore.add(guestData[i]);
       }
    }
 }
 
 function todoList() {
  var item = document.getElementById("todoInput").value
  var text = document.createTextNode(item)
  var newItem = document.createElement("li")
  newItem.appendChild(text)
  document.getElementById("todoList").appendChild(newItem)
}