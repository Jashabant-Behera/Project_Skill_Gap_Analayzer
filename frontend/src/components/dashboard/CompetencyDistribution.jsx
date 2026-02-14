import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const CompetencyDistribution = ({ data }) => {
    if (!data) return null;

    const chartData = [
        { level: 'Beginner', count: data.beginner || 0 },
        { level: 'Intermediate', count: data.intermediate || 0 },
        { level: 'Advanced', count: data.advanced || 0 },
    ];

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="level"
                        stroke="#666"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        tickLine={{ stroke: '#333' }}
                    />
                    <YAxis
                        stroke="#666"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        tickLine={{ stroke: '#333' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(23, 23, 23, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <Legend wrapperStyle={{ color: '#9ca3af' }} />
                    <Bar
                        dataKey="count"
                        fill="#0ea5e9"
                        name="Number of Skills"
                        radius={[4, 4, 0, 0]}
                        barSize={60}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
