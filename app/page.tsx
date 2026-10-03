"use client";
import { useState } from 'react';

export default function AutomationDashboard() {
  const [links, setLinks] = useState('');
  const [concurrency, setConcurrency] = useState(3);
  const [duration, setDuration] = useState(10000);
  const [referrer, setReferrer] = useState('https://facebook.com');

  const startAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // লিংকগুলোকে Array-তে কনভার্ট করা (প্রতি লাইনে একটি লিংক)
    const linkArray = links.split('\n').map(link => link.trim()).filter(link => link);

    const formData = new FormData();
    formData.append('links', JSON.stringify(linkArray));
    formData.append('concurrencyLimit', concurrency.toString());
    formData.append('duration', duration.toString());
    formData.append('referrer', referrer);
    // formData.append('proxyFile', selectedFile); // প্রক্সি ফাইল আপলোডের অপশন এখানে যুক্ত হবে

    try {
      const response = await fetch('http://localhost:5000/api/start-tasks', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Error connecting to backend server');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Marketing Automation Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Section */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
            <form onSubmit={startAutomation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Links (One per line)</label>
                <textarea 
                  className="w-full h-32 p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="https://example.com/page1&#10;https://example.com/page2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Concurrency (Threads)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    value={concurrency}
                    onChange={(e) => setConcurrency(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Visit Duration (ms)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Spoof Referrer</label>
                <select 
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                >
                  <option value="https://www.facebook.com/">Facebook</option>
                  <option value="https://twitter.com/">Twitter / X</option>
                  <option value="https://www.google.com/">Google Search</option>
                  <option value="https://www.youtube.com/">YouTube</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
              >
                Start Automation
              </button>
            </form>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col space-y-4">
            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Live Stats</h2>
            <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
              <span>Success</span>
              <span className="text-green-400 font-bold text-xl">0</span>
            </div>
            <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
              <span>Failed</span>
              <span className="text-red-400 font-bold text-xl">0</span>
            </div>
            <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
              <span>Active Threads</span>
              <span className="text-blue-400 font-bold text-xl">0</span>
            </div>
          </div>
        </div>

        {/* Logs Console */}
        <div className="mt-8 bg-black p-4 rounded-lg shadow-lg font-mono text-sm h-64 overflow-y-auto">
          <div className="text-green-500">{">"} System Ready. Waiting for tasks...</div>
          {/* Socket.io এর মাধ্যমে রিয়েল টাইম লগ এখানে আসবে */}
        </div>
      </div>
    </div>
  );
}