import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductManagement from "./ProductManagement";
import TopNavBar from "../navigation/TopNavBar";

interface AdminDashboardProps {
  onBack: () => void;
  onFavorites: () => void;
  onCart: () => void;
  onProfile: () => void;
}

const AdminDashboard = ({ onBack, onFavorites, onCart, onProfile }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsResult, usersResult, ordersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('user_profiles').select('id', { count: 'exact' }),
        supabase.from('wardrobe_items').select('id', { count: 'exact' })
      ]);

      return {
        totalProducts: productsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalOrders: ordersResult.count || 0
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep stats updated
  });

  // Refetch stats when switching back to overview tab
  useEffect(() => {
    if (activeTab === "overview") {
      refetch();
    }
  }, [activeTab, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
        <TopNavBar 
          onBack={onBack}
          onFavorites={onFavorites}
          onCart={onCart}
          onProfile={onProfile}
          showBackButton={true}
          title="Admin Dashboard"
        />
        <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <TopNavBar 
        onBack={onBack}
        onFavorites={onFavorites}
        onCart={onCart}
        onProfile={onProfile}
        showBackButton={true}
        title="Admin Dashboard"
      />
      
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your GRWMe platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                  <p className="text-xs text-muted-foreground">Active products in store</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">Items purchased</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setActiveTab("products")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
