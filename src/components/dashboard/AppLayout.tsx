
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, LayoutDashboard, ShoppingCart, BarChart2 } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // Or a loading spinner
  }

  const getUserInitials = () => {
    // Use email instead of name for initials
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div 
            className="text-3xl logo-text cursor-pointer" 
            onClick={() => navigate("/dashboard")}
          >
            PULSE
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-4">
              <div 
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 text-pos-purple" />
                <span className="text-sm font-medium">Dashboard</span>
              </div>
              <div 
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate("/new-sale")}
              >
                <ShoppingCart className="h-4 w-4 text-pos-purple" />
                <span className="text-sm font-medium">New Sale</span>
              </div>
              <div 
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate("/sales")}
              >
                <BarChart2 className="h-4 w-4 text-pos-purple" />
                <span className="text-sm font-medium">Reports</span>
              </div>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-pos-purple to-pos-pink text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
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
          PULSE POS © {new Date().getFullYear()} - All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
