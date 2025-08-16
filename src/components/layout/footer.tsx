
import Link from 'next/link';
import { Twitter, Linkedin, Facebook, Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">مهنتك بلمسة</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              منصتك الأولى للفرص الحرفية في صنعاء.
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-3">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">الرئيسية</Link></li>
              <li><Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary">ابحث عن فرصة</Link></li>
              <li><Link href="/account" className="text-sm text-muted-foreground hover:text-primary">حسابي</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-3">قانوني</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">سياسة الخصوصية</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">شروط الاستخدام</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">تواصل معنا</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-3">تابعنا</h4>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} مهنتك بلمسة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
