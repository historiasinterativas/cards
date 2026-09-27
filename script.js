 document.getElementById('download-btn').addEventListener('click', function () {
            // Select the form element
            const formElement = document.getElementById('form-container');

            // Use html2canvas to take a snapshot of the div
            html2canvas(formElement, {
                useCORS: true,       // Helps load external images if you have any in the form
                scale: 2             // Doubles the resolution for a crisp, high-quality PNG
            }).then(canvas => {
                // Convert the canvas data to a PNG data URL
                const imageURI = canvas.toDataURL('image/png');
                
                // Create a temporary anchor element to force download
                const link = document.createElement('a');
                link.download = 'user-form.png'; // The default filename
                link.href = imageURI;
                
                // Trigger the click event on the link to start the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
