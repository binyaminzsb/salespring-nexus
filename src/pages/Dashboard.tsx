
import React from "react";
import AppLayout from "@/components/dashboard/AppLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, BarChart2, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesSummary from "@/components/dashboard/SalesSummary";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-pos-blue" />
                New Sale
              </CardTitle>
              <CardDescription>Process a new transaction</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-500">
                Create a new sale, add items, and process payments.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate("/new-sale")}
              >
                Start Sale <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-pos-blue" />
                Sales Reports
              </CardTitle>
              <CardDescription>View detailed reports</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-500">
                View detailed sales reports and analytics.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate("/sales")}
              >
                View Reports <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-pos-blue" />
                Profile
              </CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-500">
                Update your profile and account settings.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate("/profile")}
              >
                Manage Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="h-96">
          <SalesSummary />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
