
const nodemailer = require('nodemailer');
const Mailgen = require("mailgen");

const sendEmail = async (subject, send_to, template, reply_to, cc) => {
    // Create an email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailGenerator = new Mailgen({
        theme: 'salted',
        product: {
            name: 'e-shop website',
            link: 'http://localhost:3000/home'
        }
    });

    const emailTemplate = mailGenerator.generate(template);

    // Options for sending an email
    const options = {
        from: process.env.EMAIL_USER,
        to: send_to,
        replyTo: reply_to,
        subject,
        html: emailTemplate,
        cc
    };

    try {
        const info = await transporter.sendMail(options);
        console.log(info);
    } catch (err) {
        console.log(err);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;














/*const nodemailer = require('nodemailer');
const  Mailgen = require("mailgen")


const sendEmail = async(subject, send_to, template, reply_to, cc)=>{

// create an email transporter
const transporter =   nodemailer.createTransport({

service:'gmail',
host: process.env.EMAIL_HOST,
port:587,
auth:{
    user: process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
}

})

const mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
      
        name: 'e-shop website',
  
        link:'http://localhost:3000/home'
        
    }
});
const emailTemplate = mailGenerator.generate(template)
require('fs').writeFileSync('preview.html', emailTemplate, 'utf8');

//options for sending an email
const options = {
    from:process.env.EMAIL_USER,
    to:send_to,
    replyTo:reply_to,
    subject,
    html:emailTemplate,
    cc
}



await  transporter.sendMail((options,(err,info)=>{
    if(err){
       console.log(err)
   
    }
    else{
       console.log(info)
    }
   }))
}




module.exports = sendEmail*/