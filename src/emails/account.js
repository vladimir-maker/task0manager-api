const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWellcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vladamata21@gmail.com",
    subject: "Thanks for joy in",
    text: `Wellcome to our application ${name}.Let me know how you get along with the app`,
  });
};

const sendDeleteingEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vladamata21@gmail.com",
    subject: "Goooooodby!!!",
    text: `Thanks you was our member for a while, ${name}.`,
  });
};

module.exports = {
  sendWellcomeEmail,
  sendDeleteingEmail,
};
