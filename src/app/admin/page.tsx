'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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

    return (
        <AdminGuard>
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="text-2xl font-bold mb-6">管理者ダッシュボード</h1>

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="grid gap-4">
                        {users.map((user) => (
                            <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                                <Link href={`/admin/user/${user.id}`} className="block">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg">{user.name || 'No Name'}</h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <span className="text-blue-500">詳細を見る &rarr;</span>
                                    </div>
                                </Link>
                            </Card>
                        ))}

                        {users.length === 0 && (
                            <p>ユーザーが見つかりませんでした。</p>
                        )}
                    </div>
                )}
            </div>
        </AdminGuard>
    );
}
