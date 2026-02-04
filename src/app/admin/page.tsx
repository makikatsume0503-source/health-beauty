'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { Card } from '@/components/ui/Card';
import AdminGuard from '@/components/AdminGuard';

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchUsers();
    }, []);

    const deleteUser = async (userId: string) => {
        if (!confirm('本当にこのユーザーを削除しますか？\n(この操作は取り消せません)')) return;

        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(users.filter(u => u.id !== userId));
            alert('ユーザーを削除しました');
        } catch (e) {
            console.error(e);
            alert('削除に失敗しました');
        }
    };

    return (
        <AdminGuard>
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="text-2xl font-bold mb-6">管理者ダッシュボード</h1>

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="grid gap-4">
                        {users.map((user) => {
                            // Alert Logic
                            const lastCond = user.lastCondition;
                            const isBadCondition = lastCond && (Number(lastCond.physical) <= 2 || Number(lastCond.mental) <= 2);

                            return (
                                <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center">
                                        <Link href={`/admin/user/${user.id}`} className="block flex-grow">
                                            <div className="flex items-center">
                                                <div className="mr-4">
                                                    <h3 className="font-bold text-lg flex items-center">
                                                        {user.name || 'No Name'}
                                                        {isBadCondition && (
                                                            <span className="ml-2 text-red-500 flex items-center text-sm bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                                                <span className="mr-1">⚠️</span>
                                                                体調注意
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
                                        <div className="flex items-center gap-3">
                                            <Link href={`/admin/user/${user.id}`} className="text-blue-500 text-sm">
                                                詳細
                                            </Link>
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
