'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import AdminGuard from '@/components/AdminGuard';

// firebaseConfig requires hardcoding again for the secondary app or importing it.
// We'll define it here to create a secondary app instance.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "health-beauty-83533.firebaseapp.com",
    projectId: "health-beauty-83533",
    storageBucket: "health-beauty-83533.firebasestorage.app",
    messagingSenderId: "215832110477",
    appId: "1:215832110477:web:ea1808086541f778e7c9c4",
};

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 新規ユーザー作成用ステート
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (userId: string) => {
        if (!confirm('本当にこのユーザーを完全に削除しますか？\n(この操作は取り消せません)')) return;

        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(users.filter(u => u.id !== userId));
            alert('ユーザーを削除しました');
        } catch (e) {
            console.error(e);
            alert('削除に失敗しました');
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        if (!confirm(`このユーザーを${newStatus ? '利用再開' : '利用停止'}にしますか？`)) return;

        try {
            await updateDoc(doc(db, 'users', userId), {
                isActive: newStatus
            });
            setUsers(users.map(u => u.id === userId ? { ...u, isActive: newStatus } : u));
        } catch (e) {
            console.error(e);
            alert('ステータスの更新に失敗しました');
        }
    };

    const markAsChecked = async (userId: string) => {
        try {
            await updateDoc(doc(db, 'users', userId), {
                hasUnreadUpdate: false
            });
            setUsers(users.map(u => u.id === userId ? { ...u, hasUnreadUpdate: false } : u));
        } catch (e) {
            console.error(e);
            alert('ステータスの更新に失敗しました');
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setCreateError('');

        try {
            // 現在の管理者ログイン状態を維持するため、セカンダリのFirebase Appインスタンスを作成
            const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
            const secondaryAuth = getAuth(secondaryApp);

            // Authenticationにユーザーを作成
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newEmail, newPassword);
            const user = userCredential.user;

            // Firestoreにユーザー情報を保存
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: newName || '名無しさん',
                email: newEmail,
                createdAt: new Date(),
                isActive: true // デフォルトで有効
            });

            // セカンダリAppのログアウト（クリーンアップ）
            await secondaryAuth.signOut();

            // フォームのリセットと一覧の更新
            setNewEmail('');
            setNewPassword('');
            setNewName('');
            alert('新規ユーザーを作成しました');
            fetchUsers();
        } catch (err: any) {
            console.error(err);
            setCreateError(`ユーザー作成エラー: ${err.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <AdminGuard>
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="text-2xl font-bold mb-6">管理者ダッシュボード</h1>

                {/* ユーザー作成フォーム */}
                <Card className="p-6 mb-8 bg-gray-50 border border-gray-200">
                    <h2 className="text-lg font-bold mb-4">新規ユーザー発行</h2>
                    <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">お名前</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="例: 山田 花子"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">メールアドレス (ID)</label>
                                <input 
                                    type="email" 
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm mb-1">パスワード (6文字以上)</label>
                                <input 
                                    type="text" 
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="パスワード"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        {createError && <p className="text-red-500 text-sm">{createError}</p>}
                        <Button type="submit" isLoading={isCreating} className="w-fit">
                            ユーザーを作成する
                        </Button>
                    </form>
                </Card>

                <h2 className="text-xl font-bold mb-4">登録ユーザー一覧</h2>

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="grid gap-4">
                        {users.map((user) => {
                            // Alert Logic
                            const lastCond = user.lastCondition;
                            const isBadCondition = lastCond && (Number(lastCond.physical) <= 2 || Number(lastCond.mental) <= 2);
                            const isActive = user.isActive !== false; // undefined/nullはtrue扱い

                            return (
                                <Card key={user.id} className={`p-4 transition-shadow ${!isActive ? 'opacity-60 bg-gray-100' : 'hover:shadow-md'}`}>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        <Link href={`/admin/user/${user.id}`} className="block flex-grow">
                                            <div className="flex items-center">
                                                <div className="mr-4">
                                                    <h3 className="font-bold text-lg flex items-center flex-wrap gap-2">
                                                        {user.name || 'No Name'}
                                                        {!isActive && (
                                                            <span className="text-gray-500 text-sm bg-gray-200 px-2 py-1 rounded-full">
                                                                利用停止中
                                                            </span>
                                                        )}
                                                        {isBadCondition && isActive && (
                                                            <span className="text-red-500 flex items-center text-sm bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                                                <span className="mr-1">⚠️</span>
                                                                体調注意
                                                            </span>
                                                        )}
                                                        {user.hasUnreadUpdate && isActive && (
                                                            <span className="text-blue-600 font-bold flex items-center text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-sm animate-pulse">
                                                                🌟 {lastCond?.date} 新着記録あり！
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                    {lastCond && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            最終記録: {lastCond.date} (体調:{lastCond.physical} / 気分:{lastCond.mental})
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {user.hasUnreadUpdate && (
                                                <button
                                                    onClick={() => markAsChecked(user.id)}
                                                    className="text-sm border px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 font-bold shadow-sm"
                                                >
                                                    ✓ 確認済みにする
                                                </button>
                                            )}
                                            <Link href={`/admin/user/${user.id}`} className="text-blue-500 text-sm border border-blue-200 px-3 py-1 rounded hover:bg-blue-50">
                                                詳細
                                            </Link>
                                            <button
                                                onClick={() => toggleUserStatus(user.id, isActive)}
                                                className={`text-sm border px-3 py-1 rounded ${isActive ? 'text-orange-500 border-orange-200 hover:bg-orange-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                                            >
                                                {isActive ? '停止' : '再開'}
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="text-red-400 hover:text-red-600 text-sm border border-red-200 px-3 py-1 rounded hover:bg-red-50"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}

                        {users.length === 0 && (
                            <p>ユーザーが見つかりませんでした。</p>
                        )}
                    </div>
                )}
            </div>
        </AdminGuard>
    );
}

