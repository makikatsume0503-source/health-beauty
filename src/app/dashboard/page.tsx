'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
// Card import removed
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/Calendar/Calendar';
import { collection, getDocs, query } from 'firebase/firestore';

export default function Dashboard() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filledDates, setFilledDates] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                // Fetch filled dates
                try {
                    const q = query(collection(db, 'users', user.uid, 'daily_logs'));
                    const snapshot = await getDocs(q);
                    const dates = snapshot.docs.map(doc => doc.id);
                    setFilledDates(dates);
                } catch (e) {
                    console.error("Error fetching logs:", e);
                }
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
                <Calendar onSelectDate={handleSelectDate} filledDates={filledDates} />
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Button variant="ghost" onClick={() => auth.signOut()}>
                    ログアウト
                </Button>
            </div>
        </div>
    )
}
