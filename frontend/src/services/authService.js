import api from './api';

export const authService = {
    // Register new user
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.tokens) {
            this.setTokens(response.data.tokens);
            this.setUser(response.data.user);
        }
        return response.data;
    },

    // Login user
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.tokens) {
            this.setTokens(response.data.tokens);
            this.setUser(response.data.user);
        }
        return response.data;
    },

    // Logout user
    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
        }
    },

    // Get current user
    async getCurrentUser() {
        const response = await api.get('/auth/me');
        this.setUser(response.data);
        return response.data;
    },

    // Update profile
    async updateProfile(data) {
        const response = await api.put('/users/profile', data);
        this.setUser(response.data);
        return response.data;
    },

    // Add user skill
    async addSkill(skillData) {
        const response = await api.post('/users/skills', skillData);
        return response.data;
    },

    // Get user skills
    async getUserSkills() {
        const response = await api.get('/users/skills');
        return response.data;
    },

    // Remove user skill
    async removeSkill(skillId) {
        const response = await api.delete(`/users/skills/${skillId}`);
        return response.data;
    },

    // Check profile completion
    async checkProfileCompletion() {
        const response = await api.get('/users/profile/complete');
        return response.data;
    },

    // Helper methods
    setTokens(tokens) {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
    },

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    clearAuth() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },
};
