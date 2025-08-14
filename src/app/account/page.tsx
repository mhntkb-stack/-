
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import SmartRecommendations from "@/components/smart-recommendations"
import { getAuth, onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { app } from '@/lib/firebase';
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDatabase, ref, onValue, set, push, serverTimestamp } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';


interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: string;
}


interface PostedJob {
  id: string;
  title: string;
  applicants: number; // This might need to be calculated separately
  status: 'مفتوح' | 'مغلق';
  description?: string;
  location?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userBio, setUserBio] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');

  const auth = getAuth(app);
  const db = getDatabase(app);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        
        // Fetch user bio
        const userBioRef = ref(db, `users/${currentUser.uid}/bio`);
        onValue(userBioRef, (snapshot) => {
          const bio = snapshot.val();
          if (bio) {
            setUserBio(bio);
          }
        });

        // Fetch posted jobs
        const jobsRef = ref(db, `jobs/${currentUser.uid}`);
        onValue(jobsRef, (snapshot) => {
            const jobsData = snapshot.val();
            const jobsList: PostedJob[] = jobsData ? Object.keys(jobsData).map(key => ({
                id: key,
                applicants: 0, // Placeholder
                status: 'مفتوح', // Placeholder
                ...jobsData[key]
            })) : [];
            setPostedJobs(jobsList);
        });

        // Fetch applications
        const applicationsRef = ref(db, `applications/${currentUser.uid}`);
        onValue(applicationsRef, (snapshot) => {
          const appsData = snapshot.val();
          const appsList: Application[] = appsData ? Object.keys(appsData).map(key => {
            const appData = appsData[key];
            return {
              id: key,
              jobTitle: appData.jobTitle,
              company: appData.company,
              appliedAt: appData.appliedAt ? format(new Date(appData.appliedAt), 'yyyy-MM-dd') : 'N/A',
              status: appData.status,
            };
          }) : [];
          setApplications(appsList);
        });

      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, db]);
  
  const handleProfileSave = async () => {
    if (!user) return;
    try {
      // Update display name in Auth
      await updateProfile(user, { displayName: displayName });
      // Update bio in Realtime Database
      await set(ref(db, `users/${user.uid}/bio`), userBio);
      toast({ title: "نجاح", description: "تم حفظ تغييرات الملف الشخصي." });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({ variant: 'destructive', title: "خطأ", description: "فشل حفظ الملف الشخصي." });
    }
  };
  
   const handlePostJob = async () => {
    if (!user || !newJobTitle || !newJobDescription || !newJobLocation) {
        toast({ variant: 'destructive', title: "خطأ", description: "الرجاء ملء جميع حقول الوظيفة." });
        return;
    }
    try {
        const jobsRef = ref(db, `jobs/${user.uid}`);
        const newJobRef = push(jobsRef);
        await set(newJobRef, {
            title: newJobTitle,
            description: newJobDescription,
            location: newJobLocation,
            createdAt: serverTimestamp(),
            status: 'مفتوح',
        });
        toast({ title: "نجاح", description: "تم نشر الوظيفة بنجاح!" });
        setNewJobTitle('');
        setNewJobDescription('');
        setNewJobLocation('');
    } catch (error) {
        console.error("Error posting job:", error);
        toast({ variant: 'destructive', title: "خطأ", description: "فشل نشر الوظيفة." });
    }
  };


  if (loading) {
    return <div className="container py-12 text-center">جارٍ تحميل بيانات الحساب...</div>;
  }

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h1>
        <p className="text-muted-foreground mb-6">يجب عليك تسجيل الدخول لعرض هذه الصفحة.</p>
        <Button asChild>
          <Link href="/login">الانتقال إلى صفحة الدخول</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">حسابي</h1>
        <span className="text-sm text-muted-foreground">أهلاً بك، {displayName || 'مستخدم'}!</span>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="applications">طلباتي</TabsTrigger>
          <TabsTrigger value="posted-jobs">الوظائف المنشورة</TabsTrigger>
          <TabsTrigger value="recommendations">توصيات ذكية</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>قم بتحديث معلوماتك الشخصية وسيرتك الذاتية.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input id="fullName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">السيرة الذاتية (ملف PDF)</Label>
                <Input id="resume" type="file" />
                <p className="text-sm text-muted-foreground">
                  السيرة الحالية: <a href="#" className="underline text-primary">my_resume.pdf</a>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">نبذة عني</Label>
                <Textarea id="bio" placeholder="تحدث عن مهاراتك وخبراتك..." value={userBio} onChange={(e) => setUserBio(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={handleProfileSave}>حفظ التغييرات</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>طلبات التوظيف</CardTitle>
              <CardDescription>تتبع حالة طلبات التوظيف التي قدمتها.</CardDescription>
            </CardHeader>
            <CardContent>
               {applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الوظيفة</TableHead>
                        <TableHead>الشركة</TableHead>
                        <TableHead>تاريخ التقديم</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium whitespace-nowrap">{app.jobTitle}</TableCell>
                          <TableCell className="whitespace-nowrap">{app.company}</TableCell>
                          <TableCell className="whitespace-nowrap">{app.appliedAt}</TableCell>
                          <TableCell>
                            <Badge variant={app.status === 'مرفوض' ? 'destructive' : app.status === 'تم العرض' ? 'default': 'secondary'}>{app.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>لم تقدم على أي وظيفة بعد.</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/jobs">تصفح الوظائف الآن</Link>
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="posted-jobs" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>الوظائف المنشورة</CardTitle>
                  <CardDescription>إدارة الوظائف التي قمت بنشرها والمتقدمين إليها.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {postedJobs.length > 0 ? (
                      postedJobs.map((job) => (
                        <Card key={job.id} className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {job.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={job.status === 'مفتوح' ? 'default' : 'secondary'}>{job.status}</Badge>
                            <Button variant="outline" size="sm">
                              عرض التفاصيل
                            </Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">لم تقم بنشر أي وظائف بعد.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                    <CardTitle>نشر وظيفة جديدة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-job-title">عنوان الوظيفة</Label>
                        <Input id="new-job-title" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} placeholder="مثال: نجار محترف"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-job-desc">وصف الوظيفة</Label>
                        <Textarea id="new-job-desc" value={newJobDescription} onChange={(e) => setNewJobDescription(e.target.value)} placeholder="المهام، المسؤوليات، المؤهلات..."/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-job-loc">الموقع</Label>
                        <Input id="new-job-loc" value={newJobLocation} onChange={(e) => setNewJobLocation(e.target.value)} placeholder="مثال: صنعاء، حدة"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handlePostJob}>نشر الوظيفة</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recommendations" className="mt-6">
           <SmartRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  )
}
