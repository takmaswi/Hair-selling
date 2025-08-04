import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Eye, Star, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  // These would typically come from your database
  const stats = {
    totalProducts: 45,
    totalOrders: 128,
    totalCustomers: 342,
    totalRevenue: 45678.90,
    pendingOrders: 12,
    lowStockProducts: 8,
    averageRating: 4.5,
    dailyVisitors: 1234
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to Truth Hair Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockProducts} items low in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingOrders} pending orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/admin/products" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Package className="h-8 w-8 mb-2 text-blue-600" />
              <span className="text-sm font-medium">Manage Products</span>
            </a>
            <a href="/admin/orders" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart className="h-8 w-8 mb-2 text-green-600" />
              <span className="text-sm font-medium">View Orders</span>
            </a>
            <a href="/admin/customers" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Users className="h-8 w-8 mb-2 text-purple-600" />
              <span className="text-sm font-medium">Customers</span>
            </a>
            <a href="/admin/analytics" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <TrendingUp className="h-8 w-8 mb-2 text-orange-600" />
              <span className="text-sm font-medium">Analytics</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dailyVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Average session: 3m 45s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Based on 245 reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New order #1234 received</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <span className="text-sm font-semibold">$299.99</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New customer registration</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Product review submitted</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <span className="text-sm">4.5 ⭐</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Low stock alert: Brazilian Body Wave</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <span className="text-sm text-red-600">3 left</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}