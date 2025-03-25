document.addEventListener("DOMContentLoaded", function() {
    const postButton = document.getElementById("postButton");
    const postContent = document.getElementById("postContent");
    const mediaUpload = document.getElementById("mediaUpload");
    const postsContainer = document.getElementById("posts");
    const friendsInput = document.getElementById("friends");

    let postCount = 0;

    // Check if user can post
    function checkPostPermission() {
        const friends = parseInt(friendsInput.value, 10);
        let maxPosts = 0;

        if (friends >= 10) {
            maxPosts = Infinity;  // Unlimited posts
        } else if (friends >= 2) {
            maxPosts = 2;
        } else if (friends >= 1) {
            maxPosts = 1;
        }

        postButton.disabled = postCount >= maxPosts;
    }

    friendsInput.addEventListener("input", checkPostPermission);

    postButton.addEventListener("click", function() {
        if (postButton.disabled) return;

        const content = postContent.value.trim();
        const media = mediaUpload.files[0];

        if (!content && !media) {
            alert("Please enter text or upload media!");
            return;
        }

        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        if (content) {
            const textPara = document.createElement("p");
            textPara.textContent = content;
            postDiv.appendChild(textPara);
        }

        if (media) {
            const mediaElement = document.createElement(media.type.startsWith("image") ? "img" : "video");
            mediaElement.src = URL.createObjectURL(media);
            if (media.type.startsWith("video")) mediaElement.controls = true;
            postDiv.appendChild(mediaElement);
        }

        // Add like & comment buttons
        const likeButton = document.createElement("span");
        likeButton.textContent = "❤️ Like";
        likeButton.classList.add("like");
        likeButton.addEventListener("click", () => {
            likeButton.textContent = "❤️ Liked!";
        });

        const commentButton = document.createElement("span");
        commentButton.textContent = "💬 Comment";
        commentButton.classList.add("comment");
        
        postDiv.appendChild(likeButton);
        postDiv.appendChild(commentButton);

        postsContainer.prepend(postDiv);

        postContent.value = "";
        mediaUpload.value = "";
        postCount++;
        checkPostPermission();
    });
});
