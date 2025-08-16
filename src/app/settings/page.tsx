'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');

  // On component mount, read the theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">الإعدادات</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>مظهر التطبيق</CardTitle>
          <CardDescription>
            اختر المظهر الذي تفضله للتطبيق. سيتم حفظ اختيارك لزياراتك القادمة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as 'light' | 'dark')}>
            <Label
              htmlFor="light"
              className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary"
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5" />
                <span>فاتح</span>
              </div>
              <RadioGroupItem value="light" id="light" />
            </Label>
            <Label
              htmlFor="dark"
              className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary"
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5" />
                <span>داكن</span>
              </div>
              <RadioGroupItem value="dark" id="dark" />
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
