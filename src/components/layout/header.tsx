'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/user-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, Search, User, Rss, Handshake } from 'lucide-react';
import { useState, useEffect } from 'react';

const HandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/></svg>
)

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/jobs', label: 'ابحث عن فرصة' },
  { href: '/employers', label: 'لأصحاب العمل' },
  { href: '/cv-builder', label: 'محسن السيرة الذاتية' },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const loggedIn = Math.random() > 0.5;
    setIsLoggedIn(loggedIn);
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <HandIcon />
            <span className="font-bold text-lg">مهنتك</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary text-foreground/80"
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
                <Link href="/register">حساب جديد</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                   <HandIcon />
                  <span className="font-bold text-lg">مهنتك</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 text-lg font-medium"
                    >
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
                        <Link href="/register">حساب جديد</Link>
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
