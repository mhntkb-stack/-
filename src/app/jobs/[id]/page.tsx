'use client';

import { useParams, useRouter } from 'next/navigation';
import { allJobs, featuredJobs } from '@/lib/jobs-data';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MapPin, Briefcase, Wallet, Building, Calendar, BarChart, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getDatabase, ref, set, serverTimestamp, push, get } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import JobCard from '@/components/job-card';

const allAvailableJobs = [...allJobs, ...featuredJobs];

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { id } = params;

  const job = allAvailableJobs.find((j) => j.id === id);

  const handleApply = async () => {
    if (!job) return;
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'يجب عليك تسجيل الدخول أولاً',
        description: 'يرجى تسجيل الدخول أو إنشاء حساب للتقديم على الوظائف.',
      });
      router.push('/login');
      return;
    }

    try {
      const db = getDatabase(app);
      
      const jobRef = ref(db, `jobs`);
      const jobSnapshot = await get(jobRef);
      let ownerId = null;

      if(jobSnapshot.exists()){
        const allJobsByOwner = jobSnapshot.val();
        for(const owner in allJobsByOwner){
          if(allJobsByOwner[owner][job.id]){
            ownerId = owner;
            break;
          }
        }
      }
      
      if(!ownerId){
         toast({ variant: 'destructive', title: 'خطأ', description: 'لم يتم العثور على صاحب العمل.' });
         return;
      }

      const applicationsRef = ref(db, `applications/${user.uid}`);
      const newApplicationRef = push(applicationsRef);
      await set(newApplicationRef, {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: 'تحت المراجعة',
        appliedAt: serverTimestamp(),
        ownerId: ownerId,
      });
      toast({
        title: 'تم التقديم بنجاح!',
        description: `لقد قدمت على وظيفة "${job.title}".`,
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        variant: 'destructive',
        title: 'حدث خطأ',
        description: 'فشل التقديم على الوظيفة. يرجى المحاولة مرة أخرى.',
      });
    }
  };


  if (!job) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">لم يتم العثور على الوظيفة</h1>
        <p className="text-muted-foreground mt-4">
          عذراً، الوظيفة التي تبحث عنها غير موجودة أو تم حذفها.
        </p>
        <Button onClick={() => router.push('/jobs')} className="mt-6">
          العودة إلى صفحة الوظائف
        </Button>
      </div>
    );
  }
  
  const otherJobs = allJobs.filter(j => j.id !== job.id && j.company === job.company).slice(0, 2);

  const isSalary = job.type.includes('ريال يمني');

  return (
    <div className="bg-secondary/30">
        <div className="container py-10 md:py-16">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2">
                     <Card>
                        <CardContent className="p-6 md:p-8">
                             <div className="flex items-start gap-6 mb-6">
                                <Image
                                    src={job.logo}
                                    alt={`${job.company} logo`}
                                    width={80}
                                    height={80}
                                    className="rounded-xl border p-1 bg-white object-cover"
                                    data-ai-hint={job.dataAiHint}
                                />
                                <div className="flex-grow">
                                    <h1 className="text-2xl md:text-3xl font-extrabold font-headline">{job.title}</h1>
                                    <p className="text-lg text-muted-foreground mt-1">{job.company}</p>
                                </div>
                            </div>
                            
                            <div className="border-t border-b py-4 my-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-semibold">الموقع</p>
                                        <p className="text-muted-foreground">{job.location}</p>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-2">
                                    {isSalary ? <Wallet className="h-5 w-5 text-primary" /> : <Briefcase className="h-5 w-5 text-primary" />}
                                    <div>
                                        <p className="font-semibold">{isSalary ? 'الراتب' : 'نوع الدوام'}</p>
                                        <p className="text-muted-foreground">{job.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BarChart className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-semibold">الخبرة</p>
                                        <p className="text-muted-foreground capitalize">{job.experience || 'غير محدد'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-semibold">تاريخ النشر</p>
                                        <p className="text-muted-foreground">منذ يومين</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-lg max-w-none text-foreground">
                                <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2"><FileText className="h-5 w-5"/> وصف الوظيفة</h2>
                                <p>{job.description}</p>
                                <h3 className="font-semibold mt-4">المسؤوليات الرئيسية:</h3>
                                <ul>
                                    <li>تنفيذ المهام الموكلة حسب المواصفات.</li>
                                    <li>صيانة الأدوات والمعدات.</li>
                                    <li>الالتزام بمعايير السلامة والجودة.</li>
                                </ul>
                                <h3 className="font-semibold mt-4">المؤهلات المطلوبة:</h3>
                                <ul>
                                    <li>خبرة سابقة في المجال المطلوب.</li>
                                    <li>القدرة على قراءة المخططات إن وجدت.</li>
                                    <li>مهارات تواصل جيدة.</li>
                                </ul>
                            </div>
                        </CardContent>
                     </Card>
                </div>
                <aside className="space-y-8">
                     <Card className="shadow-lg">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-bold font-headline mb-4">هل أنت مناسب لهذه الوظيفة؟</h3>
                            <Button size="lg" className="w-full" onClick={handleApply}>
                                التقديم الآن
                            </Button>
                        </CardContent>
                    </Card>
                    
                    {otherJobs.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold font-headline mb-4 flex items-center gap-2">
                                    <Building className="h-5 w-5 text-primary"/>
                                    وظائف أخرى في {job.company}
                                </h3>
                                <div className="space-y-4">
                                    {otherJobs.map((otherJob) => (
                                        <JobCard key={otherJob.id} {...otherJob} isMinimal={true} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </aside>
            </div>
        </div>
    </div>
  );
}
