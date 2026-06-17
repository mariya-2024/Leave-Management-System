// ====================================
// Authentication
// ====================================

checkAuthentication();

// ====================================
// Navigation
// ====================================

document
    .getElementById("dashboardBtn")
    .addEventListener("click", () => {

        window.location.href =
            "manager-dashboard.html";

    });

document
    .getElementById("requestsBtn")
    .addEventListener("click", () => {

        window.location.href =
            "leave-requests.html";

    });

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

// ====================================
// Calendar Variables
// ====================================

const calendar =
    document.getElementById("calendar");

const monthYear =
    document.getElementById("monthYear");

let currentDate =
    new Date();


let leaveData= [];

// ====================================
// Calendar
// ====================================
async function loadCalendarLeaves() {

    try {

        const token =
            getToken();

        const response =
            await fetch(

                "http://localhost:3000/api/manager/calendar",

                {

                    headers: {

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        if (
            data.success
        ) {

            leaveData =
                data.leaves.map(

                    leave => ({

                        name:
                            leave.name,

                        start:
                            leave.start_date,

                        end:
                            leave.end_date,

                        color:
                            "leave-blue"

                    })

                );

            renderCalendar();

        }

    }

    catch (error) {

        console.log(error);

    }

}

function renderCalendar() {

    calendar.innerHTML = "";

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    monthYear.textContent =
        currentDate.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );

    const weekdays = [

        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"

    ];

    weekdays.forEach(day => {

        const dayElement =
            document.createElement("div");

        dayElement.className =
            "day-name";

        dayElement.textContent =
            day;

        calendar.appendChild(
            dayElement
        );

    });

    const firstDay =
        new Date(year, month, 1)
        .getDay();

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    // Empty Cells

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        calendar.appendChild(
            empty
        );

    }

    // Actual Days

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayBox =
            document.createElement(
                "div"
            );

        dayBox.className =
            "day";

        const dateNumber =
            document.createElement(
                "div"
            );

        dateNumber.className =
            "day-number";

        dateNumber.textContent =
            day;

        dayBox.appendChild(
            dateNumber
        );

        const currentDay =
            new Date(
                year,
                month,
                day
            );

        leaveData.forEach(
            leave => {

                const start =
                    new Date(
                        leave.start
                    );

                const end =
                    new Date(
                        leave.end
                    );

                if (
                    currentDay >= start &&
                    currentDay <= end
                ) {

                    const leaveDiv =
                        document.createElement(
                            "div"
                        );

                    leaveDiv.className =
                        `leave-item ${leave.color}`;

                    leaveDiv.textContent =
                        leave.name;

                    dayBox.appendChild(
                        leaveDiv
                    );

                }

            }
        );

        calendar.appendChild(
            dayBox
        );

    }

}

// ====================================
// Month Buttons
// ====================================

document
    .getElementById("prevMonth")
    .addEventListener("click", () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    });

document
    .getElementById("nextMonth")
    .addEventListener("click", () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    });

// ====================================
// Load Calendar
// ====================================

loadCalendarLeaves();