import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import JobCard from '@/components/job-card';
import Link from 'next/link';

const ScissorsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" x2="8.12" y1="4" y2="15.88" />
    <line x1="14.47" x2="20" y1="14.48" y2="20" />
    <line x1="8.12" x2="12" y1="8.12" y2="12" />
  </svg>
);

const WrenchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
)

const HammerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
)

const PaintBucketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11z"/><path d="m5 2 4 4"/><path d="M14 4 7.5 10.5"/><path d="M22 12A10 10 0 1 1 12 2"/></svg>
)

const featuredJobs = [
  {
    title: 'نجار أثاث',
    company: 'ورشة النجارة الحديثة',
    location: 'صنعاء',
    type: '150,000 - 250,000 ريال يمني',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo carpentry'
  },
  {
    title: 'مطور واجهات أمامية (React)',
    company: 'تقنية المستقبل',
    location: 'صنعاء، الأصبحي',
    type: 'دوام كامل',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo tech'
  },
  {
    title: 'سباك محترف',
    company: 'خدمات الصيانة الحديثة',
    location: 'صنعاء، السبعين',
    type: 'دوام جزئي',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo services'
  },
  {
    title: 'مهندس معماري',
    company: 'البناء العصري',
    location: 'صنعاء، بيت بوس',
    type: 'عقد',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo construction'
  },
];

const categories = [
  { name: 'السباكة', icon: <WrenchIcon /> },
  { name: 'الدهان', icon: <PaintBucketIcon /> },
  { name: 'النجارة', icon: <HammerIcon /> },
  { name: 'الحلاقة', icon: <ScissorsIcon /> },
  { name: 'الكهرباء', icon: <WrenchIcon /> },
  { name: 'الخياطة', icon: <ScissorsIcon /> },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-primary">
            بلمسة، وظيفتك بين يديك
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            منصتك المتخصصة لإيجاد فرص عمل للحرفيين في صنعاء. ابدأ مسيرتك الحرفية اليوم.
          </p>
          <form className="w-full max-w-2xl flex items-center gap-0 relative">
            <Input
              type="text"
              placeholder="ابحث عن حرفة أمثال نجارة..."
              className="w-full pr-4 py-3 h-14 text-base rounded-full pl-6 border-2 focus-visible:ring-offset-0 focus-visible:ring-2"
            />
            <Button type="submit" size="icon" className="absolute left-2 h-10 w-10 rounded-full">
              <Search className="h-5 w-5" />
              <span className="sr-only">بحث</span>
            </Button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            فرص مميزة
          </h2>
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/jobs">عرض كل الوظائف</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            تصفح حسب الحرفة
          </h2>
          <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group flex flex-col items-center justify-center text-center gap-3 p-4 md:p-6 bg-card rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square"
              >
                <div className="h-14 w-14 md:h-16 md:w-16 flex items-center justify-center rounded-full bg-secondary text-primary transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-sm md:text-md font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
