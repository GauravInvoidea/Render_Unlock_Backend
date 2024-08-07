const GeneralSettings = require("../models/generalSettingsModel");

exports.getAllGeneralData = async (req, res) => {
    const { isAdmin } = req.query;
    try {
        if (isAdmin === true || isAdmin === 'true') {
            const result = await GeneralSettings.find();
            return res.status(200).json(result[0]);
        } else {
            res.status(403).json({
                message: "Unauthorized User",
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500);
    }
};

exports.addorUpdateGeneralData = async (req, res) => {
    console.log('dfhjk');
    try {
        const { timezone , currency , address ,sitetitle , slogan , adminemail, admincontactno, whatsappno, isAdmin, facebookurl, instagramurl, twitterurl, linkedinurl, currentDate } = req.body;
        if (isAdmin === true || isAdmin === 'true') {
            const updateFields = {
                sitetitle,
                slogan,
                adminemail,
                admincontactno,
                whatsappno,
                facebookurl,
                instagramurl,
                twitterurl,
                linkedinurl,
                timezone,
                currency,
                address,
                updatedAt: currentDate
            };
            // Add logo and favicon to the update object if they are present in req.files
            if (req.files.logo) {
                const logo = req.files.logo[0]
                updateFields.logo = logo.filename;
            }
            if (req.files.favicon) {
                const favicon = req.files.favicon[0]
                updateFields.favicon = favicon.filename;
            }

            // Check if document exists
            const isDocumentPresent = await GeneralSettings.find();

            // console.log(updateFields)

            if (isDocumentPresent.length === 0) {
                // No document exists, create a new one
                const newData = new GeneralSettings(updateFields);
                const result = await newData.save();
                if (result) {
                    return res.status(200).json({
                        message: "Settings Updated",
                    });
                } else {
                    return res.status(404).json({
                        message: "Some database issue",
                    });
                }
            } else {
                // Document exists, update the existing one
                const updatedData = await GeneralSettings.findOneAndUpdate({}, updateFields, { new: true });
                // console.log(updatedData)
                if (updatedData) {
                    return res.status(200).json({
                        message: "Settings Updated",
                    });
                } else {
                    return res.status(404).json({
                        message: "Data not found in database",
                    });
                }
            }
        } else {
            res.status(403).json({
                message: "Unauthorized User",
            });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}