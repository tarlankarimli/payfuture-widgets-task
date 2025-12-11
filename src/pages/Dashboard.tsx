import { Suspense } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardContent from "../components/DashboardContent";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
