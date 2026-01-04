// Initialize the topic page
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('id');
    
    if (!topicId) {
        window.location.href = 'index.html';
        return;
    }
    
    loadTopic(topicId);
    setupReplyForm(topicId);
});

// Load and display topic
function loadTopic(topicId) {
    const topic = Storage.getTopicById(topicId);
    
    if (!topic) {
        document.getElementById('topic-view').innerHTML = `
            <div class="empty-state">
                <h2>Topic not found</h2>
                <p>The topic you're looking for doesn't exist.</p>
                <a href="index.html" class="btn btn-primary">Back to Home</a>
            </div>
        `;
        return;
    }
    
    // Update page title
    document.title = `${topic.title} - Community Forum`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-category').textContent = getCategoryName(topic.category);
    document.getElementById('breadcrumb-title').textContent = topic.title;
    
    // Update topic header
    document.getElementById('topic-title').textContent = topic.title;
    document.getElementById('topic-category-badge').textContent = getCategoryName(topic.category);
    document.getElementById('topic-author').textContent = topic.author;
    document.getElementById('topic-date').textContent = formatDate(topic.createdAt);
    
    // Update topic content
    document.getElementById('topic-content').innerHTML = `<p>${escapeHtml(topic.content).replace(/\n/g, '<br>')}</p>`;
    
    // Load replies
    loadReplies(topic);
}

// Load and display replies
function loadReplies(topic) {
    const repliesContainer = document.getElementById('replies-list');
    const replyCount = document.getElementById('reply-count');
    
    replyCount.textContent = topic.replies.length;
    
    if (topic.replies.length === 0) {
        repliesContainer.innerHTML = '<p class="empty-state">No replies yet. Be the first to reply!</p>';
        return;
    }
    
    repliesContainer.innerHTML = topic.replies.map(reply => `
        <div class="reply-item">
            <div class="reply-header">
                <span class="reply-author">${escapeHtml(reply.author)}</span>
                <span>•</span>
                <span>${formatDate(reply.createdAt)}</span>
            </div>
            <div class="reply-content">${escapeHtml(reply.content).replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

// Setup reply form
function setupReplyForm(topicId) {
    const form = document.getElementById('reply-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const author = document.getElementById('reply-author').value;
        const content = document.getElementById('reply-content').value;
        
        const reply = {
            id: generateId(),
            author,
            content,
            createdAt: new Date().toISOString()
        };
        
        // Get topic and add reply
        const topic = Storage.getTopicById(topicId);
        if (topic) {
            topic.replies.push(reply);
            Storage.updateTopic(topic);
            
            // Reload replies
            loadReplies(topic);
            
            // Reset form
            form.reset();
            
            // Show success message
            showNotification('Reply posted successfully!');
            
            // Scroll to replies section
            document.querySelector('.replies-section').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

