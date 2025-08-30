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

    const newTagsScore = calculateNewTagsScore();
    const collisionScore = calculateCollisionScore();
    const otherTagsScore = calculateOtherTagsScore();
    const overallScore = newTagsScore + collisionScore + otherTagsScore;

    return {
      newTagsScore,
      collisionScore,
      otherTagsScore,
      overallScore
    };
  }, [newTags, collisionTags, otherTags]);

  return calculations;
};

export const useSalaryCalculations = (employeeData) => {
  const calculations = useMemo(() => {
    const hourlyRate = employeeData.baseSalary / (employeeData.workingDays * 8);
    const extraMileRate = hourlyRate * 2;
    const basicSalary = (employeeData.actualWorkingDays / employeeData.workingDays) * employeeData.baseSalary;
    const extraMilePay = employeeData.extraMileHours * extraMileRate;
    
    let performanceBonus = 0;
    if (employeeData.qaScore >= 95) {
      performanceBonus = basicSalary * 0.1;
    } else if (employeeData.qaScore >= 85) {
      performanceBonus = basicSalary * 0.05;
    }

    const totalSalary = basicSalary + extraMilePay + performanceBonus;
    const deductions = totalSalary * 0.02;
    const netSalary = totalSalary - deductions;

    return {
      hourlyRate,
      extraMileRate,
      basicSalary,
      extraMilePay,
      performanceBonus,
      totalSalary,
      deductions,
      netSalary
    };
  }, [employeeData]);

  return calculations;
};
