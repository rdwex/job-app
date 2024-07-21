import Job from "../../../DB/modules/job.model.js";
import User from "../../../DB/modules/user.model.js";
import Application from "../../../DB/modules/application.model.js";

export const addJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy,
    } = req.body;

    const job = new Job({
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy,
    });

    const newJob = await job.save();
    res.json({
      message: "Data inserted successfully",
      newJob,
    });
    // console.log(newJob);
  } catch (error) {
    res.status(500).json({
      message: "Error Here",
    });
    // console.log(error);
    console.log(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const job = await Job.findById({ _id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ job });
  } catch (error) {
    res.status(400).json({ error: "job not found here" });
  }
};

export const getAllJobs = async (req, res, next) => {
  const allJobs = await Job.find().populate({ path: "companyId" });

  // success response
  res.status(200).json({ message: "success", allJobs });
};

export const updateJob = async (req, res, next) => {
  try {
    const { userId } = req.authUser;
    const { _id } = req.params;
    const {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    } = req.body;

    const updateJob = await User.findByIdAndUpdate(
      { userId, _id },
      {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
      }
    );

    res.status(200).json({ updateJob });
  } catch (error) {
    res.status(400).json({ error: "job not found here" });
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { userId } = req.authUser;
    const { _id } = req.params;

    const updateJob = await Job.findByIdAndDelete({ userId, _id });

    res.status(200).json({ message: "job deleted successfully", updateJob });
  } catch (error) {
    res.status(400).json({ error: "job not found here" });
  }
};

export const filterJobs = async (req, res, next) => {
  try {
    const jobsFiltration = await Job.find({
      workingTime: new RegExp(req.query.workingTime, "i"),
      jobLocation: new RegExp(req.query.jobLocation, "i"),
      seniorityLevel: new RegExp(req.query.seniorityLevel, "i"),
      jobTitle: new RegExp(req.query.jobTitle, "i"),
      technicalSkills: new RegExp(req.query.technicalSkills, "i"),
    });

    if (!jobsFiltration.length) {
      return next(
        new ErrorHandlerClass(
          "no jobs are founded",
          404,
          "error from get all jobs"
        )
      );
    }

    res.status(200).json({ message: "success", jobsFiltration });
  } catch (error) {
    res.status(400).json({ error: "job not found here" });
  }
};

export const applyToJob = async (req, res, next) => {
  // destruct data
  const { jobId, userId, userTechSkills, userSoftSkills } = req.body;

  // apply to job
  const applicationObject = {
    jobId,
    userId,
    userTechSkills,
    userSoftSkills,
  };
  const newApplication = await Application.create(applicationObject);

  // success response
  res.status(200).json({ message: "success", newApplication });
};
