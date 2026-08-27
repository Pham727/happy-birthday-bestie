/* ==========================================================================
   MEDIA & CONTENT CONFIGURATION OBJECT (DỄ DÀNG TÙY CHỈNH DỮ LIỆU)
   ========================================================================== */
const CONFIG = {
  // Audio Background URL (File Loa_Phuong_Thông_Bao.mp3 phát khi nhấn mở quà)
  musicUrl: 'assets/audio/Loa_Phuong_Thông_Bao.mp3',

  // Duration settings in milliseconds (Tổng thời gian 4 Scene = 30 giây)
  scene1Duration: 5000, // Scene 1: 5 giây
  scene2Duration: 8500, // Scene 2: 8.5 giây
  scene3Duration: 8500, // Scene 3: 8.5 giây
  scene4Duration: 6000, // Scene 4: 8 giây
  sceneDuration: 8500,  // Mặc định fallback

  // Recipient profile info
  recipientName: 'CON BẠN THÂN CHÍ CỐT 💅',
  avatarEmoji: '👑',

  // Scene 1 Config
  scene1: {
    warningText: "⚠️ CẢNH BÁO: Món quà 'tiền tỷ' đặc biệt dành riêng cho con bạn thân chí cốt! ⚠️",
    btnText: "BẬT LOA & MỞ QUÀ ĐI MÀY 🎁",
    surpriseTitle: "🎉 TING TING! THÊM 1 TUỔI BỚT KHÙNG NHA MÀY! 🎉",
    subText: "Hộp quà này không có sổ đỏ đâu, chỉ có tấm lòng vô giá của tao thôi nha con quỉ!!! 🤪"
  },

  // Scene 2 Config (Album ảnh kỷ niệm thực tế)
  scene2: {
    caption: "Tuy mày hơi cọc, tính khí thất thường, chỉ đam mê ngủ và đi chơi... nhưng may cho mày là có đứa bạn thân đỉnh chóp như tao chịu đựng ngần ấy năm! 💅✨",
    polaroids: [
      {
        caption: 'Tận hưởng gió biển hay ngủ gật ngoài bờ kè? 💤',
        url: 'assets/images/20230902_171143.jpg'
      },
      {
        caption: 'Đam mê xê dịch, cứ rủ là lên đồ đi liền 🏖️',
        url: 'assets/images/20230903_105304.jpg'
      },
      {
        caption: 'Hội bạn chí cốt quậy đục nước mọi quán xá 🥳',
        url: 'assets/images/20231209_195029.jpg'
      },
      {
        caption: 'Góc dịu dàng hiếm hoi bên thỏ My Melody 💖',
        url: 'assets/images/IMG_1012.JPEG'
      },
      {
        caption: 'Sinh nhật tuổi mới bớt lười, thêm xinh đẹp nha ✨',
        url: 'assets/images/IMG_1013.JPEG'
      }
    ]
  },

  // Scene 3 Config (Thailand Trip Voucher Popup)
  scene3: {
    instruction: "Nhắm mắt lại cầu cho năm nay: HẾT Ế, GIÀU NHANH, ĐI DU LỊCH THÁI LAN !!!🕯️✨",
    voucherTitle: "🇹🇭 VOUCHER DU LỊCH THÁI LAN TRỌN GÓI 🇹🇭",
    voucherBody: "✨ Vũ trụ đã nhận đơn! Thẻ Voucher Du Lịch Thái Lan cho 5 đứa đã được kích hoạt! (Điều kiện: Mày bao 100% chi phí, tao lo xách vali & chụp ảnh dìm nha!) ✈️🐘🥭✨"
  },

  // Scene 4 Config (Finale Photo & Wish)
  scene4: {
    title: "👑 HAPPY BIRTHDAY CON BẠN THÂN 👑",
    bestiePhoto: 'assets/images/IMG_1018.JPEG',
    finalMessage: "Nói đùa vậy thôi, chúc mày tuổi mới luôn xinh đẹp rạng ngời, kiếm được thật nhiều tiền dắt tụi tao đi chơi, sớm có người yêu rước đi cho đỡ phiền và mãi mãi là bạn thân đỉnh nhất quả đất của tao nhé! 💖🌸"
  }
};

/* ==========================================================================
   APP STATE & DOM REFERENCES
   ========================================================================== */
let currentScene = 0;
const totalScenes = 4;
let isPlaying = false;
let isPaused = false;
let sceneStartTime = 0;
let elapsedTimeInScene = 0;
let animFrameId = null;
let isCandleBlown = false;
let isGiftOpened = false;
let audioUnlocked = false;
let confettiInterval = null;
let candleBlowTimeout = null;

// Scene 2 Photo Gallery State
let currentPhotoIndex = 0;
let photoSlideshowInterval = null;

// DOM Elements
const storyCard = document.getElementById('storyCard');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const btnStart = document.getElementById('btnStart');
const giftTrigger = document.getElementById('giftTrigger');
const giftBox = document.getElementById('giftBox');
const giftLid = document.getElementById('giftLid');
const surpriseTitle = document.getElementById('surpriseTitle');
const scene1Subtext = document.getElementById('scene1Subtext');
const touchPrev = document.getElementById('touchPrev');
const touchNext = document.getElementById('touchNext');
const pauseIndicator = document.getElementById('pauseIndicator');
const cakeTrigger = document.getElementById('cakeTrigger');
const flame = document.getElementById('flame');
const smoke = document.getElementById('smoke');
const wishToast = document.getElementById('wishToast');
const btnRestart = document.getElementById('btnRestart');

const voucherTitle = document.getElementById('voucherTitle');
const voucherBody = document.getElementById('voucherBody');

// Scene 2 Polaroid Elements
const polaroidActiveCard = document.getElementById('polaroidActiveCard');
const polaroidMainImg = document.getElementById('polaroidMainImg');
const polaroidMainCaption = document.getElementById('polaroidMainCaption');
const photoCounterBadge = document.getElementById('photoCounterBadge');
const photoDotsContainer = document.getElementById('photoDotsContainer');
const polaroidDeckTrigger = document.getElementById('polaroidDeckTrigger');

/* ==========================================================================
   INITIALIZATION & DATA BINDING
   ========================================================================== */
function initApp() {
  // Prevent browser scroll restoration on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Bind Config text & images to DOM
  document.getElementById('headerRecipient').textContent = CONFIG.recipientName;
  document.getElementById('headerAvatar').textContent = CONFIG.avatarEmoji;

  document.getElementById('scene1Warning').textContent = CONFIG.scene1.warningText;
  document.getElementById('surpriseTitle').textContent = CONFIG.scene1.surpriseTitle;
  document.getElementById('scene1Subtext').textContent = CONFIG.scene1.subText;

  document.getElementById('scene2Caption').textContent = CONFIG.scene2.caption;

  document.getElementById('scene3Instruction').innerHTML = CONFIG.scene3.instruction;
  voucherTitle.textContent = CONFIG.scene3.voucherTitle;
  voucherBody.textContent = CONFIG.scene3.voucherBody;

  document.getElementById('finaleTitle').textContent = CONFIG.scene4.title;
  document.getElementById('bestiePhoto').src = CONFIG.scene4.bestiePhoto;
  document.getElementById('finalMessage').textContent = CONFIG.scene4.finalMessage;

  // Audio setup (preload audio file for instant playback response, play only once)
  bgMusic.src = CONFIG.musicUrl;
  bgMusic.loop = false;
  bgMusic.load();
  bgMusic.addEventListener('ended', () => {
    isPlaying = false;
    musicBtn.classList.remove('playing');
  });

  // Setup Scene 2 Dots UI & Initial Polaroid Photo
  initScene2Gallery();

  // Generate floating sparkles inside story
  createSparkles();

  // Bind all click, touch, and hold events
  bindEvents();
}

/* ==========================================================================
   SCENE 2 GALLERY & TRANSITION CONTROLLER
   ========================================================================== */
function initScene2Gallery() {
  const photos = CONFIG.scene2.polaroids;
  photoDotsContainer.innerHTML = '';

  photos.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `photo-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      showPolaroidPhoto(idx);
    });
    photoDotsContainer.appendChild(dot);
  });

  showPolaroidPhoto(0, false);
}

function showPolaroidPhoto(index, animate = true) {
  const photos = CONFIG.scene2.polaroids;
  if (index < 0) index = photos.length - 1;
  if (index >= photos.length) index = 0;

  currentPhotoIndex = index;
  const data = photos[currentPhotoIndex];

  if (animate) {
    polaroidActiveCard.classList.add('slide-out');

    setTimeout(() => {
      polaroidMainImg.src = data.url;
      polaroidMainCaption.textContent = data.caption;
      if (photoCounterBadge) photoCounterBadge.textContent = `📸 KỶ NIỆM ${currentPhotoIndex + 1}/${photos.length}`;

      polaroidActiveCard.classList.remove('slide-out');
      polaroidActiveCard.classList.add('slide-in');

      setTimeout(() => {
        polaroidActiveCard.classList.remove('slide-in');
      }, 500);
    }, 220);
  } else {
    polaroidMainImg.src = data.url;
    polaroidMainCaption.textContent = data.caption;
    if (photoCounterBadge) photoCounterBadge.textContent = `📸 KỶ NIỆM ${currentPhotoIndex + 1}/${photos.length}`;
  }

  // Update dots UI
  const dots = photoDotsContainer.querySelectorAll('.photo-dot');
  dots.forEach((dot, idx) => {
    if (idx === currentPhotoIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function nextPolaroidPhoto() {
  showPolaroidPhoto(currentPhotoIndex + 1, true);
}

function startPolaroidSlideshow() {
  stopPolaroidSlideshow();
  photoSlideshowInterval = setInterval(() => {
    if (currentScene === 1 && !isPaused) {
      nextPolaroidPhoto();
    }
  }, 1800);
}

function stopPolaroidSlideshow() {
  if (photoSlideshowInterval) {
    clearInterval(photoSlideshowInterval);
    photoSlideshowInterval = null;
  }
}

/* ==========================================================================
   BACKGROUND SPARKLES GENERATOR
   ========================================================================== */
function createSparkles() {
  const container = document.getElementById('innerSparkles');
  const symbols = ['✨', '💖', '⭐', '🌸', '🎉'];
  for (let i = 0; i < 12; i++) {
    const item = document.createElement('div');
    item.className = 'sparkle';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.left = Math.random() * 100 + '%';
    item.style.animationDelay = (Math.random() * 6) + 's';
    item.style.animationDuration = (5 + Math.random() * 5) + 's';
    container.appendChild(item);
  }
}

/* ==========================================================================
   AUDIO CONTROLLER WITH WEB AUDIO API FALLBACK
   ========================================================================== */
function playMusicDirectly() {
  audioUnlocked = true;
  try {
    bgMusic.currentTime = 0;
  } catch (e) { }

  if (!bgMusic.src || bgMusic.src === '' || bgMusic.src === window.location.href) {
    bgMusic.src = CONFIG.musicUrl;
  }

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      musicBtn.classList.add('playing');
    }).catch(err => {
      console.warn("Retrying bgMusic.play() on click...", err);
      bgMusic.load();
      bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
      }).catch(err2 => {
        console.error("Audio playback error:", err2);
        playWebAudioBirthdayMelody();
      });
    });
  } else {
    isPlaying = true;
    musicBtn.classList.add('playing');
  }
}

function unlockAndPlayAudio() {
  if (!audioUnlocked) {
    playMusicDirectly();
  } else {
    toggleMusic();
  }
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    isPlaying = true;
    musicBtn.classList.add('playing');
  } else {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
  }
}

// Synthesize Happy Birthday song using Web Audio API if network audio fails
function playWebAudioBirthdayMelody() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    isPlaying = true;
    musicBtn.classList.add('playing');

    const notes = [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
      261.63, 261.63, 293.66, 261.63, 392.00, 349.23
    ];
    let idx = 0;

    function playNext() {
      if (!isPlaying) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[idx % notes.length], ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
      idx++;
      setTimeout(playNext, 550);
    }
    playNext();
  } catch (e) {
    console.log("Web Audio synth active");
  }
}

/* ==========================================================================
   SCENE 1: OPEN GIFT & START STORY TIMELINE
   ========================================================================== */
function handleGiftOpen() {
  if (isGiftOpened) return;
  isGiftOpened = true;

  // Start audio playback immediately on click
  playMusicDirectly();

  // Stop shaking and flip lid off
  giftBox.classList.remove('shaking');
  giftLid.classList.add('opened');

  // Trigger Confetti Burst from Center
  if (window.confetti) {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.55 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.7 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.7 }
      });
    }, 200);
  }

  // Show elastic zoom headline & subtext
  surpriseTitle.classList.add('bounce-in');
  scene1Subtext.classList.add('show');

  // Hide start button
  btnStart.style.opacity = '0';
  btnStart.style.pointerEvents = 'none';

  // Start progress timer from Scene 0
  goToScene(0);
}

/* ==========================================================================
   SCENE NAVIGATION & TIMELINE TIMER
   ========================================================================== */
function goToScene(index) {
  if (index < 0) index = 0;
  if (index >= totalScenes) index = totalScenes - 1;

  if (candleBlowTimeout) {
    clearTimeout(candleBlowTimeout);
    candleBlowTimeout = null;
  }

  currentScene = index;
  elapsedTimeInScene = 0;
  sceneStartTime = performance.now();

  // Update active scene DOM class and reset scroll offset
  document.querySelectorAll('.scene').forEach((sc, idx) => {
    sc.scrollTop = 0;
    if (idx === currentScene) {
      sc.classList.add('active');
    } else {
      sc.classList.remove('active');
    }
  });

  // Update past and future progress bars
  for (let i = 0; i < totalScenes; i++) {
    const fill = document.getElementById(`fill-${i}`);
    if (i < currentScene) {
      fill.style.width = '100%';
    } else if (i > currentScene) {
      fill.style.width = '0%';
    }
  }

  // Handle Scene-specific triggers
  if (currentScene === 1) { // Polaroid Memory Slideshow Gallery
    showPolaroidPhoto(0, false);
    startPolaroidSlideshow();
  } else {
    stopPolaroidSlideshow();
  }

  if (currentScene === 3) { // Grand Finale
    triggerFireworks();
  } else {
    stopFireworks();
  }

  // Resume frame loop
  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = requestAnimationFrame(updateTimeline);
}

function nextScene() {
  if (currentScene < totalScenes - 1) {
    goToScene(currentScene + 1);
  }
}

function prevScene() {
  if (currentScene > 0) {
    goToScene(currentScene - 1);
  } else {
    goToScene(0);
  }
}

function getSceneDuration(sceneIdx) {
  if (sceneIdx === 0) return CONFIG.scene1Duration || 5000;
  if (sceneIdx === 1) return CONFIG.scene2Duration || CONFIG.sceneDuration || 8500;
  if (sceneIdx === 2) return CONFIG.scene3Duration || CONFIG.sceneDuration || 8500;
  if (sceneIdx === 3) return CONFIG.scene4Duration || 8000;
  return CONFIG.sceneDuration || 8500;
}

function updateTimeline(now) {
  if (!isPaused) {
    if (!sceneStartTime) sceneStartTime = now;
    const delta = now - sceneStartTime;
    sceneStartTime = now;
    elapsedTimeInScene += delta;

    const duration = getSceneDuration(currentScene);
    const progress = Math.min(elapsedTimeInScene / duration, 1);
    const activeFill = document.getElementById(`fill-${currentScene}`);
    if (activeFill) {
      activeFill.style.width = (progress * 100) + '%';
    }

    // Auto advance scene when progress completes (or trigger candle blow in Scene 3)
    if (progress >= 1) {
      if (currentScene === 2) {
        if (!isCandleBlown) {
          blowCandle();
        }
        return;
      } else if (currentScene < totalScenes - 1) {
        nextScene();
        return;
      }
    }
  } else {
    sceneStartTime = now;
  }

  animFrameId = requestAnimationFrame(updateTimeline);
}

/* ==========================================================================
   SCENE 3: INTERACTIVE CANDLE BLOWING & THAILAND TRIP VOUCHER (3s DISP)
   ========================================================================== */
function blowCandle(e) {
  if (e) e.stopPropagation();
  if (isCandleBlown) return;

  isCandleBlown = true;
  flame.classList.add('extinguished');
  smoke.classList.add('active');

  // Reveal Pop-up Thailand Trip Voucher Ticket Modal
  wishToast.classList.add('show');

  // Burst Confetti for candle blow
  if (window.confetti) {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 }
    });
  }

  // Auto advance to Scene 4 after 3 seconds of showing voucher
  if (candleBlowTimeout) clearTimeout(candleBlowTimeout);
  candleBlowTimeout = setTimeout(() => {
    nextScene();
  }, 3000);
}

/* ==========================================================================
   SCENE 4: CANVAS CONFETTI FIREWORKS
   ========================================================================== */
function triggerFireworks() {
  if (!window.confetti) return;

  const canvas = document.getElementById('confetti-canvas');
  const myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true
  });

  // Initial center explosion
  myConfetti({
    particleCount: 95,
    spread: 100,
    origin: { y: 0.7 }
  });

  // Continuous side bursts from bottom corners for 4.5 seconds
  const endTime = Date.now() + 4500;
  confettiInterval = setInterval(() => {
    if (Date.now() > endTime) {
      clearInterval(confettiInterval);
      return;
    }
    myConfetti({
      particleCount: 38,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.85 }
    });
    myConfetti({
      particleCount: 38,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.85 }
    });
  }, 360);
}

function stopFireworks() {
  if (confettiInterval) {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }
}

/* ==========================================================================
   EVENT BINDINGS & HOLD TO PAUSE
   ========================================================================== */
function bindEvents() {
  // Gift & Start Button
  btnStart.addEventListener('click', (e) => {
    e.stopPropagation();
    handleGiftOpen();
  });

  giftTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    handleGiftOpen();
  });

  // Scene 2 Polaroid Deck Click to Cycle
  polaroidDeckTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    nextPolaroidPhoto();
  });

  if (photoCounterBadge) {
    photoCounterBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      nextPolaroidPhoto();
    });
  }

  // Music Button
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    unlockAndPlayAudio();
  });

  // Touch Navigation Regions (30% Left / 70% Right)
  touchPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentScene === 0 && !isGiftOpened) {
      handleGiftOpen();
      return;
    }
    prevScene();
  });

  touchNext.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentScene === 0) {
      if (!isGiftOpened) {
        handleGiftOpen();
      }
      return;
    }
    if (currentScene === 2) {
      if (!isCandleBlown) {
        blowCandle(e);
      }
      return;
    }
    nextScene();
  });

  // Candle Click Trigger
  cakeTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    blowCandle(e);
  });

  // Restart Story Button (if present)
  if (btnRestart) {
    btnRestart.addEventListener('click', (e) => {
      e.stopPropagation();
      isCandleBlown = false;
      isGiftOpened = false;

      // Reset Candle UI
      flame.classList.remove('extinguished');
      smoke.classList.remove('active');
      wishToast.classList.remove('show');

      // Reset Gift Box UI
      giftLid.classList.remove('opened');
      giftBox.classList.add('shaking');
      surpriseTitle.classList.remove('bounce-in');
      scene1Subtext.classList.remove('show');

      // Reset Start Button
      btnStart.style.opacity = '1';
      btnStart.style.pointerEvents = 'auto';

      goToScene(0);
    });
  }

  // HOLD / PRESS TO PAUSE STORY LOGIC
  const startHold = (e) => {
    if (e.target.closest('button') || e.target.closest('.music-btn') || e.target.closest('#cakeTrigger') || e.target.closest('#giftTrigger') || e.target.closest('#polaroidDeckTrigger')) {
      return;
    }
    isPaused = true;
    pauseIndicator.classList.add('visible');
  };

  const endHold = () => {
    isPaused = false;
    pauseIndicator.classList.remove('visible');
  };

  // Mouse events
  storyCard.addEventListener('mousedown', startHold);
  storyCard.addEventListener('mouseup', endHold);
  storyCard.addEventListener('mouseleave', endHold);

  // Touch events
  storyCard.addEventListener('touchstart', startHold, { passive: true });
  storyCard.addEventListener('touchend', endHold);
  storyCard.addEventListener('touchcancel', endHold);
}

// Initialize application on DOM content loaded
document.addEventListener('DOMContentLoaded', initApp);
