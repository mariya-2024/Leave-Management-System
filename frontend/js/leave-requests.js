// =======================================
// Check Authentication
// =======================================

checkAuthentication();

// =======================================
// Show Manager Name
// =======================================

const storedName = getUserName();

const managerName =
    document.getElementById("managerName");

if (storedName && managerName) {

    managerName.textContent = storedName;

}

// =======================================
// Logout
// =======================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

// =======================================
// Dashboard Navigation
// =======================================

document
    .getElementById("dashboardBtn")
    .addEventListener("click", () => {

        window.location.href =
            "manager-dashboard.html";

    });
document
    .getElementById("managerCalendarBtn")
    .addEventListener("click", () => {

        window.location.href =
            "manager-calendar.html";

    });
// =======================================
// Load Leave Requests
// =======================================

async function loadRequests() {

    try {

        const token = getToken();

        const response = await fetch(

            "http://localhost:3000/api/manager/pending",

            {

                method: "GET",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        console.log(data);

        const table =
            document.getElementById(
                "requestsTable"
            );

        table.innerHTML = "";

        if (
            !data.requests ||
            data.requests.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td colspan="8"
                        style="
                        text-align:center;
                        padding:40px;
                        ">

                        No Pending Leave Requests

                    </td>

                </tr>

            `;

            return;

        }

        data.requests.forEach((request) => {

            table.innerHTML += `

<tr>

    <td>${request.name}</td>

    <td>${request.email}</td>

    <td>${request.leave_type}</td>

    <td>${formatDate(request.start_date)}</td>

    <td>${formatDate(request.end_date)}</td>

    <td>${request.reason}</td>

    <td>${request.status}</td>

    <td class = "actions-cell">

        <button
            class="history-btn"
            onclick="viewHistory(${request.user_id})">

            View History

        </button>

        <button
            class="approve-btn"
            onclick="approveLeave(${request.id})">

            Approve

        </button>

        <button
            class="reject-btn"
            onclick="rejectLeave(${request.id})">

            Reject

        </button>

    </td>

</tr>

<tr
    id="history-${request.user_id}"
    class="history-row">

    <td colspan="8">

        <div
            class="history-content">

        </div>

    </td>

</tr>

`;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// =======================================
// Approve Leave
// =======================================

async function approveLeave(id) {

    try {

        const token = getToken();

        const response = await fetch(

            `http://localhost:3000/api/manager/approve/${id}`,

            {

                method: "PUT",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        const data =
            await response.json();

        alert(data.message);

        loadRequests();

    }

    catch (error) {

        console.log(error);

    }

}

// =======================================
// Reject Leave
// =======================================

async function rejectLeave(id) {

    try {

        const token = getToken();

        const response = await fetch(

            `http://localhost:3000/api/manager/reject/${id}`,

            {

                method: "PUT",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        const data =
            await response.json();

        alert(data.message);

        loadRequests();

    }

    catch (error) {

        console.log(error);

    }

}

// =======================================
// Date Format
// =======================================

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-GB",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }

    );

}

// =======================================
async function viewHistory(employeeId) {

    try {

        const token =
            getToken();

        const response =
            await fetch(

                `http://localhost:3000/api/manager/employee/${employeeId}/leaves`,

                {

                    headers: {

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        const historyRow =
            document.getElementById(
                `history-${employeeId}`
            );

        const historyContent =
            historyRow.querySelector(
                ".history-content"
            );

        if (

            historyRow.style.display ===
            "table-row"

        ) {

            historyRow.style.display =
                "none";

            return;

        }

        let html =
            `<h4>Previous Leave History</h4>`;

        data.leaves.forEach(leave => {

            html += `

            <div class="history-item">

                <strong>

                    ${leave.leave_type}

                </strong>

                |

                ${formatDate(leave.start_date)}

                -

                ${formatDate(leave.end_date)}

                |

                ${leave.status}

                |

                ${leave.reason}

            </div>

            `;

        });

        historyContent.innerHTML =
            html;

        historyRow.style.display =
            "table-row";

    }

    catch (error) {

        console.log(error);

    }

}
loadRequests();