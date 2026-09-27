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
                scale: 2,         
                useCORS: true,
                logging: false,   
                onclone: (clonedDoc) => {
                    const clonedCaptureArea = clonedDoc.getElementById('captureArea');
                    if (!clonedCaptureArea) return;

                    // ==========================================
                    // 1. FIX TEXT INPUTS & DROPDOWNS (<select>)
                    // ==========================================
                    const inputsAndSelects = clonedCaptureArea.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea, select');

                    inputsAndSelects.forEach(input => {
                        const textMirror = clonedDoc.createElement('div');
                        
                        // Extract value: For selects, grab the currently chosen option text
                        if (input.tagName === 'SELECT') {
                            textMirror.textContent = input.options[input.selectedIndex]?.text || '';
                        } else {
                            textMirror.textContent = input.value || input.placeholder || ' ';
                        }
                        
                        const computed = window.getComputedStyle(input);
                        
                        // Exact box replica layout
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

                        // Dim text color if it's just displaying a placeholder
                        if (input.tagName !== 'SELECT') {
                            textMirror.style.color = input.value ? computed.color : '#6c757d';
                        } else {
                            textMirror.style.color = computed.color;
                        }

                        // Alignment structure
                        textMirror.style.display = 'flex';
                        textMirror.style.alignItems = 'center';
                        
                        // 🔥 CENTERING FIX: Check if the text should be centered
                        if (computed.textAlign === 'center' || input.classList.contains('text-center')) {
                            textMirror.style.justifyContent = 'center';
                            textMirror.style.textAlign = 'center';
                        } else {
                            textMirror.style.justifyContent = 'flex-start';
                        }

                        input.style.display = 'none';
                        input.parentNode.insertBefore(textMirror, input);
                    });

                    // ==========================================
                    // 2. FIX RADIO BUTTON BULLETS DISAPPEARING
                    // ==========================================
                    const radios = clonedCaptureArea.querySelectorAll('input[type="radio"]');

                    radios.forEach(radio => {
                        // Create a visual replacement wrapper circle
                        const radioMirror = clonedDoc.createElement('span');
                        
                        // Copy exact sizing layouts from standard Bootstrap radio check boxes
                        radioMirror.style.display = 'inline-block';
                        radioMirror.style.width = '1em';
                        radioMirror.style.height = '1em';
                        radioMirror.style.verticalAlign = 'middle';
                        radioMirror.style.border = '1px solid #dee2e6';
                        radioMirror.style.borderRadius = '50%';
                        radioMirror.style.backgroundColor = '#fff';
                        radioMirror.style.position = 'relative';
                        radioMirror.style.marginRight = '0.5rem'; // Replaces default bootstrap margins

                        // 🔥 DRAW BULLET IF CHECKED: Rebuild the Bootstrap circle color overlay dynamically
                        if (radio.checked) {
                            radioMirror.style.borderColor = '#0d6efd'; // Bootstrap Primary Blue
                            radioMirror.style.backgroundColor = '#0d6efd';

                            const innerDot = clonedDoc.createElement('span');
                            innerDot.style.position = 'absolute';
                            innerDot.style.top = '50%';
                            innerDot.style.left = '50%';
                            innerDot.style.transform = 'translate(-50%, -50%)';
                            innerDot.style.width = '4.5px';
                            innerDot.style.height = '4.5px';
                            innerDot.style.borderRadius = '50%';
                            innerDot.style.backgroundColor = '#fff'; // White inner dot
                            
                            radioMirror.appendChild(innerDot);
                        }

                        // Hide native element and slide our custom graphic box directly into alignment
                        radio.style.display = 'none';
                        radio.parentNode.insertBefore(radioMirror, radio);
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
