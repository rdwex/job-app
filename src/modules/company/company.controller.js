import jwt from "jsonwebtoken";
import Company from "../../../DB/modules/company.model.js";
import Job from "../../../DB/modules/job.model.js";
import Application from "../../../DB/modules/application.model.js";

// Create Company
/**
 * @param {object} req.body
 * @param {object} Company.create
 * check if company already exists
 * @returns {message, company}
 */

export const createCompany = async (req, res, next) => {
  try {
    const {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    } = req.body;

    const isCompanyExist = await Company.findOne({
      $or: [{ companyName }, { companyEmail }],
    });
    if (isCompanyExist) {
      return res.status(500).json({
        message: "Company already exists",
      });
    }

    const company = await Company.create({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    });

    res.json({
      message: "Data inserted successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
    console.log(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const decodeToken = jwt.verify(token, "access_token");
    const companies = await Company.find({ owner: decodeToken.userId });

    console.log(token);
    res.json({ companies });
  } catch (error) {
    res.json({ message: "Error" });
    console.log(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    // const { userId } = req.authUser;

    const {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    } = req.body;

    const companyObject = {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    };
    // check if company exists
    const isCompanyExist = await Company.findOne({
      $or: [{ companyName }, { companyEmail }],
    });
    if (!isCompanyExist) {
      return res.status(500).json({
        message: "Company Does Not exists",
      });
    }

    const updateCompany = await Company.findOneAndUpdate(
      { _id: companyId },
      companyObject,
      { new: true }
    );

    console.log({ updateCompany });
    res.json({ message: "Company Updated", updateCompany });
  } catch (error) {
    res.json({ message: "Error" });
    console.log(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await Company.findOneAndDelete({
      _id: id,
      companyHR: req.user._id,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOneCompany = async (req, res, next) => {
  const { id } = req.params;

  try {
    const company = await Company.findById(id).populate("companyHR");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobs = await Job.find({ addedBy: id });
    res.status(200).json({ company, jobs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchCompany = async (req, res, next) => {
  try {
    const { name } = req.params;

    const companies = await Company.find({
      companyName: new RegExp(name, "i"),
    });
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company || company.companyHR.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    const jobs = await Job.find({ addedBy: id });
    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({
      jobId: { $in: jobIds },
    }).populate("userId");

    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const ExcelSheet = async (req, res, next) => {
  const { companyId, date } = req.params;
  const targetDate = new Date(date);

  try {
    const jobs = await Job.find({ addedBy: companyId });
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
      createdAt: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
    })
      .populate("userId")
      .populate("jobId");

    if (applications.length === 0) {
      return res.status(404).json({
        error:
          "No applications found for the specified company on the given date.",
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "Job Title", key: "jobTitle", width: 30 },
      { header: "Applicant Name", key: "applicantName", width: 30 },
      { header: "Technical Skills", key: "technicalSkills", width: 30 },
      { header: "Soft Skills", key: "softSkills", width: 30 },
      { header: "Resume", key: "resume", width: 30 },
      { header: "Application Date", key: "applicationDate", width: 30 },
    ];

    applications.forEach((app) => {
      worksheet.addRow({
        jobTitle: app.jobId.jobTitle,
        applicantName: `${app.userId.firstName} ${app.userId.lastName}`,
        technicalSkills: app.userTechSkills.join(", "),
        softSkills: app.userSoftSkills.join(", "),
        resume: app.userResume,
        applicationDate: app.createdAt.toISOString().split("T")[0],
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications.xlsx"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
