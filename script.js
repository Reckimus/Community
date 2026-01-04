// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadRecentTopics();
    updateCategoryCounts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // New topic button
    const newTopicBtn = document.getElementById('new-topic-btn');
    const modal = document.getElementById('new-topic-modal');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('new-topic-form');
    
    newTopicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.reset();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            form.reset();
        }
    });
    
    // Form submission
    form.addEventListener('submit', handleTopicSubmit);
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            filterByCategory(category);
        });
    });
}

// Handle new topic submission
function handleTopicSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('topic-category').value;
    const title = document.getElementById('topic-title').value;
    const author = document.getElementById('topic-author').value;
    const content = document.getElementById('topic-content').value;
    
    const topic = {
        id: generateId(),
        category,
        title,
        author,
        content,
        createdAt: new Date().toISOString(),
        replies: []
    };
    
    Storage.saveTopic(topic);
    
    // Close modal and reset form
    document.getElementById('new-topic-modal').style.display = 'none';
    document.getElementById('new-topic-form').reset();
    
    // Reload topics
    loadRecentTopics();
    updateCategoryCounts();
    
    // Show success message
    showNotification('Topic created successfully!');
}

// View topic (navigate to topic page)
function viewTopic(topicId) {
    window.location.href = `topic.html?id=${topicId}`;
}
function loadRecentTopics(filterCategory = null) {
    const topicsContainer = document.getElementById('recent-topics');
    let topics = Storage.getTopics();
    
    if (filterCategory) {
        topics = topics.filter(topic => topic.category === filterCategory);
    }
    
    if (topics.length === 0) {
        topicsContainer.innerHTML = '<p class="empty-state">No topics yet. Be the first to start a discussion!</p>';
        return;
    }
    
    topicsContainer.innerHTML = topics.slice(0, 10).map(topic => `
        <div class="topic-item" onclick="viewTopic('${topic.id}')">
            <h4>${escapeHtml(topic.title)}</h4>
            <div class="topic-meta">
                <span class="category-badge">${getCategoryName(topic.category)}</span>
                <span>by <strong>${escapeHtml(topic.author)}</strong></span>
                <span>${formatDate(topic.createdAt)}</span>
                <span>${topic.replies.length} ${topic.replies.length === 1 ? 'reply' : 'replies'}</span>
            </div>
        </div>
    `).join('');
}

// Filter topics by category
function filterByCategory(category) {
    loadRecentTopics(category);
    
    // Update section title
    const sectionTitle = document.querySelector('.recent-topics-section h3');
    sectionTitle.textContent = `Topics in ${getCategoryName(category)}`;
    
    // Add a back button
    const existingBackBtn = document.getElementById('back-to-all');
    if (!existingBackBtn) {
        const backBtn = document.createElement('button');
        backBtn.id = 'back-to-all';
        backBtn.className = 'btn btn-secondary';
        backBtn.textContent = 'Show All Topics';
        backBtn.style.marginBottom = '1rem';
        backBtn.onclick = () => {
            loadRecentTopics();
            sectionTitle.textContent = 'Recent Topics';
            backBtn.remove();
        };
        document.querySelector('.recent-topics-section').insertBefore(backBtn, document.getElementById('recent-topics'));
    }
}

// Update category counts
function updateCategoryCounts() {
    const topics = Storage.getTopics();
    const counts = {};
    
    topics.forEach(topic => {
        counts[topic.category] = (counts[topic.category] || 0) + 1;
    });
    
    document.querySelectorAll('.category-card').forEach(card => {
        const category = card.dataset.category;
        const countSpan = card.querySelector('.topic-count');
        const count = counts[category] || 0;
        countSpan.textContent = `${count} ${count === 1 ? 'topic' : 'topics'}`;
    });
}
