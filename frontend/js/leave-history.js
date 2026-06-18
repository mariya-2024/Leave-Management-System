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

                <td colspan="6">

                    No leave requests found

                </td>

            </tr>

        `;

        return;

    }

    leaves.forEach((leave) => {

        table.innerHTML += `

            <tr data-id="${leave.id}">

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

                <td>

                    ${
                        leave.status === "Pending"

                        ?

                        `
                        <button
    class="edit-btn"
    data-id="${leave.id}"
    data-start="${leave.start_date}"
    data-end="${leave.end_date}"
    data-reason="${leave.reason}"
    onclick="showEditFormFromButton(this)">

    Edit

</button>
                        

                        <button
                            class="delete-btn"
                            onclick="deleteLeave(${leave.id})">

                            Delete

                        </button>

                        `

                        :

                        "-"

                    }

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

function showEditFormFromButton(btn){

    showEditForm(

        btn.dataset.id,

        btn.dataset.start,

        btn.dataset.end,

        btn.dataset.reason

    );

}

async function deleteLeave(id) {

    const confirmDelete =
        confirm(
            "Delete this leave request?"
        );

    if (!confirmDelete) {

        return;

    }

    try {

        const token =
            getToken();

        const response =
            await fetch(

                `http://localhost:3000/api/leaves/${id}`,

                {

                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        const data =
            await response.json();

        alert(data.message);

        loadLeaveHistory();

    }

    catch (error) {

        console.log(error);

    }

}

function showEditForm(

    id,
    startDate,
    endDate,
    reason

){

    const row =
        document.getElementById(
            `edit-row-${id}`
        );

    if(row){

        row.remove();

        return;

    }

    const targetRow =
        document
        .querySelector(
            `[data-id="${id}"]`
        );

    const editRow =
        document.createElement(
            "tr"
        );

    editRow.id =
        `edit-row-${id}`;

    editRow.innerHTML = `

        <td colspan="6">

            <div class="edit-container">

                <input
                    type="date"
                    id="start-${id}"
                    value="${startDate.split('T')[0]}">

                <input
                    type="date"
                    id="end-${id}"
                    value="${endDate.split('T')[0]}">

                <input
                    type="text"
                    id="reason-${id}"
                    value="${reason}">

                <button
                    onclick="saveLeave(${id})">

                    Save

                </button>

            </div>

        </td>

    `;

    targetRow.after(editRow);

}


async function saveLeave(id){

    try{

        const token =
            getToken();

        const response =
            await fetch(

                `http://localhost:3000/api/leaves/${id}`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        start_date:
                        document.getElementById(
                            `start-${id}`
                        ).value,

                        end_date:
                        document.getElementById(
                            `end-${id}`
                        ).value,

                        reason:
                        document.getElementById(
                            `reason-${id}`
                        ).value

                    })

                }

            );

        const data =
            await response.json();

        alert(data.message);

        loadLeaveHistory();

    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// Initial Load
// =====================================

loadLeaveHistory();