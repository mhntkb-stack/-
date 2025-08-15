
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building, Wrench, HandMetal, Palette, Utensils, SprayCan, Droplets } from 'lucide-react';
import JobCard from '@/components/job-card';
import Link from 'next/link';
import { featuredJobs } from '@/lib/jobs-data';

const categories = [
  { name: 'البناء والإنشاءات', icon: <Building className="h-8 w-8" /> },
  { name: 'الصيانة', icon: <Wrench className="h-8 w-8" /> },
  { name: 'الحرف اليدوية', icon: <HandMetal className="h-8 w-8" /> },
  { name: 'الأعمال الفنية', icon: <Palette className="h-8 w-8" /> },
  { name: 'السباكة', icon: <Droplets className="h-8 w-8" /> },
  { name: 'الدهان', icon: <SprayCan className="h-8 w-8" /> },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline mb-4 text-foreground">
            وظيفتك في يديك
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            منصتك المتخصصة لإيجاد فرص عمل للحرفيين في صنعاء. ابدأ مسيرتك الحرفية اليوم.
          </p>
          <div className="w-full max-w-2xl mx-auto">
            <form className="w-full flex items-center gap-0 relative">
              <Input
                type="text"
                placeholder="ابحث عن حرفة، مهارة، أو وظيفة..."
                className="w-full pr-4 py-3 h-14 text-base rounded-full pl-16 border-2 focus-visible:ring-offset-0 focus-visible:ring-2"
              />
              <Button type="submit" size="lg" className="absolute left-2 h-11 rounded-full px-6">
                <Search className="h-5 w-5 ml-2" />
                <span>بحث</span>
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
          <div className="text-center w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 font-headline">
              تصفح حسب الحرفة
            </h2>
          </div>
          <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link href="/jobs" key={category.name}
                className="group flex flex-col items-center justify-center text-center gap-3 p-4 bg-card rounded-lg border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-md font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
           <div className="text-center w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 font-headline">
              فرص مميزة وحصرية
            </h2>
          </div>
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/jobs">عرض كل الوظائف</Link>
            </Button>
          </div>
        </div>
      </section>
      
    </>
  );
}
