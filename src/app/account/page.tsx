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
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDatabase, ref, onValue, set, push, serverTimestamp, get, update } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch"


interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: string;
}

interface Applicant {
    id: string;
    appId: string;
    name?: string;
    email?: string;
    appliedAt: string;
    resumeUrl?: string;
    status: string;
    jobTitle?: string;
}

interface PostedJob {
  id: string;
  title: string;
  status: 'مفتوح' | 'مغلق';
  description?: string;
  location?: string;
  applicants?: Applicant[];
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userBio, setUserBio] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  const auth = getAuth(app);
  const db = getDatabase(app);
  const storage = getStorage(app);
  const { toast } = useToast();

  const fetchApplicantsForJob = async (jobId: string, jobTitle: string): Promise<Applicant[]> => {
      const applicationsRef = ref(db, 'applications');
      const snapshot = await get(applicationsRef);
      if (!snapshot.exists()) return [];
      
      const allApplications = snapshot.val();
      const jobApplicants: Applicant[] = [];

      for (const userId in allApplications) {
          const userApplications = allApplications[userId];
          for (const appId in userApplications) {
              const applicationData = userApplications[appId];
              if (applicationData.jobId === jobId) {
                  const userRef = ref(db, `users/${userId}`);
                  const userSnapshot = await get(userRef);
                  const userData = userSnapshot.val();

                  let applicantResumeUrl: string | undefined;
                  try {
                      const resumeRef = storageRef(storage, `resumes/${userId}/resume.pdf`);
                      applicantResumeUrl = await getDownloadURL(resumeRef);
                  } catch (error) {
                      applicantResumeUrl = undefined;
                  }
                  
                  jobApplicants.push({
                      id: userId,
                      appId: appId,
                      name: userData?.displayName || 'غير متوفر',
                      email: userData?.email || 'غير متوفر',
                      appliedAt: applicationData.appliedAt ? format(new Date(applicationData.appliedAt), 'yyyy-MM-dd') : 'N/A',
                      resumeUrl: applicantResumeUrl,
                      status: applicationData.status,
                      jobTitle: jobTitle
                  });
              }
          }
      }
      return jobApplicants;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        
        const userProfileRef = ref(db, `users/${currentUser.uid}`);
        onValue(userProfileRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserBio(data.bio || '');
            setDisplayName(data.displayName || currentUser.displayName || '');
            setIsPublic(data.isPublic || false);
          }
        });

        const resumeRef = storageRef(storage, `resumes/${currentUser.uid}/resume.pdf`);
        getDownloadURL(resumeRef).then(setResumeUrl).catch(() => setResumeUrl(null));

        const jobsRef = ref(db, `jobs/${currentUser.uid}`);
        onValue(jobsRef, async (snapshot) => {
            const jobsData = snapshot.val();
            if (jobsData) {
                 const jobsListPromises: Promise<PostedJob>[] = Object.keys(jobsData).map(async key => {
                    const job = jobsData[key];
                    const applicants = await fetchApplicantsForJob(key, job.title);
                    return {
                        id: key,
                        status: 'مفتوح',
                        ...job,
                        applicants: applicants
                    }
                });
                const jobsList = await Promise.all(jobsListPromises);
                setPostedJobs(jobsList);
            } else {
                setPostedJobs([]);
            }
        });

        const applicationsRef = ref(db, `applications/${currentUser.uid}`);
        onValue(applicationsRef, (snapshot) => {
          const appsData = snapshot.val();
          const appsList: Application[] = appsData ? Object.keys(appsData).map(key => ({
            id: key,
            ...appsData[key],
            appliedAt: appsData[key].appliedAt ? format(new Date(appsData[key].appliedAt), 'yyyy-MM-dd') : 'N/A',
          })) : [];
          setApplications(appsList);
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, db, storage]);
  
  const handleProfileSave = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: displayName });
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      const existingData = userSnapshot.val() || {};

      await set(userRef, {
          ...existingData,
          bio: userBio,
          displayName: displayName,
          email: user.email,
          isPublic: isPublic,
      });

      if (resumeFile) {
        const resumeRef = storageRef(storage, `resumes/${user.uid}/resume.pdf`);
        await uploadBytes(resumeRef, resumeFile);
        const url = await getDownloadURL(resumeRef);
        setResumeUrl(url);
        setResumeFile(null);
      }
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
            ownerId: user.uid,
        });

        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
        if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
            for (const userId in usersData) {
                if (usersData[userId]?.notificationSettings?.newJobNotifications) {
                    const notificationsRef = ref(db, `notifications/${userId}`);
                    const newNotificationRef = push(notificationsRef);
                    await set(newNotificationRef, {
                        message: `تم نشر وظيفة جديدة قد تهمك: "${newJobTitle}"`,
                        link: `/jobs/${newJobRef.key}`,
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }
        }
        
        toast({ title: "نجاح", description: "تم نشر الوظيفة بنجاح!" });
        setNewJobTitle('');
        setNewJobDescription('');
        setNewJobLocation('');
    } catch (error) {
        console.error("Error posting job:", error);
        toast({ variant: 'destructive', title: "خطأ", description: "فشل نشر الوظيفة." });
    }
  };

  const handleApplicationStatusChange = async (applicant: Applicant, newStatus: string) => {
    if (!user) return;
    try {
      const applicationRef = ref(db, `applications/${applicant.id}/${applicant.appId}`);
      await update(applicationRef, { status: newStatus });
      
      const notificationsRef = ref(db, `notifications/${applicant.id}`);
      const newNotificationRef = push(notificationsRef);
      await set(newNotificationRef, {
        message: `تم تغيير حالة طلبك لوظيفة "${applicant.jobTitle}" إلى "${newStatus}".`,
        link: '/account?tab=applications',
        read: false,
        createdAt: serverTimestamp()
      });

      setPostedJobs(prevJobs => prevJobs.map(job => {
          if (job.applicants?.some(a => a.appId === applicant.appId)) {
              return {
                  ...job,
                  applicants: job.applicants.map(a => 
                      a.appId === applicant.appId ? { ...a, status: newStatus } : a
                  )
              };
          }
          return job;
      }));

      toast({
          title: 'نجاح',
          description: `تم تحديث حالة الطلب إلى "${newStatus}".`
      });
    } catch (error) {
        console.error("Error updating application status:", error);
        toast({ variant: 'destructive', title: "خطأ", description: "فشل تحديث حالة الطلب." });
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
                <Input id="resume" type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} />
                {resumeUrl ? (
                    <p className="text-sm text-muted-foreground">
                    السيرة الحالية: <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary">عرض الملف</a>
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">لم يتم رفع سيرة ذاتية بعد.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">نبذة عني</Label>
                <Textarea id="bio" placeholder="تحدث عن مهاراتك وخبراتك..." value={userBio} onChange={(e) => setUserBio(e.target.value)} />
              </div>
               <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border bg-background">
                      <Label htmlFor="is-public" className="flex flex-col gap-1 cursor-pointer">
                          <span className="font-semibold">ملف شخصي عام</span>
                          <span className="font-normal text-xs text-muted-foreground">
                              السماح لأصحاب العمل برؤية ملفك الشخصي والاتصال بك مباشرة.
                          </span>
                      </Label>
                      <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                  {isPublic && user && (
                    <p className="text-sm text-muted-foreground p-2 rounded-md bg-secondary border">
                        رابط ملفك العام: 
                        <Link href={`/profile/${user.uid}`} className="underline text-primary mr-2" target="_blank">
                          عرض الملف <Eye className="inline h-4 w-4" />
                        </Link>
                    </p>
                  )}
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
                            <Badge variant={app.status === 'مرفوض' ? 'destructive' : app.status === 'مقبول' ? 'default': 'secondary'}>{app.status}</Badge>
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
                        <Card key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                          <div className="flex-grow">
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {job.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <Badge variant={job.status === 'مفتوح' ? 'default' : 'secondary'} className="whitespace-nowrap">{job.status}</Badge>
                             <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                  عرض المتقدمين ({job.applicants?.length || 0})
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>المتقدمون لوظيفة: {job.title}</DialogTitle>
                                  <DialogDescription>
                                    قائمة بالأشخاص الذين تقدموا لهذه الفرصة.
                                  </DialogDescription>
                                </DialogHeader>
                                {job.applicants && job.applicants.length > 0 ? (
                                    <div className="overflow-auto max-h-[60vh]">
                                      <Table>
                                          <TableHeader>
                                              <TableRow>
                                                  <TableHead>الاسم</TableHead>
                                                  <TableHead>تاريخ التقديم</TableHead>
                                                  <TableHead>الحالة</TableHead>
                                                  <TableHead>السيرة الذاتية</TableHead>
                                                  <TableHead className="text-right">الإجراءات</TableHead>
                                              </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                              {job.applicants.map(applicant => (
                                                  <TableRow key={applicant.id}>
                                                      <TableCell className="font-medium whitespace-nowrap">{applicant.name}</TableCell>
                                                      <TableCell className="whitespace-nowrap">{applicant.appliedAt}</TableCell>
                                                      <TableCell>
                                                        <Badge variant={applicant.status === 'مرفوض' ? 'destructive' : applicant.status === 'مقبول' ? 'default' : 'secondary'}>
                                                            {applicant.status}
                                                        </Badge>
                                                      </TableCell>
                                                      <TableCell>
                                                        {applicant.resumeUrl ? (
                                                          <Button variant="link" size="sm" asChild>
                                                            <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                              عرض
                                                            </a>
                                                          </Button>
                                                        ) : (
                                                          <span className="text-xs text-muted-foreground">لا يوجد</span>
                                                        )}
                                                      </TableCell>
                                                      <TableCell className="text-right">
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                              <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">فتح القائمة</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                              </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                              <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
                                                              <DropdownMenuItem onClick={() => handleApplicationStatusChange(applicant, 'تحت المراجعة')}>
                                                                تحت المراجعة
                                                              </DropdownMenuItem>
                                                              <DropdownMenuItem onClick={() => handleApplicationStatusChange(applicant, 'مقبول')}>
                                                                مقبول
                                                              </DropdownMenuItem>
                                                              <DropdownMenuItem onClick={() => handleApplicationStatusChange(applicant, 'مرفوض')}>
                                                                مرفوض
                                                              </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                          </DropdownMenu>
                                                      </TableCell>
                                                  </TableRow>
                                              ))}
                                          </TableBody>
                                      </Table>
                                    </div>
                                ) : (
                                    <p className="text-center py-8 text-muted-foreground">لا يوجد متقدمون لهذه الوظيفة بعد.</p>
                                )}
                              </DialogContent>
                            </Dialog>
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
