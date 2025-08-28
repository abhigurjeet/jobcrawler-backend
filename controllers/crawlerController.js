const crawlNoDesk = require("../services/crawlerService");

exports.runCrawler = async (req, res) => {
  try {
    const result = await crawlNoDesk();
    if (result.success) {
      return res.json({ message: `Crawled ${result.count} jobs successfully` });
    }
    return res.status(500).json({ error: result.error });
  } catch (err) {
    console.error("CrawlerController error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
