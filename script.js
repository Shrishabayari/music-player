class MusicPlayer {
            constructor() {
                // Initialize DOM elements
                this.audioPlayer = document.getElementById('audioPlayer');
                this.playBtn = document.getElementById('playBtn');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.volumeSlider = document.getElementById('volumeSlider');
                this.volumeIcon = document.getElementById('volumeIcon');
                this.progressBar = document.getElementById('progressBar');
                this.progressFill = document.getElementById('progressFill');
                this.currentTimeEl = document.getElementById('currentTime');
                this.totalTimeEl = document.getElementById('totalTime');
                this.songTitle = document.getElementById('songTitle');
                this.songArtist = document.getElementById('songArtist');
                this.songAlbum = document.getElementById('songAlbum');
                this.albumArt = document.getElementById('albumArt');
                this.fileInput = document.getElementById('fileInput');
                this.playlistContainer = document.getElementById('playlistContainer');

                // Player state
                this.playlist = [];
                this.currentSongIndex = 0;
                this.isPlaying = false;
                this.isLooping = false;
                this.isShuffling = false;

                // Initialize event listeners
                this.initializeEventListeners();
                
                // Set initial volume
                this.audioPlayer.volume = 0.5;
                
                // Load demo songs
                this.loadDemoSongs();
            }

            // Initialize all event listeners
            initializeEventListeners() {
                // Control buttons
                this.playBtn.addEventListener('click', () => this.togglePlay());
                this.prevBtn.addEventListener('click', () => this.previousSong());
                this.nextBtn.addEventListener('click', () => this.nextSong());

                // Volume control
                this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

                // Progress bar
                this.progressBar.addEventListener('click', (e) => this.seek(e));

                // Audio events
                this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDisplay());
                this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
                this.audioPlayer.addEventListener('ended', () => this.songEnded());
                this.audioPlayer.addEventListener('error', (e) => this.handleError(e));

                // File input
                this.fileInput.addEventListener('change', (e) => this.handleFileInput(e));

                // Keyboard controls
                document.addEventListener('keydown', (e) => this.handleKeyboard(e));
            }

            // Load demo songs (simulated)
            loadDemoSongs() {
                // Since we can't include actual audio files, we'll create a demo structure
                // In a real application, you would load actual audio files
                const demoSongs = [
                    {
                        title: 'Sample Song 1',
                        artist: 'Demo Artist',
                        album: 'Demo Album',
                        src: null // Would be actual audio file URL
                    },
                    {
                        title: 'Sample Song 2',
                        artist: 'Demo Artist',
                        album: 'Demo Album',
                        src: null // Would be actual audio file URL
                    },
                    {
                        title: 'Sample Song 3',
                        artist: 'Demo Artist',
                        album: 'Demo Album',
                        src: null // Would be actual audio file URL
                    }
                ];

                // this.playlist = demoSongs;
                // this.updatePlaylistDisplay();
            }

            // Handle file input
            handleFileInput(event) {
                const files = Array.from(event.target.files);
                
                files.forEach(file => {
                    if (file.type.startsWith('audio/')) {
                        const song = {
                            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                            artist: 'Unknown Artist',
                            album: 'Unknown Album',
                            src: URL.createObjectURL(file),
                            file: file
                        };
                        
                        this.playlist.push(song);
                    }
                });
                
                this.updatePlaylistDisplay();
                
                // If no song is currently loaded, load the first song
                if (this.playlist.length === 1) {
                    this.loadSong(0);
                }
            }

            // Load a song
            loadSong(index) {
                if (index >= 0 && index < this.playlist.length) {
                    this.currentSongIndex = index;
                    const song = this.playlist[index];
                    
                    this.audioPlayer.src = song.src;
                    this.songTitle.textContent = song.title;
                    this.songArtist.textContent = song.artist;
                    this.songAlbum.textContent = song.album;
                    
                    // Update album art
                    this.albumArt.textContent = '🎵';
                    
                    // Update playlist display
                    this.updatePlaylistDisplay();
                }
            }

            // Toggle play/pause
            togglePlay() {
                if (this.playlist.length === 0) {
                    alert('Please add some songs to your playlist first!');
                    return;
                }

                if (this.isPlaying) {
                    this.audioPlayer.pause();
                    this.playBtn.textContent = '▶';
                    this.isPlaying = false;
                } else {
                    this.audioPlayer.play().catch(e => {
                        console.error('Error playing audio:', e);
                        alert('Unable to play this audio file. Please try another format.');
                    });
                    this.playBtn.textContent = '⏸';
                    this.isPlaying = true;
                }
            }

            // Previous song
            previousSong() {
                if (this.playlist.length === 0) return;
                
                let prevIndex = this.currentSongIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = this.playlist.length - 1;
                }
                
                this.loadSong(prevIndex);
                if (this.isPlaying) {
                    this.audioPlayer.play();
                }
            }

            // Next song
            nextSong() {
                if (this.playlist.length === 0) return;
                
                let nextIndex = this.currentSongIndex + 1;
                if (nextIndex >= this.playlist.length) {
                    nextIndex = 0;
                }
                
                this.loadSong(nextIndex);
                if (this.isPlaying) {
                    this.audioPlayer.play();
                }
            }

            // Set volume
            setVolume(value) {
                this.audioPlayer.volume = value / 100;
                
                // Update volume icon
                if (value == 0) {
                    this.volumeIcon.textContent = '🔇';
                } else if (value < 50) {
                    this.volumeIcon.textContent = '🔉';
                } else {
                    this.volumeIcon.textContent = '🔊';
                }
            }

            // Seek to position
            seek(event) {
                if (this.audioPlayer.duration) {
                    const rect = this.progressBar.getBoundingClientRect();
                    const percent = (event.clientX - rect.left) / rect.width;
                    this.audioPlayer.currentTime = percent * this.audioPlayer.duration;
                }
            }

            // Update progress bar
            updateProgress() {
                if (this.audioPlayer.duration) {
                    const percent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                    this.progressFill.style.width = percent + '%';
                    
                    // Update time display
                    this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
                    this.totalTimeEl.textContent = this.formatTime(this.audioPlayer.duration);
                }
            }

            // Update display when song loads
            updateDisplay() {
                this.updateProgress();
            }

            // Handle song end
            songEnded() {
                console.log('Song ended.');
                // Check if there's a next song in the playlist
                if (this.currentSongIndex < this.playlist.length - 1) {
                    console.log('Playing next song in sequence.');
                    this.nextSong(); // Play the next song
                } else {
                    console.log('Last song ended. Stopping playback.');
                    this.audioPlayer.pause(); // Pause the audio
                    this.audioPlayer.currentTime = 0; // Reset current time to beginning
                    this.playBtn.textContent = '▶'; // Change play button to play icon
                    this.isPlaying = false; // Update playback state
                    this.updateProgress(); // Update progress bar to show it's at the start
                    this.updatePlaylistDisplay(); // Ensure active class is removed if desired
                }
            }

            // Format time in MM:SS
            formatTime(seconds) {
                if (isNaN(seconds)) return '0:00';
                
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);
                return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }

            // Update playlist display
            updatePlaylistDisplay() {
                this.playlistContainer.innerHTML = '';
                
                if (this.playlist.length === 0) {
                    this.playlistContainer.innerHTML = `
                        <div class="playlist-item" style="text-align: center; color: rgba(255, 255, 255, 0.6);">
                            Add songs to start listening
                        </div>
                    `;
                    return;
                }
                
                this.playlist.forEach((song, index) => {
                    const item = document.createElement('div');
                    item.className = 'playlist-item';
                    if (index === this.currentSongIndex) {
                        item.classList.add('active');
                    }
                    
                    item.innerHTML = `
                        <div class="playlist-item-title">${song.title}</div>
                        <div class="playlist-item-artist">${song.artist}</div>
                    `;
                    
                    item.addEventListener('click', () => {
                        this.loadSong(index);
                        if (this.isPlaying) {
                            this.audioPlayer.play();
                        }
                    });
                    
                    this.playlistContainer.appendChild(item);
                });
            }

            // Handle keyboard shortcuts
            handleKeyboard(event) {
                switch(event.code) {
                    case 'Space':
                        event.preventDefault();
                        this.togglePlay();
                        break;
                    case 'ArrowLeft':
                        event.preventDefault();
                        this.previousSong();
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        this.nextSong();
                        break;
                    case 'ArrowUp':
                        event.preventDefault();
                        this.volumeSlider.value = Math.min(100, parseInt(this.volumeSlider.value) + 10);
                        this.setVolume(this.volumeSlider.value);
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        this.volumeSlider.value = Math.max(0, parseInt(this.volumeSlider.value) - 10);
                        this.setVolume(this.volumeSlider.value);
                        break;
                }
            }

            // Handle audio errors
            handleError(event) {
                console.error('Audio error:', event);
                this.playBtn.textContent = '▶';
                this.isPlaying = false;
            }
        }

        // Initialize the music player when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new MusicPlayer();
        });