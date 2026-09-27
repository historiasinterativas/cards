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
                scale: 2,         // Keeps the text and design high-resolution
                useCORS: true,
                logging: false,   
                onclone: (clonedDoc) => {
                    const clonedCaptureArea = clonedDoc.getElementById('captureArea');
                    if (!clonedCaptureArea) return;

                    // Locate every Bootstrap input/textarea inside the clone
                    const inputs = clonedCaptureArea.querySelectorAll('input, textarea');

                    inputs.forEach(input => {
                        // 1. Create a native div element instead of an input box
                        const textMirror = clonedDoc.createElement('div');
                        
                        // Extract text or placeholder
                        textMirror.textContent = input.value || input.placeholder || ' ';
                        
                        // 2. Fetch Bootstrap's dynamic styles from the live screen
                        const computed = window.getComputedStyle(input);
                        
                        // 3. Reapply layout shapes so it still LOOKS like a Bootstrap input card box
                        textMirror.style.boxSizing = 'border-box';
                        textMirror.style.width = computed.width;
                        textMirror.style.height = computed.height;
                        textMirror.style.fontSize = computed.fontSize;
                        textMirror.style.fontFamily = computed.fontFamily;
                        textMirror.style.fontWeight = computed.fontWeight;
                        textMirror.style.paddingLeft = computed.paddingLeft;
                        textMirror.style.paddingRight = computed.paddingRight;
                        textMirror.style.border = computed.border;
                        textMirror.style.borderRadius = computed.borderRadius;
                        textMirror.style.backgroundColor = computed.backgroundColor;
                        textMirror.style.textAlign = computed.textAlign;

                        // Dim text color if it's just displaying a placeholder
                        textMirror.style.color = input.value ? computed.color : '#6c757d'; 

                        // 🔥 THE BOOTSTRAP VERTICAL CENTERING FIX:
                        // Instead of letting line-height break, we lock text using flex centering
                        textMirror.style.display = 'flex';
                        textMirror.style.alignItems = 'center';

                        // 4. Hide Bootstrap's actual input field and inject our layout-safe text container
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
