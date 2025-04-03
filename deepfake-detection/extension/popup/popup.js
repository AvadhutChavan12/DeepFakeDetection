document.getElementById('detect').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "detectDeepfake" });
        });
    });
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "displayResults") {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `Deepfake: ${message.result.is_deepfake}`;
        }
    });