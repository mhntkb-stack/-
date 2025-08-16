'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ADMIN_EMAIL } from '@/lib/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, BarChart, FileText, DivideCircle } from 'lucide-react';
import { getDatabase, ref, get } from 'firebase/database';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { format } from 'date-fns';

interface Stats {
  users: number;
  jobs: number;
  applications: number;
  avgAppsPerJob: number;
}

interface MonthlyJobs {
    name: string;
    total: number;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ users: 0, jobs: 0, applications: 0, avgAppsPerJob: 0 });
  const [monthlyJobsData, setMonthlyJobsData] = useState<MonthlyJobs[]>([]);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        router.push('/');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    
    const db = getDatabase(app);
    const fetchStats = async () => {
      const usersRef = ref(db, 'users');
      const jobsRef = ref(db, 'jobs');
      const applicationsRef = ref(db, 'applications');
      
      const [usersSnapshot, jobsSnapshot, applicationsSnapshot] = await Promise.all([
        get(usersRef),
        get(jobsRef),
        get(applicationsRef),
      ]);
      
      let jobsCount = 0;
      const monthlyJobs: {[key: string]: number} = {};

      if(jobsSnapshot.exists()){
        const allJobs = jobsSnapshot.val();
        Object.keys(allJobs).forEach(userId => {
            const userJobs = allJobs[userId];
            jobsCount += Object.keys(userJobs).length;
            Object.values(userJobs).forEach((job: any) => {
                if (job.createdAt) {
                    const month = format(new Date(job.createdAt), 'yyyy-MM');
                    monthlyJobs[month] = (monthlyJobs[month] || 0) + 1;
                }
            });
        });
      }

      const formattedMonthlyJobs = Object.entries(monthlyJobs)
        .map(([month, total]) => ({ name: month, total }))
        .sort((a, b) => a.name.localeCompare(b.name));

      let applicationsCount = 0;
      if(applicationsSnapshot.exists()){
          const allApplications = applicationsSnapshot.val();
          Object.keys(allApplications).forEach(userId => {
              applicationsCount += Object.keys(allApplications[userId]).length;
          });
      }

      setStats({
        users: usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0,
        jobs: jobsCount,
        applications: applicationsCount,
        avgAppsPerJob: jobsCount > 0 ? parseFloat((applicationsCount / jobsCount).toFixed(2)) : 0,
      });
      setMonthlyJobsData(formattedMonthlyJobs);
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="container py-12 text-center">جارٍ التحقق من الأذونات...</div>;
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">لوحة تحكم الإدارة</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">عدد الحسابات المسجلة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الوظائف</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobs}</div>
            <p className="text-xs text-muted-foreground">الوظائف المنشورة على المنصة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات التوظيف</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">إجمالي الطلبات المقدمة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الطلبات/وظيفة</CardTitle>
            <DivideCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAppsPerJob}</div>
            <p className="text-xs text-muted-foreground">متوسط عدد المتقدمين لكل وظيفة</p>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                الوظائف المنشورة شهريًا
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <RechartsBarChart data={monthlyJobsData}>
                    <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      cursor={{fill: 'hsl(var(--muted))'}}
                      contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                    />
                    <Legend />
                    <Bar dataKey="total" name="وظائف جديدة" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

    </div>
  );
}
