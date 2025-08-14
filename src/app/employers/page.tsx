
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Building, Users, Briefcase } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import Link from 'next/link';

// Dummy data for posted jobs
const postedJobs = [
  { id: '1', title: 'نجار أثاث', applicants: 12, status: 'مفتوح' },
  { id: '2', title: 'فني تبريد وتكييف', applicants: 5, status: 'مغلق' },
];

export default function EmployersPage() {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // @ts-ignore
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">صفحة أصحاب العمل</h1>
        <p className="text-lg text-muted-foreground mb-6">
          يجب عليك تسجيل الدخول لتتمكن من نشر الوظائف وإدارة المتقدمين.
        </p>
        <Button asChild>
          <Link href="/login">تسجيل الدخول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">لوحة تحكم أصحاب العمل</h1>
          <p className="text-muted-foreground mt-1">
            قم بإدارة وظائفك والمتقدمين إليها بسهولة.
          </p>
        </div>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" />
          نشر وظيفة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الوظائف</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 عن الشهر الماضي</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المتقدمين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">235</div>
                <p className="text-xs text-muted-foreground">+30 عن الشهر الماضي</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الشركة</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">تقنية المستقبل</div>
                <p className="text-xs text-muted-foreground">صنعاء، اليمن</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>الوظائف المنشورة</CardTitle>
              <CardDescription>
                قائمة بالوظائف التي قمت بنشرها.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {postedJobs.map((job) => (
                  <Card key={job.id} className="flex items-center justify-between p-4">
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.applicants} متقدم
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${job.status === 'مفتوح' ? 'text-green-600' : 'text-red-600'}`}>
                        {job.status}
                      </span>
                      <Button variant="outline" size="sm">
                        عرض التفاصيل
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>نشر وظيفة جديدة</CardTitle>
              <CardDescription>
                املأ النموذج التالي لنشر فرصة عمل جديدة.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">عنوان الوظيفة</Label>
                <Input id="job-title" placeholder="مثال: مهندس برمجيات" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-description">وصف الوظيفة</Label>
                <Textarea
                  id="job-description"
                  placeholder="صف المهام والمسؤوليات والمؤهلات المطلوبة."
                  className="min-h-[100px]"
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="job-location">الموقع</Label>
                <Input id="job-location" placeholder="مثال: صنعاء، حدة" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">نشر الوظيفة</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
