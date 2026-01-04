// Storage helper functions (same as in script.js)
const Storage = {
    getTopics: () => {
        const topics = localStorage.getItem('forumTopics');
        return topics ? JSON.parse(topics) : [];
    },
    
    getTopicById: (id) => {
        const topics = Storage.getTopics();
        return topics.find(topic => topic.id === id);
    },
    
    updateTopic: (updatedTopic) => {
        const topics = Storage.getTopics();
        const index = topics.findIndex(topic => topic.id === updatedTopic.id);
        if (index !== -1) {
            topics[index] = updatedTopic;
            localStorage.setItem('forumTopics', JSON.stringify(topics));
        }
    }
};

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

// Helper functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getCategoryName(category) {
    const names = {
        'general': 'General Discussion',
        'announcements': 'Announcements',
        'support': 'Support',
        'feedback': 'Feedback & Ideas'
    };
    return names[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
