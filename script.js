document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            // Find the element at the exact moment of the click
            const formElement = document.getElementById('captureArea'); 

            // Safety check: Make sure it actually exists right now
            if (!formElement) {
                console.error("Error: Could not find #captureArea in the DOM at the time of click.");
                alert("The capture area could not be found on the page.");
                return; 
            }

            // Run html2canvas
            html2canvas(formElement, {
                scale: 2 
            }).then(canvas => {
                const imageURI = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'user-form.png';
                link.href = imageURI;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(err => {
                console.error("html2canvas error:", err);
            });
        });
    } else {
        console.error("Could not find #download-btn in the HTML.");
    }
});
