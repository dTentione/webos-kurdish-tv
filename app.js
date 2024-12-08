document.addEventListener('DOMContentLoaded', () => {
    const channelList = document.getElementById('channel-list');
    const videoPlayer = document.getElementById('video-player');
    const playerContainer = document.getElementById('player-container');
    const exitButton = document.getElementById('exit-button');
    const appTitle = document.getElementById('app-title');
    const languageSelector = document.getElementById('language-selector');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Translations for English and Kurdish
    const translations = {
        en: {
            title: "Kurdish TV Channels",
            categories: ["All", "News", "Sports", "Entertainment", "Religion"],
            exitButton: "Exit",
            noUrl: "No URL available for this channel.",
            notSupported: "HLS is not supported on this device."
        },
        ku: {
            title: "کانالەکانی تەلەڤیزیۆنی کوردی",
            categories: ["هەموو", "هەواڵ", "وەرزشی", "ئاههنگ", "ئایینی"],
            exitButton: "چوونە دەرەوە",
            noUrl: "هیچ URL یەک بەرزکراو نیە بۆ ئەم کاناڵە.",
            notSupported: "HLS پشتیوانی ناکرێت لەسەر ئەم ئامێرە."
        }
    };

    let currentLanguage = "en"; // Default language
    let channelsData = []; // To store channels fetched from JSON

    // Update UI text based on the selected language
    function updateLanguage() {
        const t = translations[currentLanguage];
        appTitle.textContent = t.title;
        document.querySelectorAll('.category-btn').forEach((btn, index) => {
            btn.textContent = t.categories[index];
        });
        exitButton.textContent = t.exitButton;
    }

    // Handle language change
    languageSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateLanguage();
    });

    // Fetch and display channels
    fetch('data/channels.json')
        .then(res => res.json())
        .then(channels => {
            channelsData = channels; // Save channels for filtering
            renderChannels(channels);
        })
        .catch(error => console.error('Error loading channels:', error));

    // Render channels
    function renderChannels(channels) {
        channelList.innerHTML = '';
        channels.forEach(channel => {
            const card = document.createElement('div');
            card.className = 'channel-card';
            card.innerHTML = `
                <img src="${channel.logo}" class="channel-logo" alt="${channel.name}">
                <div class="channel-info">
                    <h3 class="channel-name">${channel.name}</h3>
                </div>
            `;
            card.addEventListener('click', () => playChannel(channel.url));
            channelList.appendChild(card);
        });
    }

    // Play channel with HLS.js support
    function playChannel(url) {
        if (!url) {
            alert(translations[currentLanguage].noUrl);
            return;
        }

        if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = url;
        } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoPlayer);
        } else {
            alert(translations[currentLanguage].notSupported);
            return;
        }

        playerContainer.style.display = 'flex';
        videoPlayer.play();
    }

    // Exit playback
    exitButton.addEventListener('click', () => {
        videoPlayer.pause();
        videoPlayer.src = '';
        playerContainer.style.display = 'none';
    });

    // Handle category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            const filteredChannels =
                category === 'all'
                    ? channelsData
                    : channelsData.filter(channel => channel.category === category);
            renderChannels(filteredChannels);
        });
    });

    // Initialize the language UI
    updateLanguage();
});

