//http://petlatkea.dk/2019/hogwarts/families.json

"use strict";

// --- Declare Arrays ---
let arrayOfStudents = [];
let arrayOfExpelled = [];
let currentArray;

// --- Declare Filter/Sort ---
let filterBy = "All";
let sortBy = "None";

// --- Declare Umbridge ---
let bloodFamilyJSON;

// --- Declare new Student ---
let newStudent = {
  fullName: "Ioana Germaine Jocelyne Aneroussis",
  house: "Hufflepuff",
  crest: "myimg/hufflepuff.jpg",
  middleName: " Germaine Jocelyne ",
  firstName: "Ioana",
  lastName: "Aneroussis",
  image: "images/aneroussis_i.png",
  expelled: false,
  bloodstatus: "Pure-blood"
};

// --- Object Prototype ---
const studentProto = {
  fullName: "--Fullname--",
  firstName: "--Firstname--",
  middleName: "--Middlename--",
  lastName: "--Lastname--",
  house: "--House--",
  crest: "--Crest--",
  image: "--Image-",
  expelled: "--Expelled--",

  bloodstatus: "--blood--",

  setJSONdata(studentData) {
    // Spacing in names
    const firstSpace = studentData.fullname.indexOf(" ");
    const lastSpace = studentData.fullname.lastIndexOf(" ");
    // Full name
    this.fullName = studentData.fullname;
    // First Name
    this.firstName = studentData.fullname.substring(0, firstSpace);
    // Middle Name
    this.middleName =
      " " + studentData.fullname.substring(firstSpace + 1, lastSpace) + " ";
    // Last name
    this.lastName = studentData.fullname.substring(lastSpace + 1);
    // House
    this.house = studentData.house;
    // Crests
    this.crest = "myimg/" + this.house.toLowerCase() + ".jpg";
    // Get images by their last names in the folder
    this.image =
      "images/" +
      this.lastName.toLowerCase() +
      "_" +
      this.firstName.substring(0, 1).toLowerCase() +
      ".png";
    this.expelled = false;
  }
};

// --- Init ---
window.addEventListener("DOMContentLoaded", init);

function init() {
  //console.log("init");
  // Filter Houses
  document.querySelector("#all").addEventListener("click", filterAll);
  document
    .querySelector("#hufflepuff")
    .addEventListener("click", filterHufflepuff);
  document
    .querySelector("#gryffindor")
    .addEventListener("click", filterGryffindor);
  document
    .querySelector("#ravenclaw")
    .addEventListener("click", filterRavenclaw);
  document
    .querySelector("#slytherin")
    .addEventListener("click", filterSlytherin);
  // Sort Names
  document.querySelector("#firstname").addEventListener("click", sortFirstName);
  document.querySelector("#lastname").addEventListener("click", sortLastName);
  document.querySelector("#house").addEventListener("click", sortHouse);

  // Expel button
  document
    .querySelector("#expelled")
    .addEventListener("click", expelliarmusButton);

  // Call Fetch JSON Function
  getJson();
}

// --- Fetch JSON Datas ---
async function getJson() {
  let Json = await fetch("students.json");
  let students = await Json.json();
  studentObject(students);
  pushMyself();
}

// --- Fetch JSON Blood Status Datas ---
function fetchBloodFamilyJSON(student) {
  fetch("families.json")
    .then(res => res.json())
    .then(famJSON => {
      bloodFamilyJSON = famJSON;
      insertBloodStatus(student);
    });
}

// --- Insert Blood Status to the Student Object Prototype
function insertBloodStatus(student) {
  let halfBlood = findHalfBlood(student.lastName);
  let pureBlood = findPureBlood(student.lastName);
  if (halfBlood) {
    student.bloodstatus = "Half";
  } else if (pureBlood) {
    student.bloodstatus = "Pure";
  } else {
    student.bloodstatus = "Muggle";
  }
}

// --- Inject New Student ---
function pushMyself() {
  arrayOfStudents.push(newStudent);
  console.log(arrayOfStudents);
}

// --- Find JSON Family Datas ---
function findHalfBlood(studentLast) {
  return bloodFamilyJSON.half.findIndex(obj => obj == studentLast) > -1;
}
function findPureBlood(studentLast) {
  return bloodFamilyJSON.pure.findIndex(obj => obj == studentLast) > -1;
}

// --- Create Objects for each Student ---
function studentObject(students) {
  students.forEach(studentData => {
    // Object
    const student = Object.create(studentProto);

    fetchBloodFamilyJSON(student);

    student.setJSONdata(studentData);
    // Push in array
    arrayOfStudents.push(student);
  });
  createIdStudent();
}

// --- Create unique IDs for each students ---
function createIdStudent() {
  arrayOfStudents.forEach(student => {
    const idMade = makeId(student.fullName);
    student.id = idMade;
  });
  currentArray = arrayOfStudents;
  filterStudents(filterBy);
}

// --- Make the IDs ---
function makeId(input) {
  let idMade = "";
  // Use for loop
  for (let i = 0; i < input.length; i++) {
    idMade += input[i].charCodeAt(0);
    // charCodeAt() method returns an integer
  }
  return idMade.substring(0, 7);
}

// --- Function Expelling Students ---
function expelliarmus(expelStudentId) {
  // Set the expel status
  let objIndex = arrayOfStudents.findIndex(obj => obj.id == expelStudentId);
  arrayOfStudents[objIndex].expelled = true;

  let expelledStudent = arrayOfStudents[objIndex];
  arrayOfExpelled.unshift(expelledStudent);

  // Delete students
  arrayOfStudents = arrayOfStudents.filter(function(el) {
    return el.expelled === false;
  });

  currentArray = arrayOfStudents;
  filterStudents(filterBy);

  // TODO Find id for new Student to reject Expel function
}

// --- Filter Functions for each House ---
function filterAll() {
  filterBy = "All";
  currentArray = arrayOfStudents;
  filterStudents(filterBy);
}

function filterHufflepuff() {
  filterBy = "Hufflepuff";
  filterStudents(filterBy);
}

function filterGryffindor() {
  filterBy = "Gryffindor";
  filterStudents(filterBy);
}

function filterRavenclaw() {
  filterBy = "Ravenclaw";
  filterStudents(filterBy);
}

function filterSlytherin() {
  filterBy = "Slytherin";
  filterStudents(filterBy);
}

function filterStudents(filterBy) {
  if (filterBy === "All") {
    sortStudents(arrayOfStudents);
  } else {
    currentArray = arrayOfStudents.filter(function(student) {
      return student.house === filterBy;
    });
    // Call the Sorting Function
    sortStudents();
  }
}

// --- Sorting Functions ---
function sortFirstName() {
  sortBy = "firstName";
  sortStudents();
}

function sortLastName() {
  sortBy = "lastName";
  sortStudents();
}

function sortHouse() {
  sortBy = "house";
  sortStudents();
}

function sortStudents() {
  if (sortBy === "None") {
    displayStudents();
  }
  if (sortBy === "firstName") {
    currentArray.sort(function(a, z) {
      if (a.firstName < z.firstName) {
        return -1; // Shift to one position foreward
      } else {
        return 1; // Shift to one position backward
      }
    });
    displayStudents();
  }
  if (sortBy === "lastName") {
    currentArray.sort(function(a, z) {
      if (a.lastName < z.lastName) {
        return -1;
      } else {
        return 1;
      }
    });
    displayStudents();
  }
  if (sortBy === "house") {
    currentArray.sort(function(a, z) {
      if (a.house < z.house) {
        return -1;
      } else {
        return 1;
      }
    });
    displayStudents();
  }
}

function expelliarmusButton() {
  currentArray = arrayOfExpelled;
  displayStudents();
}

// --- Function Display Students ---
function displayStudents() {
  //console.log("displayList");
  const template = document.querySelector("[data-template]");
  const container = document.querySelector("[data-container]");
  container.innerHTML = "";

  currentArray.forEach(student => {
    console.log(student);
    let clone = template.content.cloneNode(true);
    // Get elements in the template
    clone.querySelector("[data-firstname]").textContent = student.firstName;
    clone.querySelector("[data-middlename]").textContent = student.middleName;
    clone.querySelector("[data-lastname]").textContent = student.lastName;
    clone.querySelector("[data-house]").textContent = student.house;
    clone.querySelector("[data-crest]").src = student.crest;

    if (student.expelled === false) {
      clone.querySelector(".expel").addEventListener("click", () => {
        expelliarmus(student.id);
      });
    } else {
      clone.querySelector(".expel").remove();
    }

    clone.querySelector(".studentName").addEventListener("click", () => {
      displayModal(student);
    });
    container.appendChild(clone);
  });
  countStudents();
}

// --- MODAL ---

function displayModal(student) {
  modal.classList.add("show");
  modal.querySelector("[data-firstname]").textContent = student.firstName;
  modal.querySelector("[data-middlename]").textContent = student.middleName;
  modal.querySelector("[data-lastname]").textContent = student.lastName;
  modal.querySelector("[data-house]").textContent = student.house;
  modal.querySelector("[data-crest]").src = student.crest;

  let studentPortrait = modal.querySelector(".portrait");
  if (student.firstName == "Padma") {
    studentPortrait.src = "images/patil_padme.png";
  } else if (student.firstName == "Ernest") {
    studentPortrait.src = "images/macmillian_e.png";
  } else {
    studentPortrait.src = student.image;
  }

  modal.querySelector(".close").addEventListener("click", closeModal);
  modal.querySelector(".blood-status").textContent = `Blood Status: ${
    student.bloodstatus
  }`;

  if (student.house === "Hufflepuff") {
    modal.querySelector("#modal-content").classList.add("hufflepuff");
  } else if (student.house === "Gryffindor") {
    modal.querySelector("#modal-content").classList.add("gryffindor");
  } else if (student.house === "Ravenclaw") {
    modal.querySelector("#modal-content").classList.add("ravenclaw");
  } else if (student.house === "Slytherin") {
    modal.querySelector("#modal-content").classList.add("slytherin");
  }
}

function closeModal() {
  modal.querySelector("#modal-content").classList.remove("slytherin");
  modal.querySelector("#modal-content").classList.remove("ravenclaw");
  modal.querySelector("#modal-content").classList.remove("gryffindor");
  modal.querySelector("#modal-content").classList.remove("hufflepuff");

  modal.classList.remove("show");
}

// --- Count Students ---
function countStudents() {
  const countAll = arrayOfStudents.length;
  document.querySelector("#studentCount").textContent = countAll;

  const gryffindorArray = arrayOfStudents.filter(function(el) {
    return el.house === "Gryffindor";
  });
  document.querySelector("#gryffindorCount").textContent =
    gryffindorArray.length;

  const ravenclawArray = arrayOfStudents.filter(function(el) {
    return el.house === "Ravenclaw";
  });

  document.querySelector("#ravenclawCount").textContent = ravenclawArray.length;

  const hufflepuffArray = arrayOfStudents.filter(function(el) {
    return el.house === "Hufflepuff";
  });
  document.querySelector("#hufflepuffCount").textContent =
    hufflepuffArray.length;

  const slytherinArray = arrayOfStudents.filter(function(el) {
    return el.house === "Slytherin";
  });
  document.querySelector("#slytherinCount").textContent = slytherinArray.length;

  const countExpelled = arrayOfExpelled.length;
  document.querySelector("#expelledCount").textContent = countExpelled;
}
