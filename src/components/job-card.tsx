
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Briefcase, Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getDatabase, ref, set, serverTimestamp, push } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type JobCardProps = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  dataAiHint?: string;
};

export default function JobCard({ id, title, company, location, type, logo, dataAiHint }: JobCardProps) {
  const isSalary = type.includes('ريال يمني');
  const auth = getAuth(app);
  const db = getDatabase(app);
  const { toast } = useToast();
  const router = useRouter();

  const handleApply = async () => {
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
      const applicationsRef = ref(db, `applications/${user.uid}`);
      const newApplicationRef = push(applicationsRef);
      await set(newApplicationRef, {
        jobId: id,
        jobTitle: title,
        company: company,
        status: 'تحت المراجعة',
        appliedAt: serverTimestamp(),
      });
      toast({
        title: 'تم التقديم بنجاح!',
        description: `لقد قدمت على وظيفة "${title}".`,
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

  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col bg-card rounded-2xl">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start gap-6">
          <Image
            src={logo}
            alt={`${company} logo`}
            width={64}
            height={64}
            className="rounded-lg border p-1 bg-white"
            data-ai-hint={dataAiHint}
          />
          <div className="flex-grow">
            <CardTitle className="text-xl font-bold mb-1 font-headline">{title}</CardTitle>
            <CardDescription className="text-md mb-3">{company}</CardDescription>
            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isSalary ? <Wallet className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                <span className={isSalary ? 'text-primary font-semibold' : ''}>{type}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0 flex items-center justify-end">
          <Button onClick={handleApply} className="transition-transform transform hover:scale-105">التقديم الآن</Button>
      </div>
    </Card>
  );
}
