chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.action === "detectDeepfake") {
        const imageUrl = message.imageUrl;
        console.log("Processing Image:", imageUrl);

        fetch('http://localhost:5000/detect', {
            method: 'POST',
            body: JSON.stringify({ image_url: imageUrl }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data);
            sendResponse({ result: data });
        })
        .catch(error => {
            console.error("Error detecting deepfake:", error);
            sendResponse({ error: "Failed to fetch data", details: error.message });
        });

        return true;  // Keeps sendResponse active for async processing
    }
});
