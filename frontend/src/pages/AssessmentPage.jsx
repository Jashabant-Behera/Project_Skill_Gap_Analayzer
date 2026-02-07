import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import { QuestionCard } from '../components/assessment/QuestionCard';
import { EvaluationFeedback } from '../components/assessment/EvaluationFeedback';
import { ProgressBar } from '../components/assessment/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AssessmentPage = () => {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const { getNextQuestion, submitAnswer, updateProgress, completeAssessment } = useAssessment();

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEvaluation, setShowEvaluation] = useState(false);

    useEffect(() => {
        loadQuestion();
        loadProgress();
    }, [assessmentId]);

    const loadQuestion = async () => {
        try {
            setLoading(true);
            const question = await getNextQuestion(assessmentId);
            setCurrentQuestion(question);
            setShowEvaluation(false);
        } catch (error) {
            if (error.response?.status === 400) {
                // All questions completed
                handleComplete();
            } else {
                toast.error('Failed to load question');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadProgress = async () => {
        try {
            const progressData = await updateProgress(assessmentId);
            setProgress(progressData);
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
    };

    const handleSubmitAnswer = async (answerData) => {
        try {
            const evaluationResult = await submitAnswer(assessmentId, answerData);
            setEvaluation(evaluationResult);
            setShowEvaluation(true);
            await loadProgress();
        } catch (error) {
            toast.error('Failed to submit answer');
        }
    };

    const handleNextQuestion = async () => {
        await loadQuestion();
    };

    const handleComplete = async () => {
        try {
            await completeAssessment(assessmentId);
            navigate(`/results/${assessmentId}`);
        } catch (error) {
            toast.error('Failed to complete assessment');
        }
    };

    if (loading && !currentQuestion) {
        return <LoadingSpinner text="Loading assessment..." />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress */}
            {progress && (
                <ProgressBar
                    current={progress.answered_questions}
                    total={progress.total_questions}
                    score={progress.overall_score}
                />
            )}

            {/* Question or Evaluation */}
            {showEvaluation ? (
                <EvaluationFeedback
                    evaluation={evaluation}
                    onNext={handleNextQuestion}
                />
            ) : (
                currentQuestion && (
                    <QuestionCard
                        question={currentQuestion}
                        onSubmit={handleSubmitAnswer}
                        loading={loading}
                    />
                )
            )}
        </div>
    );
};
