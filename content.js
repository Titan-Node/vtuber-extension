// Function to check URL and load iframe if condition is met
function checkAndLoadIframe() {
    // Check if the iframe already exists
    if (!document.querySelector('#pump-fun-iframe')) {
        // Check if we're on the board page
        const currentPath = window.location.pathname;
        if (currentPath.includes('/board')) {
            loadBoardStreams();
            return;
        }

        // Create placeholder elements
        const lineBreak = document.createElement("br");
        
        // Create loading spinner first
        const loadingImg = document.createElement("img");
        loadingImg.id = 'pump-fun-iframe';
        loadingImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <style>
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                </style>
                <circle cx="50%" cy="50%" r="30" stroke="#666" stroke-width="4" fill="none" style="animation: spin 1s linear infinite"/>
            </svg>
        `);
        loadingImg.style.width = '100%';
        loadingImg.style.height = '500px';
        loadingImg.style.objectFit = 'fill';

        // Find the target div and prepend elements
        const targetDiv = document.querySelector('div.chart-container');
        targetDiv.prepend(loadingImg);
        targetDiv.prepend(lineBreak);

        // Fetch streams data from JSON file with cache-busting query parameter
        fetch('https://vtuber.fun/streams.json?' + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                const currentUrl = window.location.href;
                let streamFound = false;
                
                // Check if current URL ending matches any stream key
                console.log('Checking URL:', currentUrl);
                console.log('Available streams:', data.streams);
                for (const [urlEnding, streamUrl] of Object.entries(data.streams)) {
                    if (currentUrl.endsWith(urlEnding)) {
                        streamFound = true;
                        // Create an iframe for the live stream
                        const iframe = document.createElement("iframe");
                        iframe.id = 'pump-fun-iframe';
                        iframe.src = streamUrl;
                        iframe.style.width = '100%';
                        iframe.style.height = '500px';
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('allowfullscreen', '');
                        iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
                        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');

                        // Replace loading spinner with iframe
                        loadingImg.replaceWith(iframe);
                        console.log('Replaced loading spinner with iframe');
                        break;
                    }
                }

                // If no stream found, replace loading spinner with "no stream" message
                if (!streamFound) {
                    const noStreamImg = document.createElement("img");
                    noStreamImg.id = 'pump-fun-iframe';
                    noStreamImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            <rect width="100%" height="100%" fill="#f0f0f0"/>
                            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle">
                                No Vtuber Stream Available For This Coin.
                            </text>
                        </svg>
                    `);
                    noStreamImg.style.width = '100%';
                    noStreamImg.style.height = '500px';
                    noStreamImg.style.objectFit = 'fill';
                    loadingImg.replaceWith(noStreamImg);
                }
            })
            .catch(error => {
                console.error('Error fetching streams data:', error);
                // Show error message if fetch fails
                const errorImg = document.createElement("img");
                errorImg.id = 'pump-fun-iframe';
                errorImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <rect width="100%" height="100%" fill="#f0f0f0"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle">
                            Error loading stream data.
                        </text>
                    </svg>
                `);
                errorImg.style.width = '100%';
                errorImg.style.height = '500px';
                errorImg.style.objectFit = 'fill';
                loadingImg.replaceWith(errorImg);
            });
    }
}   

function loadBoardStreams() {
    // Create live streams carousel
    const loadingImg = document.createElement("img");
    loadingImg.id = 'pump-fun-board';
    loadingImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle">
                Loading streams...
            </text>
        </svg>
    `);
    loadingImg.style.width = '100%';
    loadingImg.style.height = '200px';
    loadingImg.style.objectFit = 'fill';

    // Create container div
    const streamsContainer = document.createElement('div');
    streamsContainer.className = 'flex max-w-full flex-col items-center justify-start gap-4 overflow-hidden md:flex-row md:gap-6';
    
    const carouselContainer = document.createElement('div');
    carouselContainer.id = 'streams-carousel-container';
    carouselContainer.style.overflowX = 'auto';

    const section = document.createElement('section');
    section.className = 'jsx-a93ea0ccb11df76e relative mb-6 w-full';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'jsx-a93ea0ccb11df76e mx-1 mb-2 flex items-center justify-between';
    
    const header = document.createElement('h2');
    header.className = 'jsx-a93ea0ccb11df76e font-light text-green-300 md:text-lg';
    header.id = 'pump-fun-iframe';
    header.textContent = 'Live Streams';
    
    headerDiv.appendChild(header);
    section.appendChild(headerDiv);

    const carouselDiv = document.createElement('div');
    carouselDiv.className = 'jsx-a93ea0ccb11df76e relative w-full overflow-hidden';
    
    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'jsx-a93ea0ccb11df76e flex flex-nowrap space-x-3 scrollbar-hide relative';
    scrollDiv.style.overflowX = 'scroll';
    scrollDiv.style.touchAction = 'pan-x';
    scrollDiv.style.maxWidth = '100vw';
    scrollDiv.style.minWidth = '100%';
    scrollDiv.style.scrollBehavior = 'smooth';

    // Fetch streams data from JSON file with cache-busting query parameter
    fetch('https://vtuber.fun/streams.json?' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            console.log('Available streams to board:', data.streams);
            // Convert object entries to array and iterate
            Object.entries(data.streams).forEach(([key, streamUrl]) => {
                const streamDiv = document.createElement('div');
                streamDiv.className = 'relative overflow-visible pt-2';
                streamDiv.style.height = 'auto';

                const card = document.createElement('a');
                card.className = 'carousel-card relative flex flex-shrink-0 flex-col overflow-hidden rounded-xl bg-[#1F2937] bg-opacity-90 p-3 text-slate-300 transition-colors duration-300 ease-in-out hover:bg-[#2F3741] hover:shadow-xl';
                card.style.width = '70vw';
                card.style.maxWidth = '280px';
                card.href = key; // Use the key as the URL

                const iframe = document.createElement('iframe');
                iframe.src = streamUrl; // Use the streamUrl directly
                iframe.width = '100%';
                iframe.height = '150px';
                iframe.style.borderRadius = '8px';
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
                iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');

                const watchButton = document.createElement('button');
                watchButton.className = 'mt-3 w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600 transition-colors duration-200';
                watchButton.textContent = 'Watch Now';
                watchButton.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = key;
                };

                card.appendChild(iframe);
                card.appendChild(watchButton);
                streamDiv.appendChild(card);
                scrollDiv.appendChild(streamDiv);
            });
        })
        .catch(error => {
            console.error('Error loading streams:', error);
            scrollDiv.innerHTML = 'Error loading streams';
        });

    carouselDiv.appendChild(scrollDiv);
    section.appendChild(carouselDiv);
    carouselContainer.appendChild(section);
    streamsContainer.appendChild(carouselContainer);

    // Insert the streams container before the existing carousel
    const existingCarousel = document.querySelector('.flex.max-w-full.flex-col');
    if (existingCarousel) {
        existingCarousel.parentNode.insertBefore(streamsContainer, existingCarousel);
    }
}

// Check URL on page load   
window.addEventListener("load", checkAndLoadIframe);

// Check URL on history change
window.addEventListener("popstate", checkAndLoadIframe);

// Optionally, use setInterval to check URL periodically
setInterval(checkAndLoadIframe, 1000);
