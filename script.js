const videoContainer = document.querySelector('.video-container'),
    boxVideo = document.querySelector('.box-video'),
    boxFile = document.querySelector('.box-file'),
    myVideo = document.getElementById("myVideo"),
    progressBar = document.getElementById("progressBar"),
    progressFilled = document.getElementById("progressFilled"),
    playPauseBtn = document.getElementById("playPauseBtn"),
    rewindBtn = document.getElementById("rewindBtn"),
    forwardBtn = document.getElementById("forwardBtn"),
    volumeSlider = document.getElementById("volumeSlider"),
    currentTime = document.getElementById("currentTime"),
    duration = document.getElementById("duration"),
    muteBtn = document.getElementById("muteBtn"),
    speedSelect = document.getElementById("speedSelect"),
    fullscreenBtn = document.getElementById("fullscreenBtn"),
    pipBtn = document.getElementById("pipBtn"),
    loadingSpinner = document.getElementById("loadingSpinner"),
    centerPlayBtn = document.getElementById("centerPlayBtn"),
    EnterFileBtn = document.querySelector(".enter-file"),
    videoInput = document.getElementById("videoInput");

EnterFileBtn.addEventListener("click", () => {videoInput.click();});

videoInput.addEventListener("change", () => {
    const file = videoInput.files[0];

    if (file) {
        boxFile.style.display = "none";
        boxVideo.style.display = "block";
        myVideo.src = URL.createObjectURL(file);
        myVideo.load();
        myVideo.pause();
        previewVideo.src = URL.createObjectURL(file);
    }
});

let hideControlsTimer;

function showControlsTemporarily() {
    boxVideo.classList.add("show-controls");

    clearTimeout(hideControlsTimer);

    hideControlsTimer = setTimeout(() => {
        boxVideo.classList.remove("show-controls");
    }, 3000);
}

boxVideo.addEventListener("mousemove", showControlsTemporarily);
boxVideo.addEventListener("touchstart", showControlsTemporarily, { passive: true });

boxVideo.addEventListener("mouseleave", () => {
    clearTimeout(hideControlsTimer);
    boxVideo.classList.remove("show-controls");
});

/* ---------- Timeline Thumbnail Preview ---------- */
const previewVideo = document.getElementById("previewVideo"),
    timelinePreview = document.getElementById("timelinePreview"),
    previewCanvas = document.getElementById("previewCanvas"),
    previewTime = document.getElementById("previewTime"),
    previewCtx = previewCanvas.getContext("2d");

let previewSeekPending = false,
    previewTargetTime = 0;

progressBar.addEventListener("mousemove", (e) => {
    if (!Number.isFinite(myVideo.duration)) return;

    const rect = progressBar.getBoundingClientRect();
    const hoverX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const hoverTime = (hoverX / rect.width) * myVideo.duration;

    const halfPreviewWidth = timelinePreview.offsetWidth / 2;
    const clampedX = Math.min(Math.max(hoverX, halfPreviewWidth), rect.width - halfPreviewWidth);

    timelinePreview.style.left = `${clampedX}px`;
    previewTime.textContent = formatTime(hoverTime);
    timelinePreview.classList.add("show");

    previewTargetTime = hoverTime;
    if (!previewSeekPending) {
        previewSeekPending = true;
        previewVideo.currentTime = previewTargetTime;
    }
});

progressBar.addEventListener("mouseleave", () => {
    timelinePreview.classList.remove("show");
});

previewVideo.addEventListener("seeked", () => {
    previewCtx.drawImage(previewVideo, 0, 0, previewCanvas.width, previewCanvas.height);
    previewSeekPending = false;

    if (Math.abs(previewVideo.currentTime - previewTargetTime) > 0.25) {
        previewSeekPending = true;
        previewVideo.currentTime = previewTargetTime;
    }
});

function updateDuration() {
    if (Number.isFinite(myVideo.duration) && myVideo.duration > 0) {
        duration.textContent = formatTime(myVideo.duration);
    }
}

myVideo.addEventListener("loadedmetadata", updateDuration);
myVideo.addEventListener("loadeddata", updateDuration);
myVideo.addEventListener("canplay", updateDuration);

playPauseBtn.addEventListener("click", () => {
    if (myVideo.paused) {
        myVideo.play();
        playPauseBtn.innerHTML = "<i data-lucide='pause'></i>";
    } else {
        myVideo.pause();
        playPauseBtn.innerHTML = "<i data-lucide='play'></i>";
    }
    lucide.createIcons();
});

rewindBtn.addEventListener("click", () => {
    myVideo.currentTime -= 10;
});

forwardBtn.addEventListener("click", () => {
    myVideo.currentTime += 10;
});

myVideo.addEventListener('timeupdate', () => {
    progressFilled.style.width = ((myVideo.currentTime / myVideo.duration) * 100).toFixed(2) + "%";
    currentTime.textContent = formatTime(myVideo.currentTime);
});


myVideo.addEventListener("durationchange", updateDuration);


let isDraggingProgress = false,
    rafPending = false,
    latestClientX = 0;

function percentFromClientX(clientX) {
    const rect = progressBar.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    return x / rect.width;
}

function seekToClientX(clientX) {
    myVideo.currentTime = percentFromClientX(clientX) * myVideo.duration;
}

progressBar.addEventListener("pointerdown", (e) => {
    isDraggingProgress = true;
    progressBar.setPointerCapture(e.pointerId);
    seekToClientX(e.clientX);
});

progressBar.addEventListener("pointermove", (e) => {
    if (!isDraggingProgress) return;

    // آپدیت فوری و روان نوار، بدون وابستگی به timeupdate
    progressFilled.style.width = (percentFromClientX(e.clientX) * 100).toFixed(2) + "%";

    // seek واقعی ویدیو، محدود به حداکثر یه‌بار در هر فریم
    latestClientX = e.clientX;
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
            seekToClientX(latestClientX);
            rafPending = false;
        });
    }
});

progressBar.addEventListener("pointerup", () => {
    isDraggingProgress = false;
});

progressBar.addEventListener("pointercancel", () => {
    isDraggingProgress = false;
});

muteBtn.addEventListener("click", () => {
    if (myVideo.muted) {
        myVideo.muted = false;
        volumeSlider.value = 1;
        muteBtn.innerHTML = "<i data-lucide='volume-2'></i>";
    } else {
        myVideo.muted = true;
        volumeSlider.value = 0;
        muteBtn.innerHTML = "<i data-lucide='volume-x'></i>";
    }
    myVideo.volume = Number(volumeSlider.value);
    lucide.createIcons();
});

volumeSlider.addEventListener("input", () => {
    myVideo.volume = Number(volumeSlider.value);
    if (myVideo.volume === 0) {
        myVideo.muted = true;
        muteBtn.innerHTML = "<i data-lucide='volume-x'></i>";
    } else if (myVideo.volume <= 0.5) {
        myVideo.muted = false;
        muteBtn.innerHTML = "<i data-lucide='volume-1'></i>";
    } else {
        myVideo.muted = false;
        muteBtn.innerHTML = "<i data-lucide='volume-2'></i>";
    }
    lucide.createIcons();
});


fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});


document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        videoContainer.style.backgroundColor = "#080C14";
        fullscreenBtn.innerHTML = "<i data-lucide='minimize'></i>";
    } else {
        videoContainer.style.backgroundColor = "transparent";
        fullscreenBtn.innerHTML = "<i data-lucide='maximize'></i>";
    }
    lucide.createIcons();
});


speedSelect.addEventListener("change", () => {
    myVideo.playbackRate = Number(speedSelect.value);
});


if (!document.pictureInPictureEnabled) {
    pipBtn.disabled = true;
    pipBtn.title = "Picture-in-Picture پشتیبانی نمیشه";
}

pipBtn.addEventListener("click", async () => {
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            await myVideo.requestPictureInPicture();
        }
    } catch (err) {
        console.error("PiP failed:", err);
    }
});

myVideo.addEventListener("enterpictureinpicture", () => {
    pipBtn.innerHTML = "<i data-lucide='picture-in-picture'></i>";
    lucide.createIcons();
});

myVideo.addEventListener("leavepictureinpicture", () => {
    pipBtn.innerHTML = "<i data-lucide='picture-in-picture-2'></i>";
    lucide.createIcons();
});


boxVideo.classList.add("paused");

centerPlayBtn.addEventListener("click", () => {
    playPauseBtn.click();
});

myVideo.addEventListener("play", () => {
    boxVideo.classList.remove("paused");
});

myVideo.addEventListener("pause", () => {
    boxVideo.classList.add("paused");
});


document.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement.tagName;
    if (activeTag === "INPUT" || activeTag === "SELECT" || activeTag === "TEXTAREA") return;

    switch (e.code) {
        case "Space":
            e.preventDefault();
            playPauseBtn.click();
            break;
        case "ArrowRight":
            myVideo.currentTime += 5;
            break;
        case "ArrowLeft":
            myVideo.currentTime -= 5;
            break;
        case "KeyM":
            muteBtn.click();
            break;
        case "KeyF":
            fullscreenBtn.click();
            break;
    }
});


myVideo.addEventListener("waiting", () => {
    loadingSpinner.classList.add("show");
});

["playing", "canplay", "canplaythrough"].forEach((evt) => {
    myVideo.addEventListener(evt, () => {
        loadingSpinner.classList.remove("show");
    });
});


function formatTime(time) {
    const minutes = Math.floor(time / 60),
        seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}