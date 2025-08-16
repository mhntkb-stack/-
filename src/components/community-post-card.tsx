'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Post, Comment } from '@/lib/types';
import { User } from 'firebase/auth';

interface CommunityPostCardProps {
  post: Post;
  currentUser: User | null;
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
}

export function CommunityPostCard({ post, currentUser, onLike, onComment }: CommunityPostCardProps) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })
    : 'منذ وقت';

  const likeCount = Object.keys(post.likes || {}).length;
  const commentCount = Object.keys(post.comments || {}).length;
  const isLiked = currentUser && post.likes && post.likes[currentUser.uid];
  
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
        onComment(post.id, commentText);
        setCommentText('');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
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
      <CardFooter className="flex flex-col items-start gap-4">
         <div className="w-full flex justify-between items-center text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{likeCount} إعجاب</span>
            </div>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{commentCount} تعليق</span>
            </button>
        </div>
        <div className="w-full flex border-t pt-2 gap-2">
            <Button 
                variant={isLiked ? "default" : "outline"} 
                className="flex-1" 
                onClick={() => currentUser && onLike(post.id)}
                disabled={!currentUser}
            >
                <ThumbsUp className="ml-2 h-4 w-4" />
                {isLiked ? 'تم الإعجاب' : 'إعجاب'}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowComments(!showComments)}>
                <MessageSquare className="ml-2 h-4 w-4" />
                تعليق
            </Button>
        </div>
        {showComments && (
            <div className="w-full pt-4 space-y-4">
                 {commentCount > 0 ? (
                    Object.values(post.comments!).sort((a,b) => a.createdAt - b.createdAt).map((comment: Comment, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.authorName.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="bg-secondary p-3 rounded-lg w-full">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-sm">{comment.authorName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ar })}
                                    </p>
                                </div>
                                <p className="text-sm mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-center text-muted-foreground">لا توجد تعليقات. كن أول من يعلق!</p>
                )}

                {currentUser && (
                    <div className="flex items-start gap-3 pt-4 border-t">
                        <Avatar className="h-9 w-9">
                             <AvatarFallback>{currentUser.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="w-full flex gap-2">
                            <Textarea 
                                placeholder='اكتب تعليقاً...' 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="h-auto resize-none"
                                rows={1}
                            />
                            <Button size="icon" onClick={handleCommentSubmit} disabled={!commentText.trim()}>
                                <Send className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
