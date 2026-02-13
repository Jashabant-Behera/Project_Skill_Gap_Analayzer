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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';

export const SkillRadarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No skill data available
            </div>
        );
    }

    // Transform data for charts
    const chartData = data.map((item) => ({
        skill: item.skill.length > 15 ? item.skill.substring(0, 15) + '...' : item.skill,
        Current: item.current,
        Required: item.required,
        fullSkillName: item.skill,
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const levelMap = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 mb-2">
                        {payload[0].payload.fullSkillName}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {levelMap[entry.value] || entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Use BarChart for few data points, RadarChart for many
    const ChartComponent = data.length < 3 ? (
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" />
            <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar name="Current Level" dataKey="Current" fill="#0ea5e9" barSize={40} />
            <Bar name="Required Level" dataKey="Required" fill="#ef4444" barSize={40} />
        </BarChart>
    ) : (
        <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={90} domain={[0, 3]} tickCount={4} />
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
            <Tooltip content={<CustomTooltip />} />
        </RadarChart>
    );

    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                {ChartComponent}
            </ResponsiveContainer>

            <div className="mt-4 text-sm text-gray-600 text-center">
                <p>1 = Beginner | 2 = Intermediate | 3 = Advanced</p>
            </div>
        </div>
    );
};
