const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { runAutomationQueue } = require('./services/queueService');

const app = express();
const upload = multer({ dest: 'uploads/' }); // প্রক্সি ফাইল আপলোডের জন্য

app.use(cors());
app.use(express.json());

// টাস্ক রিসিভ করার API
app.post('/api/start-tasks', upload.single('proxyFile'), async (req, res) => {
    try {
        const { links, concurrencyLimit, duration, referrer } = req.body;
        const targetLinks = JSON.parse(links);
        
        // এখানে প্রক্সি ফাইল রিড করার লজিক বসবে (fs.readFileSync)
        // ডেমো পারপাসে আমরা ফাঁকা প্রক্সি লিস্ট পাস করছি
        const proxies = []; 

        res.status(200).json({ message: 'Automation Started successfully', totalTasks: targetLinks.length });

        // ব্যাকগ্রাউন্ডে অটোমেশন কিউ (Queue) চালু করা
        runAutomationQueue(targetLinks, proxies, parseInt(concurrencyLimit), parseInt(duration), referrer);
        
    } catch (error) {
        console.error('Error starting tasks:', error);
        res.status(500).json({ error: 'Failed to start automation' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend Automation Server running on port ${PORT}`);
});