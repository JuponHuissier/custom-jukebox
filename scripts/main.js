let musicDiscIndexId = 0;

  // Get references to the input and label
  const toggle = document.getElementById('toggle');
  const label = document.getElementById('toggle-label');

  // Function to update the label text based on toggle state
  function updateLabel() {
    if (toggle.checked) {
      label.textContent = '1.21.4+';
      label.setAttribute("mc_version","1.21.4")
    } else {
      label.textContent = '1.21';
      label.setAttribute("mc_version","1.21")
    }
  }

  // Add event listener to update text when the toggle changes
  toggle.addEventListener('change', updateLabel);

  // Initial call to set the correct label text
  updateLabel();

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
                    <input type="file" class="file-input" id="songFile${musicDiscIndexId}" accept="audio/ogg" style="display: none;" onchange="showFileName(event, 'songFile${musicDiscIndexId}', ${musicDiscIndexId})">
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
                songLengthDiv.setAttribute("song_length",duration)
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
    const label = document.getElementById('toggle-label');
    const mc_version = label.getAttribute("mc_version")
    try {
        await fetchPackImage(zip);//Fetch Pack Icon

        await fecthPackInfo(zip);//Fetch Pack Description 

        await createMusicDiscsDatapackFile(zip);//Create Every Disc

        await createSoundJSON(zip);//Create sounds.json file

        await fetchSoundFile(zip);//Create the assets for minecraft

        await generateCustomModelData(zip, mc_version);

        await createMcFunction(zip, mc_version);
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

//Generate Assets for Minecraft
async function fetchSoundFile(zip) {
    console.log("Sounds Assets")
    for (let i = 0 ; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song'+i);
        if (songId) {
            //Get the Song Title
            console.log("Song")
            const songTitle = document.getElementById('songTitle'+i).value;
            let songName = await cleanName(songTitle)+i;
            let audioInput = document.getElementById("songFile"+i);
            let audioFile = audioInput.files[0];

            zip.file(`assets/minecraft/sounds/records/music_disc_${songName}.ogg`, audioFile)
        }
        else {
            console.log(`SONG ID : ${i} Removed`)
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
async function createMcFunction(zip,mc_version){
    for (let i = 0 ; i < musicDiscIndexId; i++) {
        const songId = document.getElementById('song'+i);
        if (songId) {
            //Get the Song Title
            const songTitle = document.getElementById('songTitle'+i).value;
            let name = await cleanName(songTitle)+i;
            let textContent
            if (mc_version == "1.21.4")
            {textContent = `#give ${songTitle} to player\ngive @s minecraft:music_disc_13[minecraft:jukebox_playable={song:"new_music:${name}"},minecraft:custom_model_data={strings:["${name}"]}]`;}
            else {
                textContent = `#give ${songTitle} to player\ngive @s minecraft:music_disc_13[minecraft:jukebox_playable={song:"new_music:${name}"},minecraft:custom_model_data=${i+37000}]`;
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

async function cleanName(dirtyName) {
    const dirt = dirtyName ;
    const dust = removeFileExtension(dirt);
    const stone = dust.replace(unwantedCharactersPattern,'_')
    const cleanedName = stone.toLowerCase()
    return cleanedName
}

