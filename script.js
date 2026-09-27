// 1. Wait for the browser to build the HTML elements
document.addEventListener('DOMContentLoaded', function() {

    // 2. NOW it is safe to look for your button
    const downloadBtn = document.getElementById('download-btn');
    const formElement = document.getElementById('form-container');

    downloadBtn.addEventListener('click', function () {
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
        });
    });

});
