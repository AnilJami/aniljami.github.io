
function getMobileDeviceDetails() {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    let deviceType = "Desktop";

    // Check for Operating System
    if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Windows Phone/i.test(ua)) os = "Windows Phone";

    // Check for Device Type
    const isMobileUA = /Mobi|Android|iPhone|iPod/i.test(ua);
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isMobileUA) {
        deviceType = /Tablet|iPad/i.test(ua) ? "Tablet" : "Mobile Phone";
    } else if (hasTouch && /Macintosh/i.test(ua)) {
        // Modern iPads often masquerade as Desktop Macs but feature touch screens
        deviceType = "Tablet (iPad)";
        os = "iOS";
    }

    return { os, deviceType };
}


async function getVisitorDetails() {
    // 1. Gather browser details directly from the navigator object
    const browserData = {
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // 2. Fetch the public IP address using a free external API
    let ipAddress = 'Unknown';
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }

    const mobileData = getMobileDeviceDetails();
    // 3. Combine and return the collected data
    return {
        ip: ipAddress,
        browser: browserData,
        mobileData: mobileData
    };
}

// Execute when the page hits / loads
getVisitorDetails().then(details => {
    const messageElement = document.getElementById("myMessage");
    messageElement.textContent = JSON.stringify( details, null, 2);
});