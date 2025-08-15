
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building, Wrench, HandMetal, Palette, SprayCan, MapPin } from 'lucide-react';
import JobCard from '@/components/job-card';
import Link from 'next/link';
import { featuredJobs } from '@/lib/jobs-data';
import { Target, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const categories = [
  { name: 'البناء والإنشاءات', icon: <Building className="h-8 w-8" /> },
  { name: 'الصيانة', icon: <Wrench className="h-8 w-8" /> },
  { name: 'الحرف اليدوية', icon: <HandMetal className="h-8 w-8" /> },
  { name: 'الأعمال الفنية', icon: <Palette className="h-8 w-8" /> },
  { name: 'الدهان', icon: <SprayCan className="h-8 w-8" /> },
];

const features = [
    {
        icon: <Target className="h-10 w-10 text-primary" />,
        title: 'فرص مستهدفة',
        description: 'نصلك بأفضل الفرص الحرفية المناسبة لمهاراتك وتخصصك في منطقتك مباشرة.'
    },
    {
        icon: <Briefcase className="h-10 w-10 text-primary" />,
        title: 'تخصص واحترافية',
        description: 'منصتنا متخصصة في الوظائف الحرفية فقط، مما يضمن لك نتائج دقيقة وعروض عمل جادة.'
    },
    {
        icon: <Users className="h-10 w-10 text-primary" />,
        title: 'تواصل مباشر',
        description: 'نسهل عليك التواصل المباشر والفعال مع أصحاب العمل بدون أي وسطاء أو تعقيدات.'
    }
]

const locations = [
  'شارع الستين', 'مذبح', 'الحصبة', 'سعوان', 'الزبيري', 'التحرير', 
  'عصر', 'شملان', 'جولة عمران', 'جولة الرويشان', 'الصافية', 'شعوب', 
  'باب اليمن', 'صباحة', 'الجامعة', 'الحي السياسي'
];

export default function Home() {
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationQuery(value);
    if (value.length > 0) {
      const filteredSuggestions = locations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocationQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline mb-4 text-foreground drop-shadow-sm">
            وظيفتك في يديك
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            منصتك الأولى للفرص الحرفية والمهنية في صنعاء.
          </p>
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
            <form className="w-full grid grid-cols-1 md:grid-cols-4 items-center gap-2 bg-card p-2 rounded-xl border shadow-sm">
                <div className="relative md:col-span-3">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="ابحث عن حرفة, مهارة, أو وظيفة..."
                        className="w-full pr-10 pl-3 py-3 h-12 text-base rounded-lg border-none focus-visible:ring-offset-0 focus-visible:ring-1 bg-transparent"
                    />
                </div>
                <Button type="submit" size="lg" className="md:col-span-1 h-12 rounded-lg transition-transform transform hover:scale-105 w-full">
                    <span>بحث</span>
                </Button>
            </form>
             <form className="w-full grid grid-cols-1 md:grid-cols-4 items-center gap-2 bg-card p-2 rounded-xl border shadow-sm">
                <div className="relative md:col-span-3">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="ابحث حسب المنطقة أو الحي..."
                        className="w-full pr-10 pl-3 py-3 h-12 text-base rounded-lg border-none focus-visible:ring-offset-0 focus-visible:ring-1 bg-transparent"
                        value={locationQuery}
                        onChange={handleLocationChange}
                        onFocus={() => { if(locationQuery) setSuggestions(locations.filter(loc => loc.toLowerCase().includes(locationQuery.toLowerCase())))}}
                        onBlur={() => setTimeout(() => setSuggestions([]), 100)}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-card border shadow-lg rounded-md mt-2 z-10 text-right">
                        <ul className="py-2">
                          {suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className="px-4 py-2 hover:bg-accent cursor-pointer"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
                <Button type="submit" size="lg" className="md:col-span-1 h-12 rounded-lg transition-transform transform hover:scale-105 w-full" variant="secondary">
                    <span>بحث بالموقع</span>
                </Button>
            </form>
            <div className="mt-8">
                 <Image
                    src="https://placehold.co/150x150.png"
                    alt="أدوات حرفية"
                    width={150}
                    height={150}
                    className="rounded-full mx-auto shadow-lg"
                    data-ai-hint="craftsmanship tools"
                />
            </div>
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
          <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link href="/jobs" key={category.name}
                className="group flex flex-col items-center justify-center text-center gap-4 p-6 bg-card rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                <div className="h-20 w-20 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
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
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild className="transition-transform transform hover:scale-105">
              <Link href="/jobs">عرض كل الوظائف</Link>
            </Button>
          </div>
        </div>
      </section>
      
        {/* Why Us Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 font-headline">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-muted-foreground md:text-lg mb-12">
                نحن نركز على تمكين الحرفيين وربطهم بأفضل الفرص المتاحة.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border shadow-sm">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
