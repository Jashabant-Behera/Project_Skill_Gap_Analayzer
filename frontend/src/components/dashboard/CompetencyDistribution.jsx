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
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0ea5e9" name="Number of Skills" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
