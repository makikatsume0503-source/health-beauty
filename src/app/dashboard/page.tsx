'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/Calendar/Calendar';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                // Guest Preview
                setUser({ displayName: 'Guest (Preview)' });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSelectDate = (date: string) => {
        router.push(`/dashboard/log/${date}`);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!user) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>ダッシュボード</h1>
                <span style={{ color: 'var(--text-light)' }}>こんにちは、{user.displayName || 'ゲスト'}さん</span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <p className="mb-4" style={{ color: 'var(--text-light)' }}>
                    記録したい日付を選択してください。
                </p>
                <Calendar onSelectDate={handleSelectDate} />
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Button variant="ghost" onClick={() => auth.signOut()}>
                    ログアウト
                </Button>
            </div>
        </div>
    )
}
