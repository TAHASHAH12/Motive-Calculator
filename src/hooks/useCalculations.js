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

    // Enhanced tag performance analysis
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
            needsImprovement: accuracy < 85,
            isLagging: accuracy < 70,
            isExcellent: accuracy >= 95,
            isCritical: accuracy < 60,
            improvementPotential: Math.max(0, 95 - accuracy),
            category: getTagCategory(tag)
          });
        }
      });

      // Sort by performance (worst first for recommendations)
      return tagAnalysis.sort((a, b) => a.accuracy - b.accuracy);
    };

    const getTagCategory = (tag) => {
      if (Object.keys(newTags).includes(tag)) return 'newTags';
      if (Object.keys(collisionTags).includes(tag)) return 'collisionTags';
      if (Object.keys(otherTags).includes(tag)) return 'otherTags';
      return 'unknown';
    };

    const getPerformanceLevel = (accuracy) => {
      if (accuracy >= 95) return 'excellent';
      if (accuracy >= 85) return 'good';
      if (accuracy >= 70) return 'average';
      if (accuracy >= 60) return 'below-average';
      return 'poor';
    };

    // Enhanced insights generation
    const generateInsights = (tagAnalysis) => {
      const insights = [];
      const laggingTags = tagAnalysis.filter(tag => tag.isLagging);
      const criticalTags = tagAnalysis.filter(tag => tag.isCritical);
      const needsImprovementTags = tagAnalysis.filter(tag => tag.needsImprovement && !tag.isLagging);
      const excellentTags = tagAnalysis.filter(tag => tag.isExcellent);

      // Critical performance issues
      if (criticalTags.length > 0) {
        const worstTag = criticalTags[0];
        insights.push({
          type: 'critical',
          title: `Critical Alert: ${worstTag.tag} Performance`,
          message: `${worstTag.tag} accuracy is critically low at ${worstTag.accuracy.toFixed(1)}%. Immediate action required.`,
          recommendation: `Prioritize ${worstTag.tag} improvement immediately. Review all documentation and seek additional training.`,
          tag: worstTag.tag,
          priority: 'high',
          impact: 'severe',
          urgency: 'immediate'
        });
      }

      // Lagging performance
      if (laggingTags.length > 0 && criticalTags.length === 0) {
        const worstTag = laggingTags[0];
        insights.push({
          type: 'critical',
          title: `Performance Alert: ${worstTag.tag}`,
          message: `${worstTag.tag} accuracy is ${worstTag.accuracy.toFixed(1)}%. This is significantly impacting your overall score.`,
          recommendation: `Focus intensive study on ${worstTag.tag}. Review documentation and practice with examples.`,
          tag: worstTag.tag,
          priority: 'high',
          impact: 'high',
          urgency: 'high'
        });
      }

      // Tags needing improvement
      if (needsImprovementTags.length > 0) {
        needsImprovementTags.slice(0, 2).forEach(tag => {
          insights.push({
            type: 'warning',
            title: `Improve ${tag.tag} Performance`,
            message: `${tag.tag} is at ${tag.accuracy.toFixed(1)}% accuracy. Target is 85%+ for optimal performance.`,
            recommendation: `Review edge cases and challenging examples for ${tag.tag}. Focus on consistency.`,
            tag: tag.tag,
            priority: 'medium',
            impact: 'moderate',
            urgency: 'moderate'
          });
        });
      }

      // Excellent performance recognition
      if (excellentTags.length > 0) {
        insights.push({
          type: 'success',
          title: 'Exceptional Performance!',
          message: `Outstanding work on ${excellentTags.map(t => t.tag).join(', ')}! Consistently above 95% accuracy.`,
          recommendation: 'Maintain excellence and consider mentoring others in these areas.',
          priority: 'low',
          impact: 'positive',
          urgency: 'low'
        });
      }

      // Category-specific insights
      const categoryPerformance = {
        newTags: tagAnalysis.filter(t => t.category === 'newTags'),
        collisionTags: tagAnalysis.filter(t => t.category === 'collisionTags'),
        otherTags: tagAnalysis.filter(t => t.category === 'otherTags')
      };

      Object.entries(categoryPerformance).forEach(([category, tags]) => {
        if (tags.length > 0) {
          const avgAccuracy = tags.reduce((sum, tag) => sum + tag.accuracy, 0) / tags.length;
          const categoryName = category === 'newTags' ? 'New Tags' : 
                             category === 'collisionTags' ? 'Collision Tags' : 'Other Tags';
          
          if (avgAccuracy < 75) {
            insights.push({
              type: 'warning',
              title: `${categoryName} Category Needs Focus`,
              message: `Your average accuracy in ${categoryName} is ${avgAccuracy.toFixed(1)}%. This category needs attention.`,
              recommendation: `Dedicate extra study time to ${categoryName} documentation and examples.`,
              priority: 'medium',
              impact: 'category-wide',
              urgency: 'moderate'
            });
          }
        }
      });

      // Overall performance patterns
      const averageAccuracy = tagAnalysis.reduce((sum, tag) => sum + tag.accuracy, 0) / tagAnalysis.length;
      if (averageAccuracy > 0 && averageAccuracy < 75) {
        insights.push({
          type: 'info',
          title: 'Systematic Improvement Needed',
          message: `Overall accuracy is ${averageAccuracy.toFixed(1)}%. Consider a structured improvement plan.`,
          recommendation: 'Create a comprehensive study schedule covering all weak areas systematically.',
          priority: 'medium',
          impact: 'overall',
          urgency: 'moderate'
        });
      }

      // Diversity insights
      if (tagAnalysis.length < 5 && tagAnalysis.length > 0) {
        insights.push({
          type: 'info',
          title: 'Expand Your Evaluation Practice',
          message: `You've evaluated ${tagAnalysis.length} tag types. Broaden your experience with more diverse events.`,
          recommendation: 'Practice with different event types to build comprehensive evaluation skills.',
          priority: 'low',
          impact: 'skill-building',
          urgency: 'low'
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
      insights,
      performanceMetrics: {
        totalTagsEvaluated: tagAnalysis.length,
        averageAccuracy: tagAnalysis.length > 0 ? 
          tagAnalysis.reduce((sum, tag) => sum + tag.accuracy, 0) / tagAnalysis.length : 0,
        excellentTags: tagAnalysis.filter(t => t.isExcellent).length,
        criticalTags: tagAnalysis.filter(t => t.isCritical).length,
        improvementPotential: tagAnalysis.reduce((sum, tag) => sum + tag.improvementPotential, 0)
      }
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
