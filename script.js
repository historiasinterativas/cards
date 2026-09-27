document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            const formElement = document.getElementById('captureArea'); 

            if (!formElement) {
                console.error("Error: Could not find an element with id='captureArea' on this page.");
                return; 
            }

            // Capture the exact positions of all live elements BEFORE cloning
            const liveInputsData = Array.from(formElement.querySelectorAll('input, textarea')).map(input => {
                return {
                    value: input.value || input.placeholder || '',
                    // Get position relative to the #captureArea container instead of the whole page
                    rect: {
                        top: input.offsetTop,
                        left: input.offsetLeft,
                        width: input.offsetWidth,
                        height: input.offsetHeight
                    },
                    styles: {
                        padding: window.getComputedStyle(input).padding,
                        fontSize: window.getComputedStyle(input).fontSize,
                        fontFamily: window.getComputedStyle(input).fontFamily,
                        color: window.getComputedStyle(input).color,
                        border: window.getComputedStyle(input).border,
                        borderRadius: window.getComputedStyle(input).borderRadius,
                        backgroundColor: window.getComputedStyle(input).backgroundColor,
                        textAlign: window.getComputedStyle(input).textAlign
                    }
                };
            });

            html2canvas(formElement, {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    const clonedCaptureArea = clonedDoc.getElementById('captureArea');
                    if (!clonedCaptureArea) return;

                    // 1. Hide the original buggy elements inside the clone completely
                    const clonedInputs = clonedCaptureArea.querySelectorAll('input, textarea');
                    clonedInputs.forEach(input => {
                        input.style.opacity = '0'; // Keeps layout structure intact but hides them
                    });

                    // Ensure the cloned container can hold absolute positioned child mirrors
                    const originalPosition = window.getComputedStyle(formElement).position;
                    if (originalPosition === 'static') {
                        clonedCaptureArea.style.position = 'relative';
                    }

                    // 2. Overlay pixel-perfect text blocks exactly where the inputs were
                    liveInputsData.forEach(data => {
                        const textMirror = clonedDoc.createElement('div');
                        textMirror.textContent = data.value;
                        
                        // Enforce absolute geometry matching the live positions exactly
                        textMirror.style.position = 'absolute';
                        textMirror.style.top = data.rect.top + 'px';
                        textMirror.style.left = data.rect.left + 'px';
                        textMirror.style.width = data.rect.width + 'px';
                        textMirror.style.height = data.rect.height + 'px';
                        
                        // Match visual aesthetics
                        textMirror.style.boxSizing = 'border-box';
                        textMirror.style.padding = data.styles.padding;
                        textMirror.style.fontSize = data.styles.fontSize;
                        textMirror.style.fontFamily = data.styles.fontFamily;
                        textMirror.style.color = data.styles.color;
                        textMirror.style.border = data.styles.border;
                        textMirror.style.borderRadius = data.styles.borderRadius;
                        textMirror.style.backgroundColor = data.styles.backgroundColor;
                        
                        // Lock vertical text centering using flexbox on a flat div
                        textMirror.style.display = 'flex';
                        textMirror.style.alignItems = 'center';
                        textMirror.style.justifyContent = data.styles.textAlign === 'center' ? 'center' : 'flex-start';

                        clonedCaptureArea.appendChild(textMirror);
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
