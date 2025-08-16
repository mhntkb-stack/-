'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  isPublic?: boolean;
}

interface CraftsmanCardProps {
  user: UserProfile;
}

export default function CraftsmanCard({ user }: CraftsmanCardProps) {
  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');

  return (
    <Card className="flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src="https://placehold.co/100x100.png" alt={user.displayName} data-ai-hint="user avatar" />
          <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-headline">{user.displayName}</CardTitle>
          <CardDescription>حرفي موثوق</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {user.bio || 'هذا الحرفي لم يضف نبذة تعريفية بعد.'}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/profile/${user.uid}`}>
            عرض الملف الشخصي <ArrowLeft className="mr-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
