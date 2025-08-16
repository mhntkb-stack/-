import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const features = [
  "نشر الوظائف بسهولة والوصول إلى آلاف الحرفيين.",
  "تصفية المتقدمين وإدارة طلبات التوظيف بكفاءة.",
  "ملفات شخصية متكاملة للحرفيين مع نماذج أعمالهم.",
  "تواصل مباشر وفوري مع المرشحين المناسبين."
];

export default function EmployersPage() {
  return (
    <div className="container py-12 md:py-20">
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline mb-4">
          ابحث عن أفضل الحرفيين لمشروعك
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          منصتنا توفر لك الأدوات اللازمة للعثور على أمهر الحرفيين في صنعاء. انشر وظيفتك اليوم واحصل على أفضل العروض.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/account">انشر وظيفة الآن</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/jobs">تصفح الحرفيين</Link>
          </Button>
        </div>
      </section>

      <section className="mt-20">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">لماذا يختارنا أصحاب العمل؟</CardTitle>
            <CardDescription className="text-center text-md">
                كل ما تحتاجه لإدارة عملية التوظيف في مكان واحد.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
