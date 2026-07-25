async function fetchLatestMediumArticle() {
    const mediumUsername = '@gizano'; 
    const rssUrl = `https://medium.com/feed/${mediumUsername}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const linkElement = document.getElementById('medium-link');

    if (!linkElement) return;

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Feed retrieval failed');
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const lastArticle = data.items[0]; 
            
            linkElement.href = lastArticle.link;
            linkElement.textContent = lastArticle.title;
        } else {
            linkElement.textContent = "Visit my Medium blog";
        }
        
    } catch (error) {
        console.error('Error fetching Medium article:', error);
        linkElement.textContent = "Visit my Medium blog";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLatestMediumArticle();
});