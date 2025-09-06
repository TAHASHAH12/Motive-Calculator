import { useMemo } from 'react';

export const useQACalculations = (newTags, collisionTags, otherTags) => {
  const calculations = useMemo(() => {
    const calculateNewTagsScore = () => {
      let validTags = 0;
      let totalAccuracy = 0;

      Object.entries(newTags).forEach(([tag, data]) => {
        if (data.qaCount > 0) {
          const accuracy = ((data.correctCount + data.qaError) * 100) / data.qaCount;
          totalAccuracy += accuracy;
          validTags++;
        }
      });

      if (validTags === 0) return 0;
      const averageAccuracy = totalAccuracy / validTags;
      return (averageAccuracy * 0.2);
    };

    const calculateCollisionScore = () => {
      const cpcData = collisionTags['C/PC'] || { qaCount: 0, correctCount: 0, qaError: 0 };
      const ncData = collisionTags['NC'] || { qaCount: 0, correctCount: 0, qaError: 0 };

      let cpcAccuracy = 0;
      let ncAccuracy = 0;

      if (cpcData.qaCount > 0) {
        cpcAccuracy = ((cpcData.correctCount + cpcData.qaError) * 100) / cpcData.qaCount;
      }

      if (ncData.qaCount > 0) {
        ncAccuracy = ((ncData.correctCount + ncData.qaError) * 100) / ncData.qaCount;
      }

      const cpcScore = (cpcAccuracy * 0.2);
      const ncScore = (ncAccuracy * 0.1);

      return cpcScore + ncScore;
    };

    const calculateOtherTagsScore = () => {
      let totalQACount = 0;
      let totalCorrectCount = 0;

      Object.entries(otherTags).forEach(([tag, data]) => {
        if (data.qaCount > 0) {
          totalQACount += data.qaCount;
          totalCorrectCount += data.correctCount;
        }
      });

      if (totalQACount === 0) return 0;
      const accuracy = (totalCorrectCount / totalQACount) * 100;
      return accuracy * 0.5;
    };

    // Analyze individual tag performance
    const analyzeTagPerformance = () => {
      const allTags = { ...newTags, ...collisionTags, ...otherTags };
      const tagAnalysis = [];

      Object.entries(allTags).forEach(([tag, data]) => {
        if (data.qaCount > 0) {
          const accuracy = ((data.correctCount + data.qaError) * 100) / data.qaCount;
          const errorRate = (data.qaCount - data.correctCount - data.qaError) / data.qaCount * 100;
          const performanceLevel = getPerformanceLevel(accuracy);
          
          tagAnalysis.push({
            tag,
            accuracy,
            errorRate,
            performanceLevel,
            qaCount: data.qaCount,
            correctCount: data.correctCount,
            qaError: data.qaError,
            needsImprovement: accuracy < 80,
            isLagging: accuracy < 70,
            isExcellent: accuracy >= 95
          });
        }
      });

      // Sort by performance (worst first for recommendations)
      return tagAnalysis.sort((a, b) => a.accuracy - b.accuracy);
    };

    const getPerformanceLevel = (accuracy) => {
      if (accuracy >= 95) return 'excellent';
      if (accuracy >= 85) return 'good';
      if (accuracy >= 70) return 'average';
      if (accuracy >= 60) return 'below-average';
      return 'poor';
    };

    // Generate intelligent insights
    const generateInsights = (tagAnalysis) => {
      const insights = [];
      const laggingTags = tagAnalysis.filter(tag => tag.isLagging);
      const needsImprovementTags = tagAnalysis.filter(tag => tag.needsImprovement && !tag.isLagging);
      const excellentTags = tagAnalysis.filter(tag => tag.isExcellent);

      // Critical performance issues
      if (laggingTags.length > 0) {
        const worstTag = laggingTags[0];
        insights.push({
          type: 'critical',
          title: `Critical: ${worstTag.tag} Performance`,
          message: `${worstTag.tag} has only ${worstTag.accuracy.toFixed(1)}% accuracy. This requires immediate attention.`,
          recommendation: `Review the ${worstTag.tag} documentation and focus on understanding the key criteria.`,
          tag: worstTag.tag,
          priority: 'high'
        });
      }

      // Tags needing improvement
      if (needsImprovementTags.length > 0) {
        needsImprovementTags.slice(0, 2).forEach(tag => {
          insights.push({
            type: 'warning',
            title: `Improve ${tag.tag} Performance`,
            message: `${tag.tag} accuracy is ${tag.accuracy.toFixed(1)}%. Target 85%+ for better results.`,
            recommendation: `Study common mistakes in ${tag.tag} evaluation and practice with examples.`,
            tag: tag.tag,
            priority: 'medium'
          });
        });
      }

      // Excellent performance recognition
      if (excellentTags.length > 0) {
        insights.push({
          type: 'success',
          title: 'Excellent Performance',
          message: `Great work on ${excellentTags.map(t => t.tag).join(', ')}! Keep maintaining these high standards.`,
          recommendation: 'Use your expertise in these areas to help improve performance in other tags.',
          priority: 'low'
        });
      }

      // Overall performance patterns
      const averageAccuracy = tagAnalysis.reduce((sum, tag) => sum + tag.accuracy, 0) / tagAnalysis.length;
      if (averageAccuracy < 75) {
        insights.push({
          type: 'info',
          title: 'Overall Performance Improvement Needed',
          message: `Your overall accuracy is ${averageAccuracy.toFixed(1)}%. Focus on systematic improvement.`,
          recommendation: 'Create a study plan focusing on your lowest-performing tags first.',
          priority: 'medium'
        });
      }

      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    };

    const newTagsScore = calculateNewTagsScore();
    const collisionScore = calculateCollisionScore();
    const otherTagsScore = calculateOtherTagsScore();
    const overallScore = newTagsScore + collisionScore + otherTagsScore;
    const tagAnalysis = analyzeTagPerformance();
    const insights = generateInsights(tagAnalysis);

    return {
      newTagsScore,
      collisionScore,
      otherTagsScore,
      overallScore,
      tagAnalysis,
      insights
    };
  }, [newTags, collisionTags, otherTags]);

  return calculations;
};

export const useSalaryCalculations = (employeeData) => {
  const calculations = useMemo(() => {
    const hourlyRate = employeeData.totalGrossSalary / (employeeData.workingDays * 8);
    const extraMileRate = hourlyRate * 2;
    const basicSalary = (employeeData.actualWorkingDays / employeeData.workingDays) * employeeData.totalGrossSalary;
    const extraMilePay = employeeData.extraMileHours * extraMileRate;
    
    const totalSalary = basicSalary + extraMilePay;
    const netSalary = totalSalary;

    return {
      hourlyRate,
      extraMileRate,
      basicSalary,
      extraMilePay,
      totalSalary,
      netSalary
    };
  }, [employeeData]);

  return calculations;
};
