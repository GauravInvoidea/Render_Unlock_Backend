const Users = require("../models/usersModel");
const UserDetails = require("../models/usersDetailsModel");
const CompanyDetails = require("../models/companyDetailsModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.createadmin = async (req, res) => {
  try {
    const { name, username, email, password, userType, companyDetailsId, userDetailsId } = req.body;

    // console.log(password)

    // Check if admin with given email already exists
    const user = await Users.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, "hashpassword")
    // Create a new admin user
    const newAdmin = new Users({
      name,
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
      userType,// Assuming you have a field isAdmin in your schema
    });

    // Save the new admin user to the database
    await newAdmin.save();

    // Respond with success message
    return res.status(201).json({
      message: "Admin created successfully",
    });

  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error in creating admin:", err);

    // Respond with a 500 status and error message
    return res.status(500).json({
      message: "Server error occurred while creating admin",
    });
  }
}


exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      return res.status(200).json({
        message: "Login Successfull",
        token: token,
        user
      });
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some server error occurred",
    });
  }
}


exports.getAdminDetails = async (req, res) => {
  try {
    const { isAdmin } = req.query;
    if (isAdmin === true | isAdmin === 'true') {
      const email = 'admin@gmail.com'
      const user = await Users.findOne({ email });

      const details = {};
      details.name = user.name;
      details.image = user.image;

      if (user) {
        res.status(200).json(details)
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    } else {
      res.status(403).json({
        message: "Unauthorized User",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some server error occurred",
    });
  }
}


exports.updateAdminDetails = async (req, res) => {
  try {
    const { isAdmin, name, old, password, confirm } = req.body;
    const image = req.file;

    if (isAdmin === true | isAdmin === 'true') {
      const email = 'admin@gmail.com'
      const user = await Users.findOne({ email });

      const isMatch = await bcrypt.compare(old, user.password);

      if (isMatch) {
        if (password !== confirm) {
          return res.status(400).json({
            message: "Password and Confirm Password does not matched",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedData = {};
        if (name) updatedData.name = name;
        if (password) updatedData.password = hashedPassword;
        if (image) updatedData.image = image.filename;

        const updatedUser = await Users.findOneAndUpdate({ email }, updatedData, { new: true });
        if (updatedUser) {
          res.status(200).json({
            message: "Details updated Successfully",
          });
        } else {
          res.status(404).json({
            message: "User not found",
          });
        }
      } else {
        return res.status(400).json({
          message: "Old Password does not matched",
        });
      }
    } else {
      res.status(403).json({
        message: "Unauthorized User",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some server error occurred",
    });
  }
}


exports.createNewUser = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userAlreadyExist = await Users.findOne({ email });
    if (userAlreadyExist) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    if (userType === "Individual") {
      const { name, contactNo, avatar, attachments } = req.body;
      const userDetails = new UserDetails({
        contactNo,
        avatar,
        attachments,
      });
      const savedUserDetails = await userDetails.save();
      if (savedUserDetails) {
        const user = new Users({
          name,
          username,
          email,
          password: hashedPassword,
          userType,
          userDetailsId: savedUserDetails._id,
        });
        const savedUser = await user.save();
        if (savedUser) {
          return res.status(200).json({
            message: "User Created successfully",
          });
        } else {
          return res.status(500).json({
            message: "Unable to add new user in users collection",
          });
        }
      } else {
        return res.status(500).json({
          message: "Unable to save user details in userdetails collection",
        });
      }
    }

    else if (userType === "Startup") {
      const { name, address, contactNo, url, GST, attachments, industerytype, since, } = req.body;
      console.log(req.body)
      const companyDetails = new CompanyDetails({
        address,
        contactNo,
        url,
        GST,
        attachments,
        industerytype,
        since,
      });
      const savedCompany = await companyDetails.save();

      if (savedCompany) {
        const user = new Users({
          name,
          username,
          email,
          password: hashedPassword,
          userType,
          companyDetailsId: savedCompany._id,
        });
        const savedUser = await user.save();
        if (savedUser) {
          return res.status(200).json({
            message: "User Created successfully",
          });
        } else {
          return res.status(500).json({
            message: "Unable to add new user in users collection",
          });
        }
      } else {
        return res.status(500).json({
          message:
            "Unable to save company details in companydetails collection",
        });
      }
    }
    else if (userType === "Business") {
      const { name, address, contactNo, url, GST, attachments, industerytype, since, } = req.body;
      console.log(req.body)
      const companyDetails = new CompanyDetails({
        address,
        contactNo,
        url,
        GST,
        attachments,
        industerytype,
        since,
      });
      const savedCompany = await companyDetails.save();

      if (savedCompany) {
        const user = new Users({
          name,
          username,
          email,
          password: hashedPassword,
          userType,
          companyDetailsId: savedCompany._id,
        });
        const savedUser = await user.save();
        if (savedUser) {
          return res.status(200).json({
            message: "Business User Created successfully",
          });
        } else {
          return res.status(500).json({
            message: "Unable to add new user in users collection",
          });
        }
      } else {
        return res.status(500).json({
          message:
            "Unable to save company details in companydetails collection",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some server error occurred",
    });
  }
};


exports.userLogin = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    console.log(email, password, userType);

    // Find the user with the provided email
    const user = await Users.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    // console.log(user.userType , user.userType !== 'Startup', user.userType !== 'Individual', user.userType !== 'Startup' || user.userType !== 'Individual');
    

    // Check if the userType matches
    if (user.userType !== 'Startup' && user.userType !== 'Individual') {
      return res.status(400).json({
        message: "Incorrect user type",
      }); 
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    // Create a JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType, // Add userType to payload if needed
      }
    };

    // Sign the JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        token,
        message: "Login Successful",
        user
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error occurred",
    });
  }
};



exports.BusinessLogin = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    console.log(email, password, userType);

    // Find the user with the provided email
    const user = await Users.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    

    // Check if the userType matches
    if (user.userType !== 'Business') {
      return res.status(400).json({
        message: "Incorrect user type",
      }); 
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    // Create a JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType, // Add userType to payload if needed
      }
    };

    // Sign the JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        token,
        message: "Login Successful",
        user
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error occurred",
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({ email: { $ne: "admin@gmail.com" } });

    const userDetailIds = [];
    const companyDetailIds = [];

    // Iterate through users to collect detail IDs
    users.forEach((user) => {
      if (
        (user.userType === "Individual" || user.userType === "Startup") &&
        user.userDetailsId
      ) {
        userDetailIds.push(user.userDetailsId);
      } else if (user.userType === "Company" && user.companyDetailsId) {
        companyDetailIds.push(user.companyDetailsId);
      }
    });

    // Retrieve user details
    const userDetails = await UserDetails.find({ _id: { $in: userDetailIds } });
    const companyDetails = await CompanyDetails.find({
      _id: { $in: companyDetailIds },
    });

    // Map user details to their respective users
    users.forEach((user) => {
      if (
        (user.userType === "Individual" || user.userType === "Startup") &&
        user.userDetailsId
      ) {
        const userDetail = userDetails.find((detail) =>
          detail._id.equals(user.userDetailsId)
        );
        user.userDetails = userDetail; // Assign user details to user object
      } else if (user.userType === "Company" && user.companyDetailsId) {
        const companyDetails = companyDetails.find((detail) =>
          detail._id.equals(user.companyDetailsId)
        );
        user.companyDetails = companyDetails; // Assign company details to user object
      }
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getParticularUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve the user
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check user type and retrieve corresponding details
    let userDetails;
    let companyDetails;
    if ((user.userType === "Individual" || user.userType === "Startup") && user.userDetailsId) {
      userDetails = await UserDetails.findById(user.userDetailsId);
    } else if (user.userType === "Company" && user.companyDetailsId) {
      companyDetails = await CompanyDetails.findById(user.companyDetailsId);
    }

    // Add details to user object
    if (userDetails) {
      user.userDetails = userDetails;
    } else if (companyDetails) {
      user.companyDetails = companyDetails;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check user type and delete corresponding details
    if ((user.userType === "Individual" || user.userType === "Startup") && user.userDetailsId) {
      await UserDetails.findByIdAndDelete(user.userDetailsId);
    } else if (user.userType === "Company" && user.companyDetailsId) {
      await CompanyDetails.findByIdAndDelete(user.companyDetailsId);
    }

    // Delete the user
    await Users.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User and associated details deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
