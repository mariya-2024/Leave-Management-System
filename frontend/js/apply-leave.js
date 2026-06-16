// =====================================
// Authentication
// =====================================

checkAuthentication();

// =====================================
// Display Employee Name
// =====================================
const startDateInput =
    document.getElementById(
        "startDate"
    );

const endDateInput =
    document.getElementById(
        "endDate"
    );

const durationText =
    document.getElementById(
        "leaveDuration"
    );


const storedName = getUserName();

const employeeName = document.getElementById("employeeName");

if (storedName && employeeName) {
    employeeName.textContent = storedName;
}


function updateDuration() {

    if (
        !startDateInput.value ||
        !endDateInput.value
    ) {

        durationText.textContent =
            "Duration : 0 Days";

        return;

    }

    const start =
        new Date(startDateInput.value);

    const end =
        new Date(endDateInput.value);

    const days =
        Math.floor(

            (end - start)

            /

            (1000 * 60 * 60 * 24)

        ) + 1;

    durationText.textContent =
        `Duration : ${days} Days`;

}
// =====================================
// Dashboard Navigation
// =====================================

const dashboardBtn = document.getElementById("dashboardBtn");

if (dashboardBtn) {

    dashboardBtn.addEventListener("click", () => {

        window.location.href = "employee-dashboard.html";

    });

}

// =====================================
// My Leaves Navigation
// =====================================

const myLeavesBtn = document.getElementById("myLeavesBtn");

if (myLeavesBtn) {

    myLeavesBtn.addEventListener("click", () => {

        window.location.href = "leave-history.html";

    });

}

document
    .getElementById("calendarBtn")
    .addEventListener("click", () => {

        window.location.href = "calendar.html";

    });

startDateInput.addEventListener(

    "change",

    updateDuration

);

endDateInput.addEventListener(

    "change",

    updateDuration

);


// =====================================
// Cancel Button
// =====================================

const cancelBtn = document.getElementById("cancelBtn");

if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

        window.location.href = "employee-dashboard.html";

    });

}

// =====================================
// Logout
// =====================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", logout);

}

// =====================================
// Submit Leave Form
// =====================================

const leaveForm = document.getElementById("leaveForm");

leaveForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const leave_type =
        document.getElementById("leaveType").value;

    const start_date =
        document.getElementById("startDate").value;

    const end_date =
        document.getElementById("endDate").value;

    const reason =
        document.getElementById("reason").value;

    // Validation

    if (
        !leave_type ||
        !start_date ||
        !end_date ||
        !reason
    ) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const token = getToken();

        const response = await fetch(

            "http://localhost:3000/api/leaves/apply",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    leave_type,

                    start_date,

                    end_date,

                    reason

                })

            }

        );

        const data = await response.json();

        console.log(data);

        if (data.success) {

            alert("Leave applied successfully!");

            window.location.href =
                "employee-dashboard.html";

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

});