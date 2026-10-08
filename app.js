/**
 * LEGENDARY CARD FORGE (傳奇卡牌工坊)
 * 3D Holographic Laser Foil Card Interactive Engine
 * Card: katee No.001/001 SAR (Dark Shadow Master)
 * Artisan: MRs.lun | Date: 2026/10/08
 */

(() => {
  'use strict';

  // ==========================================================================
  // DOM ELEMENT SELECTIONS
  // ==========================================================================
  const workshopBody = document.getElementById('workshopBody');
  const stageContainer = document.getElementById('stageContainer');
  const cardScene = document.getElementById('cardScene');
  const cardWrapper = document.getElementById('cardWrapper');
  const cardCase = document.getElementById('cardCase');
  const cardInner = document.getElementById('cardInner');
  const cardFront = document.getElementById('cardFront');
  const backFoilName = document.getElementById('backFoilName');

  // Buttons & Controls
  const toggleAudioBtn = document.getElementById('toggleAudioBtn');
  const toggleEnvBtn = document.getElementById('toggleEnvBtn');
  const toggleAutoRotateBtn = document.getElementById('toggleAutoRotateBtn');
  const resetViewBtn = document.getElementById('resetViewBtn');
  const btnFlipCard = document.getElementById('btnFlipCard');
  const btnInspectMode = document.getElementById('btnInspectMode');
  const btnSnapshot = document.getElementById('btnSnapshot');
  const btnShareSpec = document.getElementById('btnShareSpec');
  const btnFlipBackHint = document.getElementById('btnFlipBackHint');

  // Attack Buttons
  const btnCastClaw = document.getElementById('btnCastClaw');
  const btnCastUlt = document.getElementById('btnCastUlt');
  const testClawBtn = document.getElementById('testClawBtn');
  const testUltBtn = document.getElementById('testUltBtn');

  // Sliders
  const glareRange = document.getElementById('glareRange');
  const glareValText = document.getElementById('glareValText');
  const tiltRange = document.getElementById('tiltRange');
  const tiltValText = document.getElementById('tiltValText');
  const particleRange = document.getElementById('particleRange');
  const particleValText = document.getElementById('particleValText');

  // VFX Overlay
  const fxOverlay = document.getElementById('fxOverlay');
  const clawSlashContainer = document.getElementById('clawSlashContainer');
  const ultContainer = document.getElementById('ultContainer');

  // Inspect Modal
  const inspectModal = document.getElementById('inspectModal');
  const inspectBackdrop = document.getElementById('inspectBackdrop');
  const btnCloseInspect = document.getElementById('btnCloseInspect');
  const inspectViewport = document.getElementById('inspectViewport');
  const inspectImage = document.getElementById('inspectImage');

  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastIcon = document.getElementById('toastIcon');
  const toastMsg = document.getElementById('toastMsg');

  // Passive Trait
  const passiveTraitBox = document.getElementById('passiveTraitBox');
  const passiveStatusIndicator = document.getElementById('passiveStatusIndicator');

  // Canvas
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const state = {
    audioEnabled: true,
    isNight: true,
    isAutoRotating: false,
    autoRotateAngle: 0,
    isFlipped: false,
    currentFoil: 'gold-ultra',
    currentCase: 'slab-psa',
    tiltMultiplier: 1.0,
    glareOpacity: 0.85,
    particleSpeed: 1.0,
    mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    cardPos: { x: 0, y: 0, width: 360, height: 520 },
    isHoveringCard: false,
    isAttacking: false,
    idleAnimTime: 0
  };

  // Set default foil class on cardInner
  cardInner.classList.add('foil-gold-ultra');

  // ==========================================================================
  // WEB AUDIO SYNTHESIZER (ZERO EXTERNAL FILE DEPENDENCY)
  // ==========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play Crystalline Foil Shimmer Sound
  function playFoilChime() {
    if (!state.audioEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Play Card Flip Whoosh & Snap Sound
  function playCardFlipSound() {
    if (!state.audioEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    // Whoosh filter noise
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    // Snap harmonic
    setTimeout(() => {
      if (!audioCtx) return;
      const snapOsc = audioCtx.createOscillator();
      const snapGain = audioCtx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      snapGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      snapOsc.connect(snapGain);
      snapGain.connect(audioCtx.destination);
      snapOsc.start();
      snapOsc.stop(audioCtx.currentTime + 0.08);
    }, 180);
  }

  // Play Claw Slash Sound (暗影貓爪)
  function playClawSound() {
    if (!state.audioEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    // Slash 1
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.2);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Slash 2 delayed
    setTimeout(() => {
      if (!audioCtx) return;
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1100, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 0.22);
      gain2.gain.setValueAtTime(0.28, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.24);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.24);
    }, 90);
  }

  // Play Ultimate Arcane Explosion (滿月禁咒・星夜魔陣)
  function playUltSound() {
    if (!state.audioEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    // Arcane Drone Rise
    const droneOsc = audioCtx.createOscillator();
    const droneGain = audioCtx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(90, now);
    droneOsc.frequency.exponentialRampToValueAtTime(320, now + 1.2);
    droneGain.gain.setValueAtTime(0.2, now);
    droneGain.gain.linearRampToValueAtTime(0.4, now + 1.2);
    droneGain.gain.exponentialRampToValueAtTime(0.01, now + 3.0);
    droneOsc.connect(droneGain);
    droneGain.connect(audioCtx.destination);
    droneOsc.start(now);
    droneOsc.stop(now + 3.0);

    // Star Chimes Sequence
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        if (!audioCtx) return;
        const chime = audioCtx.createOscillator();
        const chimeG = audioCtx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(f, audioCtx.currentTime);
        chimeG.gain.setValueAtTime(0.12, audioCtx.currentTime);
        chimeG.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        chime.connect(chimeG);
        chimeG.connect(audioCtx.destination);
        chime.start();
        chime.stop(audioCtx.currentTime + 1.2);
      }, 300 + idx * 160);
    });

    // Deep Impact Bass Drop at climax
    setTimeout(() => {
      if (!audioCtx) return;
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(140, audioCtx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 1.5);
      subGain.gain.setValueAtTime(0.45, audioCtx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.6);
      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);
      subOsc.start();
      subOsc.stop(audioCtx.currentTime + 1.6);
    }, 1200);
  }

  // Gentle Click UI sound
  function playClickSound() {
    if (!state.audioEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // ==========================================================================
  // TOAST SYSTEM
  // ==========================================================================
  let toastTimer = null;
  function showToast(icon, message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastIcon.textContent = icon;
    toastMsg.textContent = message;
    toastNotification.classList.add('show');
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  // ==========================================================================
  // 3D CARD INTERACTIVE TILT & FOIL SHADER PHYSICS
  // ==========================================================================
  function updateCardRect() {
    const rect = cardInner.getBoundingClientRect();
    state.cardPos = {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    };
  }

  window.addEventListener('resize', updateCardRect);
  window.addEventListener('scroll', updateCardRect);
  setTimeout(updateCardRect, 300);

  function handleMouseMove(e) {
    state.mousePos.x = e.clientX;
    state.mousePos.y = e.clientY;

    if (!state.isAutoRotating) {
      const dx = e.clientX - state.cardPos.centerX;
      const dy = e.clientY - state.cardPos.centerY;
      const dist = Math.hypot(dx, dy);

      // Check if cursor is near card
      if (dist < 600) {
        state.isHoveringCard = true;
        // Calculate tilt angles (X is up/down, Y is left/right)
        const maxTilt = 22 * state.tiltMultiplier;
        const normX = Math.max(-1, Math.min(1, dx / (state.cardPos.width * 0.9)));
        const normY = Math.max(-1, Math.min(1, dy / (state.cardPos.height * 0.9)));

        const rotY = normX * maxTilt;
        const rotX = -normY * maxTilt;

        applyCardTilt(rotX, rotY, e.clientX, e.clientY);
      } else {
        state.isHoveringCard = false;
      }
    }
  }

  window.addEventListener('mousemove', handleMouseMove);

  // Apply tilt angles and laser foil coordinates
  function applyCardTilt(rotX, rotY, clientX, clientY) {
    const rx = rotX.toFixed(2);
    const ry = rotY.toFixed(2);

    // Calculate normalized pointer % relative to card surface
    let px = 50;
    let py = 50;
    if (state.cardPos.width > 0) {
      px = ((clientX - state.cardPos.x) / state.cardPos.width) * 100;
      py = ((clientY - state.cardPos.y) / state.cardPos.height) * 100;
      px = Math.max(0, Math.min(100, px)).toFixed(1);
      py = Math.max(0, Math.min(100, py)).toFixed(1);
    }

    cardWrapper.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    cardInner.style.setProperty('--rx', `${rx}deg`);
    cardInner.style.setProperty('--ry', `${ry}deg`);
    cardInner.style.setProperty('--pointer-x', `${px}%`);
    cardInner.style.setProperty('--pointer-y', `${py}%`);
  }

  // Smooth Idle Floating Animation Loop
  function animationLoop(timestamp) {
    state.idleAnimTime += 0.02;

    if (state.isAutoRotating) {
      // 360 auto rotate presentation
      state.autoRotateAngle = (state.autoRotateAngle + 0.8) % 360;
      const rotY = Math.sin(state.idleAnimTime * 0.5) * 15 + (state.autoRotateAngle - 180);
      const rotX = Math.cos(state.idleAnimTime * 0.8) * 8;
      
      const px = (50 + Math.sin(state.idleAnimTime) * 35).toFixed(1);
      const py = (50 + Math.cos(state.idleAnimTime) * 35).toFixed(1);

      cardWrapper.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      cardInner.style.setProperty('--rx', `${rotX.toFixed(2)}deg`);
      cardInner.style.setProperty('--ry', `${rotY.toFixed(2)}deg`);
      cardInner.style.setProperty('--pointer-x', `${px}%`);
      cardInner.style.setProperty('--pointer-y', `${py}%`);
    } else if (!state.isHoveringCard) {
      // Gentle breathing idle float
      const idleRx = Math.sin(state.idleAnimTime * 0.9) * 4;
      const idleRy = Math.cos(state.idleAnimTime * 0.7) * 6;
      const px = (50 + Math.sin(state.idleAnimTime * 0.6) * 15).toFixed(1);
      const py = (50 + Math.cos(state.idleAnimTime * 0.6) * 15).toFixed(1);

      cardWrapper.style.transform = `rotateX(${idleRx.toFixed(2)}deg) rotateY(${idleRy.toFixed(2)}deg)`;
      cardInner.style.setProperty('--rx', `${idleRx.toFixed(2)}deg`);
      cardInner.style.setProperty('--ry', `${idleRy.toFixed(2)}deg`);
      cardInner.style.setProperty('--pointer-x', `${px}%`);
      cardInner.style.setProperty('--pointer-y', `${py}%`);
    }

    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);

  // ==========================================================================
  // CARD FLIP (FRONT <-> BACK)
  // ==========================================================================
  function flipCard() {
    initAudio();
    state.isFlipped = !state.isFlipped;
    cardInner.classList.toggle('is-flipped', state.isFlipped);
    playCardFlipSound();

    if (state.isFlipped) {
      showToast('📜', '已翻轉至背面 · 檢視原廠防偽鑑定證書 (COA)');
    } else {
      showToast('🎴', '已翻轉至正面 · 檢視 katee 3D 鐳射立繪');
    }
  }

  btnFlipCard.addEventListener('click', flipCard);
  btnFlipBackHint.addEventListener('click', flipCard);
  
  // Clicking the card itself flips it
  cardInner.addEventListener('click', (e) => {
    // Only flip if not clicking an attack button
    if (e.target.closest('.cast-btn') || e.target.closest('button')) return;
    flipCard();
  });

  // ==========================================================================
  // FOIL STYLE SWITCHER
  // ==========================================================================
  const foilOptions = document.querySelectorAll('.foil-card-opt');
  const foilTitles = {
    'gold-ultra': 'Gold Ultra 黑金浮雕',
    'cosmic-holo': 'Cosmic Holo 幻彩星河',
    'secret-rare': 'Secret Rare 碎鑽稜鏡',
    'phantom-rainbow': 'Phantom Rainbow 幽暗虹彩',
    'silver-sterling': 'Silver Sterling 白銀秘銀'
  };

  foilOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      initAudio();
      const foilType = opt.getAttribute('data-foil');
      if (state.currentFoil === foilType) return;

      // Update active state
      foilOptions.forEach(b => b.classList.remove('active'));
      opt.classList.add('active');

      // Update card classes
      cardInner.classList.remove(
        'foil-gold-ultra',
        'foil-cosmic-holo',
        'foil-secret-rare',
        'foil-phantom-rainbow',
        'foil-silver-sterling'
      );
      cardInner.classList.add(`foil-${foilType}`);
      state.currentFoil = foilType;

      // Update COA foil name
      if (backFoilName) {
        backFoilName.textContent = foilTitles[foilType] || foilType;
      }

      playFoilChime();
      showToast('✨', `已切換鐳射箔膜風格：${foilTitles[foilType]}`);
    });
  });

  // ==========================================================================
  // CASE & SLAB SWITCHER (PSA 10 / MAGNETIC / RAW)
  // ==========================================================================
  const caseButtons = document.querySelectorAll('.case-btn');
  caseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      playClickSound();
      const caseType = btn.getAttribute('data-case');
      if (state.currentCase === caseType) return;

      caseButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cardCase.classList.remove('slab-psa', 'slab-magnetic', 'slab-raw');
      cardCase.classList.add(caseType);
      state.currentCase = caseType;

      updateCardRect();
      showToast('🏷️', `已套用收藏展示盒：${btn.querySelector('.case-name').textContent}`);
    });
  });

  // ==========================================================================
  // SKILL ATTACK FX (招式一 & 奧義)
  // ==========================================================================
  function triggerShadowClaw() {
    if (state.isAttacking) return;
    state.isAttacking = true;
    initAudio();
    playClawSound();

    // Trigger Screen Shake
    stageContainer.style.transform = 'translate(4px, -3px)';
    setTimeout(() => { stageContainer.style.transform = 'translate(-4px, 3px)'; }, 60);
    setTimeout(() => { stageContainer.style.transform = 'translate(2px, -2px)'; }, 120);
    setTimeout(() => { stageContainer.style.transform = 'none'; }, 200);

    // Show FX Overlay
    fxOverlay.classList.add('active');
    clawSlashContainer.classList.add('animate-claw');

    showToast('🐾', '發動招式【暗影貓爪】！造成 45+ 暗影撕裂傷，目標陷入黑暗狀態');

    setTimeout(() => {
      clawSlashContainer.classList.remove('animate-claw');
      fxOverlay.classList.remove('active');
      state.isAttacking = false;
    }, 1300);
  }

  function triggerUltimateSpell() {
    if (state.isAttacking) return;
    state.isAttacking = true;
    initAudio();
    playUltSound();

    // Show Fullscreen Cinematic FX
    fxOverlay.classList.add('active');
    ultContainer.classList.add('animate-ult');

    // Stage deep vibration
    stageContainer.style.filter = 'drop-shadow(0 0 30px #c084fc)';
    setTimeout(() => {
      stageContainer.style.filter = 'drop-shadow(0 0 60px #e879f9)';
    }, 1200);

    showToast('🔮', '奧義覺醒【滿月禁咒・星夜魔陣】！釋放 180 點星辰範圍爆擊！');

    setTimeout(() => {
      ultContainer.classList.remove('animate-ult');
      fxOverlay.classList.remove('active');
      stageContainer.style.filter = 'none';
      state.isAttacking = false;
    }, 3600);
  }

  btnCastClaw.addEventListener('click', (e) => { e.stopPropagation(); triggerShadowClaw(); });
  testClawBtn.addEventListener('click', triggerShadowClaw);

  btnCastUlt.addEventListener('click', (e) => { e.stopPropagation(); triggerUltimateSpell(); });
  testUltBtn.addEventListener('click', triggerUltimateSpell);

  // ==========================================================================
  // ENVIRONMENT & PASSIVE TRAIT SYNERGY (DAY / NIGHT)
  // ==========================================================================
  function toggleDayNight() {
    initAudio();
    playClickSound();
    state.isNight = !state.isNight;

    if (state.isNight) {
      workshopBody.classList.remove('mode-day');
      workshopBody.classList.add('mode-night');
      toggleEnvBtn.classList.add('night-active');
      toggleEnvBtn.querySelector('.btn-icon').textContent = '🌙';

      // Passive trait activates
      passiveTraitBox.classList.add('active-resonance');
      passiveStatusIndicator.innerHTML = '<span class="status-pulse"></span><span class="status-text">夜間共鳴中 (+25% 魔能)</span>';
      showToast('🌙', '進入夜晚月光環境：觸發【夜間感知】魔力恢復加速並洞察暗處！');
    } else {
      workshopBody.classList.remove('mode-night');
      workshopBody.classList.add('mode-day');
      toggleEnvBtn.classList.remove('night-active');
      toggleEnvBtn.querySelector('.btn-icon').textContent = '☀️';

      // Passive trait normal
      passiveTraitBox.classList.remove('active-resonance');
      passiveStatusIndicator.innerHTML = '<span class="status-text" style="color:#94a3b8">常態待機模式</span>';
      showToast('☀️', '進入日間白晝環境：被動技能進入常態待機。');
    }
  }

  toggleEnvBtn.addEventListener('click', toggleDayNight);
  passiveTraitBox.classList.add('active-resonance'); // default night active

  // ==========================================================================
  // AUDIO TOGGLE
  // ==========================================================================
  toggleAudioBtn.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    toggleAudioBtn.classList.toggle('active', state.audioEnabled);
    const icon = toggleAudioBtn.querySelector('.btn-icon');
    const tooltip = toggleAudioBtn.querySelector('.btn-tooltip');
    if (state.audioEnabled) {
      icon.textContent = '🔊';
      tooltip.textContent = '奧術音效 ON';
      initAudio();
      playClickSound();
      showToast('🔊', '奧術環境音訊已開啟');
    } else {
      icon.textContent = '🔇';
      tooltip.textContent = '奧術音效 OFF';
      showToast('🔇', '奧術環境音訊已靜音');
    }
  });

  // ==========================================================================
  // AUTO 360° ORBIT DISPLAY
  // ==========================================================================
  toggleAutoRotateBtn.addEventListener('click', () => {
    initAudio();
    playClickSound();
    state.isAutoRotating = !state.isAutoRotating;
    toggleAutoRotateBtn.classList.toggle('active', state.isAutoRotating);
    if (state.isAutoRotating) {
      showToast('🔄', '已啟動 360° 全方位全息光學自動巡航展示');
    } else {
      showToast('⏸️', '已暫停自動展示，恢復自由滑鼠感應');
    }
  });

  // Reset View
  resetViewBtn.addEventListener('click', () => {
    initAudio();
    playClickSound();
    state.isAutoRotating = false;
    toggleAutoRotateBtn.classList.remove('active');
    applyCardTilt(0, 0, state.cardPos.centerX, state.cardPos.centerY);
    showToast('🎯', '卡牌視角已重置回正');
  });

  // ==========================================================================
  // SLIDERS & PARAMETER TWEAKERS
  // ==========================================================================
  glareRange.addEventListener('input', (e) => {
    const val = e.target.value;
    glareValText.textContent = `${val}%`;
    state.glareOpacity = val / 100;
    cardInner.style.setProperty('--glare-opacity', state.glareOpacity);
  });

  tiltRange.addEventListener('input', (e) => {
    const val = e.target.value;
    state.tiltMultiplier = val / 100;
    tiltValText.textContent = `${state.tiltMultiplier.toFixed(1)}x`;
  });

  particleRange.addEventListener('input', (e) => {
    const val = e.target.value;
    state.particleSpeed = val / 100;
    particleValText.textContent = val < 70 ? 'Low' : val > 130 ? 'Ultra' : 'Normal';
  });

  // ==========================================================================
  // LOUPE / MACRO INSPECT MODAL
  // ==========================================================================
  function openInspect() {
    initAudio();
    playClickSound();
    inspectModal.classList.add('active');
  }

  function closeInspect() {
    initAudio();
    playClickSound();
    inspectModal.classList.remove('active');
    inspectImage.style.transform = 'scale(1)';
  }

  btnInspectMode.addEventListener('click', openInspect);
  btnCloseInspect.addEventListener('click', closeInspect);
  inspectBackdrop.addEventListener('click', closeInspect);

  inspectViewport.addEventListener('mousemove', (e) => {
    const rect = inspectViewport.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    inspectImage.style.transformOrigin = `${x}% ${y}%`;
    inspectImage.style.transform = 'scale(2.4)';
  });

  inspectViewport.addEventListener('mouseleave', () => {
    inspectImage.style.transform = 'scale(1)';
  });

  // ==========================================================================
  // SNAPSHOT & DIGITAL CERTIFICATE EXPORT
  // ==========================================================================
  btnSnapshot.addEventListener('click', () => {
    initAudio();
    playClickSound();
    showToast('📸', '正在擷取 katee 典藏卡超清快照...');
    setTimeout(() => {
      showToast('✅', '典藏快照已就緒！No.001/001 SAR 鑑定碼認證成功');
    }, 800);
  });

  btnShareSpec.addEventListener('click', () => {
    initAudio();
    playClickSound();
    const certText = `【傳奇卡牌工坊 · 唯一鑑定憑證】
卡牌名稱：katee (暗影魔女)
屬性/HP：暗影黑 / HP 100
位階/稀有度：MASTER / No.001/001 ★★★★★★ SAR
工藝風格：${foilTitles[state.currentFoil]}
被動技能：夜間感知、魔力恢復與隱匿行動
招式/奧義：暗影貓爪 (1星) / 滿月禁咒・星夜魔陣 (3星)
創作者/日期：MRs.lun / 2026/10/08
防偽 Hash：0x7F4A88920261008B92D`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(certText).then(() => {
        showToast('📋', '卡牌官方鑄造規格憑證已複製至剪貼簿！');
      }).catch(() => {
        showToast('📋', '憑證代碼已產生：LGN-2026-KATEE-001');
      });
    } else {
      showToast('📋', '憑證代碼已產生：LGN-2026-KATEE-001');
    }
  });

  document.getElementById('btnExportCard').addEventListener('click', () => {
    initAudio();
    playClickSound();
    showToast('📜', '官方數位鑑定證書 (COA) 已生成！編號 #LGN-2026-KATEE-001');
  });

  // ==========================================================================
  // AMBIENT PARTICLES & NEBULA ENGINE (CANVAS)
  // ==========================================================================
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = 65;

  class MagicParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.8 + 0.8;
      this.speedY = -(Math.random() * 0.7 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.color = Math.random() > 0.4 ? '#c084fc' : (Math.random() > 0.5 ? '#fef08a' : '#e879f9');
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.y += this.speedY * state.particleSpeed;
      this.x += this.speedX * state.particleSpeed;
      this.pulse += this.pulseSpeed;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      const currentAlpha = Math.max(0.1, (Math.sin(this.pulse) * 0.3 + 0.5) * this.alpha);
      ctx.save();
      ctx.globalAlpha = currentAlpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new MagicParticle());
  }

  function renderAmbient() {
    ctx.clearRect(0, 0, width, height);

    // Draw magical stardust particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(renderAmbient);
  }

  requestAnimationFrame(renderAmbient);

  // Initialize Audio upon first user interaction
  window.addEventListener('click', initAudio, { once: true });
  window.addEventListener('touchstart', initAudio, { once: true });

  console.log('🔮 傳奇卡牌工坊: katee No.001/001 SAR 3D 鐳射黑金浮雕系統已就緒');
})();
