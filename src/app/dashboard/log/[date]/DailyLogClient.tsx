'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import VoiceInputButton from '@/components/VoiceInputButton';

interface DailyLogProps {
    targetUserId?: string;
}

export default function DailyLogPage({ targetUserId }: DailyLogProps) {
    const params = useParams();
    const dateStr = params.date as string;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Form State
    const [meals, setMeals] = useState({ breakfast: '', lunch: '', dinner: '', snack: '' });
    const [exercise, setExercise] = useState({ content: '', duration: '' });
    const [condition, setCondition] = useState({ physical: '3', mental: '3', notes: '' });

    useEffect(() => {
        // Check Auth & Load Data
        const init = async () => {
            // Guest Preview Mode Support
            if (!auth.currentUser) {
                // Fake guest login if needed or redirect
            }

            const currentUserUid = auth.currentUser?.uid;
            // Use targetUserId if provided (for admin), otherwise use current user
            const effectiveUid = targetUserId || currentUserUid;

            setUserId(effectiveUid || 'guest');

            if (effectiveUid && effectiveUid !== 'guest') {
                try {
                    const docRef = doc(db, 'users', effectiveUid, 'daily_logs', dateStr);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.meals) setMeals(data.meals);
                        if (data.exercise) setExercise({ content: data.exercise.content, duration: String(data.exercise.duration) });
                        if (data.condition) setCondition(data.condition);
                    }
                } catch (e) {
                    console.error("Error loading doc:", e);
                }
            }
            setLoading(false);
        };
        init();
    }, [dateStr, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (userId && userId !== 'guest') {
                const docRef = doc(db, 'users', userId, 'daily_logs', dateStr);
                await setDoc(docRef, {
                    date: dateStr,
                    meals,
                    exercise: {
                        content: exercise.content,
                        duration: Number(exercise.duration) || 0
                    },
                    condition,
                    updatedAt: serverTimestamp()
                }, { merge: true });

                // Also update the user's top-level document with latest condition for Admin alerts
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, {
                    lastCondition: {
                        date: dateStr,
                        physical: condition.physical,
                        mental: condition.mental,
                        updatedAt: serverTimestamp()
                    }
                }, { merge: true });
            }
            alert('保存しました！');
            router.push('/dashboard');
        } catch (e) {
            console.error(e);
            alert('エラーが発生しました');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <main style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Link href="/dashboard" style={{ marginRight: '1rem', color: 'var(--text-light)', fontSize: '1.2rem' }}>
                    ←
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                    {dateStr.replace('-', '年 ').replace('-', '月 ')}日 の記録
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Meals Section */}
                <Card className="mb-6">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-dark)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                            <path d="M7 2v20" />
                            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                        </svg>
                        お食事
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-600">朝食</label>
                                <VoiceInputButton onTranscript={(text) => setMeals(prev => ({ ...prev, breakfast: prev.breakfast + (prev.breakfast ? ' ' : '') + text }))} />
                            </div>
                            <textarea
                                className="w-full p-3 border rounded-md"
                                rows={2}
                                value={meals.breakfast}
                                onChange={(e) => setMeals({ ...meals, breakfast: e.target.value })}
                                placeholder="例: トースト、コーヒー、ヨーグルト"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-600">昼食</label>
                                <VoiceInputButton onTranscript={(text) => setMeals(prev => ({ ...prev, lunch: prev.lunch + (prev.lunch ? ' ' : '') + text }))} />
                            </div>
                            <textarea
                                className="w-full p-3 border rounded-md"
                                rows={2}
                                value={meals.lunch}
                                onChange={(e) => setMeals({ ...meals, lunch: e.target.value })}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-600">夕食</label>
                                <VoiceInputButton onTranscript={(text) => setMeals(prev => ({ ...prev, dinner: prev.dinner + (prev.dinner ? ' ' : '') + text }))} />
                            </div>
                            <textarea
                                className="w-full p-3 border rounded-md"
                                rows={2}
                                value={meals.dinner}
                                onChange={(e) => setMeals({ ...meals, dinner: e.target.value })}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-600">間食</label>
                                <VoiceInputButton onTranscript={(text) => setMeals(prev => ({ ...prev, snack: prev.snack + (prev.snack ? ' ' : '') + text }))} />
                            </div>
                            <textarea
                                className="w-full p-3 border rounded-md"
                                rows={2}
                                value={meals.snack}
                                onChange={(e) => setMeals({ ...meals, snack: e.target.value })}
                            />
                        </div>
                    </div>
                </Card>

                {/* Exercise Section */}
                <Card className="mb-6">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--secondary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        運動
                    </h2>
                    <Input
                        label="運動の内容"
                        value={exercise.content}
                        onChange={(e) => setExercise({ ...exercise, content: e.target.value })}
                        placeholder="ウォーキング、ストレッチなど"
                        style={{ marginBottom: '1rem' }}
                    />
                    <div className="flex justify-end -mt-12 mb-4 mr-2 relative z-10">
                        <VoiceInputButton onTranscript={(text) => setExercise(prev => ({ ...prev, content: prev.content + (prev.content ? ' ' : '') + text }))} />
                    </div>
                    <Input
                        label="時間 (分)"
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => setExercise({ ...exercise, duration: e.target.value })}
                        style={{ marginBottom: '1rem' }}
                    />
                </Card>

                {/* Condition Section */}
                <Card className="mb-8">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#BCAAA4', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        体調・メンタル
                    </h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="block text-sm font-medium mb-2 text-gray-600">今日の体調 (1:悪い - 5:良い)</label>
                        <input
                            type="range"
                            min="1" max="5"
                            value={condition.physical}
                            onChange={(e) => setCondition({ ...condition, physical: e.target.value })}
                            style={{ width: '100%' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginTop: '4px' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                                    <div style={{ width: '1px', height: '6px', backgroundColor: '#9CA3AF', marginBottom: '2px' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6B7280' }}>{num}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginTop: '2px' }}>
                            {['悪い', '', '普通', '', '良い'].map((text, i) => (
                                <div key={i} style={{ width: '40px', textAlign: 'center', fontSize: '0.65rem', color: '#9CA3AF' }}>
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="block text-sm font-medium mb-2 text-gray-600">今日の気分 (1:落ち込む - 5:ハッピー)</label>
                        <input
                            type="range"
                            min="1" max="5"
                            value={condition.mental}
                            onChange={(e) => setCondition({ ...condition, mental: e.target.value })}
                            style={{ width: '100%' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginTop: '4px' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                                    <div style={{ width: '1px', height: '6px', backgroundColor: '#9CA3AF', marginBottom: '2px' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6B7280' }}>{num}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginTop: '2px' }}>
                            {['落ち込む', '', '普通', '', 'Happy!'].map((text, i) => (
                                <div key={i} style={{ width: '40px', textAlign: 'center', fontSize: '0.65rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-600">ひとことメモ</label>
                            <VoiceInputButton onTranscript={(text) => setCondition(prev => ({ ...prev, notes: prev.notes + (prev.notes ? ' ' : '') + text }))} />
                        </div>
                        <textarea
                            className="w-full p-3 border rounded-md"
                            rows={3}
                            value={condition.notes}
                            onChange={(e) => setCondition({ ...condition, notes: e.target.value })}
                            placeholder="気になったこと、頑張ったことなど"
                        />
                    </div>
                </Card>

                <Button type="submit" className="w-full py-4 text-lg shadow-lg" isLoading={saving}>
                    保存する
                </Button>
            </form>
        </main>
    );
}
