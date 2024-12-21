function addMusicDisc(){
    const musicDiscContainer = document.getElementById('playlist-div');

    // Create a new music-disc-input-div element
    const newMusicDisc = document.createElement('div');
    newMusicDisc.classList.add('song');

    // Add inner HTML for the new music-disc-input-div
    newMusicDisc.innerHTML = `
            <li class="song-image-li song-item">
                <div class="song-image-container">
                    <label for="song-image-input" class="song-image-label">
                        <img src="dummy" class="song-image" alt="Disc Texture">
                    </label>
                    <input type="file" id="song-image-input" class="song-image-input" accept="image/*" style="display: none;" />
                </div>
            </li>
            <li class="song-title-li song-item">
                <div class="song-title">
                    <input type="text" class="song-title-input text-input" placeholder="Enter title" value="Title">
                </div>
            </li>
            <li class="song-author-li song-item">
                <div class="song-author">
                    <input type="text" class="song-author-input text-input" placeholder="Enter author" value="Author">
                </div>
            </li>
            <li class="song-file-li song-item">
                <div class="song-file">
                    <label for="song-file-input" class="song-file-label">
                        No File &#10515
                    </label>
                    <input type="file" id="song-file-input" class="file-input" accept="audio/*" style="display: none;">
                </div>
            </li>
            <li class="song-length-li song-item">
                <div class="song-length">
                    00:00
                </div>
            </li>
            <li class="song-remove song-item">
                <div id="removeSong" class="remove-song-button">
                    <span class="cross-sign" onclick="addMusicDisc()">⨉</span>
                </div>
            </li>
    `;


    // Append the new music-disc-input-div to the container
    musicDiscContainer.appendChild(newMusicDisc);

}

//Show Pack Icon

document.addEventListener('DOMContentLoaded', function() {
    // Show default image when the page loads
    const defaultImagePath = 'images/default_jukebox_pack_image.png'; // Adjust path as needed
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.style.backgroundImage = 'url(' + defaultImagePath + ')';
    const uploadText = imagePreview.querySelector('.upload-text');
    if (uploadText) {
        uploadText.style.display = 'block'; // Show the upload text
    }
});
// Function to show image preview
function showImage(event, elementId, hideText) {
    const input = event.target;
    // console.log(input)
    const reader = new FileReader();
    reader.onload = function() {
        const imagePreview = document.getElementById(elementId);
        imagePreview.style.backgroundImage = 'url(' + reader.result + ')';
        const uploadText = imagePreview.querySelector('.upload-text');
        if (uploadText && hideText) {
            uploadText.style.display = 'none'; // Hide the upload text
        }
    }
    reader.readAsDataURL(input.files[0]);
}