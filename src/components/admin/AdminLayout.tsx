
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Users, BarChart2 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import Clock from "../dashboard/Clock";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div 
              className="text-3xl logo-text cursor-pointer" 
              onClick={() => navigate("/admin/users")}
            >
              PULSE ADMIN
            </div>
            <Clock />
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-4">
              <div 
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate("/admin/users")}
              >
                <Users className="h-4 w-4 text-pos-purple" />
                <span className="text-sm font-medium">Users</span>
              </div>
              <div 
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate("/admin/sales")}
              >
                <BarChart2 className="h-4 w-4 text-pos-purple" />
                <span className="text-sm font-medium">Sales</span>
              </div>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  adminLogout();
                  navigate("/");
                }} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          PULSE POS © {new Date().getFullYear()} - Admin Panel
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
