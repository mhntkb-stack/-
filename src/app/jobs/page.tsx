
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Frown } from 'lucide-react';
import JobCard from '@/components/job-card';
import { allJobs } from '@/lib/jobs-data';


export default function JobsPage() {
    const [filteredJobs, setFilteredJobs] = useState(allJobs);
    const [keywords, setKeywords] = useState('');
    const [location, setLocation] = useState('');
    const [jobTypes, setJobTypes] = useState<string[]>([]);
    const [experience, setExperience] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Load filters from localStorage on initial client-side render
    useEffect(() => {
        setIsMounted(true);
        const savedKeywords = localStorage.getItem('job_keywords');
        const savedLocation = localStorage.getItem('job_location');
        const savedJobTypes = localStorage.getItem('job_types');
        const savedExperience = localStorage.getItem('job_experience');

        if (savedKeywords) setKeywords(savedKeywords);
        if (savedLocation) setLocation(savedLocation);
        if (savedJobTypes) setJobTypes(JSON.parse(savedJobTypes));
        if (savedExperience) setExperience(savedExperience);
    }, []);

    // Save filters to localStorage whenever they change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('job_keywords', keywords);
            localStorage.setItem('job_location', location);
            localStorage.setItem('job_types', JSON.stringify(jobTypes));
            localStorage.setItem('job_experience', experience);
            handleFilter();
        }
    }, [keywords, location, jobTypes, experience, isMounted]);

    const handleFilter = () => {
        let jobs = allJobs;

        if (keywords) {
            jobs = jobs.filter(job => job.title.toLowerCase().includes(keywords.toLowerCase()) || job.company.toLowerCase().includes(keywords.toLowerCase()));
        }

        if (location) {
            jobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (jobTypes.length > 0) {
            jobs = jobs.filter(job => jobTypes.includes(job.type));
        }

        if (experience) {
            jobs = jobs.filter(job => job.experience === experience);
        }

        setFilteredJobs(jobs);
    };

    const handleJobTypeChange = (checked: boolean | 'indeterminate', type: string) => {
        if (checked) {
            setJobTypes(prev => [...prev, type]);
        } else {
            setJobTypes(prev => prev.filter(t => t !== type));
        }
    };
    
    const resetFilters = () => {
        setKeywords('');
        setLocation('');
        setJobTypes([]);
        setExperience('');
    };

    if (!isMounted) {
        return null; // or a loading skeleton
    }

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
                                    <Input id="keywords" placeholder="مهندس، مطور..." value={keywords} onChange={e => setKeywords(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">الموقع</Label>
                                    <Input id="location" placeholder="صنعاء، حدة..." value={location} onChange={e => setLocation(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>نوع الوظيفة</Label>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="full-time" checked={jobTypes.includes('دوام كامل')} onCheckedChange={(checked) => handleJobTypeChange(checked, 'دوام كامل')} />
                                        <Label htmlFor="full-time" className="font-normal">دوام كامل</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="part-time" checked={jobTypes.includes('دوام جزئي')} onCheckedChange={(checked) => handleJobTypeChange(checked, 'دوام جزئي')} />
                                        <Label htmlFor="part-time" className="font-normal">دوام جزئي</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox id="contract" checked={jobTypes.includes('عقد')} onCheckedChange={(checked) => handleJobTypeChange(checked, 'عقد')} />
                                        <Label htmlFor="contract" className="font-normal">عقد</Label>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="experience">مستوى الخبرة</Label>
                                    <Select value={experience} onValueChange={value => setExperience(value)}>
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
                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleFilter}>
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
                    {filteredJobs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} {...job} />
                            ))}
                        </div>
                    ) : (
                         <Card className="flex flex-col items-center justify-center text-center p-12 gap-4 border-dashed">
                           <Frown className="w-16 h-16 text-muted-foreground/50" />
                           <h3 className="text-xl font-semibold">لا توجد نتائج مطابقة</h3>
                           <p className="text-muted-foreground max-w-xs">
                             حاول تعديل معايير البحث أو توسيع نطاقه للعثور على ما تبحث عنه.
                           </p>
                           <Button variant="outline" onClick={resetFilters}>إعادة تعيين الفلاتر</Button>
                         </Card>
                    )}
                     <div className="mt-8 flex justify-center">
                        <Button variant="outline">تحميل المزيد</Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
