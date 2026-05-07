'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
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
            await setPersistence(auth, browserLocalPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Check if user is active
            try {
                const userDocRef = doc(db, 'users', userCredential.user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists() && userDocSnap.data().isActive === false) {
                    await auth.signOut();
                    setError('このアカウントは現在利用停止されています。管理者にお問い合わせください。');
                    setLoading(false);
                    return;
                }
            } catch (firestoreError: any) {
                console.warn('Firestore user check failed:', firestoreError);
                if (firestoreError.code === 'permission-denied') {
                    // Firebaseのルール期限切れ等でアクセス拒否された場合は、ログイン自体は許可して進める
                    console.warn('Firestoreの権限エラーをスキップしてログインを継続します。');
                } else {
                    throw firestoreError;
                }
            }

            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            // エラーハンドリング
            if (err.code === 'auth/invalid-credential') {
                setError('メールアドレスまたはパスワードが正しくありません。');
            } else {
                setError(`ログイン失敗: ${err.message} (${err.code})`);
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
                    <div style={{ color: 'var(--error)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm mb-1 text-gray-700">メールアドレス (ID)</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="block text-sm mb-1 text-gray-700">パスワード</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        style={{ width: '100%' }}
                        isLoading={loading}
                    >
                        ログインする
                    </Button>
                </form>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-2">【開発用】テスト管理者アカウントを作成します</p>
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-xs"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const testEmail = 'admin@test.com';
                                    const testPass = 'password123';
                                    
                                    try {
                                        const cred = await createUserWithEmailAndPassword(auth, testEmail, testPass);
                                        await setDoc(doc(db, 'users', cred.user.uid), {
                                            uid: cred.user.uid,
                                            name: 'テスト管理者',
                                            email: testEmail,
                                            createdAt: new Date(),
                                            isActive: true
                                        });
                                        alert('テスト管理者アカウントを作成しました！\nこのままログインボタンを押してください。');
                                    } catch (e: any) {
                                        if (e.code === 'auth/email-already-in-use') {
                                            alert('すでにテストアカウントは作成されています。そのままログインできます。');
                                        } else {
                                            throw e;
                                        }
                                    }
                                    
                                    setEmail(testEmail);
                                    setPassword(testPass);
                                } catch (e: any) {
                                    alert('エラー: ' + e.message);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            テスト管理者(admin@test.com)を作成・セット
                        </Button>
                    </div>
                )}
            </Card>
        </main>
    );
}
