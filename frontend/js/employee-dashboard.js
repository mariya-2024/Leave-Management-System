// =====================================
// Authentication
// =====================================

checkAuthentication();

// =====================================
// Welcome User
// =====================================

const welcomeName = document.getElementById("welcomeName");
const employeeName = document.getElementById("employeeName");

const storedName = getUserName();

if (storedName) {
    welcomeName.textContent = storedName;
    employeeName.textContent = storedName;
}

// =====================================
// Current Date
// =====================================

const todayDate = document.getElementById("todayDate");

todayDate.textContent = new Date().toDateString();

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
    .getElementById("applyLeaveBtn")
    .addEventListener("click", () => {
        window.location.href = "apply-leave.html";
    });

document
    .getElementById("applyTopBtn")
    .addEventListener("click", () => {
        window.location.href = "apply-leave.html";
    });

document
    .getElementById("myLeavesBtn")
    .addEventListener("click", () => {
        window.location.href = "leave-history.html";
    });

document
    .getElementById("calendarBtn")
    .addEventListener("click", () => {

        window.location.href = "calendar.html";

    });

// =====================================
// Load Dashboard
// =====================================

async function loadDashboard() {

    try {

        const token = getToken();

        const response = await fetch(
            "http://localhost:3000/api/leaves/dashboard",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(data);

        document.getElementById("totalLeaves").textContent =
            data.dashboard.totalLeaves;

        document.getElementById("takenLeaves").textContent =
            data.dashboard.leavesTaken;

        document.getElementById("remainingLeaves").textContent =
            data.dashboard.remainingLeaves;

        document.getElementById("pendingLeaves").textContent =
            data.dashboard.pendingLeaves;

        document.getElementById("pendingCount").textContent =
            data.dashboard.pendingLeaves;

        // Leave Balance

        const balanceContainer =
            document.getElementById("balanceContainer");

        balanceContainer.innerHTML = `

            <div class="balance-item">
                <div class="balance-title">
                    <span>Total Leaves</span>
                    <span>${data.dashboard.totalLeaves}</span>
                </div>
            </div>

            <div class="balance-item">
                <div class="balance-title">
                    <span>Leaves Taken</span>
                    <span>${data.dashboard.leavesTaken}</span>
                </div>
            </div>

            <div class="balance-item">
                <div class="balance-title">
                    <span>Remaining Leaves</span>
                    <span>${data.dashboard.remainingLeaves}</span>
                </div>
            </div>

            <div class="balance-item">
                <div class="balance-title">
                    <span>Pending Leaves</span>
                    <span>${data.dashboard.pendingLeaves}</span>
                </div>
            </div>

        `;

    } catch (error) {

        console.log(error);

    }

}

// =====================================
// Load Recent Requests
// =====================================

async function loadRecentRequests() {

    try {

        const token = getToken();

        const response = await fetch(
            "http://localhost:3000/api/leaves/history",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(data);

        const recentTableBody =
            document.getElementById("recentTableBody");

        recentTableBody.innerHTML = "";

        if (data.leaves && data.leaves.length > 0) {

            data.leaves
                .slice(0, 5)
                .forEach((leave) => {

                    recentTableBody.innerHTML += `

                        <tr>

                            <td>${leave.leave_type}</td>

                            <td>
                                ${new Date(leave.start_date).toLocaleDateString()}
                                <br>
                                to
                                <br>
                                ${new Date(leave.end_date).toLocaleDateString()}
                            </td>

                            <td class="status-${leave.status.toLowerCase()}">
                                ${leave.status}
                            
                        </tr>

                    `;

                });

        } else {

            recentTableBody.innerHTML = `

                <tr>

                    <td colspan="3">

                        No leave requests found

                    </td>

                </tr>

            `;

        }

    } catch (error) {

        console.log(error);

    }

}

// =====================================
// Initial Load
// =====================================

loadDashboard();

loadRecentRequests();