// ======================================
// Authentication
// ======================================

checkAuthentication();

// ======================================
// Show Manager Name
// ======================================

const storedName = getUserName();

const managerName =
    document.getElementById("managerName");

if (storedName && managerName) {

    managerName.textContent = storedName;

}

// ======================================
// Logout
// ======================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

// ======================================
// Navigation
// ======================================

document
    .getElementById("reviewBtn")
    .addEventListener("click", () => {

        window.location.href =
            "leave-requests.html";

    });

document
    .getElementById("leaveRequestsBtn")
    .addEventListener("click", () => {

        window.location.href =
            "leave-requests.html";

    });
document
    .getElementById("managerCalendarBtn")
    .addEventListener("click", () => {

        window.location.href =
            "manager-calendar.html";

    });
// ======================================
// Load Dashboard
// ======================================

async function loadManagerDashboard() {

    try {

        const token = getToken();

        const response = await fetch(

            "http://localhost:3000/api/manager/dashboard",

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

        if (!data.success) {

            alert(data.message);

            return;

        }

        // =============================
        // Statistics
        // =============================

        document.getElementById(
            "pendingCount"
        ).textContent =
            data.dashboard.pending;

        document.getElementById(
            "approvedCount"
        ).textContent =
            data.dashboard.approved;

        document.getElementById(
            "rejectedCount"
        ).textContent =
            data.dashboard.rejected;

        document.getElementById(
            "leaveTodayCount"
        ).textContent =
            data.dashboard.onLeaveToday;

        // =============================
        // Pie Chart
        // =============================

        const ctx =
            document
                .getElementById("leaveChart")
                .getContext("2d");

        new Chart(ctx, {

            type: "pie",

            data: {

                labels: [

                    "Approved",

                    "Pending",

                    "Rejected"

                ],

                datasets: [

                    {

                        data: [

                            data.dashboard.approved,

                            data.dashboard.pending,

                            data.dashboard.rejected

                        ],

                        backgroundColor: [

                            "#6AAA2A",

                            "#CF8B2D",

                            "#D9534F"

                        ],

                        borderWidth: 1

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

        // =============================
        // Employees On Leave
        // =============================

        const container =
            document.getElementById(
                "leaveTodayContainer"
            );

        container.innerHTML = "";

        if (
            data.onLeaveToday &&
            data.onLeaveToday.length > 0
        ) {

            data.onLeaveToday.forEach(emp => {

                const initials =
                    emp.name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .toUpperCase();

                container.innerHTML += `

                    <div class="employee-item">

                        <div class="employee-avatar">

                            ${initials}

                        </div>

                        <div class="employee-details">

                            <h3>

                                ${emp.name}

                            </h3>

                            <p>

                                ${emp.leave_type}

                            </p>

                        </div>

                    </div>

                `;

            });

        }

        else {

            container.innerHTML = `

                <div class="empty-state">

                    Nobody is on leave today 🎉

                </div>

            `;

        }

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================

loadManagerDashboard();