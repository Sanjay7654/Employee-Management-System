let employees = JSON.parse(sessionStorage.getItem("employees")) || [];
let editIndex = null;

const form = document.getElementById("employeeForm");
const tbody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("searchInput");
const employeeCount = document.getElementById("employeeCount");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const salary = parseFloat(document.getElementById("salary").value.trim());

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|net|org|co)$/;
  if (!emailRegex.test(email)) {
    alert("❌ Enter a valid email (e.g. example@domain.com)");
    return;
  }

  // Duplicate check using for loops (not .some)
  let nameExists = false;
  let emailExists = false;
  let phoneExists = false;

  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    if (editIndex === null || i !== editIndex) {
      if (emp.name.toLowerCase() === name.toLowerCase()) nameExists = true;
      if (emp.email.toLowerCase() === email.toLowerCase()) emailExists = true;
      if (emp.phone === phone) phoneExists = true;
    }
  }

  if (nameExists) {
    alert("❌ Name already exists. Please enter a unique name.");
    return;
  }
  if (emailExists) {
    alert("❌ Email already exists. Please enter a unique email.");
    return;
  }
  if (phoneExists) {
    alert("❌ Phone number already exists. Please enter a unique phone.");
    return;
  }

  const employee = { name, email, department, phone, salary };

  if (editIndex === null) {
    employees.push(employee);
  } else {
    employees[editIndex] = employee;
    editIndex = null;
  }

  saveToSessionStorage();
  form.reset();
  renderTable();
});

searchInput.addEventListener("input", renderTable);

function renderTable() {
  tbody.innerHTML = "";

  const filter = searchInput.value.toLowerCase();
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(filter) ||
    emp.email.toLowerCase().includes(filter) ||
    emp.department.toLowerCase().includes(filter) ||
    emp.phone.toLowerCase().includes(filter)
  );

  filteredEmployees.forEach((emp, index) => {
    const row = document.createElement("tr");

    if (editIndex !== null && employees[editIndex] === emp) {
      row.classList.add("editing");
    }

    const cellIndex = document.createElement("td");
    cellIndex.textContent = index + 1;

    const cellName = document.createElement("td");
    cellName.textContent = emp.name;

    const cellEmail = document.createElement("td");
    cellEmail.textContent = emp.email;

    const cellDepartment = document.createElement("td");
    cellDepartment.textContent = emp.department;

    const cellPhone = document.createElement("td");
    cellPhone.textContent = emp.phone;

    const cellSalary = document.createElement("td");
    cellSalary.textContent = `${emp.salary.toFixed(2)}`;

    const cellActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      editIndex = employees.indexOf(emp);
      document.getElementById("name").value = emp.name;
      document.getElementById("email").value = emp.email;
      document.getElementById("department").value = emp.department;
      document.getElementById("phone").value = emp.phone;
      document.getElementById("salary").value = emp.salary;

     
      renderTable();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
      if (confirm("Are you sure you want to delete this employee?")) {
        employees.splice(employees.indexOf(emp), 1);
        saveToSessionStorage();
        renderTable();
      }
    };

    cellActions.appendChild(editBtn);
    cellActions.appendChild(deleteBtn);

    row.appendChild(cellIndex);
    row.appendChild(cellName);
    row.appendChild(cellEmail);
    row.appendChild(cellDepartment);
    row.appendChild(cellPhone);
    row.appendChild(cellSalary);
    row.appendChild(cellActions);

    tbody.appendChild(row);
  });

  employeeCount.textContent = `Total Employees: ${employees.length}`;
}


function saveToSessionStorage() {
  sessionStorage.setItem("employees", JSON.stringify(employees));
}

function resetAll() {
  if (confirm("Are you sure you want to delete all employees?")) {
    employees = [];
    saveToSessionStorage();
    renderTable();
  }
}

renderTable();
