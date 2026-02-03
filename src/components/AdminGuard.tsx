'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAILS = ['maki.katsume.0503@gmail.com'];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
                setAuthorized(true);
            } else {
                router.push('/dashboard'); // Redirect non-admins to dashboard
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (!authorized) {
        return <div className="p-8 text-center">Checking permissions...</div>;
    }

    return <>{children}</>;
}
