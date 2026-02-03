'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update display name
            await updateProfile(user, {
                displayName: name
            });

            // Create user document in Firestore
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    createdAt: new Date()
                });
            } catch (dbError) {
                console.error("Firestore error:", dbError);
                // Non-blocking error for now, purely auth can still work
            }

            router.push('/dashboard');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('このメールアドレスは既に使用されています。');
            } else if (err.code === 'auth/weak-password') {
                setError('パスワードは6文字以上で設定してください。');
            } else {
                setError('登録中にエラーが発生しました。もう一度お試しください。');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'linear-gradient(to bottom, var(--background), #E8F5E9)' // Slight green tint for signup
        }}>
            <Card className="w-full max-w-md p-8">
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontSize: '1.75rem',
                    color: 'var(--secondary)'
                }}>
                    新規登録
                </h1>

                <form onSubmit={handleSignup}>
                    <Input
                        label="お名前（ニックネーム可）"
                        type="text"
                        placeholder="健康 花子"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ marginBottom: '1.5rem' }}
                    />

                    <Input
                        label="メールアドレス"
                        type="email"
                        placeholder="example@health-beauty.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginBottom: '1.5rem' }}
                    />

                    <Input
                        label="パスワード"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{ marginBottom: '2rem' }}
                    />

                    {error && (
                        <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        style={{ width: '100%', marginBottom: '1.5rem', background: 'var(--secondary)' }}
                        isLoading={loading}
                    >
                        登録して始める
                    </Button>

                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        すでにアカウントをお持ちの方は<br />
                        <Link href="/login" style={{ color: 'var(--secondary)', textDecoration: 'underline' }}>
                            ログインはこちら
                        </Link>
                    </div>
                </form>
            </Card>
        </main>
    );
}
