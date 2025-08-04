"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Search, ShoppingBag, Menu, User, Heart } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "./cart/CartDrawer";
import { usePathname } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const { getTotalItems, openCart } = useCart();
  const cartCount = getTotalItems();
  const pathname = usePathname();
  
  // Pages that need always visible header
  const alwaysVisibleHeaderPages = ['/about', '/hair-care'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Collections", href: "/shop" },
    { name: "Hair Care", href: "/hair-care" },
    { name: "About", href: "/about" },
  ];
  
  // Check if we're on a page that needs always visible header
  const needsAlwaysVisibleHeader = alwaysVisibleHeaderPages.includes(pathname);
  const hasBackground = isScrolled || needsAlwaysVisibleHeader;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasBackground
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-28">
          {/* Left Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1">
            {navigationItems.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 hover:opacity-80 text-sm lg:text-base font-medium ${
                  hasBackground ? 'text-gray-900' : 'text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center justify-center flex-shrink-0">
            <Image
              src="/assets/logo.jpg"
              alt="Truth Hair"
              width={200}
              height={80}
              className="h-12 lg:h-20 w-auto transition-transform duration-300 hover:scale-105"
              priority
            />
          </Link>

          {/* Right Section - Navigation + Actions */}
          <div className="flex items-center space-x-6 flex-1 justify-end">
            {/* Right Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href={navigationItems[2].href}
                className={`transition-colors duration-200 hover:opacity-80 text-sm lg:text-base font-medium ${
                  hasBackground ? 'text-gray-900' : 'text-white'
                }`}
              >
                {navigationItems[2].name}
              </Link>
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`${hasBackground ? 'text-gray-900' : 'text-white'} hover:bg-black/10`}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className={`${hasBackground ? 'text-gray-900' : 'text-white'} hover:bg-black/10`}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href={session ? "/account" : "/login"}>
              <Button
                variant="ghost"
                size="icon"
                className={`${hasBackground ? 'text-gray-900' : 'text-white'} hover:bg-black/10`}
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className={`relative ${hasBackground ? 'text-gray-900' : 'text-white'} hover:bg-black/10`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                  style={{ backgroundColor: 'var(--truth-magenta)' }}
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`lg:hidden ${hasBackground ? 'text-gray-900' : 'text-white'}`}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mb-8 mt-4">
                  <Image
                    src="/assets/logo.jpg"
                    alt="Truth Hair"
                    width={150}
                    height={60}
                    className="h-12 w-auto mx-auto mb-4"
                  />
                </div>
                <nav className="flex flex-col space-y-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg transition-colors duration-200 hover:opacity-80"
                      style={{ color: 'var(--truth-navy)' }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
}