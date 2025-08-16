'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { User, Settings, LifeBuoy, LogOut, Bell, CheckCheck } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, update } from "firebase/database";
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Notification {
    id: string;
    message: string;
    link: string;
    read: boolean;
    createdAt: number;
}

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getDatabase(app);
  const user = auth.currentUser;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserName(user.displayName || 'مستخدم');
        setUserEmail(user.email || '');
        setUserInitial(user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U'));
      }
    });

    const notificationsRef = ref(db, `notifications/${user.uid}`);
    const unsubscribeNotifications = onValue(notificationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const notificationsList: Notification[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).sort((a,b) => b.createdAt - a.createdAt);
            setNotifications(notificationsList);
            setHasUnread(notificationsList.some(n => !n.read));
        } else {
            setNotifications([]);
            setHasUnread(false);
        }
    });

    return () => {
        unsubscribe();
        unsubscribeNotifications();
    };
  }, [user, db, auth]);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "حدث خطأ أثناء تسجيل الخروج",
      });
    }
  };

  const handleMarkAsRead = () => {
    if (!user || !hasUnread) return;
    const updates: { [key: string]: boolean } = {};
    notifications.forEach(n => {
        if (!n.read) {
            updates[`/notifications/${user.uid}/${n.id}/read`] = true;
        }
    });
    if (Object.keys(updates).length > 0) {
        update(ref(db), updates);
    }
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/36x36.png`} alt="@user" data-ai-hint="user avatar" />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
             <Link href="/account">
                <User className="ml-2 h-4 w-4" />
                <span>حسابي</span>
             </Link>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger onFocus={handleMarkAsRead}>
              <Bell className="ml-2 h-4 w-4" />
              <span>الإشعارات</span>
              {hasUnread && <span className="w-2 h-2 rounded-full bg-destructive mr-auto animate-pulse"></span>}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='w-80 max-h-96 overflow-y-auto'>
                <DropdownMenuLabel>آخر الإشعارات</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {notifications.length > 0 ? (
                    notifications.map(n => (
                         <DropdownMenuItem key={n.id} asChild className="text-wrap h-auto cursor-pointer">
                            <Link href={n.link}>
                                <div className="flex flex-col gap-1">
                                    <p className={`text-sm ${!n.read ? 'font-bold' : ''}`}>{n.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ar })}
                                    </p>
                                </div>
                            </Link>
                         </DropdownMenuItem>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-muted-foreground">لا توجد إشعارات بعد.</p>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuItem asChild>
             <Link href="/settings">
                <Settings className="ml-2 h-4 w-4" />
                <span>الإعدادات</span>
             </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="ml-2 h-4 w-4" />
            <span>الدعم</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
