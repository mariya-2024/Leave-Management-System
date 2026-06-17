require("dotenv").config();

const sendEmail =
    require("./src/utils/sendEmail");

async function test() {

    try {

        await sendEmail(

            "irinmariyabyjubyju@gmail.com",

            "LeaveEase Test",

            "This is a test email."

        );

        console.log("Email Sent!");

    }

    catch (error) {

        console.log(error);

    }

}

test();