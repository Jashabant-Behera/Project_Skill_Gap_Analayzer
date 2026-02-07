import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

export const SkillRadarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No skill data available
            </div>
        );
    }

    // Transform data for radar chart
    const chartData = data.map((item) => ({
        skill: item.skill.length > 15 ? item.skill.substring(0, 15) + '...' : item.skill,
        Current: item.current,
        Required: item.required,
        fullSkillName: item.skill,
    }));

    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 3]} />
                    <Radar
                        name="Current Level"
                        dataKey="Current"
                        stroke="#0ea5e9"
                        fill="#0ea5e9"
                        fillOpacity={0.5}
                    />
                    <Radar
                        name="Required Level"
                        dataKey="Required"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const levelMap = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };
                                return (
                                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                        <p className="font-semibold text-gray-900 mb-2">
                                            {payload[0].payload.fullSkillName}
                                        </p>
                                        {payload.map((entry, index) => (
                                            <p key={index} style={{ color: entry.color }} className="text-sm">
                                                {entry.name}: {levelMap[entry.value]}
                                            </p>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            <div className="mt-4 text-sm text-gray-600 text-center">
                <p>1 = Beginner | 2 = Intermediate | 3 = Advanced</p>
            </div>
        </div>
    );
};
