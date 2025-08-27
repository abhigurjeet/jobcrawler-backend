const { chromium } = require('playwright');
async function crawlNoDesk(db) {
let browser;
  try{
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    });
    const page = await context.newPage();

    await page.goto('https://nodesk.co/remote-jobs/', { waitUntil: 'domcontentloaded' , timeout: 60000  });

    // Get all job listing links
    let jobLinks = await page.$$eval('a.link.dim.indigo-500', links => links.map(a => a.href));
    console.log(`Found ${jobLinks.length} jobs`);
    let jobsInserted = 0;
    const insert = db.prepare(`
        INSERT OR IGNORE INTO jobs (title, company, location, role_type, category, url)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const link of jobLinks) {
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000  });

        await page.waitForTimeout(1000 + Math.random() * 2000); // polite delay

        const job = await page.evaluate(() => {
        const title = document.querySelector('div > h1')?.innerText.trim() || '';
        const company = document.querySelector('.link.dim.grey-700')?.innerText.trim() || '';
        const location = 'Remote'; // NodeSk jobs are mostly remote
        const applyAnchor = document.evaluate(
            '/html/body/main/div/div/section[1]/div[2]/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        const url = applyAnchor ? applyAnchor.href : '';
        
        const roleTypeEl = document.evaluate(
            '/html/body/main/div/div/div[1]/div/div[3]/div/div/p/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        const role_type = roleTypeEl ? roleTypeEl.innerText.trim() : '';

        const categoryEl = document.evaluate(
            '/html/body/main/div/div/div[1]/div/div[4]/div/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        const category = categoryEl ? categoryEl.innerText.trim() : '';

        return { title,company, location, role_type, category, url };
        });
        if (job.url) {
            const result = insert.run(job.title, job.company, job.location, job.role_type, job.category, job.url);

            if (result.changes > 0) {
              jobsInserted+=1;
              console.log(`Saved: ${job.title} - ${job.url}`);
            } else {
              console.log(`Already exists, skipping: ${job.url}`);
            }
        } else {
        console.log('No external link found for this job');
        }

        await page.waitForTimeout(1000 + Math.random() * 2000); 
    }
    await browser.close();
    console.log('Crawling complete.');
    return { success: true, count: jobsInserted };
  } catch (err) {
    console.error('Crawler failed:', err.message);
    return { success: false, error: err.message };
  } finally {
    if (browser) await browser.close();
  }
}


module.exports = crawlNoDesk;
