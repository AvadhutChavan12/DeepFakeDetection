console.log("Instagram Deepfake Detection Extension Loaded");

// Function to select the first image from a post
function getFirstImageElement(postElement) {
    const imageContainer = postElement.querySelector("div._aagu"); // Find the image container
    if (!imageContainer) return null;

    const firstImage = imageContainer.querySelector("img"); // Get the first image inside
    return firstImage ? firstImage : null;
}

// Function to send the first image from a post for deepfake detection
function sendImageForDetection(imageElement, postElement) {
    if (!imageElement || postElement.dataset.processed) return; // Avoid duplicate processing

    postElement.dataset.processed = "true"; // Mark post as processed
    const imageUrl = imageElement.src;
    console.log("Selected Image URL:", imageUrl);

    chrome.runtime.sendMessage({ action: "detectDeepfake", imageUrl: imageUrl }, response => {
        console.log("Deepfake Detection Response:", response);

        if (response && response.result) {
            const confidence = response.result.confidence ? (response.result.confidence * 100).toFixed(2) : "N/A";
            postElement.style.border = response.result.is_deepfake ? "5px solid red" : "5px solid rgb(0, 255, 0)"; 

            // Add label
            const label = document.createElement("div");
            label.style.position = "absolute";
            label.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            label.style.color = "white";
            label.style.padding = "5px";
            label.style.fontSize = "12px";
            label.style.borderRadius = "5px";
            label.style.top = "10px";
            label.style.left = "10px";
            label.innerText = response.result.is_deepfake
                ? `⚠️ Deepfake Detected! (${confidence}%)`
                : `✅ Real Image (${confidence}%)`;

            postElement.style.position = "relative"; // Ensure the post div is positioned
            postElement.appendChild(label);
        }
    });
}

// Function to check visible posts in viewport
function checkVisiblePosts() {
    const posts = document.querySelectorAll("article"); // Instagram posts are inside <article> elements
    posts.forEach(post => {
        const rect = post.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            const firstImage = getFirstImageElement(post);
            sendImageForDetection(firstImage, post);
        }
    });
}

// Observer to detect dynamically loaded posts
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.tagName.toLowerCase() === "article") {
                checkVisiblePosts(); // Check newly added posts
            }
        });
    });
});

// Start observing Instagram feed for new posts
observer.observe(document.body, { childList: true, subtree: true });

// Detect scrolling and new posts appearing
window.addEventListener("scroll", checkVisiblePosts);
window.addEventListener("load", checkVisiblePosts);
