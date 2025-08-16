'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';
import { UserProfile } from '@/components/craftsman-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Mail, FileText, UserCircle, Frown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("لم يتم توفير معرّف المستخدم.");
      return;
    };

    const db = getDatabase(app);
    const storage = getStorage(app);
    const userRef = ref(db, `users/${id}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.isPublic) {
          setProfile({ uid: id as string, ...userData });
          
          const resumeStorageRef = storageRef(storage, `resumes/${id}/resume.pdf`);
          getDownloadURL(resumeStorageRef)
            .then(setResumeUrl)
            .catch(() => setResumeUrl(null));
            
        } else {
          setError("هذا الملف الشخصي ليس عامًا.");
        }
      } else {
        setError("لم يتم العثور على المستخدم.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
       <div className="container py-12">
        <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center items-center">
                 <Skeleton className="h-28 w-28 rounded-full" />
                 <div className="w-full space-y-2 pt-4">
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-1/3 mx-auto" />
                 </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <Frown className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">حدث خطأ</h1>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-6">
          العودة إلى الرئيسية
        </Button>
      </div>
    );
  }

  if (!profile) {
    return null; 
  }

  const userInitial = profile.displayName ? profile.displayName.charAt(0).toUpperCase() : (profile.email ? profile.email.charAt(0).toUpperCase() : '?');

  return (
    <div className="bg-secondary/30">
        <div className="container py-12 md:py-20">
        <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader className="text-center items-center pb-8 pt-10 bg-card rounded-t-lg">
                <Avatar className="h-28 w-28 border-4 border-primary shadow-md">
                    <AvatarImage src="https://placehold.co/100x100.png" alt={profile.displayName} data-ai-hint="user avatar" />
                    <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-3xl pt-4 font-headline">{profile.displayName}</CardTitle>
                <CardDescription className="text-lg">حرفي في منصة مهنتك بلمسة</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold flex items-center gap-2"><UserCircle className="text-primary"/> نبذة عني</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {profile.bio || 'لم يقم هذا المستخدم بكتابة نبذة تعريفية بعد.'}
                    </p>
                </div>
                <div className="border-t pt-6 space-y-3">
                     <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="text-primary"/> معلومات التواصل</h3>
                     <div className="flex flex-wrap gap-4">
                         {profile.email && (
                            <Button asChild variant="outline">
                                <a href={`mailto:${profile.email}`}>
                                <Mail className="ml-2"/>
                                    تواصل عبر البريد
                                </a>
                            </Button>
                         )}
                        {resumeUrl && (
                            <Button asChild>
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="ml-2"/>
                                تحميل السيرة الذاتية
                            </a>
                            </Button>
                        )}
                        {!resumeUrl && (
                             <p className="text-sm text-muted-foreground p-2">لا توجد سيرة ذاتية مرفوعة.</p>
                        )}
                     </div>
                </div>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
