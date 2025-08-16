'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Link as LinkIcon, Copy } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


export default function SettingsPage() {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText('https://mhntk.com/join/u123xyz');
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
                    <Label htmlFor="job-reply-notifications" className="flex flex-col gap-1">
                        <span className="font-semibold">الرد على طلباتي</span>
                        <span className="font-normal text-xs text-muted-foreground">
                            تلقي إشعار عند تغيير حالة طلبات التوظيف التي قدمتها.
                        </span>
                    </Label>
                    <Switch id="job-reply-notifications" />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="new-job-notifications" className="flex flex-col gap-1">
                       <span className="font-semibold">وظائف جديدة تهمّني</span>
                        <span className="font-normal text-xs text-muted-foreground">
                           تلقي إشعار عند نشر وظائف جديدة تتناسب مع اهتماماتك.
                        </span>
                    </Label>
                    <Switch id="new-job-notifications" disabled />
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
                <Input value="https://mhntk.com/join/u123xyz" readOnly />
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="نسخ رابط الدعوة">
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
