import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-jMYrT55cCaAyz7Xc0h0V634cP4C0iJY",
  authDomain: "tuesday-90ff3.firebaseapp.com",
  databaseURL: "https://tuesday-90ff3-default-rtdb.firebaseio.com",
  projectId: "tuesday-90ff3",
  storageBucket: "tuesday-90ff3.appspot.com",
  messagingSenderId: "260280559251",
  appId: "1:260280559251:web:e7423afa3300363a3f4f66",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let db = getDatabase();
const dbRef = ref(db, "tasks");
let input = document.getElementById("taskid");

//get tasks
getTasks();

//add task
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask(input.value);
  }
});

document.getElementById("btnSubmit").addEventListener("click", function () {
  addTask(input.value);
});

//remove tasks
document.getElementById("btnRemove").addEventListener("click", function () {
  removeTasks(4);
});

getIP();

function addTask(task) {
  let id = push(child(ref(db), "tasks")).key;
  let ipaddress = document.getElementById("demo").textContent;
  let timenow = Date.now();
  set(ref(db, "tasks/" + id), {
    task: task,
    ip: ipaddress,
    time: timenow
  });
  document.getElementById("tableid").innerHTML = `<tr>
  <td>Tasks</td>
  <td>Mark</td>
</tr>`;
  input.value = "";
  getTasks();
}

function getTasks() {
  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        // console.log(childKey);
        // console.log(childData);
        const template = document.createElement("tr");
        template.innerHTML = `<td>${childData.task}</td>
        <td>
        <input type="checkbox" id="checkbox">
        </td>`;

        document.getElementById("tableid").appendChild(template);
      });
    },
    {
      onlyOnce: true,
    }
  );
}

function removeTasks(task) {
  let removeThese = document.querySelectorAll("#checkbox");
  for (let i = 0; i < removeThese.length; i++) {
    const element = removeThese[i];
    if (element.checked == true) {
      let task = element.parentElement.previousElementSibling.innerHTML;

      onValue(
        dbRef,
        (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            let dbtask = childData.task;
            if (dbtask == task) {
              remove(ref(db, "tasks/" + childKey));
              element.parentElement.parentElement.style.display = "none";
            }
          });
        },
        {
          onlyOnce: true,
        }
      );
    }
  }
}

function getIP() {
  const Http = new XMLHttpRequest();
  const url = "https://ipecho.net/plain";
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    if (Http.readyState == 4 && Http.status == 200) {
      document.getElementById("demo").innerHTML = Http.responseText;
    }
  };
}
