'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { app } from '@/lib/firebase';
import CraftsmanCard from '@/components/craftsman-card';
import { Frown, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfile } from '@/lib/types';


export default function CraftsmenPage() {
  const [craftsmen, setCraftsmen] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase(app);
    const usersRef = query(ref(db, 'users'), orderByChild('isPublic'), equalTo(true));

    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const publicCraftsmen: UserProfile[] = Object.keys(usersData).map(key => ({
          uid: key,
          ...usersData[key]
        }));
        setCraftsmen(publicCraftsmen);
      } else {
        setCraftsmen([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline mb-4">تصفح الحرفيين</h1>
        <p className="text-lg text-muted-foreground">
          اكتشف أفضل المواهب الحرفية في صنعاء. تواصل معهم مباشرة لمشاريعك القادمة.
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 p-6 border rounded-lg">
                <div className="flex items-center space-x-4 space-x-reverse">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-grow">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : craftsmen.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {craftsmen.map((craftsman) => (
            <CraftsmanCard key={craftsman.uid} user={craftsman} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <Frown className="mx-auto h-16 w-16 mb-4" />
          <h2 className="text-2xl font-semibold text-foreground">لا يوجد حرفيون لعرضهم</h2>
          <p className="mt-2">
            لا يوجد حاليًا أي حرفي قام بجعل ملفه الشخصي عامًا.
          </p>
        </div>
      )}
    </div>
  );
}
