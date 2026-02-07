import api from './api';

export const roadmapService = {
    // Generate roadmap
    async generateRoadmap(data) {
        const response = await api.post('/roadmaps', data);
        return response.data;
    },

    // Get roadmap
    async getRoadmap(roadmapId) {
        const response = await api.get(`/roadmaps/${roadmapId}`);
        return response.data;
    },

    // Get roadmap by assessment
    async getRoadmapByAssessment(assessmentId) {
        const response = await api.get(`/roadmaps/by-assessment/${assessmentId}`);
        return response.data;
    },

    // Get specific week
    async getWeek(roadmapId, weekNumber) {
        const response = await api.get(`/roadmaps/${roadmapId}/week/${weekNumber}`);
        return response.data;
    },
};
