const Job = require("../models/Job");
const { Op } = require("sequelize");

async function getJobsService(filters) {
    const { title, company, location, role_type, category, limit, page, sort } = filters;
  
    const where = {};
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (company) where.company = { [Op.like]: `%${company}%` };
    if (category) where.category = { [Op.like]: `%${category}%` };
  
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;
  
    // decide sort order
    let order = [["createdAt", "DESC"]]; // default
    if (sort) {
      if (sort === "title") order = [["title", "ASC"]];
      else if (sort === "company") order = [["company", "ASC"]];
      else if (sort === "createdAt") order = [["createdAt", "ASC"]];
    }
  
    const jobs = await Job.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order,
    });
  
    return {
      total: jobs.count,
      page: pageNum,
      pageSize,
      jobs: jobs.rows,
    };
  }
  

module.exports = { getJobsService };
