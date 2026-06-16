// =====================================
// Authentication
// =====================================

checkAuthentication();


// =====================================
// Display Employee Name
// =====================================

const storedName = getUserName();

const employeeName =
    document.getElementById("employeeName");

if (storedName && employeeName) {

    employeeName.textContent = storedName;

}


// =====================================
// Logout
// =====================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);


// =====================================
// Navigation
// =====================================

document
    .getElementById("dashboardBtn")
    .addEventListener("click", () => {

        window.location.href =
            "employee-dashboard.html";

    });

document
    .getElementById("applyLeaveBtn")
    .addEventListener("click", () => {

        window.location.href =
            "apply-leave.html";

    });

document
    .getElementById("myLeavesBtn")
    .addEventListener("click", () => {

        window.location.href =
            "leave-history.html";

    });

const calendarBtn =
    document.getElementById("calendarBtn");

if (calendarBtn) {

    calendarBtn.addEventListener("click", () => {

        window.location.href = "calendar.html";

    });

}
// =====================================
// Year Dropdown
// =====================================

const yearSelect =
    document.getElementById("yearSelect");

const monthSelect =
    document.getElementById("monthSelect");

const currentDate =
    new Date();

const currentYear =
    currentDate.getFullYear();

const currentMonth =
    currentDate.getMonth();

for (let year = currentYear - 5; year <= currentYear + 5; year++) {

    const option =
        document.createElement("option");

    option.value = year;

    option.textContent = year;

    if (year === currentYear) {

        option.selected = true;

    }

    yearSelect.appendChild(option);

}

monthSelect.value = currentMonth;


// =====================================
// Store Leave Data
// =====================================

let allLeaves = [];


// =====================================
// Load Leave History
// =====================================

async function loadLeaves() {

    try {

        const token = getToken();

        const response = await fetch(

            "http://localhost:3000/api/leaves/history",

            {

                method: "GET",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        const data =
            await response.json();

        if (data.success) {

            allLeaves =
                data.leaves;

            renderCalendar();

        }

    }

    catch (error) {

        console.log(error);

    }

}


// =====================================
// Render Calendar
// =====================================

function renderCalendar() {

    const grid =
        document.getElementById("calendarGrid");

    grid.innerHTML = "";

    const month =
        parseInt(monthSelect.value);

    const year =
        parseInt(yearSelect.value);

    const firstDay =
        new Date(year, month, 1).getDay();

    const totalDays =
        new Date(year, month + 1, 0).getDate();

    // Empty cells

    for (let i = 0; i < firstDay; i++) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day empty-day";

        grid.appendChild(empty);

    }

    // Actual days

    for (let day = 1; day <= totalDays; day++) {

        const cell =
            document.createElement("div");

        cell.className =
            "calendar-day";

        // Highlight Today

        if (
            day === currentDate.getDate() &&
            month === currentMonth &&
            year === currentYear
        ) {

            cell.classList.add("today");

        }

        // Day Number

        const number =
            document.createElement("div");

        number.className =
            "day-number";

        number.textContent =
            day;

        cell.appendChild(number);

        // Date String

        const cellDate =
            new Date(year, month, day);

        // Check Every Leave

        allLeaves.forEach((leave) => {

            const start =
                new Date(leave.start_date);

            const end =
                new Date(leave.end_date);

            if (
                cellDate >= start &&
                cellDate <= end
            ) {

                const badge =
                    document.createElement("div");

                badge.className =
                    `leave-pill ${leave.status.toLowerCase()}`;

                badge.textContent =
                    leave.leave_type;

                cell.appendChild(badge);

            }

        });

        grid.appendChild(cell);

    }

}


// =====================================
// Change Month / Year
// =====================================

monthSelect.addEventListener(

    "change",

    renderCalendar

);

yearSelect.addEventListener(

    "change",

    renderCalendar

);


// =====================================
// Initial Load
// =====================================

loadLeaves();