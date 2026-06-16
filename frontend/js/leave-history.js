// =====================================
// Authentication
// =====================================

checkAuthentication();

// =====================================
// Display Employee Name
// =====================================

const storedName = getUserName();

const employeeName = document.getElementById("employeeName");

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
    .getElementById("newRequestBtn")
    .addEventListener("click", () => {

        window.location.href =
            "apply-leave.html";

    });

document
    .getElementById("calendarBtn")
    .addEventListener("click", () => {

        window.location.href = "calendar.html";

    });

// =====================================
// Global Leave Data
// =====================================

let allLeaves = [];

// =====================================
// Render Table
// =====================================

function renderTable(leaves) {

    const table =
        document.getElementById("historyTable");

    table.innerHTML = "";

    if (leaves.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5">

                    No leave requests found

                </td>

            </tr>

        `;

        return;

    }

    leaves.forEach((leave) => {

        table.innerHTML += `

            <tr>

                <td>

                    ${leave.leave_type}

                </td>

                <td>

                    ${new Date(
                        leave.start_date
                    ).toLocaleDateString()}

                </td>

                <td>

                    ${new Date(
                        leave.end_date
                    ).toLocaleDateString()}

                </td>

                <td>

                    ${leave.reason}

                </td>

                <td>

                    <span class="status-${leave.status.toLowerCase()}">

                        ${leave.status}

                    </span>

                </td>

            </tr>

        `;

    });

}

// =====================================
// Load Leave History
// =====================================

async function loadLeaveHistory() {

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

        console.log(data);

        if (data.success) {

            allLeaves = data.leaves;

            renderTable(allLeaves);

        }

    }

    catch (error) {

        console.log(error);

        alert("Unable to load leave history");

    }

}

// =====================================
// Filters
// =====================================

const typeFilter =
    document.getElementById("typeFilter");

const statusFilter =
    document.getElementById("statusFilter");

function applyFilters() {

    let filtered = [...allLeaves];

    const selectedType =
        typeFilter.value;

    const selectedStatus =
        statusFilter.value;

    if (selectedType !== "all") {

        filtered = filtered.filter(

            leave =>

            leave.leave_type === selectedType

        );

    }

    if (selectedStatus !== "all") {

        filtered = filtered.filter(

            leave =>

            leave.status === selectedStatus

        );

    }

    renderTable(filtered);

}

typeFilter.addEventListener(
    "change",
    applyFilters
);

statusFilter.addEventListener(
    "change",
    applyFilters
);

// =====================================
// Initial Load
// =====================================

loadLeaveHistory();