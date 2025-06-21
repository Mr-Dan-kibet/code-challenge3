const BASE_URL = "http://localhost:3000/posts";
const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");
const editForm = document.getElementById("edit-post-form");
const editTitle = document.getElementById("edit-title");
const editContent = document.getElementById("edit-content");
const cancelEditBtn = document.getElementById("cancel-edit");
// Track the currently selected post (used for edit/delete)
let currentPostId = null;

// Runs after DOM is fully loaded
function main() {
  displayPosts();          
  addNewPostListener();    
}

// Wait until everything on the page is ready before starting app logic
document.addEventListener('DOMContentLoaded', main);

// Fetch and display all post titles
function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = ''; // Clear existing post list

      // Loop through each post from the server
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;      
        div.classList.add('post-title');      
        div.addEventListener('click', () => handlePostClick(post.id)); 
        postList.appendChild(div);      
      });

      // Automatically show the first post's details on page load
      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      }
    });
}
// Fetch and display a post’s full details
function handlePostClick(id) {
    fetch(`${BASE_URL}/${id}`)
      .then(res => res.json())
      .then(post => {
        currentPostId = post.id; // Save which post we're currently viewing
  
        // Populate detail section with post content and buttons
        postDetail.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p><strong>Author:</strong> ${post.author}</p>
          <button id="edit-btn">Edit</button>
          <button id="delete-btn">Delete</button>
        `;
  
        // Enable "Edit" and "Delete" buttons
        document.getElementById('edit-btn').addEventListener('click', showEditForm);
        document.getElementById('delete-btn').addEventListener('click', handleDeletePost);
      });
  }
  

