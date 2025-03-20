export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: "NA",
    gradePoints: 0,
  };

  if (totalMarks >= 0 && totalMarks < 40) {
    result = {
      grade: "F",
      gradePoints: 0.0,
    };
  } else if (totalMarks >= 40 && totalMarks < 50) {
    result = {
      grade: "D",
      gradePoints: 2.0,
    };
  } else if (totalMarks >= 50 && totalMarks < 60) {
    result = {
      grade: "C",
      gradePoints: 2.5,
    };
  } else if (totalMarks >= 60 && totalMarks < 70) {
    result = {
      grade: "B",
      gradePoints: 3.0,
    };
  } else if (totalMarks >= 70 && totalMarks < 80) {
    result = {
      grade: "A",
      gradePoints: 3.5,
    };
  } else if (totalMarks >= 80) {
    result = {
      grade: "A+",
      gradePoints: 3.5,
    };
  } else {
    result = {
      grade: "NA",
      gradePoints: 0,
    };
  }

  console.log(result);

  return result;
};
