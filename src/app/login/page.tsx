'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithPopup(auth, googleProvider);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            // DEBUG: Show actual error to user
            setError(`Googleログイン失敗: ${err.message} (${err.code})`);
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
            background: 'linear-gradient(to bottom, var(--background), #E0F7FA)' // Light blue gradient
        }}>
            <Card className="w-full max-w-md p-8">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/running_woman.png" alt="Running Woman" style={{ width: '120px', height: 'auto', opacity: 0.8 }} />
                </div>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontSize: '1.75rem',
                    color: 'var(--primary-dark)'
                }}>
                    ログイン
                </h1>

                {error && (
                    <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Button
                        type="button"
                        className="w-full"
                        style={{
                            width: '100%',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: 'white',
                            color: '#333',
                            border: '1px solid #ccc'
                        }}
                        onClick={handleGoogleLogin}
                        isLoading={loading}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.637-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.159 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Googleでログイン
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
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    アカウントをお持ちでない方は<br />
                    <Link href="/signup" style={{ color: 'var(--primary-dark)', textDecoration: 'underline' }}>
                        新規登録はこちら
                    </Link>
                </div>
            </Card>
        </main>
    );
}
