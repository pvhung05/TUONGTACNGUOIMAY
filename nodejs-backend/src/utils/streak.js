/**
 * Tính streak dựa trên lịch sử học
 * @param {Array} learningDates - Mảng các ngày học (Date objects)
 * @returns {Object} { streak: số ngày liên tiếp, lastLearnedDate: ngày cuối cùng học }
 */
const calculateStreak = (learningDates) => {
  if (!learningDates || learningDates.length === 0) {
    return { streak: 0, lastLearnedDate: null };
  }

  // Sắp xếp giảm dần theo ngày
  const sortedDates = learningDates
    .map((date) => new Date(date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));

  // Loại bỏ trùng lặp
  const uniqueDates = [...new Set(sortedDates)].map((d) => new Date(d));

  let streak = 1;
  const today = new Date().toDateString();
  const firstDate = uniqueDates[0].toDateString();

  // Nếu ngày cuối cùng học không phải hôm nay, streak về 0
  // Hoặc nếu là hôm qua, vẫn giữ streak
  const daysDifference = Math.floor(
    (uniqueDates[0].getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference < -1) {
    return { streak: 0, lastLearnedDate: uniqueDates[0] };
  }

  // Tính streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const previousDate = uniqueDates[i - 1];

    const diffTime = previousDate.getTime() - currentDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return { streak, lastLearnedDate: uniqueDates[0] };
};

module.exports = {
  calculateStreak,
};
