import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase } from 'lucide-react';
import { Button } from './ui/button';

type JobCardProps = {
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  dataAiHint?: string;
};

export default function JobCard({ title, company, location, type, logo, dataAiHint }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300 flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start gap-6">
          <Image
            src={logo}
            alt={`${company} logo`}
            width={64}
            height={64}
            className="rounded-lg border p-1"
            data-ai-hint={dataAiHint}
          />
          <div className="flex-grow">
            <CardTitle className="text-xl font-bold mb-1 font-headline">{title}</CardTitle>
            <CardDescription className="text-md mb-3">{company}</CardDescription>
            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>{type}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0 flex items-center justify-end">
          <Button>التقديم الآن</Button>
      </div>
    </Card>
  );
}
