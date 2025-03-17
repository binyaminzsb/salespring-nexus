
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, BarChart2, Settings, ArrowRight, CreditCard, TrendingUp } from "lucide-react";
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="col-span-2 border-0 shadow-md">
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
          
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Today's Sales</p>
                  <p className="text-2xl font-bold">$1,240.50</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span>12% from yesterday</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold">156</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span>8% from last week</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Average Sale</p>
                  <p className="text-2xl font-bold">$78.65</p>
                  <div className="flex items-center text-xs text-red-600 mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>3% from last week</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
