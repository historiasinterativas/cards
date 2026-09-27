document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            const formElement = document.getElementById('captureArea'); 

            if (!formElement) {
                console.error("Error: Could not find an element with id='captureArea' on this page.");
                return; 
            }

            html2canvas(formElement, {
                scale: 2,         // High quality
                useCORS: true,
                logging: false,    // Cleans up console
                onclone: (clonedDoc) => {
                    const clonedCaptureArea = clonedDoc.getElementById('captureArea');
                    if (!clonedCaptureArea) return;

                    // Find all inputs inside the snapshot area
                    const inputs = clonedCaptureArea.querySelectorAll('input, textarea');

                    inputs.forEach(input => {
                        // Create a flat block element instead of a flex container
                        const textMirror = clonedDoc.createElement('div');
                        
                        // Grab the text (fallback to placeholder text if empty)
                        textMirror.textContent = input.value || input.placeholder || '';
                        
                        // Extract exactly how the browser evaluates styles right now
                        const computed = window.getComputedStyle(input);
                        
                        // Apply layout and typography precisely
                        textMirror.style.boxSizing = 'border-box';
                        textMirror.style.width = computed.width;
                        textMirror.style.height = computed.height;
                        textMirror.style.fontSize = computed.fontSize;
                        textMirror.style.fontFamily = computed.fontFamily;
                        textMirror.style.fontWeight = computed.fontWeight;
                        textMirror.style.color = input.value ? computed.color : '#a9a9a9'; // Dim placeholder text if empty
                        textMirror.style.textAlign = computed.textAlign;
                        
                        // Core Fix: Use identical line-height and height to force middle vertical centering natively
                        textMirror.style.lineHeight = computed.height; 
                        textMirror.style.paddingLeft = computed.paddingLeft;
                        textMirror.style.paddingRight = computed.paddingRight;
                        
                        // Visual boxes matching your inputs
                        textMirror.style.border = computed.border;
                        textMirror.style.borderRadius = computed.borderRadius;
                        textMirror.style.backgroundColor = computed.backgroundColor;

                        // Clean replacement
                        input.style.display = 'none';
                        input.parentNode.insertBefore(textMirror, input);
                    });
                }
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
    }
});
