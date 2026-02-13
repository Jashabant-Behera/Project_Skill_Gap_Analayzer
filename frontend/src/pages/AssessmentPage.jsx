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
                // toast.error('Failed to load question');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadProgress = async () => {
        try {
            const progressData = await updateProgress(assessmentId);
            setProgress(progressData);
            return progressData;
        } catch (error) {
            console.error('Failed to load progress:', error);
            return null;
        }
    };

    const handleSubmitAnswer = async (answerData) => {
        try {
            await submitAnswer(assessmentId, answerData);
            // No longer show individual feedback
            // setEvaluation(evaluationResult);
            // setShowEvaluation(true);

            const progressData = await loadProgress();
            // setProgress(progressData); // This line is now redundant as loadProgress already sets it

            if (progressData && progressData.answered_questions >= progressData.total_questions) {
                await handleComplete();
            } else {
                await loadQuestion();
            }
        } catch (error) {
            // toast.error('Failed to submit answer');
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
            // toast.error('Failed to complete assessment');
        }
    };

    if (loading && !currentQuestion) {
        return <LoadingSpinner text="Loading assessment..." />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
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
                    isLastQuestion={progress && progress.answered_questions >= progress.total_questions}
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
