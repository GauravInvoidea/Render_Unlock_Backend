const Enquiry = require("../models/enquiriesModel");
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport(
    {
        host: 'mail.invoidea.in',
        auth: {
            user: 'testmail@invoidea.in',
            pass: 'eop7hFI5UE5Y'
        }
    }
);

exports.getAllEnquiries = async (req, res) => {
    try {
        const result = await Enquiry.find();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Some server error occurred",
        });
    }
};

exports.newEnquiry = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNo, message } = req.body;

        const newEnquiry = new Enquiry({
            firstName,
            lastName,
            email,
            contactNo,
            message,
        });
        const result = await newEnquiry.save();
        if (result) {
            const mailOptions = {
                from: 'testmail@invoidea.in',
                to: 'hmrriteshsingh@gmail.com',
                subject: 'New Enquiry Received',
                text: `Name: ${firstName} ${lastName}\nEnquiry No: ${result.enquiryNo}\nEmail: ${email}\nContact No: ${contactNo}\nMessage: ${message}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        message: "Error occurred while sending email",
                    });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).json({
                        message: "New enquiry added",
                    }); 
                }
            });
        } else {
            return res.status(500).json({
                message: "Unable to add new enquiry in database",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Some server error occured",
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const { id, status, isAdmin } = req.body;
        const challenge = await Enquiry.findById(id);

        if (isAdmin === true || isAdmin === 'true' || challenge.postedBy === req.user._id) {
            const result = await Enquiry.findByIdAndUpdate(
                id,
                { status: parseInt(status) },
                { new: true }
            );

            // console.log(result)
            if (result) {
                return res.status(200).json({
                    message: "Status has been changed",
                });
            } else {
                return res.status(404).json({
                    message: "Enquiry not found",
                });
            }
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal server error occurred",
        });
    }
}