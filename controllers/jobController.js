const { getJobsService } = require("../services/jobService");

exports.getJobs = async (req, res) => {
  try {
    const result = await getJobsService(req.query);
    return res.json(result);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
