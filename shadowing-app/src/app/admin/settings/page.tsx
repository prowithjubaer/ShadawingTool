'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="animate-fadeIn max-w-3xl">
      <h1 className="text-2xl font-bold text-navy mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold text-navy mb-4">Platform Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">Unlock System</p>
                <p className="text-sm text-gray-500">Require students to complete levels before unlocking next</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-brand-red" />
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">Registration Open</p>
                <p className="text-sm text-gray-500">Allow new students to register</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-brand-red" />
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">Gamification</p>
                <p className="text-sm text-gray-500">Enable XP, streaks, and badges</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-brand-red" />
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium">Beta Speech Recognition</p>
                <p className="text-sm text-gray-500">Show experimental feature (not accurate)</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded text-brand-red" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold text-navy mb-4">Brand Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand Name</label>
              <input type="text" defaultValue="Pro English BD" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Accent</label>
              <select defaultValue="british" className="w-full px-3 py-2 border rounded-lg">
                <option value="british">British</option>
                <option value="australian">Australian</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold text-navy mb-4">Motivational Messages</h2>
          <p className="text-sm text-gray-500 mb-3">These are shown to students during practice</p>
          <textarea className="w-full px-3 py-2 border rounded-lg h-32" defaultValue={`দারুণ! আরেকবার native rhythm ধরার চেষ্টা করুন।\nGood try! এবার stress আর pause মিলানোর চেষ্টা করুন।\nPractice makes fluency!\nআজকের practice complete!`} />
          <button className="mt-3 bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
