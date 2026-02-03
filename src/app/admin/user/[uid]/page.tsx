'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Calendar } from '@/components/Calendar/Calendar';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';

export default function AdminUserDetail() {
    const params = useParams();
    const uid = params.uid as string; // Extract UID from URL
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!uid) return;
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserProfile(docSnap.data());
            }
        };
        fetchUser();
    }, [uid]);

    const handleSelectDate = (date: string) => {
        router.push(`/admin/user/${uid}/log/${date}`);
    };

    return (
        <AdminGuard>
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div className="mb-6">
                    <Link href="/admin" className="text-gray-500 hover:underline mb-2 block">
                        &larr; ユーザー一覧に戻る
                    </Link>
                    <h1 className="text-2xl font-bold">
                        {userProfile ? `${userProfile.name} さんの記録` : 'ユーザー記録'}
                    </h1>
                    {userProfile && <p className="text-gray-500">{userProfile.email}</p>}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <p className="mb-4" style={{ color: 'var(--text-light)' }}>
                        確認したい日付を選択してください。
                    </p>
                    <Calendar onSelectDate={handleSelectDate} />
                </div>
            </div>
        </AdminGuard>
    );
}
