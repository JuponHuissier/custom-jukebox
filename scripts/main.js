let musicDiscIndexId = 0;

  // Get references to the input and label
  const toggle = document.getElementById("triple-toggle");
  const knob = toggle.querySelector(".toggle-knob");
  const label = document.getElementById("selected-label");
  const options = ["1.21.1-1.21.3", "1.21.4", "1.21.5+"];
  const mc_versions = ["1.21.1-1.21.3", "1.21.4", "1.21.4"];
  let state = 0;
  
  const updateToggle = () => {
    console.log(state)
      knob.style.transform = `translateX(${state * 60}px)`;
      label.textContent = options[state];
      label.setAttribute("mc_version", mc_versions[state]);
      label.setAttribute("data-index",  state);
  };
  
  toggle.addEventListener("click", () => {
      state = (state + 1) % 3;
      updateToggle();
  });
  
  updateToggle();
  
// Enable sorting for playlist-div
function enableSorting() {
    const playlistDiv = document.getElementById('playlist-div');
    const songs = playlistDiv.querySelectorAll('.song');

    songs.forEach(song => {
        song.setAttribute('draggable', true);

        song.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', song.id);
            song.classList.add('dragging');
        });

        song.addEventListener('dragend', () => {
            song.classList.remove('dragging');
        });
    });

    playlistDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
        const draggingElement = playlistDiv.querySelector('.dragging');
        const afterElement = getDragAfterElement(playlistDiv, event.clientY);
        if (afterElement == null) {
            playlistDiv.appendChild(draggingElement);
        } else {
            playlistDiv.insertBefore(draggingElement, afterElement);
        }
    });
}

// Helper function to determine the element after which the dragged element should be placed
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.song:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
// Call enableSorting to activate the sorting functionality

function addMusicDisc(songData = null) {
    const musicDiscContainer = document.getElementById('playlist-div');

    // Create a new music-disc-input-div element
    const newMusicDisc = document.createElement('div');
    newMusicDisc.classList.add('song');
    newMusicDisc.id = 'song' + musicDiscIndexId;

    // Use songData if provided, otherwise use default values
    const title = songData?.title || "Title";
    const author = songData?.author || "Author";
    const fileBlob = songData?.fileBlob || null;
    const imageBlob = songData?.imageBlob || null;
    const length = songData?.length || 0;

    const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : '';
    const fileName = fileBlob ? fileBlob.name : 'No File';
    const formattedLength = `${Math.floor(length / 60)}:${Math.floor(length % 60).toString().padStart(2, '0')}`;

    // Add inner HTML for the new music-disc-input-div
    newMusicDisc.innerHTML = `
        <li class="song-image-li song-item" style="display: flex; align-items: center; gap: 12px;">
            <div class="song-image-container">
                <label for="songImageInput${musicDiscIndexId}" class="song-image-label">
                    <div class="song-image" id="songImagePreview${musicDiscIndexId}" style="background-image: url('${imageUrl}')">
                        <span class="upload-text">${imageBlob ? '' : 'Upload Image'}</span>
                    </div>
                </label>
                <input type="file" id="songImageInput${musicDiscIndexId}" name="song-image-input" class="song-image-input" accept="image/png" style="display: none;" onchange="showImage(event, 'songImagePreview${musicDiscIndexId}', true)"/>
            </div>
            <!-- Animated Spritesheet Toggle placed to the right of the image, outside the container -->
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px;">
                <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer; white-space: nowrap;">
                    <input type="checkbox" id="animatedToggle${musicDiscIndexId}" class="animated-toggle" style="margin: 0;">
                    Animated
                </label>
                <input type="number" id="animatedFrames${musicDiscIndexId}" class="animated-frames-input text-input" placeholder="Frametime" min="1" style="display: none;" />
            </div>
        </li>
        <li class="song-title-li song-item">
            <div class="song-title">
                <input type="text" class="song-title-input text-input" id="songTitle${musicDiscIndexId}" placeholder="Enter title" value="${title}">
            </div>
        </li>
        <li class="song-author-li song-item">
            <div class="song-author">
                <input type="text" class="song-author-input text-input" id="songAuthor${musicDiscIndexId}" placeholder="Enter author" value="${author}">
            </div>
        </li>
        <li class="song-file-li song-item">
            <div class="song-file">
                <label for="songFile${musicDiscIndexId}" class="song-file-label">
                    ${fileName}
                </label>
                <input type="file" class="file-input" id="songFile${musicDiscIndexId}" accept="audio/ogg" style="display: none;" onchange="showFileName(event, 'songFile${musicDiscIndexId}', ${musicDiscIndexId})">
            </div>
        </li>
        <li class="song-length-li song-item">
            <div class="song-length" id="songFileLength${musicDiscIndexId}" song_length="${length}">
                ${formattedLength}
            </div>
        </li>
        <li class="song-remove song-item">
            <div id="removeSong" class="remove-song-button">
                <span class="cross-sign" onclick="removeMusicDisc('song${musicDiscIndexId}')">⨉</span>
            </div>
        </li>
    `;

    // Increment the musicDiscIndexId
    musicDiscIndexId++;

    // Append the new music-disc-input-div to the container
    musicDiscContainer.appendChild(newMusicDisc);

    // Enable sorting after adding the new song
    enableSorting();

    // Show/hide number input when animated toggle is checked
    const animatedToggle = newMusicDisc.querySelector('.animated-toggle');
    const animatedFramesInput = newMusicDisc.querySelector('.animated-frames-input');
    if (animatedToggle && animatedFramesInput) {
        animatedToggle.addEventListener('change', function() {
            animatedFramesInput.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// Initialize sorting when the page loads
document.addEventListener('DOMContentLoaded', () => {
    enableSorting();
});

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
                songLengthDiv.setAttribute("song_length",duration)
                songLengthDiv.innerHTML = `${minutes}:${seconds}`;
            }
        });
}

// GENERATING PACK CODE //

// Main Function
const wantedCharacters = 'a-zA-Z0-9';
const unwantedCharactersPattern = new RegExp(`[^${wantedCharacters}]`, 'g');

async function download() { 
    // Start loading animation
    loadingAnimationActivate();

    // Size check before ZIP creation
    let totalSize = 0;
    // Add pack icon size
    const packImageFileInput = document.getElementById('pack-icon-input');
    const packImage = packImageFileInput.files[0];
    if (packImage) {
        totalSize += packImage.size;
    }
    // Add all song files and images
    for (let i = 0; i < musicDiscIndexId; i++) {
        const songFileInput = document.getElementById('songFile' + i);
        const songImageInput = document.getElementById('songImageInput' + i);
        if (songFileInput && songFileInput.files[0]) {
            totalSize += songFileInput.files[0].size;
        }
        if (songImageInput && songImageInput.files[0]) {
            totalSize += songImageInput.files[0].size;
        }
    }
    // 900MB = 943718400 bytes
    if (totalSize > 943718400) {
        loadingAnimationDeactivate();
        window.alert('The total file size exceeds 900MB. Please remove some songs or images to continue.');
        return;
    }

    // Create the ZIP file
    const zip = new JSZip();
    const packName = document.getElementById('packTitle').value;
    const label = document.getElementById('selected-label');
    const mc_version = label.getAttribute("mc_version");
    const dataIndex = label.getAttribute("data-index");

    try {
        await fetchPackImage(zip); // Fetch pack icon
        await fecthPackInfo(zip); // Fetch pack description
        await createMusicDiscsDatapackFile(zip); // Create disc data files
        await createSoundJSON(zip); // Create sounds.json file
        await fetchSoundFile(zip); // Add sound assets
        await generateCustomModelData(zip, mc_version); // Generate custom model data
        await createMcFunction(zip, dataIndex); // Create Minecraft functions

        // Create the manifest file
        await createManifestFile(zip);

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
        loadingAnimationDeactivate(); // Stop loading animation
    }
}
// Create Manifest File
async function createManifestFile(zip) {
    const packTitle = document.getElementById('packTitle').value;
    const packDescription = document.getElementById('packDescription').value.replace(/\\n/g, '\n');
    const packVersion = parseInt(document.getElementById('packVersion').value, 10);
    const packIconPath = 'pack.png'; // Path to the pack icon in the ZIP

    const songs = [];
    for (let i = 0; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song' + i);
        if (songId) {
            const songTitle = document.getElementById('songTitle' + i).value;
            const songAuthor = document.getElementById('songAuthor' + i).value;
            const songLengthDiv = document.getElementById('songFileLength' + i);
            const songLength = Number(songLengthDiv.getAttribute("song_length"));
            const songFilePath = `assets/minecraft/sounds/records/music_disc_${await cleanName(songTitle) + i}.ogg`;
            const songImagePath = `assets/minecraft/textures/item/${await cleanName(songTitle) + i}.png`;
            // Get frametime if animated
            let frametime = undefined;
            let animated = false;
            const animatedToggle = document.getElementById('animatedToggle' + i);
            if (animatedToggle && animatedToggle.checked) {
                animated = true;
                const frametimeInput = document.getElementById('animatedFrames' + i);
                frametime = frametimeInput ? Number(frametimeInput.value) : undefined;
                if (!frametime || isNaN(frametime)) {
                    frametime = 3;
                }
            }
            const songObj = {
                title: songTitle,
                author: songAuthor,
                length: songLength,
                filePath: songFilePath,
                imagePath: songImagePath,
                animated: animated
            };
            if (animated) {
                songObj.frametime = frametime;
            }
            songs.push(songObj);
        }
    }

    const manifest = {
        packTitle: packTitle,
        packDescription: packDescription,
        packVersion: packVersion,
        packIcon: packIconPath,
        songs: songs
    };

    zip.file("manifest.json", JSON.stringify(manifest, null, 2));
}
//Generating Disc Data

async function createMusicDiscsDatapackFile(zip) {
    for (let i = 0 ; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song'+i);
        if (songId) {
            //Get the Song Title
            const songTitle = document.getElementById('songTitle'+i).value;

            //Get the song Author
            const songAuthor = document.getElementById('songAuthor'+i).value;

            //Get the Song Length
            const songLengthDiv = document.getElementById("songFileLength"+i);
            const songLengthString = songLengthDiv.getAttribute("song_length");
            const songLength = Number(+songLengthString)
            if (!songLength) {
                window.alert("A Song has no file");
                throw new Error("A File is Missing")
            }

            let cleanedName = await cleanName(songTitle) + i
            const musicDataJSON = {
                comparator_output: 1,
                description: songAuthor.concat(' - ', songTitle),
                length_in_seconds: songLength, // Assign the retrieved duration here
                sound_event: {
                    sound_id: `minecraft:music_disc.${cleanedName}`
                }
            };
            zip.file(`data/new_music/jukebox_song/${cleanedName}.json`, JSON.stringify(musicDataJSON, null, 2));
        }
        else {
            console.log(`SONG ID : ${i} Removed`)
        }
    }
}

//Generate Disc Sound Index File

async function createSoundJSON(zip) {
    console.log("Sounds.json")
    const musicDiscData = {};
    for (let i = 0 ; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song'+i);
        if (songId) {
            //Get the Song Title
            const songTitle = document.getElementById('songTitle'+i).value;
            let songName = await cleanName(songTitle) + i
            if (!musicDiscData["music_disc."+songName]) {
                musicDiscData["music_disc."+songName] = { sounds: [] };

                const soundData = {
                    name: `records/music_disc_${songName}`,
                    stream: true
                };

                musicDiscData["music_disc."+songName].sounds.push(soundData);
            }

        }
        else {
            console.log(`SONG ID : ${i} Removed`)
        }
    }
    const musicDiscDataJson = JSON.stringify(musicDiscData, null, 2);

    zip.file('assets/minecraft/sounds.json', musicDiscDataJson);
}

async function fetchSoundFile(zip) {
    console.log("Sounds Assets");
    for (let i = 0; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song' + i);
        if (songId) {
            // Get the Song Title
            const songTitle = document.getElementById('songTitle' + i).value;
            const songFileInput = document.getElementById("songFile" + i);
            const songFile = songFileInput.files[0];

            if (!songFile) {
                console.error(`No file selected for song: ${songTitle}`);
                continue;
            }

            const songName = await cleanName(songTitle) + i;
            zip.file(`assets/minecraft/sounds/records/music_disc_${songName}.ogg`, songFile);
        } else {
            console.log(`SONG ID : ${i} Removed`);
        }
    }
}

//Generate Custom Model Data
async function generateCustomModelData(zip, mc_version) {
    console.log("Custom Model Data")
    let data
    //Create the Custom Model Data
    if (mc_version == "1.21.4")
    {data = {
        "model": {
          "type": "select",
          "property": "custom_model_data",
          "fallback": {
            "type": "model",
            "model": "item/music_disc_13"
          },
          "cases": [
          ]
        }
      };}
      else {
        data = {
            "parent": "item/generated",
            "textures": {
                "layer0": "item/music_disc_13"
            },
            
            "overrides": [
            ]
        };
      };
      
    for (let i = 0 ; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song'+i);
        if (songId) {
            //Create the model File
            let discTextureInput = document.getElementById('songImageInput'+i);
            let discTexture = discTextureInput.files[0];
            const songTitle = document.getElementById('songTitle'+i).value;
            let songName = await cleanName(songTitle)+i;
            
            let TextureModelJson = {
                parent: "minecraft:item/generated",
                textures: {
                  layer0: "item/"+songName
                }
              };

            console.log(discTexture)

            const discTextureModelJson = JSON.stringify(TextureModelJson, null, 2);
            if (mc_version=="1.21.4")
            {
            zip.file(`assets/minecraft/models/item/${songName}.json`, discTextureModelJson);
            zip.file(`assets/minecraft/textures/item/${songName}.png`, discTexture);
            }
            else {
            zip.file(`assets/minecraft/models/item/${songName}.json`, discTextureModelJson);
            zip.file(`assets/minecraft/textures/item/${songName}.png`, discTexture);
            }

            // Define the new case you want to add
            if (mc_version == "1.21.4"){
            let newCase = {
                "when": songName,
                "model": {
                "type": "model",
                "model": "item/"+songName
                }
            };
            
            // Add the new case to the 'cases' array
            data.model.cases.push(newCase);
            }
            
            else {
                let newOverride =
                    {"predicate": {"custom_model_data":i+37000}, "model": `item/${songName}`}
                data.overrides.push(newOverride)
            }
            const animatedToggle = document.getElementById('animatedToggle' + i);
            if (animatedToggle && animatedToggle.checked) {
                const frametimeInput = document.getElementById('animatedFrames' + i);
                let frametime = frametimeInput ? Number(frametimeInput.value) : null;
                if (!frametime || isNaN(frametime)) {
                    frametime = 3;
                }
                // Create animation JSON file at the same location as the song texture
                const animationJson = {
                    animation: {
                        frametime: frametime
                    }
                };
                zip.file(`assets/minecraft/textures/item/${songName}.png.mcmeta`, JSON.stringify(animationJson, null, 2));
            }
        }
        else {
            console.log(`SONG ID : ${i} Removed`)
        }
    }
    const jsonCMD = JSON.stringify(data, null, 2);
    if (mc_version == "1.21.4")
    {zip.file(`assets/minecraft/items/music_disc_13.json`, jsonCMD);}
    else {
        zip.file(`assets/minecraft/models/item/music_disc_13.json`, jsonCMD);
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

//Mc Function
async function createMcFunction(zip,dataIndex){
    for (let i = 0 ; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song'+i);
        if (songId) {
            //Get the Song Title
            const songTitle = document.getElementById('songTitle'+i).value;
            let name = await cleanName(songTitle)+i;
            let textContent
            if (dataIndex == "1")
            {textContent = `#give ${songTitle} to player\ngive @s minecraft:music_disc_13[minecraft:jukebox_playable={song:"new_music:${name}"},minecraft:custom_model_data={strings:["${name}"]}]`;}
            if (dataIndex == "0"){
                textContent = `#give ${songTitle} to player\ngive @s minecraft:music_disc_13[minecraft:jukebox_playable={song:"new_music:${name}"},minecraft:custom_model_data=${i+37000}]`;
            }
            if (dataIndex == "2"){
                textContent = `#give ${songTitle} to player\ngive @s minecraft:music_disc_13[minecraft:jukebox_playable="new_music:${name}",minecraft:custom_model_data={strings:["${name}"]}]`;
            }
            zip.file(`data/new_music/function/${name}.mcfunction`, textContent);
        }
        else {
            console.log(`SONG ID : ${i} Removed`)
        }
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
          supported_formats: [34, 79],
          description: packDescription.replace(/\\n/g, '\n')
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

async function cleanName(dirtyName) {
    const dirt = dirtyName ;
    const dust = removeFileExtension(dirt);
    const stone = dust.replace(unwantedCharactersPattern,'_')
    const cleanedName = stone.toLowerCase()
    return cleanedName
}

async function importPack(event) {
    const file = event.target.files[0];
    if (!file) return;

    const zip = new JSZip();
    const contents = await zip.loadAsync(file);

    // Read the manifest file
    const manifestFile = contents.file("manifest.json");
    if (!manifestFile) {
        console.error("Manifest file not found in the ZIP.");
        return;
    }

    const manifest = JSON.parse(await manifestFile.async("string"));

    // Update pack metadata
    document.getElementById('packTitle').value = manifest.packTitle;
    document.getElementById('packDescription').value = manifest.packDescription.replace(/\n/g, '\\n');
    document.getElementById('packVersion').value = manifest.packVersion;

    // Update pack icon
    const packIcon = contents.file(manifest.packIcon);
    if (packIcon) {
        const iconBlob = await packIcon.async("blob");
        const iconUrl = URL.createObjectURL(iconBlob);
        document.getElementById('imagePreview').style.backgroundImage = `url(${iconUrl})`;

        // Simulate manually adding the pack icon file
        const packIconInput = document.getElementById('pack-icon-input');
        const packIconFile = new File([iconBlob], "pack.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(packIconFile);
        packIconInput.files = dataTransfer.files;
    }

    // Add songs to playlist
    manifest.songs.forEach(async (song, index) => {
        const songFile = contents.file(song.filePath);
        const songImage = contents.file(song.imagePath);

        // Check if song file exists
        if (!songFile) {
            console.error(`Song file not found: ${song.filePath}`);
            return;
        }

        // Check if song image exists
        if (!songImage) {
            console.error(`Song image not found: ${song.imagePath}`);
            return;
        }

        // Create Blob objects with correct MIME types
        const songBlob = new Blob([await songFile.async("arraybuffer")], { type: "audio/ogg" });
        const imageBlob = new Blob([await songImage.async("arraybuffer")], { type: "image/png" });

        // Simulate manually adding the song file and image file
        const songFileInput = document.createElement('input');
        songFileInput.type = 'file';
        const songFileObject = new File([songBlob], `music_disc_${index}.ogg`, { type: "audio/ogg" });
        const songFileDataTransfer = new DataTransfer();
        songFileDataTransfer.items.add(songFileObject);
        songFileInput.files = songFileDataTransfer.files;

        const songImageInput = document.createElement('input');
        songImageInput.type = 'file';
        const songImageObject = new File([imageBlob], `song_image_${index}.png`, { type: "image/png" });
        const songImageDataTransfer = new DataTransfer();
        songImageDataTransfer.items.add(songImageObject);
        songImageInput.files = songImageDataTransfer.files;

        // Prepare songData for addMusicDisc
        const songData = {
            title: song.title,
            author: song.author,
            length: Math.floor(song.length), // Round down the length
            fileBlob: songFileObject,
            imageBlob: songImageObject,
            animated: !!song.animated,
            frametime: song.animated ? (song.frametime || 3) : undefined
        };

        addMusicDisc(songData); // Use the updated addMusicDisc function

        // Attach the simulated file inputs to the DOM
        const songElement = document.getElementById(`song${musicDiscIndexId - 1}`);
        const songFileInputElement = songElement.querySelector(`#songFile${musicDiscIndexId - 1}`);
        const songImageInputElement = songElement.querySelector(`#songImageInput${musicDiscIndexId - 1}`);
        songFileInputElement.files = songFileDataTransfer.files;
        songImageInputElement.files = songImageDataTransfer.files;

        // Set animated toggle and frametime in the DOM
        if (songData.animated) {
            const animatedToggle = songElement.querySelector(`#animatedToggle${musicDiscIndexId - 1}`);
            const animatedFramesInput = songElement.querySelector(`#animatedFrames${musicDiscIndexId - 1}`);
            if (animatedToggle) {
                animatedToggle.checked = true;
                if (animatedFramesInput) {
                    animatedFramesInput.style.display = 'block';
                    animatedFramesInput.value = songData.frametime;
                }
            }
        }
    });

    console.log("Pack imported successfully!");
}
