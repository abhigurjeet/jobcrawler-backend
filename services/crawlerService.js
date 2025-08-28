const { chromium } = require("playwright");
const Job = require("../models/Job");

async function crawlNoDesk() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    });
    const page = await context.newPage();

    await page.goto("https://nodesk.co/remote-jobs/", { waitUntil: "domcontentloaded", timeout: 60000 });

    const jobLinks = await page.$$eval("a.link.dim.indigo-500", (links) =>
      links.map((a) => a.href)
    );
    console.log(`Found ${jobLinks.length} jobs`);

    let jobsInserted = 0;

    for (const link of jobLinks) {
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1000 + Math.random() * 2000);

      const job = await page.evaluate(() => {
        const title = document.querySelector("div > h1")?.innerText.trim() || "";
        const company = document.querySelector(".link.dim.grey-700")?.innerText.trim() || "";
        const location = "Remote";

        const applyAnchor = document.evaluate(
          "/html/body/main/div/div/section[1]/div[2]/a",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        const url = applyAnchor ? applyAnchor.href : "";

        const roleTypeEl = document.evaluate(
          "/html/body/main/div/div/div[1]/div/div[3]/div/div/p/a",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        const role_type = roleTypeEl ? roleTypeEl.innerText.trim() : "";

        const categoryEl = document.evaluate(
          "/html/body/main/div/div/div[1]/div/div[4]/div/a",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        const category = categoryEl ? categoryEl.innerText.trim() : "";

        return { title, company, location, role_type, category, url };
      });

      if (job.url) {
        try {
          const [record, created] = await Job.findOrCreate({
            where: { url: job.url },
            defaults: job,
          });

          if (created) {
            jobsInserted++;
            console.log(`Saved: ${job.title} - ${job.url}`);
          } else {
            console.log(`Already exists, skipping: ${job.url}`);
          }
        } catch (err) {
          console.error(`Insert failed for ${job.url}:`, err.message);
        }
      } else {
        console.log("No external link found for this job");
      }

      await page.waitForTimeout(1000 + Math.random() * 2000);
    }

    console.log("Crawling complete.");
    return { success: true, count: jobsInserted };
  } catch (err) {
    console.error("Crawler failed:", err.message);
    return { success: false, error: err.message };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = crawlNoDesk;
