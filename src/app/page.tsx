import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Wrench, Code, Palette, Building, DraftingCompass, Zap } from 'lucide-react';
import JobCard from '@/components/job-card';

const featuredJobs = [
  {
    title: 'مهندس كهرباء',
    company: 'شركة الكهرباء الوطنية',
    location: 'صنعاء، حدة',
    type: 'دوام كامل',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'company logo'
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
  { name: 'كهرباء', icon: <Zap className="h-8 w-8" /> },
  { name: 'هندسة', icon: <DraftingCompass className="h-8 w-8" /> },
  { name: 'سباكة', icon: <Wrench className="h-8 w-8" /> },
  { name: 'برمجة', icon: <Code className="h-8 w-8" /> },
  { name: 'بناء', icon: <Building className="h-8 w-8" /> },
  { name: 'ديكور', icon: <Palette className="h-8 w-8" /> },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center bg-secondary/50">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            ابحث عن مهنتك التالية بلمسة واحدة
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            منصتك الأولى للبحث عن فرص عمل احترافية في صنعاء.
          </p>
          <form className="max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="المسمى الوظيفي، كلمات مفتاحية، أو شركة"
                className="w-full pl-10 pr-4 py-3 h-12 text-base"
              />
            </div>
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="المدينة أو المنطقة"
                className="w-full pl-10 pr-4 py-3 h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 h-12">
              <Search className="h-5 w-5 text-accent-foreground" />
              <span className="md:hidden mr-2">بحث</span>
            </Button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            وظائف مميزة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <a href="/jobs">عرض كل الوظائف</a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            تصفح حسب المجال
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group flex flex-col items-center gap-3 p-6 bg-background rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-md font-semibold text-center">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
