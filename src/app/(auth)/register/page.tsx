'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.41 0-6.19-2.84-6.19-6.38s2.78-6.38 6.19-6.38c1.84 0 3.22.66 4.21 1.62l2.56-2.56c-1.62-1.51-3.79-2.4-6.77-2.4-5.49 0-9.91 4.49-9.91 9.91s4.42 9.91 9.91 9.91c2.84 0 5.22-1 7.02-2.69 1.9-1.84 2.92-4.38 2.92-7.17 0-.6-.06-1.12-.18-1.62h-9.56z" />
    </svg>
)

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "أهلاً بك في منصتنا!",
      });
      router.push('/account');
    } catch (error: any) {
      setError("فشل إنشاء الحساب. قد يكون البريد الإلكتروني مستخدماً بالفعل.");
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: "قد يكون البريد الإلكتروني مستخدماً بالفعل أو كلمة المرور ضعيفة.",
      });
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const auth = getAuth(app);
      await signInWithPopup(auth, provider);
       toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "أهلاً بك في منصتنا!",
      });
      router.push('/account');
    } catch (error) {
       setError("فشل إنشاء الحساب باستخدام جوجل. يرجى المحاولة مرة أخرى.");
       toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: "فشل إنشاء الحساب باستخدام جوجل. يرجى المحاولة مرة أخرى.",
      });
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
           <Briefcase className="mx-auto h-8 w-8 mb-2 text-primary" />
          <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
          <CardDescription>
            أدخل معلوماتك أدناه لإنشاء حساب جديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">الاسم الكامل</Label>
              <Input
                id="full-name"
                placeholder="أحمد الصالح"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء حساب'}
            </Button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
           <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">أو أنشئ حساب بـ</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                <GoogleIcon />
                <span>المتابعة باستخدام جوجل</span>
            </Button>
          <div className="mt-4 text-center text-sm">
            هل لديك حساب بالفعل؟{' '}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
