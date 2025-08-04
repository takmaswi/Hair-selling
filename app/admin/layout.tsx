import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart,
  FileText,
  Home,
  LogOut,
  Menu
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Truth Hair Admin</h2>
        </div>
        
        <nav className="mt-6">
          <Link href="/admin" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          
          <Link href="/admin/products" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
          
          <Link href="/admin/orders" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </Link>
          
          <Link href="/admin/customers" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <Users className="w-5 h-5 mr-3" />
            Customers
          </Link>
          
          <Link href="/admin/analytics" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <BarChart className="w-5 h-5 mr-3" />
            Analytics
          </Link>
          
          <Link href="/admin/reports" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <FileText className="w-5 h-5 mr-3" />
            Reports
          </Link>
          
          <Link href="/admin/settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <LogOut className="w-5 h-5 mr-3" />
            Exit Admin
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex justify-between items-center">
            <button className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}