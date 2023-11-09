const Comment = require('../models/comment');
const Post = require('../models/post');

const getWeeklyCounts = async () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate the date 7 days ago

  const commentCounts = await Comment.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo, $lte: today }, // Filter comments created within the past 7 days
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' }, // Group comments by the day of the week they were created
        count: { $sum: 1 }, // Count the number of comments in each group
      },
    },
    {
      $sort: { _id: 1 }, // Sort the results by day of the week (Monday to Sunday)
    },
  ]);

  const postCounts = await Post.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo, $lte: today }, // Filter posts created within the past 7 days
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' }, // Group posts by the day of the week they were created
        count: { $sum: 1 }, // Count the number of posts in each group
      },
    },
    {
      $sort: { _id: 1 }, // Sort the results by day of the week (Monday to Sunday)
    },
  ]);

  const weeklyCommentCounts = Array(7).fill(0); // Initialize an array to hold the comment counts for each day of the week
  const weeklyPostCounts = Array(7).fill(0); // Initialize an array to hold the post counts for each day of the week

  commentCounts.forEach((count) => {
    weeklyCommentCounts[count._id] = count.count; // Store the comment count in the corresponding day of the week index
  });

  postCounts.forEach((count) => {
    weeklyPostCounts[count._id] = count.count; // Store the post count in the corresponding day of the week index
  });
  return { weeklyCommentCounts, weeklyPostCounts };
};

module.exports = getWeeklyCounts
