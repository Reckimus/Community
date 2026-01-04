// Shared utility functions for the Community Forum

// Storage helper functions
const Storage = {
    getTopics: () => {
        const topics = localStorage.getItem('forumTopics');
        return topics ? JSON.parse(topics) : [];
    },
    
    saveTopic: (topic) => {
        const topics = Storage.getTopics();
        topics.unshift(topic);
        localStorage.setItem('forumTopics', JSON.stringify(topics));
        return topics;
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

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Get full category name from category ID
function getCategoryName(category) {
    const names = {
        'general': 'General Discussion',
        'announcements': 'Announcements',
        'support': 'Support',
        'feedback': 'Feedback & Ideas'
    };
    return names[category] || category;
}

// Format date to relative time
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

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification message
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

// Add CSS animations for notifications (only if not already added)
if (!document.getElementById('forum-animations')) {
    const style = document.createElement('style');
    style.id = 'forum-animations';
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
}
