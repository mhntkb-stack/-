'use server';

import { getJobRecommendations } from '@/ai/flows/smart-job-recommendations';
import { z } from 'zod';

const recommendationSchema = z.object({
  userProfile: z.string().min(10, { message: 'يرجى تقديم وصف أكثر تفصيلاً.' }),
});

export type RecommendationState = {
  message?: string | null;
  recommendations?: string[] | null;
  errors?: {
    userProfile?: string[];
  } | null;
};

export async function generateRecommendations(
  prevState: RecommendationState,
  formData: FormData
): Promise<RecommendationState> {
  const validatedFields = recommendationSchema.safeParse({
    userProfile: formData.get('userProfile'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'فشلت عملية التحقق من الحقول.',
    };
  }

  try {
    const result = await getJobRecommendations({
      userProfile: validatedFields.data.userProfile,
      jobMarketTrends: 'High demand for frontend developers and electrical engineers in Sanaa.',
      pastEngagement: 'User previously applied for engineering and tech jobs.',
    });

    if (result.recommendedJobs && result.recommendedJobs.length > 0) {
      return { message: 'تم العثور على توصيات بنجاح!', recommendations: result.recommendedJobs };
    } else {
      return { message: 'لم نتمكن من العثور على توصيات بناءً على مدخلاتك.' };
    }
  } catch (error) {
    console.error(error);
    return { message: 'حدث خطأ أثناء إنشاء التوصيات. الرجاء المحاولة مرة أخرى.' };
  }
}
