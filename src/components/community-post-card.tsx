'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  createdAt: number;
}

interface CommunityPostCardProps {
  post: Post;
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })
    : 'منذ وقت';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar>
          <AvatarFallback>
            {post.authorName ? post.authorName.charAt(0).toUpperCase() : '؟'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-lg">{post.authorName}</CardTitle>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  );
}
