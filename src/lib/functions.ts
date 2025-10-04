export async function getComments() {
  try {
    const response = await fetch('/api/comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

export async function getCommentsWithReplies() {
  try {
    const response = await fetch('/api/comments/with-replies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.error("Error fetching comments with replies:", err);
  }
}

export async function postComment({
  user,
  content,
  parentId = null,
}: {
  user: { id: string; fullName?: string };
  content: string;
  parentId?: number | null;
}) {
  try {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorId: user.id,
        author: user.fullName || "Anonymous",
        text: content,
        parentId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, comment: data };
    } else {
      return { success: false, error: data };
    }
  } catch (err) {
    console.error("Error posting comment:", err);
    return { success: false, error: err };
  }
}


export async function likeComment(commentId: string | number, userId: string) {
  try {
    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData };
    }
  } catch (err) {
    console.error("Error liking comment:", err);
    return { success: false, error: err };
  }
}

export async function deleteComment(commentId: string | number, userId: string) {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData };
    }
  } catch (err) {
    console.error("Error deleting comment:", err);
    return { success: false, error: err };
  }
}