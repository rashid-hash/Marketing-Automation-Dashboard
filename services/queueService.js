const pLimit = require('p-limit');
const { executeBrowserTask } = require('../workers/browser');

async function runAutomationQueue(links, proxies, concurrencyLimit, duration, referrer) {
    // p-limit দিয়ে একসাথে কয়টি টাস্ক চলবে তা নির্ধারণ করা
    const limit = pLimit(concurrencyLimit);

    console.log(`Starting ${links.length} tasks with concurrency: ${concurrencyLimit}`);

    const tasks = links.map((link, index) => {
        return limit(async () => {
            // প্রতিটি টাস্কের জন্য একটি করে প্রক্সি অ্যাসাইন করা (যদি থাকে)
            const proxy = proxies.length > 0 ? proxies[index % proxies.length] : null;
            
            try {
                console.log(`Task ${index + 1} started for link: ${link}`);
                await executeBrowserTask(link, proxy, duration, referrer);
                console.log(`Task ${index + 1} completed: ${link}`);
                // এখানে Socket.io দিয়ে ফ্রন্টএন্ডে Success Log পাঠাতে হবে
            } catch (error) {
                console.error(`Task ${index + 1} failed for link: ${link}`, error.message);
                // এখানে Socket.io দিয়ে ফ্রন্টএন্ডে Fail Log পাঠাতে হবে
            }
        });
    });

    await Promise.all(tasks);
    console.log('All automated tasks completed!');
}

module.exports = { runAutomationQueue };