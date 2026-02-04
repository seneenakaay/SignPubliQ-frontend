'use client';

import React, { useEffect, useState } from 'react';

export default function SettingsPage() {
    
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle update logic here
        console.log('Updating password:', formData);
    };

    return (
        <div className="min-h-screen bg-white p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-xl font-bold text-black mb-8">Setting</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="block text-sm text-gray-800 mb-2"
                        >
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm text-gray-800 mb-2"
                        >
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        />
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label
                            htmlFor="confirmNewPassword"
                            className="block text-sm text-gray-800 mb-2"
                        >
                            Confirm New Password
                        </label>
                        <input
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            type="password"
                            value={formData.confirmNewPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4 mt-8 pt-4">
                        <button
                            type="button"
                            className="px-8 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors bg-gray-50/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 rounded-lg bg-[#3e95e5] text-white font-medium hover:bg-[#2d7bc9] transition-colors shadow-sm"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
