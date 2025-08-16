'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, Wallet } from 'lucide-react';
import Link from 'next/link';

type JobCardProps = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  dataAiHint?: string;
  isMinimal?: boolean;
};

export default function JobCard({ id, title, company, location, type, logo, dataAiHint, isMinimal = false }: JobCardProps) {
  const isSalary = type.includes('ريال يمني');

  if (isMinimal) {
    return (
        <Link href={`/jobs/${id}`} className="block hover:bg-accent p-3 rounded-lg -m-3 transition-colors">
            <div className="flex items-center gap-4">
                 <Image
                    src={logo}
                    alt={`${company} logo`}
                    width={40}
                    height={40}
                    className="rounded-lg border bg-white object-cover"
                    data-ai-hint={dataAiHint}
                />
                <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-sm text-muted-foreground">{location}</p>
                </div>
            </div>
        </Link>
    )
  }


  return (
    <Link href={`/jobs/${id}`} className="block group">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col bg-card rounded-2xl h-full">
        <CardContent className="p-6 flex-grow">
            <div className="flex items-start gap-6">
            <Image
                src={logo}
                alt={`${company} logo`}
                width={64}
                height={64}
                className="rounded-full border p-1 bg-white object-cover transition-transform duration-300 group-hover:scale-110"
                data-ai-hint={dataAiHint}
            />
            <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1 font-headline group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-md mb-3 text-muted-foreground">{company}</p>
                <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {isSalary ? <Wallet className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                    <span className={isSalary ? 'text-primary font-semibold' : ''}>{type}</span>
                </div>
                </div>
            </div>
            </div>
        </CardContent>
        <div className="p-6 pt-0 flex items-center justify-end">
            <span className="text-sm font-semibold text-primary group-hover:underline">عرض التفاصيل والتقديم</span>
        </div>
        </Card>
    </Link>
  );
}
