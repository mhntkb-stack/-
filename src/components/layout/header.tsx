'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/user-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Building, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/jobs', label: 'الوظائف', icon: <Briefcase className="h-4 w-4" /> },
  { href: '/employers', label: 'أصحاب العمل', icon: <Building className="h-4 w-4" /> },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // In a real app, you'd check for a token or session
    // For this example, we'll just simulate the logged in state
    const loggedIn = Math.random() > 0.5;
    setIsLoggedIn(loggedIn);
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">لمسة مهنتك</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <UserNav />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild>
                <Link href="/register">إنشاء حساب</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">لمسة مهنتك</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t pt-6 flex flex-col gap-4">
                  {isLoggedIn ? (
                     <UserNav />
                  ) : (
                    <>
                      <Button variant="ghost" asChild>
                        <Link href="/login">تسجيل الدخول</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">إنشاء حساب</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
