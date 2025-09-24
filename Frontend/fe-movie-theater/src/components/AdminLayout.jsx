import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = () => {
    return (
        <div className="admin-container">
            <div className="admin-content">
                <main className="admin-main">
                    <Outlet /> {/* Hiển thị nội dung route con */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
