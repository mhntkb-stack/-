'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateRecommendations, RecommendationState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';

const initialState: RecommendationState = {
  message: null,
  recommendations: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          جارٍ الإنشاء...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          أنشئ توصيات
        </>
      )}
    </Button>
  );
}

export default function SmartRecommendations() {
  const [state, formAction] = useFormState(generateRecommendations, initialState);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-primary" />
            توصيات ذكية
          </CardTitle>
          <CardDescription>
            استخدم الذكاء الاصطناعي لاكتشاف الوظائف المناسبة لك. صف مهاراتك، خبراتك، واهتماماتك المهنية.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userProfile">ملفك الشخصي واهتماماتك</Label>
            <Textarea
              id="userProfile"
              name="userProfile"
              placeholder="مثال: أنا مهندس برمجيات بخبرة 5 سنوات في تطوير تطبيقات الويب باستخدام React و Node.js. أبحث عن فرصة عمل في شركة ناشئة..."
              className="min-h-[120px] mt-2"
              required
            />
            {state?.errors?.userProfile && (
              <p className="text-sm font-medium text-destructive mt-2">{state.errors.userProfile[0]}</p>
            )}
          </div>
          
          {state?.message && !state.recommendations && (
             <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/20 flex items-start gap-3">
               <AlertTriangle className="h-5 w-5 mt-0.5" />
               <div>
                  <h4 className="font-bold">خطأ</h4>
                  <p className="text-sm">{state.message}</p>
               </div>
            </div>
          )}

          {state?.recommendations && state.recommendations.length > 0 && (
            <div className="p-4 rounded-md bg-secondary border border-border">
              <h4 className="font-bold mb-3 text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                وظائف مقترحة لك:
              </h4>
              <ul className="list-disc pr-5 space-y-2">
                {state.recommendations.map((job, index) => (
                  <li key={index} className="text-md">{job}</li>
                ))}
              </ul>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
