document.addEventListener('DOMContentLoaded', function() {
    // 1. Grab the download button
    const downloadBtn = document.getElementById('download-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            // 2. Locate your live capture element on the page
            const formElement = document.getElementById('captureArea'); 

            // 3. Safety Check: Stop immediately if it's missing
            if (!formElement) {
                console.error("Error: Could not find an element with id='captureArea' on this page.");
                alert("Capture area not found!");
                return; 
            }

            // 4. Run html2canvas on the live element
            html2canvas(formElement, {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    // Inside the clone, locate the cloned version of your container
                    const clonedCaptureArea = clonedDoc.getElementById('captureArea');
                    if (!clonedCaptureArea) return;

                    // Find all input fields inside the cloned area
                    const inputs = clonedCaptureArea.querySelectorAll('input, textarea');

                    inputs.forEach(input => {
                        // Create a clean text mirror span to perfectly align text
                        const textMirror = clonedDoc.createElement('span');
                        textMirror.textContent = input.value || input.placeholder || '';
                        
                        // Mirror the exact computed layout sizes and styles
                        textMirror.style.display = 'flex';
                        textMirror.style.alignItems = 'center';
                        textMirror.style.width = window.getComputedStyle(input).width;
                        textMirror.style.height = window.getComputedStyle(input).height;
                        textMirror.style.padding = window.getComputedStyle(input).padding;
                        textMirror.style.boxSizing = 'border-box';
                        textMirror.style.fontSize = window.getComputedStyle(input).fontSize;
                        textMirror.style.fontFamily = window.getComputedStyle(input).fontFamily;
                        textMirror.style.color = window.getComputedStyle(input).color;
                        textMirror.style.border = window.getComputedStyle(input).border;
                        textMirror.style.borderRadius = window.getComputedStyle(input).borderRadius;
                        textMirror.style.backgroundColor = window.getComputedStyle(input).backgroundColor;

                        // Hide the shifting input field and replace it with the flat text mirror
                        input.style.display = 'none';
                        input.parentNode.insertBefore(textMirror, input);
                    });
                }
            }).then(canvas => {
                // 5. Convert to image data and force the local file download
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
