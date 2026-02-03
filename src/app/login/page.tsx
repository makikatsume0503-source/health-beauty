'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('メールアドレスまたはパスワードが正しくありません。');
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
            background: 'linear-gradient(to bottom, var(--background), #FCE4EC)'
        }}>
            <Card className="w-full max-w-md p-8">
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontSize: '1.75rem',
                    color: 'var(--primary-dark)'
                }}>
                    ログイン
                </h1>

                <form onSubmit={handleLogin}>
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
                        style={{ width: '100%', marginBottom: '1rem' }}
                        isLoading={loading}
                    >
                        ログインする
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        style={{ width: '100%', marginBottom: '1.5rem', color: 'var(--text-light)' }}
                        onClick={() => router.push('/dashboard')}
                    >
                        ゲストとして試す (Preview)
                    </Button>

                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        アカウントをお持ちでない方は<br />
                        <Link href="/signup" style={{ color: 'var(--primary-dark)', textDecoration: 'underline' }}>
                            新規登録はこちら
                        </Link>
                    </div>
                </form>
            </Card>
        </main>
    );
}
