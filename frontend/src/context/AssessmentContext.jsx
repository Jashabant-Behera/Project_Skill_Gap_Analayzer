import React, { createContext, useState, useCallback } from 'react';
import { assessmentService } from '../services/assessmentService';
import toast from 'react-hot-toast';

export const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
    const [currentAssessment, setCurrentAssessment] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);

    const startAssessment = useCallback(async (data) => {
        try {
            setLoading(true);
            const assessment = await assessmentService.createAssessment(data);
            setCurrentAssessment(assessment);
            toast.success('Assessment started!');
            return assessment;
        } catch (error) {
            console.error('Assessment start error:', error);
            const detail = error.response?.data?.detail;
            let message = 'Failed to start assessment';

            if (detail) {
                if (typeof detail === 'string') {
                    message = detail;
                } else if (detail.message) {
                    message = detail.message;
                    if (detail.missing_fields?.length) {
                        message += `: ${detail.missing_fields.join(', ')}`;
                    }
                }
            }

            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const getNextQuestion = useCallback(async (assessmentId) => {
        try {
            setLoading(true);
            const question = await assessmentService.getNextQuestion(assessmentId);
            setCurrentQuestion(question);
            return question;
        } catch (error) {
            if (error.response?.status === 400) {
                toast.info('All questions completed!');
            } else {
                // toast.error('Failed to load question');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const submitAnswer = useCallback(async (assessmentId, answerData) => {
        try {
            setLoading(true);
            const evaluation = await assessmentService.submitAnswer(assessmentId, answerData);
            return evaluation;
        } catch (error) {
            // toast.error('Failed to submit answer');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProgress = useCallback(async (assessmentId) => {
        try {
            const progressData = await assessmentService.getProgress(assessmentId);
            setProgress(progressData);
            return progressData;
        } catch (error) {
            console.error('Failed to update progress:', error);
        }
    }, []);

    const completeAssessment = useCallback(async (assessmentId) => {
        try {
            setLoading(true);
            const result = await assessmentService.completeAssessment(assessmentId);
            toast.success('Assessment completed!');
            return result;
        } catch (error) {
            // toast.error('Failed to complete assessment');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetAssessment = useCallback(() => {
        setCurrentAssessment(null);
        setCurrentQuestion(null);
        setProgress(null);
    }, []);

    const value = {
        currentAssessment,
        currentQuestion,
        progress,
        loading,
        startAssessment,
        getNextQuestion,
        submitAnswer,
        updateProgress,
        completeAssessment,
        resetAssessment,
    };

    return (
        <AssessmentContext.Provider value={value}>
            {children}
        </AssessmentContext.Provider>
    );
};
