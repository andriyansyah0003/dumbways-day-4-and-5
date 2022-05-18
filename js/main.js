function submitForm() {
  const emailReceiver = "andriyansyah0003@gmail.com";

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let subject = document.getElementById("subject").value;
  let message = document.getElementById("message").value;

  if (
    name === "" ||
    email === "" ||
    phone === "" ||
    subject === "" ||
    message === ""
  ) {
    alert("Tolong isi semua form...");
  }

  let a = document.createElement("a");
  a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hallo, Perkenalkan Nama saya ${name}. I wanted to ${subject}, ${message} .terimakasih`;
  a.click();
}

function getProjects() {
  let a = localStorage.getItem("list_project"); // get data from local storage
  let isArrayEmpty = (x) => (x === null ? [] : JSON.parse(x)); // check if local storage is empty
  return isArrayEmpty(a); // return array
}

window.onload = () => renderProjects(); // render projects when page is loaded
function getDateDifference(startDate, endDate) {
  // get date difference
  if (startDate > endDate) {
    // check if start date is greater than end date
    console.error("Start date must be before end date"); // throw error
    return null; // return null
  }
  let startYear = startDate.getFullYear(); // get start year
  let startMonth = startDate.getMonth(); // get start month
  let startDay = startDate.getDate(); // get start day

  let endYear = endDate.getFullYear(); // get end year
  let endMonth = endDate.getMonth(); // get end month
  let endDay = endDate.getDate(); // get end day

  let february =
    (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28; // check if end year is leap year
  let daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // get days of month

  let startDateNotPassedInEndYear =
    endMonth < startMonth || (endMonth == startMonth && endDay < startDay); // check if start date is not passed in end year
  let years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0); // get years
  let months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12; // get months

  let days =
    startDay <= endDay
      ? endDay - startDay
      : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay; // get days

  return {
    years: years,
    months: months,
    days: days,
  };
}

function addProjects() {
  let title = document.getElementById("input-project-name").value; // get title from input
  let startDate = new Date(document.getElementById("input-start-date").value); // get start date from input
  let endDate = new Date(document.getElementById("input-end-date").value); // get end date from input
  let lengthDate = getDateDifference(startDate, endDate); // get date difference
  let description = document.getElementById("input-description").value; // get description from input
  let image = document.getElementById("upload-image").files[0]; // get image from input

  let logoTechlist = []; // create array for logo tech
  if (document.getElementById("node-js").checked) {
    logoTechlist.push("node-js");
  }
  if (document.getElementById("react-js").checked) {
    logoTechlist.push("react-js");
  }
  if (document.getElementById("next-js").checked) {
    logoTechlist.push("next-js");
  }
  if (document.getElementById("typeScript-js").checked) {
    logoTechlist.push("typeScript-js");
  }
  const dateFormatOptions = { year: "numeric", month: "long", day: "numeric" }; // set date format

  image = URL.createObjectURL(image); // create image url
  let project = {
    id: Math.floor(Math.random() * 1000000),
    title: title,
    startDate: startDate.toLocaleDateString("id-ID", dateFormatOptions),
    endDate: endDate.toLocaleDateString("id-ID", dateFormatOptions),
    lengthDate: lengthDate.months,
    description: description,
    logoTechlist: logoTechlist,
    image: image,
  }; // create project object
  let data = getProjects(); // get data from local storage
  data.push(project); // push project to data
  localStorage.setItem("list_project", JSON.stringify(data)); // set data to local storage
  renderProjects();
}

function checkTechLogoifExists(list) {
  let logoTech = "";
  if (list.includes("node-js")) {
    logoTech += '<img src="../img/nodejs-icon.svg" alt="node-js">';
  }
  if (list.includes("react-js")) {
    logoTech += '<img src="../img/react.svg" alt="react-js">';
  }
  if (list.includes("next-js")) {
    logoTech += '<img src="../img/nextjs-icon.svg" alt="next-js">';
  }
  if (list.includes("typeScript-js")) {
    logoTech += '<img src="../img/typescript-icon.svg" alt="typescript-js">';
  }
  return logoTech;
}

function deleteProject(id) {
  let data = JSON.parse(localStorage.getItem("list_project")); // get data from local storage
  const removeIndex = data.findIndex((item) => item.id === id); // get index of project
  data.splice(removeIndex, 1); // remove project from data
  localStorage.setItem("list_project", JSON.stringify(data)); // set data to local storage
  renderProjects();
}

function renderProjects() {
  let projectsContainer = document.getElementById("contents-projects"); // get projects container

  projectsContainer.innerHTML = ""; // clear projects container
  let projects = getProjects(); // get projects from local storage
  projects.forEach((data) => {
    projectsContainer.innerHTML += `
    <div class="grid-item" >
      <img src="${data.image}" alt="">
      <div class="title">
        <h2><a href="project-detail.html?id=${data.id}">${data.title}</a></h2>
        <p>durasi : ${data.lengthDate} bulan</p>
      </div>
              <p> ${data.description} </p>
              <div class="tech-icon">
                  ${checkTechLogoifExists(data.logoTechlist)}
              </div>
              <div class="btn-group">
                  <button class="btn-edit" type="button" onclick="">edit</button>
                  <button class="btn-delete" type="button" onclick="deleteProject(${
                    data.id
                  })">delete</button>
              </div>
          </div>`;
  });
}

function getProjectDetail() {
  let params = new URLSearchParams(location.search); // get params from url
  let id = params.get("id"); // get id from params
  let a = localStorage.getItem("list_project"); // get data from local storage
  let isArrayEmpty = (x) => (x === null ? [] : JSON.parse(x)); // check if array is empty
  let projects = isArrayEmpty(a); // get projects from local storage
  return projects.find((x) => x.id == id); // get project from projects
}

window.onload = () => {
  let data = getProjectDetail(); // get project detail
  let projectsDetailContainer = document.getElementById("detail-project"); // get projects detail container
  projectsDetailContainer.innerHTML += `
  <h1 class="header">${data.title}</h1>
      <div class="project">
          <img src="${data.image}" class="image-project">
          <div class="item">
              <h2 class="sub-title">Duration</h2>
              <div class="duration">
                  <p><i class="fa-solid fa-calendar-days"></i> ${
                    data.startDate
                  } - ${data.endDate}</p>
                  <p><i class="fa-solid fa-clock-rotate-left"></i> ${
                    data.lengthDate
                  } Months</p>
              </div>
              <h2 class="sub-title">Technologies</h2>
              <div class="tech-icon" id="tech-icon-project-detail">
                  <div class="">
                      <div class="item-icon">
                          ${checkTechLogoifExists(data.logoTechlist)}
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="project-description">
          <p>${data.description}</p>
      </div>`;
};
