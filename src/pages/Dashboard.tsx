import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardContent from "../components/DashboardContent";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
