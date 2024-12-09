function addMusicDisc(){
    const musicDiscContainer = document.getElementById('playlist-div');

    // Create a new music-disc-input-div element
    const newMusicDisc = document.createElement('div');
    newMusicDisc.classList.add('song');

    // Add inner HTML for the new music-disc-input-div
    newMusicDisc.innerHTML = `
        <li class = "song-image-li song-item">
            <div class = "song-image-container">
                <img src="dummy" class="song-image" alt="Disc Texture">
            </div>
        </li>
        <li class = "song-title-li song-item">
            <div class="song-title">
                Title
            </div>
        </li>
        <li class = "song-author-li song-item">
            <div class="song-author">
                Author
            </div>
        </li>
        <li class = "song-file-li song-item">
            <div class="song-file">
                File
            </div>
        </li>
        <li class = "song-length-li song-item">
            <div class="song-length">
                Time
            </div>
        </li>
        <li class = "song-remove song-item">
            <div id="removeSong" class="remove-song-button ">
                <span class = "cross-sign" onclick="addMusicDisc()">⨉</span>
            </div>
        </li>
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