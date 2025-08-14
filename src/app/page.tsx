import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building, Wrench as WrenchIconLucid, HandMetal, Palette, Utensils } from 'lucide-react';
import JobCard from '@/components/job-card';
import Link from 'next/link';

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
    title: 'فني تبريد وتكييف',
    company: 'خبراء الصيانة',
    location: 'صنعاء، الأصبحي',
    type: 'دوام كامل',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo tech'
  },
  {
    title: 'خياط ماهر',
    company: 'معمل الخياطة العصري',
    location: 'صنعاء، السبعين',
    type: 'دوام جزئي',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo services'
  },
  {
    title: 'دهان وديكور',
    company: 'لمسة فنية للديكور',
    location: 'صنعاء، بيت بوس',
    type: 'عقد',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo construction'
  },
];

const categories = [
  { name: 'البناء والإنشاءات', icon: <Building className="h-8 w-8" /> },
  { name: 'الصيانة', icon: <WrenchIconLucid className="h-8 w-8" /> },
  { name: 'الحرف اليدوية', icon: <HandMetal className="h-8 w-8" /> },
  { name: 'الأعمال الفنية', icon: <Palette className="h-8 w-8" /> },
  { name: 'المجال الغذائي', icon: <Utensils className="h-8 w-8" /> },
  { name: 'السباكة', icon: <WrenchIconLucid className="h-8 w-8" /> },
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
