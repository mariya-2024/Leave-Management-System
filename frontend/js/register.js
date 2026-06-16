// =====================================
// Employee Register
// =====================================

const registerForm =
    document.getElementById("registerForm");

registerForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        // -------------------------
        // Get Input Values
        // -------------------------

        const firstName =
            document.getElementById(
                "firstName"
            ).value.trim();

        const lastName =
            document.getElementById(
                "lastName"
            ).value.trim();

        const email =
            document.getElementById(
                "email"
            ).value.trim();

        const employeeId =
            document.getElementById(
                "employeeId"
            ).value.trim();

        const department =
            document.getElementById(
                "department"
            ).value;

        const password =
            document.getElementById(
                "password"
            ).value;

        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;

        // -------------------------
        // Validations
        // -------------------------

        if (
            !firstName ||
            !lastName ||
            !email ||
            !employeeId ||
            !department ||
            !password ||
            !confirmPassword
        ) {

            alert("Please fill all fields.");

            return;

        }

        const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,<>\`~\/])[A-Za-z\d@$!%*?&.#^()_+\-=\[\]{};':"\\|,<>\`~\/]{8,}$/;

if (!passwordRegex.test(password)) {

    alert(
        "Password must contain:\n\n" +
        "• Minimum 8 characters\n" +
        "• At least 1 uppercase letter\n" +
        "• At least 1 lowercase letter\n" +
        "• At least 1 number\n" +
        "• At least 1 special character"
    );

    return;

}

        if (password !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;

        }

        // -------------------------
        // Full Name
        // -------------------------

        const name =
            firstName + " " + lastName;

        // -------------------------
        // Send to Backend
        // -------------------------

        try {

            const response =
                await fetch(

                    "http://localhost:3000/api/auth/register",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            name,

                            email,

                            password,

                            role: "employee",

                            employee_id:
                                employeeId,

                            department

                        })

                    }

                );

            const data =
                await response.json();

            if (data.success) {

                alert(
                    "Registration Successful!"
                );

                window.location.href =
                    "login.html?role=employee";

            }

            else {

                alert(
                    data.message
                );

            }

        }

        catch (error) {

            console.log(error);

            alert(
                "Server Error"
            );

        }

    }
);