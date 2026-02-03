'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DailyLogClient from '@/app/dashboard/log/[date]/DailyLogClient';
import AdminGuard from '@/components/AdminGuard';

export default function AdminDailyLogPage() {
    const params = useParams();
    const uid = params.uid as string;

    return (
        <AdminGuard>
            {/* Supply the targetUserId prop so the component fetches this user's data */}
            <DailyLogClient targetUserId={uid} />
        </AdminGuard>
    );
}
