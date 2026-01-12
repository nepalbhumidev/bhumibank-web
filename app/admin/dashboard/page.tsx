'use client';

export default function AdminDashboard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
      <p className="text-gray-600 mb-6">Welcome to the CMS Dashboard</p>
      
      {/* Empty content area - components will be added here */}
      <div className="text-center py-12">
        <p className="text-gray-500">Dashboard content will be added here.</p>
      </div>
    </div>
  );
}
