// Function to handle file upload
function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");
    const progress = document.getElementById("progress");

    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // You can use a server endpoint to handle the file upload.
    // In this example, we are using the JSONPlaceholder API to simulate a file upload.
    fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "POST",
        body: formData,
        headers: {
            // Include any required headers here
        },
        onprogress: function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progress.value = percentComplete;
            }
        }
    })
    .then(response => response.json())
    .then(data => {
        fileNameDisplay.innerText = `File uploaded: ${file.name}`;
        alert("File uploaded successfully.");
    })
    .catch(error => {
        console.error("Error uploading file:", error);
    });
}
