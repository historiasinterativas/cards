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
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    const clonedCaptureArea = clonedDoc.getElementById('captureArea');
                    const inputs = clonedCaptureArea.querySelectorAll('input, textarea');

                    inputs.forEach(input => {
                        const textMirror = clonedDoc.createElement('span');
                        textMirror.textContent = input.value || input.placeholder || '';
                        textMirror.style.display = 'inline-block';
                        textMirror.style.width = window.getComputedStyle(input).width;
                        textMirror.style.height = window.getComputedStyle(input).height;
                        textMirror.style.padding = window.getComputedStyle(input).padding;
                        textMirror.style.boxSizing = 'border-box';
                        textMirror.style.fontSize = window.getComputedStyle(input).fontSize;
                        textMirror.style.fontFamily = window.getComputedStyle(input).fontFamily;
                        textMirror.style.color = window.getComputedStyle(input).color;
                        textMirror.style.display = 'flex';
                        textMirror.style.alignItems = 'center';
                        textMirror.style.border = window.getComputedStyle(input).border;
                        textMirror.style.borderRadius = window.getComputedStyle(input).borderRadius;
                        textMirror.style.backgroundColor = window.getComputedStyle(input).backgroundColor;

                        input.style.display = 'none';
                        input.parentNode.insertBefore(textMirror, input);
                    });
                }
            }).then(canvas => { // ✅ Added the missing }) closure right before the .then loop here
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
