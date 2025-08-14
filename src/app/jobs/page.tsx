import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import JobCard from '@/components/job-card';

const jobs = [
    { title: 'مهندس كهرباء', company: 'شركة الكهرباء الوطنية', location: 'صنعاء، حدة', type: 'دوام كامل', logo: 'https://placehold.co/100x100.png', dataAiHint: 'company logo' },
    { title: 'مطور واجهات أمامية (React)', company: 'تقنية المستقبل', location: 'صنعاء، الأصبحي', type: 'دوام كامل', logo: 'https://placehold.co/100x100.png', dataAiHint: 'company logo tech' },
    { title: 'سباك محترف', company: 'خدمات الصيانة الحديثة', location: 'صنعاء، السبعين', type: 'دوام جزئي', logo: 'https://placehold.co/100x100.png', dataAiHint: 'company logo services' },
    { title: 'مهندس معماري', company: 'البناء العصري', location: 'صنعاء، بيت بوس', type: 'عقد', logo: 'https://placehold.co/100x100.png', dataAiHint: 'company logo construction' },
    { title: 'مصمم جرافيك', company: 'إبداع للإعلان', location: 'صنعاء، حدة', type: 'دوام كامل', logo: 'https://placehold.co/100x100.png', dataAiHint: 'company logo design' },
    { title: 'مدير مشروع', company: 'مشاريع اليمن', location: 'صنعاء، الأصبحي', type: 'دوام كامل', logo: 'https://placehold.co/100x100.png', dataAiHint: 'company logo corporate' },
];

export default function JobsPage() {
    return (
        <div className="container py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Filters Sidebar */}
                <aside className="col-span-1 lg:sticky top-24">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 font-headline">تصفية النتائج</h3>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="keywords">كلمات مفتاحية</Label>
                                    <Input id="keywords" placeholder="مهندس، مطور..." />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">الموقع</Label>
                                    <Input id="location" placeholder="صنعاء، حدة..." />
                                </div>
                                <div className="grid gap-2">
                                    <Label>نوع الوظيفة</Label>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="full-time" />
                                        <Label htmlFor="full-time" className="font-normal">دوام كامل</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="part-time" />
                                        <Label htmlFor="part-time" className="font-normal">دوام جزئي</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="contract" />
                                        <Label htmlFor="contract" className="font-normal">عقد</Label>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="experience">مستوى الخبرة</Label>
                                    <Select>
                                        <SelectTrigger id="experience">
                                            <SelectValue placeholder="اختر المستوى" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="entry">مبتدئ</SelectItem>
                                            <SelectItem value="mid">متوسط</SelectItem>
                                            <SelectItem value="senior">خبير</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="salary">الراتب</Label>
                                    <Select>
                                        <SelectTrigger id="salary">
                                            <SelectValue placeholder="اختر الراتب" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="range1">50,000 - 100,000</SelectItem>
                                            <SelectItem value="range2">100,000 - 200,000</SelectItem>
                                            <SelectItem value="range3">200,000+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full bg-accent hover:bg-accent/90">
                                    <Search className="h-4 w-4 ml-2" />
                                    تطبيق الفلاتر
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Job Listings */}
                <main className="col-span-1 lg:col-span-3">
                    <h1 className="text-3xl font-bold mb-6 font-headline">الوظائف المتاحة</h1>
                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map((job, index) => (
                            <JobCard key={index} {...job} />
                        ))}
                    </div>
                     <div className="mt-8 flex justify-center">
                        <Button variant="outline">تحميل المزيد</Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
