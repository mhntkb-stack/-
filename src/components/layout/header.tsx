
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/user-nav';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { ADMIN_EMAIL } from '@/lib/config';


const HandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/></svg>
)

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/jobs', label: 'ابحث عن فرصة' },
  { href: '/employers', label: 'لأصحاب العمل' },
];

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, [auth]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <HandIcon />
                <span className="font-bold sm:inline-block">
                مهنتك بلمسة
                </span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "transition-colors hover:text-primary px-3 py-2 rounded-md",
                        link.href === '/' ? 'mr-6' : '',
                        pathname === link.href ? "text-foreground font-bold" : "text-foreground/70"
                    )}
                    >
                    {link.label}
                    </Link>
                ))}
                 {isAdmin && (
                    <Link
                        href="/admin"
                        className={cn(
                        "transition-colors hover:text-foreground/80 flex items-center gap-1",
                        pathname === '/admin' ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span>الإدارة</span>
                    </Link>
                 )}
            </nav>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right">
                <div className="flex flex-col gap-6 p-6">
                    <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2 mb-4">
                      <HandIcon />
                      <span className="font-bold text-xl">مهنتك بلمسة</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                    ))}
                     {isAdmin && (
                        <Link
                            href="/admin"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                        >
                            <ShieldCheck className="h-5 w-5" />
                            <span>الإدارة</span>
                        </Link>
                     )}
                    </nav>
                    <div className="border-t pt-6 mt-4 flex flex-col gap-4">
                    {!user && (
                        <>
                          <Button variant="outline" asChild>
                              <Link href="/login" onClick={closeMobileMenu}>تسجيل الدخول</Link>
                          </Button>
                          <Button asChild>
                              <Link href="/register" onClick={closeMobileMenu}>حساب جديد</Link>
                          </Button>
                        </>
                    )}
                    </div>
                </div>
                </SheetContent>
            </Sheet>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <UserNav />
          ) : (
            <div className='hidden md:flex items-center gap-2'>
              <Button variant="ghost" asChild>
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild>
                <Link href="/register">حساب جديد</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
