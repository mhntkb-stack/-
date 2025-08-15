
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ADMIN_EMAIL } from '@/lib/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, BarChart } from 'lucide-react';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
  { name: "يناير", total: Math.floor(Math.random() * 50) + 10 },
  { name: "فبراير", total: Math.floor(Math.random() * 50) + 10 },
  { name: "مارس", total: Math.floor(Math.random() * 50) + 10 },
  { name: "أبريل", total: Math.floor(Math.random() * 50) + 10 },
  { name: "مايو", total: Math.floor(Math.random() * 50) + 10 },
  { name: "يونيو", total: Math.floor(Math.random() * 50) + 10 },
]

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, jobs: 0 });
  const router = useRouter();

  useEffect(() => {
    const app = getFirebaseApp();
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
    
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const fetchStats = async () => {
      const usersRef = ref(db, 'users');
      const jobsRef = ref(db, 'jobs');
      
      const usersSnapshot = await get(usersRef);
      const jobsSnapshot = await get(jobsRef);
      
      let jobsCount = 0;
      if(jobsSnapshot.exists()){
        const allJobs = jobsSnapshot.val();
        Object.keys(allJobs).forEach(userId => {
            jobsCount += Object.keys(allJobs[userId]).length;
        });
      }

      setStats({
        users: usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0,
        jobs: jobsCount,
      });
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="container py-12 text-center">جارٍ التحقق من الأذونات...</div>;
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">لوحة تحكم الإدارة</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
      </div>

      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                نظرة عامة على النشاط
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <RechartsBarChart data={chartData}>
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
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

    </div>
  );
}
