const employeeCard = document.getElementById("employeeCard");

const managerCard = document.getElementById("managerCard");

employeeCard.addEventListener("click", () => {

    window.location.href = "login.html?role=employee";

});

managerCard.addEventListener("click", () => {

    window.location.href = "login.html?role=manager";

});