const { chromium } = require('playwright');

async function executeBrowserTask(targetUrl, proxyConfig, durationMs, referrerUrl) {
    let browser;
    try {
        // প্রক্সি সেটআপ (যদি দেওয়া থাকে)
        const launchOptions = {
            headless: true, // স্ক্রিনে ব্রাউজার না দেখিয়ে ব্যাকগ্রাউন্ডে চালানোর জন্য
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };

        if (proxyConfig) {
            launchOptions.proxy = {
                server: proxyConfig.server,
                username: proxyConfig.username,
                password: proxyConfig.password
            };
        }

        browser = await chromium.launch(launchOptions);
        
        // কনটেক্সট তৈরি এবং রেফারার স্পুফিং (আপনার ২ নম্বর পয়েন্ট)
        const context = await browser.newContext({
            extraHTTPHeaders: {
                'Referer': referrerUrl || 'https://www.google.com/'
            },
            viewport: { width: 1280, height: 720 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();

        // লিংকে প্রবেশ করা
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // হিউম্যান-লাইক বিহেভিয়ার: পেজ লোড হওয়ার পর ২ সেকেন্ড অপেক্ষা করা
        await page.waitForTimeout(2000);

        // পেজ স্ক্রল করা
        await page.evaluate(() => {
            window.scrollBy({ top: 500, behavior: 'smooth' });
        });

        // আপনার নির্দিষ্ট করা সময় পর্যন্ত পেজে অবস্থান করা (পয়েন্ট ৯)
        if (durationMs) {
            await page.waitForTimeout(durationMs);
        }

        await browser.close();

    } catch (error) {
        if (browser) await browser.close();
        throw error; // এররটি queueService-এ পাস করার জন্য
    }
}

module.exports = { executeBrowserTask };