
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, BarChart2, Settings, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesSummary from "@/components/dashboard/SalesSummary";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold logo-text">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <div className="p-2 rounded-full bg-indigo-100 mr-3">
                  <ShoppingCart className="h-5 w-5 text-indigo-600" />
                </div>
                New Sale
              </CardTitle>
              <CardDescription>Process a new transaction</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-500">
                Create a new sale, add items, and process payments quickly.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full button-gradient" 
                onClick={() => navigate("/new-sale")}
              >
                Start Sale <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-3">
                  <BarChart2 className="h-5 w-5 text-purple-600" />
                </div>
                Sales Reports
              </CardTitle>
              <CardDescription>View detailed reports</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-500">
                View detailed sales reports and analytics for better insights.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 hover:border-purple-300" 
                variant="outline"
                onClick={() => navigate("/sales")}
              >
                View Reports <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-pink-500 to-pink-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <div className="p-2 rounded-full bg-pink-100 mr-3">
                  <Settings className="h-5 w-5 text-pink-600" />
                </div>
                Profile
              </CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-500">
                Update your profile and account settings easily.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-white text-pink-600 border border-pink-200 hover:bg-pink-50 hover:border-pink-300" 
                variant="outline"
                onClick={() => navigate("/profile")}
              >
                Manage Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-10">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-indigo-600" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <SalesSummary />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
