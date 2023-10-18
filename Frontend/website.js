// Function to handle file upload
function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const fileInput1 = document.getElementById("fileInput1");
    const fileNameDisplay = document.getElementById("fileName");
    const progress = document.getElementById("progress");

    const file = fileInput.files[0];
    const file1 = fileInput1.files[0];

    
    if (!file || !file1) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file1", file1)

     // Check if the file type is either .wav or .mp3
     const allowedFileTypes = ["audio/wav", "audio/mpeg"];
     if (!allowedFileTypes.includes(file.type) || !allowedFileTypes.includes(file1.type)) {
         alert("Please upload a valid .wav or .mp3 file.");
         return;
     }

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
        fileNameDisplay.innerText = `Files uploaded: ${file.name, file1.name}`;
        alert("File uploaded successfully.");
    })
    .catch(error => {
        console.error("Error uploading file:", error);
    });
}
