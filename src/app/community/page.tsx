'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, onValue, push, serverTimestamp, set, runTransaction } from 'firebase/database';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { CommunityPostCard } from '@/components/community-post-card';
import { Post } from '@/lib/types';


export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = getAuth(app);
  const db = getDatabase(app);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const postsRef = ref(db, 'community_posts');
    const unsubscribePosts = onValue(postsRef, (snapshot) => {
      const postsData = snapshot.val();
      if (postsData) {
        const postsList: Post[] = Object.keys(postsData)
          .map((key) => ({
            id: key,
            ...postsData[key],
            likes: postsData[key].likes || {},
            comments: postsData[key].comments || {},
          }))
          .sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
        setPosts(postsList);
      } else {
        setPosts([]);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, [auth, db]);

  const handlePostSubmit = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يجب عليك تسجيل الدخول أولاً لتتمكن من النشر.',
      });
      return;
    }

    if (newPostContent.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يجب أن تحتوي المشاركة على 10 أحرف على الأقل.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const postsRef = ref(db, 'community_posts');
      const newPostRef = push(postsRef);
      await set(newPostRef, {
        content: newPostContent,
        authorId: user.uid,
        authorName: user.displayName || 'مستخدم مجهول',
        authorEmail: user.email,
        createdAt: serverTimestamp(),
        likes: {},
        comments: {},
      });
      setNewPostContent('');
      toast({
        title: 'نجاح',
        description: 'تم نشر مشاركتك بنجاح!',
      });
    } catch (error) {
      console.error('Error posting to community:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'فشل نشر المشاركة. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
    const handleLike = (postId: string) => {
    if (!user) return;
    const postRef = ref(db, `community_posts/${postId}/likes/${user.uid}`);
    runTransaction(postRef, (currentData) => {
      return currentData ? null : true;
    });
  };

  const handleComment = (postId: string, commentText: string) => {
    if (!user || !commentText.trim()) return;
    const commentsRef = ref(db, `community_posts/${postId}/comments`);
    const newCommentRef = push(commentsRef);
    set(newCommentRef, {
      text: commentText,
      authorId: user.uid,
      authorName: user.displayName || 'مستخدم مجهول',
      createdAt: serverTimestamp(),
    });
  };


  if (loading) {
    return <div className="container py-12 text-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto">
        <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline mb-4">مجتمع الحرفيين</h1>
        <p className="text-lg text-muted-foreground">
          مكان للنقاش، تبادل الخبرات، وطرح الأسئلة بين الحرفيين وأصحاب العمل.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-12">
        {user ? (
          <Card>
            <CardHeader>
              <CardTitle>أضف مشاركة جديدة</CardTitle>
              <CardDescription>شارك فكرة، اطرح سؤالاً، أو ساعد الآخرين بخبرتك.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="اكتب شيئًا هنا..."
                className="min-h-[100px]"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={handlePostSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'جارٍ النشر...' : <><Send className="ml-2 h-4 w-4" /> نشر المشاركة</>}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="text-center p-8">
            <CardTitle>انضم إلى النقاش!</CardTitle>
            <CardDescription className="mt-2 mb-4">
              يجب عليك تسجيل الدخول أو إنشاء حساب جديد لتتمكن من المشاركة في المجتمع.
            </CardDescription>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">إنشاء حساب</Link>
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold font-headline text-center">آخر المشاركات</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <CommunityPostCard 
                key={post.id} 
                post={post} 
                currentUser={user} 
                onLike={handleLike} 
                onComment={handleComment} 
                />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              لا توجد مشاركات في المجتمع حتى الآن. كن أول من يشارك!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
