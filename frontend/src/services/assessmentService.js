import api from './api';

export const assessmentService = {
    // Create new assessment
    async createAssessment(data) {
        const response = await api.post('/assessments', data);
        return response.data;
    },

    // Get next question
    async getNextQuestion(assessmentId) {
        const response = await api.get(`/assessments/${assessmentId}/questions/next`);
        return response.data;
    },

    // Submit answer
    async submitAnswer(assessmentId, answerData) {
        const response = await api.post(`/assessments/${assessmentId}/answers`, answerData);
        return response.data;
    },

    // Get assessment progress
    async getProgress(assessmentId) {
        const response = await api.get(`/assessments/${assessmentId}/progress`);
        return response.data;
    },

    // Complete assessment
    async completeAssessment(assessmentId) {
        const response = await api.post(`/assessments/${assessmentId}/complete`);
        return response.data;
    },

    // Get assessment results
    async getResults(assessmentId) {
        const response = await api.get(`/assessments/${assessmentId}/results`);
        return response.data;
    },

    // List assessments
    async listAssessments(params = {}) {
        const response = await api.get('/assessments', { params });
        return response.data;
    },
};
