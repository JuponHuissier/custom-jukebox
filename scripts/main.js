let musicDiscIndexId = 0

function addMusicDisc(){
    const musicDiscContainer = document.getElementById('playlist-div');

    // Create a new music-disc-input-div element
    const newMusicDisc = document.createElement('div');
    newMusicDisc.classList.add('song');
    newMusicDisc.id = 'song'+ musicDiscIndexId

    // Add inner HTML for the new music-disc-input-div
    newMusicDisc.innerHTML = `
            <li class="song-image-li song-item">
                <div class="song-image-container">
                    <label for="songImageInput${musicDiscIndexId}" class="song-image-label">
                        <div class="song-image" id="songImagePreview${musicDiscIndexId}">
                            <span class="upload-text">Upload Image</span>
                        </div>
                    </label>
                    <input type="file" id="songImageInput${musicDiscIndexId}" name="song-image-input" class="song-image-input" accept="image/png" style="display: none;" onchange="showImage(event, 'songImagePreview${musicDiscIndexId}', true)"/>
                </div>
            </li>
            <li class="song-title-li song-item">
                <div class="song-title">
                    <input type="text" class="song-title-input text-input" id="songTitle${musicDiscIndexId}" placeholder="Enter title" value="Title">
                </div>
            </li>
            <li class="song-author-li song-item">
                <div class="song-author">
                    <input type="text" class="song-author-input text-input" id="songAuthor${musicDiscIndexId}" placeholder="Enter author" value="Author">
                </div>
            </li>
            <li class="song-file-li song-item">
                <div class="song-file">
                    <label for="songFile${musicDiscIndexId}" class="song-file-label">
                        No File &#10515
                    </label>
                    <input type="file" class="file-input" id="songFile${musicDiscIndexId}" accept="audio/*" style="display: none;" onchange="showFileName(event, 'songFile${musicDiscIndexId}', ${musicDiscIndexId})">
                </div>
            </li>
            <li class="song-length-li song-item">
                <div class="song-length" id="songFileLength${musicDiscIndexId}">
                    00:00
                </div>
            </li>
            <li class="song-remove song-item">
                <div id="removeSong" class="remove-song-button">
                    <span class="cross-sign" onclick="removeMusicDisc('song${musicDiscIndexId}')">⨉</span>
                </div>
            </li>
    `;

    //Add 1 to musicDiscIndexId
    musicDiscIndexId = musicDiscIndexId + 1
    // Append the new music-disc-input-div to the container
    musicDiscContainer.appendChild(newMusicDisc);

}

//Remove Song from Playlist
function removeMusicDisc(songId) {
    const element = document.getElementById(songId); // Get the element by id

    if (element) {
        element.remove();
        console.log(`Element with id '${songId}' has been removed.`);
    } else {
        console.log(`Element with id '${songId}' not found.`);
    }
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
    console.log(elementId)
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

// Function to update the label with the file name
function showFileName(event, elementId, songIndex) {
    const input = event.target;

    if (input.files && input.files[0]) {
        const audioFile = input.files[0];
        const fileName = input.files[0].name; // Get the file name
        const label = document.querySelector(`label[for="${elementId}"]`);
        console.log(fileName)
        if (label) {
            label.textContent = fileName; // Update the label text with the file name
            updateAudioLength(audioFile, songIndex)
        }
    }
}

// Function to get the duration of a song

function updateAudioLength(file, songIndex) {
    const songLengthDiv = document.getElementById("songFileLength"+songIndex)
    const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration; // Get duration in seconds
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60).toString().padStart(2, '0');

            // Update the label with file name and audio duration
            if (songLengthDiv) {
                songLengthDiv.setAttribute("song_legnth",duration)
                songLengthDiv.innerHTML = `${minutes}:${seconds}`;
            }
        });
}

// GENERATING PACK CODE //

// Main Function
const wantedCharacters = 'a-zA-Z0-9';
const unwantedCharactersPattern = new RegExp(`[^${wantedCharacters}]`, 'g');

async function download() { //Start
    //Loading Animation
    loadingAnimationActivate();

    //Creating the Zip
    const zip = new JSZip();
    const packName = document.getElementById('packTitle').value;
    try {
        await fetchPackImage(zip);//Fetch Pack Icon

        await fecthPackInfo(zip);//Fetch Pack Description 


        // Generate and download ZIP file
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${packName}.zip`;
        link.click();
    } catch (error) {
        console.error('Error generating ZIP file:', error);
        // Handle error appropriately
    } finally {
        loadingAnimationDeactivate();
    }
}


//Loading Animation

function loadingAnimationActivate () {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Show loader
}

function loadingAnimationDeactivate () {
    const loader = document.getElementById('loader');
    loader.style.display = 'none'; // Hide loader
}

// Fetch an Image for the Pack

async function fetchPackImage(zip) {
    const packImageFileInput = document.getElementById('pack-icon-input');
    const packImage = packImageFileInput.files[0];
    if (packImage) {
        zip.file('pack.png', packImage, { base64: true });
    } else {
        const response = await fetch("images/default_jukebox_pack_image.png");
        const arrayBuffer = await response.arrayBuffer();
        zip.file('pack.png', arrayBuffer);
    }
}

//Pack Description In-Game
async function fecthPackInfo(zip) {
    const packVersion = parseInt(document.getElementById('packVersion').value, 10);
    const packDescription = document.getElementById('packDescription').value;
    const jsonData = 
    {
        pack: {
          pack_format: packVersion,
          supported_formats: [34, 45],
          description: packDescription.replace(/\\n/g, '\n')
        },
        overlays: {
            entries: [
                {
                    formats: {min_inclusive: 18, max_inclusive: 2147483647},
                    directory: "overlay_18"
                }
            ]
        }
    }

    zip.file("pack.mcmeta", JSON.stringify(jsonData, null, 2));
}

//Remove file extension
function removeFileExtension(fileName) {
    // Find the last dot (.) in the string
    const lastDotIndex = fileName.lastIndexOf('.');
    
    if (lastDotIndex === -1) {
        // If there's no dot in the fileName, return the fileName as is
        return fileName;
    } else {
        // Otherwise, return the part of the fileName up to the last dot
        return fileName.substring(0, lastDotIndex);
    }
}