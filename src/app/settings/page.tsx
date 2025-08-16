'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Link as LinkIcon, Copy } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getDatabase, ref, get, set, update } from 'firebase/database';


export default function SettingsPage() {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [notificationSettings, setNotificationSettings] = useState({
      jobReplyNotifications: false,
      newJobNotifications: false,
    });
    const auth = getAuth(app);
    const db = getDatabase(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if(currentUser){
                const settingsRef = ref(db, `users/${currentUser.uid}/notificationSettings`);
                get(settingsRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        setNotificationSettings(snapshot.val());
                    }
                });
            }
        });
        return () => unsubscribe();
    }, [auth, db]);

    const handleNotificationChange = (key: keyof typeof notificationSettings, value: boolean) => {
        if (!user) return;

        const newSettings = { ...notificationSettings, [key]: value };
        setNotificationSettings(newSettings);

        const userRef = ref(db, `users/${user.uid}`);
        update(userRef, { notificationSettings: newSettings }).catch(error => {
            toast({ variant: 'destructive', title: 'خطأ', description: 'فشل حفظ الإعدادات.' });
        });
    };

    const handleCopy = () => {
        if(!user) return;
        const inviteLink = `${window.location.origin}/register?ref=${user.uid}`;
        navigator.clipboard.writeText(inviteLink);
        toast({
            title: 'تم النسخ!',
            description: 'تم نسخ رابط الدعوة إلى الحافظة.',
        });
    }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">الإعدادات</h1>
      <div className="grid gap-8 max-w-2xl mx-auto">
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell />الإشعارات</CardTitle>
            <CardDescription>
              اختر الإشعارات التي تود استقبالها لتظل على اطلاع دائم.
            </CardDescription>
          </CardHeader>
           <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="job-reply-notifications" className="flex flex-col gap-1 cursor-pointer">
                        <span className="font-semibold">الرد على طلباتي</span>
                        <span className="font-normal text-xs text-muted-foreground">
                            تلقي إشعار عند تغيير حالة طلبات التوظيف التي قدمتها.
                        </span>
                    </Label>
                    <Switch 
                        id="job-reply-notifications" 
                        checked={notificationSettings.jobReplyNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('jobReplyNotifications', checked)}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="new-job-notifications" className="flex flex-col gap-1 cursor-pointer">
                       <span className="font-semibold">وظائف جديدة تهمّني</span>
                        <span className="font-normal text-xs text-muted-foreground">
                           تلقي إشعار عند نشر وظائف جديدة تتناسب مع اهتماماتك.
                        </span>
                    </Label>
                    <Switch 
                        id="new-job-notifications"
                        checked={notificationSettings.newJobNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('newJobNotifications', checked)}
                    />
                </div>
           </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon />ادعُ صديقاً</CardTitle>
            <CardDescription>
              شارك رابط الدعوة مع أصدقائك من الحرفيين أو أصحاب العمل.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex gap-2">
                <Input value={user ? `${window.location.origin}/register?ref=${user.uid}` : '...'} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="نسخ رابط الدعوة" disabled={!user}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
