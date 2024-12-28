function countCommentsAndReplies(comments) {
  let total = 0;

  // Loop through each top-level comment
  comments.forEach((comment) => {
    // Count the comment itself
    total += 1;

    // If the comment has replies, add them to the total count
    if (Array.isArray(comment.replies)) {
      total += comment.replies.length;
    }
  });

  return total;
}

export default countCommentsAndReplies;
