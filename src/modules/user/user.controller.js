import User from "../../../DB/modules/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmailService } from "../services/send-email.service.js";
import { ErrorClass } from "../../utils/error-class.utils.js";

export const signUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      recoveryEmail,
      DOB,
      mobileNumber,
      role,
    } = req.body;

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return next(new ErrorClass("Email already exists", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      recoveryEmail,
      DOB,
      mobileNumber,
      role,
    });
    // token for _id

    const token = jwt.sign({ userId: user._id }, "confirmToken", {
      expiresIn: "5h",
    });
    // generate link

    const confirmationLink = `${req.protocol}://${req.headers.host}/user/verify-email/${token}`;

    // sending email verification email

    const isEmailSent = await sendEmailService({
      to: email,
      subject: "Verification email=  ",
      textMessage: "Please enter verify your email",
      htmlMessage: `<a href=${confirmationLink}>Please Verify Your Email</a>`,
    });
    console.log({ isEmailSent });

    if (isEmailSent.rejected.length) {
      res.json({
        message: "email rejected",
      });
    }
    const newUser = await user.save();
    res.json({
      message: "Data inserted successfully",
      newUser,
    });

    // console.log(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error Here",
    });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const data = jwt.verify(token, "confirmToken");
    const confirmedUser = await User.findOneAndUpdate(
      { _id: data.userId, isConfirmed: false },
      { isConfirmed: true },
      { new: true }
    );
    if (!confirmedUser) {
      res.status(500).send({ message: "NOT VERIFIED or ALREADY VERiFIED" });
    }
    res.status(200).send({ message: "Verified successfully", confirmedUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, recoveryEmail, mobileNumber, password } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { recoveryEmail }, { mobileNumber }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // token
    // data
    // signature
    //
    user.status = "online";
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "access_token",
      { expiresIn: "1h" }
    );

    res.status(200).send({ message: "login successfully", token });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    console.log(req.authUser);
    const { _id } = req.authUser;
    const { token } = req.headers;
    // const decodeToken = jwt.verify(token, "access_token");
    const users = await User.find({ _id });
    console.log(token);
    res.json({ users });
  } catch (error) {
    res.json({ message: "Error" });
    console.log(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // const updates = req.body;
    const { _id } = req.authUser;
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
      req.body;

    const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    if (user) {
      return res.status(404).json({ message: "User Already Here" });
    }

    const updateUser = await User.findByIdAndUpdate(_id, {
      email,
      mobileNumber,
      recoveryEmail,
      DOB,
      lastName,
      firstName,
    });
    // if (updates.email !== user.email) {
    //   const emailExists = await User.findOne({ email: updates.email });
    //   if (emailExists) {
    //     return res.status(400).json({ message: "Email already in use" });
    //   }
    // }
    // if (updates.email) {
    //   const token = jwt.sign({ userId: user._id }, "confirmToken", {
    //     expiresIn: "5h",
    //   });

    //   const confirmationLink = `${req.protocol}://${req.headers.host}/user/verify-email/${token}`;

    //   const isEmailSent = await sendEmailService({
    //     to: email,
    //     subject: "Verification email=  ",
    //     textMessage: "Please enter verify your email",
    //     htmlMessage: `<a href=${confirmationLink}>Please Verify Your Email</a>`,
    //   });
    //   console.log({ isEmailSent });

    //   if (isEmailSent.rejected.length) {
    //     res.json({
    //       message: "email rejected",
    //     });
    //   }
    //   const newUser = await user.save();
    //   res.json({
    //     message: "Data inserted successfully",
    //     newUser,
    //   });
    // }
    res.status(200).json({ updateUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.authUser;
    const { userId } = req.params;
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
      req.body;

    const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    if (user) {
      return res.status(404).json({ message: "User Already Here" });
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id, userId },
      {
        email,
        mobileNumber,
        recoveryEmail,
        DOB,
        lastName,
        firstName,
      }
    );

    res.status(200).json({ updateUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserDataAccount = async (req, res, next) => {
  try {
    const { _id } = req.authUser;
    const user = await User.findOne(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
