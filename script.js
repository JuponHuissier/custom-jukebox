const wantedCharacters = 'a-z0-9 ';
const unwantedCharactersPattern = new RegExp(`[^${wantedCharacters}]`, 'g');
//Default Image Preview
document.addEventListener('DOMContentLoaded', function() {
    // Show default image when the page loads
    const defaultImagePath = 'default_jukebox_pack_image.png'; // Adjust path as needed
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
    console.log(input)
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

// Function to update label text with selected file name
function updateButtonLabel(event) {
    const fileInput = event.target;
    const fileName = fileInput.files[0].name;
    const uploadLabel = fileInput.nextElementSibling; // Assuming label is next sibling
    uploadLabel.textContent = fileName;
}

function removeMusicDisc(button) {
    // Get the parent element (music-disc-input-div) of the button clicked
    const musicDiscDiv = button.parentNode;
    
    // Remove the music-disc-input-div from its parent container
    musicDiscDiv.parentNode.removeChild(musicDiscDiv);
}

// Function to add new music-disc-input-div
function addMusicDisc() {
    const musicDiscContainer = document.getElementById('musicDiscContainer');

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

//Get Audio Duration
function getAudioDuration(soundFile) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(URL.createObjectURL(soundFile));

        audio.addEventListener('loadedmetadata', function() {
            const duration = audio.duration;
            resolve(duration);
        });

        audio.addEventListener('error', function(e) {
            reject(e);
        });
    });
}

function createMcFunction(zip,name){
    const textContent = `#give ${name} to player\ngive @s minecraft:music_disc_13[minecraft:jukebox_playable={song:"new_music:${name}"}]`;
    zip.file(`data/new_music/function/${name}.mcfunction`, textContent);
}

// Function to handle music disc inputs and create JSON data
async function createMusicDiscJson(zip) {
    const musicDiscInputs = document.querySelectorAll('.music-disc-input-div input[type="file"]');
    const musicDiscTextInputs = document.querySelectorAll('.music-disc-input-div input[type="text"]');
    const filePromises = [];
    const musicDiscData = {}; // Object to hold music disc data

    for (let i = 0; i < musicDiscTextInputs.length; i += 2) {
        const name = musicDiscTextInputs[i].value;
        const author = musicDiscTextInputs[i + 1].value;
        const soundFile = musicDiscInputs[i % 2].files[0];
        console.log(unwantedCharactersPattern)
        
        const cleanedInput = name.replace(unwantedCharactersPattern, '_');
        const cleanedName = cleanedInput.replace(/ /g, '_');

        try {
            // Wait for audio duration retrieval
            const duration = await getAudioDuration(soundFile);
            console.log('Duration:', duration, 'seconds');

            const musicDataJSON = {
                comparator_output: 1,
                description: author.concat(' - ', name),
                length_in_seconds: duration, // Assign the retrieved duration here
                sound_event: {
                    sound_id: `minecraft:music_disc.${cleanedName}`
                }
            };
            console.log(cleanedName)
            zip.file(`data/new_music/jukebox_song/${cleanedName}.json`, JSON.stringify(musicDataJSON, null, 2));
        } catch (error) {
            console.error('Error while loading audio:', error);
            // Handle error as needed
        }

        try {
            //wait for function creation
            await createMcFunction(zip,cleanedName)
        } catch (error) {
            console.error('Error while loading audio:', error);
            // Handle error as needed
        }
    }

    // Processing other file inputs (sounds)
    musicDiscInputs.forEach((fileInput, index) => {
        const file = fileInput.files[0];
        if (file) {
            const musicDiscPromise = new Promise((innerResolve, innerReject) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Add sound data to music disc object
                    const nameUsed = removeFileExtension(file.name);
                    const soundData = {
                        name: `records/music_disc_${index + 1}_${nameUsed}`
                    };

                    const musicDiscName = `music_disc.${musicDiscTextInputs[index * 2].value.replace(unwantedCharactersPattern, '_')}`;
                    if (!musicDiscData[musicDiscName]) {
                        musicDiscData[musicDiscName] = { sounds: [] };
                    }
                    musicDiscData[musicDiscName].sounds.push(soundData);

                    // Add file to ZIP
                    zip.file(`assets/minecraft/sounds/records/music_disc_${index + 1}_${file.name}`, event.target.result.split(',')[1], { base64: true });

                    innerResolve();
                };
                reader.readAsDataURL(file);
            });
            filePromises.push(musicDiscPromise);
        }
    });

    // Wait for all file promises to resolve
    await Promise.all(filePromises);

    // Convert music disc data object to JSON string
    const musicDiscDataJson = JSON.stringify(musicDiscData, null, 2);

    // Add JSON file to ZIP
    zip.file('assets/minecraft/sounds.json', musicDiscDataJson);
}


// Function to create main pack JSON data
function createPackJson() {
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

    return jsonData;
}

// Event listener for download button
document.getElementById('downloadDataButton').addEventListener('click', async function() {
    const packName = document.getElementById('packName').value ;
    const packImageFileInput = document.getElementById('image');
    const packImage = packImageFileInput.files[0];
    const zip = new JSZip();

    // Create pack data JSON
    const packJson = createPackJson();
    zip.file("pack.mcmeta", JSON.stringify(packJson, null, 2));

    if (packImage){
        zip.file('pack.png', packImage, { base64: true });
    }
    else {
        const response = await fetch("default_jukebox_pack_image.png");
        const arrayBuffer = await response.arrayBuffer();
        zip.file('pack.png', arrayBuffer)
    }
    // Create music disc data JSON and add to zip
    createMusicDiscJson(zip)
        .then(() => {
            // Generate and download ZIP file
            return zip.generateAsync({ type: "blob" });
        })
        .then((content) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `${packName}.zip`;
            link.click();
        })
        .catch((error) => {
            console.error('Error generating ZIP file:', error);
            // Handle error appropriately
        });
});
