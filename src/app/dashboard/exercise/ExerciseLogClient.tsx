'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function ExerciseLogPage() {
    const [exerciseType, setExerciseType] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'users', auth.currentUser.uid, 'exercises'), {
                exerciseType,
                duration: Number(duration),
                createdAt: serverTimestamp(),
            });
            router.push('/dashboard');
        } catch (error) {
            console.error("Error adding exercise: ", error);
            alert('保存に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <Link href="/dashboard" style={{ marginBottom: '1rem', display: 'inline-block', color: 'var(--text-light)' }}>
                ← ダッシュボードに戻る
            </Link>
            <Card className="p-6">
                <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>運動の記録</h1>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="運動の種類 (例: ウォーキング、ヨガ)"
                        value={exerciseType}
                        onChange={(e) => setExerciseType(e.target.value)}
                        required
                        style={{ marginBottom: '1.5rem' }}
                    />
                    <Input
                        label="時間 (分)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        min="1"
                        style={{ marginBottom: '2rem' }}
                    />

                    <Button type="submit" isLoading={loading} className="w-full">
                        記録する
                    </Button>
                </form>
            </Card>
        </main>
    );
}
