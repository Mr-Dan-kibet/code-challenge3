const BASE_URL = "http://localhost:3000/posts";
const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");
const editForm = document.getElementById("edit-post-form");
const editTitle = document.getElementById("edit-title");
const editContent = document.getElementById("edit-content");
const cancelEditBtn = document.getElementById("cancel-edit");

let currentPostId = null; //track current slected post

function main() {
  displayPosts();
  addNewPostListener();
}
//ensures application starst when DOM is empty
document.addEventListener("DOMContentLoaded", main);

// Fetch and display all post titles
function displayPosts() {
  postList.innerHTML = "<p>Loading posts...</p>";

  fetch(BASE_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    })
    .then((posts) => {
      //Clear Previous content
      postList.innerHTML = "";
      //Handle empty state
      if (posts.length === 0) {
        postList.innerHTML = "<p>No posts yet.</p>";
        postDetail.innerHTML = "<p>Select a post to view details.</p>";
        return;
      }
      // Create list items for each post
      posts.forEach((post) => {
        const li = document.createElement("li");
        li.textContent = post.title;
        li.dataset.id = post.id;
        li.classList.add("post-title");
        postList.appendChild(li);
      });

      // Auto load first post
      handlePostClick(posts[0].id);
    })
    .catch((err) => {
      postList.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    });
}

// Use event delegation to handle clicks
postList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI" && e.target.dataset.id) {
    handlePostClick(e.target.dataset.id);
  }
});

// Fetch and display details for one post
function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    })
    .then((post) => {
      currentPostId = post.id;

      postDetail.innerHTML = `
        <article>
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p><strong>Author:</strong> ${post.author}</p>
          <button id="edit-btn">Edit</button>
          <button id="delete-btn">Delete</button>
        </article>
      `;

      document
        .getElementById("edit-btn")
        .addEventListener("click", showEditForm);
      document
        .getElementById("delete-btn")
        .addEventListener("click", handleDeletePost);
    })
    .catch((err) => {
      postDetail.innerHTML = `<p style="color: red;">Error loading post: ${err.message}</p>`;
    });
}

// Add new post. inclusive eror handling

function addNewPostListener() {
  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();

    const content = e.target.content.value.trim();

    const author = e.target.author.value.trim();

    if (!title || !content || !author) {
      alert("Please fill in all fields.");

      return;
    }
    //Submit to API
    fetch(BASE_URL, {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ title, content, author }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create post");

        return res.json();
      })

      .then(() => {
        alert("Post added successfully!");

        displayPosts();

        newPostForm.reset();
      })

      .catch((err) => {
        alert("Error: " + err.message);
      });
  });
} 
  
   

  
  

