'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Palette } from 'lucide-react';


export default function SettingsPage() {

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">الإعدادات</h1>
      <div className="grid gap-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette />مظهر التطبيق</CardTitle>
            <CardDescription>
              يمكنك تغيير مظهر التطبيق (فاتح/داكن) باستخدام الزر الموجود في الشريط العلوي.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">يتم حفظ اختيارك تلقائيًا لزياراتك القادمة.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell />الإشعارات</CardTitle>
            <CardDescription>
              إدارة تفضيلات الإشعارات الخاصة بك. (ميزة قادمة قريبًا)
            </CardDescription>
          </CardHeader>
           <CardContent>
             <p className="text-sm text-muted-foreground">قريبًا ستتمكن من التحكم في الإشعارات التي تصلك عبر البريد الإلكتروني أو داخل التطبيق.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
