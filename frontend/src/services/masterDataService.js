import api from './api';

export const masterDataService = {
    // Get all roles
    async getRoles(params = {}) {
        const response = await api.get('/roles', { params });
        return response.data;
    },

    // Get role details
    async getRole(roleId) {
        const response = await api.get(`/roles/${roleId}`);
        return response.data;
    },

    // Get all skills
    async getSkills(params = {}) {
        const response = await api.get('/skills', { params });
        return response.data;
    },

    // Get skill details
    async getSkill(skillId) {
        const response = await api.get(`/skills/${skillId}`);
        return response.data;
    },

    // Search skills
    async searchSkills(query) {
        const response = await api.get('/skills', {
            params: { search: query, limit: 20 }
        });
        return response.data;
    },
};
