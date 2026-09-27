 document.getElementById('myForm').addEventListener('submit', function (e) {
            // 1. Halt default native browser page routing refresh behavior
            e.preventDefault();

            const form = this;
            const submitBtn = document.getElementById('submitBtn');
            const captureArea = document.getElementById('captureArea');

            // Visually visually signal processing states to avoid double clicks
            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";

            // 2. Prepare canvas rendering rules 
            const options = {
                scale: 2,             
                useCORS: true,        
                backgroundColor: null 
            };

            // 3. Chain execution: Process font verification -> Generate image -> Send text data
            document.fonts.ready.then(function() {
                html2canvas(captureArea, options).then(function (canvas) {
                    
                    // --- STEP A: PNG FILE DOWNLOADING ---
                    const imageURl = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.href = imageURl;
                    downloadLink.download = 'form-submission.png';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);

                    // --- STEP B: BACKEND SERVER API SUBMISSION ---
                    // Capture input selections from the fields
                    const formData = new FormData(form);

                    // If you also want to send the raw image file payload directly to your database:
                    // formData.append('form_image', imageURl);

                    fetch(form.action, {
                        method: form.method,
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            alert("Success! Form data sent and image saved.");
                            form.reset(); // Wipe inputs clear for next transaction context
                        } else {
                            alert("Form text data transmission failed, but image downloaded.");
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert("Network error encountered during data dispatch step.");
                    })
                    .finally(() => {
                        // Re-enable button state
                        submitBtn.disabled = false;
                        submitBtn.innerText = "Submit & Download Form";
                    });

                });
            });
        });
