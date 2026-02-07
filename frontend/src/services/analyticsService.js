import api from './api';

export const analyticsService = {
    // Get dashboard data
    async getDashboard(assessmentId) {
        const response = await api.get(`/analytics/dashboard/${assessmentId}`);
        return response.data;
    },

    // Get skill comparison
    async getSkillComparison(assessmentId) {
        const response = await api.get(`/analytics/skill-comparison/${assessmentId}`);
        return response.data;
    },

    // Get progress timeline
    async getProgressTimeline() {
        const response = await api.get('/analytics/progress-timeline');
        return response.data;
    },

    // Export results
    async exportResults(assessmentId, format = 'json') {
        const response = await api.get(`/analytics/export/${assessmentId}`, {
            params: { format }
        });
        return response.data;
    },
};
