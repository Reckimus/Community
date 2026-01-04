# Community Forum

A simple, lightweight community forum application built with vanilla HTML, CSS, and JavaScript.

## Features

- 📝 Create and view discussion topics
- 💬 Reply to topics
- 🏷️ Organize topics by categories (General, Announcements, Support, Feedback)
- 📱 Responsive design for mobile and desktop
- 💾 Client-side storage using localStorage

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/Reckimus/Community.git
   cd Community
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Use a local server (recommended):
     ```bash
     python -m http.server 8000
     # or
     npx serve
     ```
   - Navigate to `http://localhost:8000`

## Usage

### Creating a Topic
1. Click the "New Topic" button in the navigation bar
2. Fill in the form:
   - Select a category
   - Enter a title
   - Enter your name
   - Write your message
3. Click "Create Topic"

### Viewing Topics
- Click on any topic in the "Recent Topics" section to view it
- Click on a category card to filter topics by that category

### Replying to Topics
1. Navigate to a topic page
2. Scroll to the "Post a Reply" section
3. Enter your name and reply
4. Click "Post Reply"

## File Structure

```
Community/
├── index.html      # Main forum page with topic list
├── topic.html      # Individual topic view page
├── styles.css      # All styling for the forum
├── script.js       # Main page functionality
├── topic.js        # Topic page functionality
└── README.md       # This file
```

## Categories

The forum includes four default categories:
- **General Discussion** - Talk about anything and everything
- **Announcements** - Important news and updates
- **Support** - Get help from the community
- **Feedback & Ideas** - Share your suggestions

## Storage

The forum uses browser localStorage to persist data. All topics and replies are stored locally in your browser. Note that:
- Data persists across browser sessions
- Data is specific to each browser
- Clearing browser data will remove all forum content

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid and Flexbox

## License

MIT License - feel free to use this project however you'd like!