'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface CalendarProps {
    onSelectDate: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onSelectDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = ('0' + (date.getMonth() + 1)).slice(-2);
        const d = ('0' + date.getDate()).slice(-2);
        return `${y}-${m}-${d}`;
    };

    return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Button variant="ghost" onClick={handlePrevMonth} style={{ fontSize: '1.2rem' }}>&lt;</Button>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {year}年 {month + 1}月
                </h2>
                <Button variant="ghost" onClick={handleNextMonth} style={{ fontSize: '1.2rem' }}>&gt;</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: i === 0 ? 'var(--error)' : i === 6 ? '#4A90E2' : 'var(--text-light)' }}>
                        {d}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {days.map((date, index) => {
                    if (!date) return <div key={index} />;

                    const dateStr = formatDate(date);
                    const isToday = dateStr === formatDate(new Date());

                    return (
                        <button
                            key={index}
                            onClick={() => onSelectDate(dateStr)}
                            style={{
                                aspectRatio: '1/1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                border: 'none',
                                background: isToday ? 'var(--primary)' : 'transparent',
                                color: isToday ? 'white' : 'var(--text-main)',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                fontWeight: isToday ? 600 : 400,
                                fontSize: '0.9rem'
                            }}
                            className="hover:bg-pink-50"
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
