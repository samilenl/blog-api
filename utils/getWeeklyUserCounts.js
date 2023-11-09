const User = require('../models/user');

const getWeeklyUserCounts = async () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate the date 7 days ago
  
    const userCounts = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: today }, // Filter users created within the past 7 days
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' }, // Group users by the day of the week they were created
          count: { $sum: 1 }, // Count the number of users in each group
        },
      },
      {
        $sort: { _id: 1 }, // Sort the results by day of the week (Monday to Sunday)
      },
    ]);
  
    const weeklyUserCounts = Array(7).fill(0); // Initialize an array to hold the counts for each day of the week
  
    userCounts.forEach((count) => {
      weeklyUserCounts[count._id] = count.count; // Store the count in the corresponding day of the week index
    });
  
    return weeklyUserCounts;
};

module.exports = getWeeklyUserCounts