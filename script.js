function addMusicDisc(){
    const musicDiscContainer = document.getElementById('playlist-div');

    // Create a new music-disc-input-div element
    const newMusicDisc = document.createElement('div');
    newMusicDisc.classList.add('music-disc-input-div');

    // Add inner HTML for the new music-disc-input-div
    newMusicDisc.innerHTML = `
        <div class="input-group">
            <label for="name">Enter Name:</label>
            <input type="text" id="name" name="name">
        </div>
        <div class="input-group">
            <label for="author">Enter Author Name:</label>
            <input type="text" id="author" name="author">
        </div>
        <div class="input-group">
            <input type="file" class="file-input" name="file" accept="audio/ogg" style="display: none;">
            <label class="upload-label">Upload File</label>
        </div>
        <button class="remove-button" onclick="removeMusicDisc(this)">Remove</button>
    `;


    // Append the new music-disc-input-div to the container
    musicDiscContainer.appendChild(newMusicDisc);

    // Attach event listener for file input to new music-disc-input-div
    const newFileInput = newMusicDisc.querySelector('.file-input');
    const newUploadLabel = newMusicDisc.querySelector('.upload-label');

    newFileInput.addEventListener('change', updateButtonLabel);
    newUploadLabel.addEventListener('click', () => {
        newFileInput.click();
    });

}