/**
 * 천명(天命) 은하수 소원 연등 광장 (Wish Plaza Engine)
 * - 2D Canvas 기반 탐험형 가상 광장
 * - 키보드 방향키(↑↓←→) 및 WASD 이동 지원
 * - 마우스/터치 클릭 이동 및 모바일 가상 패드 지원
 * - 30+ 실시간 부유 연등, 별똥별(유성), 반짝이는 은하수 밤하늘
 * - 주간 1위 명예의 전당 대연등 제단 & 소원 인터랙션
 */

class WishPlazaEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.isRunning = false;
    this.animFrameId = null;

    // World size
    this.worldWidth = 2600;
    this.worldHeight = 1800;

    // Camera
    this.camera = { x: 1300, y: 900 };

    // Player
    this.player = {
      x: 1300,
      y: 1100,
      vx: 0,
      vy: 0,
      speed: 4.8,
      radius: 18,
      facing: "down", // "up", "down", "left", "right"
      isMoving: false,
      stepPhase: 0,
      targetX: null,
      targetY: null,
      name: "나의 도반"
    };

    // Keys state
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    // World Elements
    this.stars = [];
    this.shootingStars = [];
    this.lanterns = [];
    this.nearbyLantern = null;
    this.shrine = { x: 1300, y: 450, radius: 85 };

    // Timing
    this.lastTime = 0;
    this.lastShootingStarTime = 0;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.getElementById("wishPlazaCanvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();

    window.addEventListener("resize", () => {
      if (this.isRunning) this.resizeCanvas();
    });

    this.initStars();
    this.initLanterns();
    this.bindEvents();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 280; i++) {
      this.stars.push({
        x: Math.random() * this.worldWidth,
        y: Math.random() * (this.worldHeight * 0.85),
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  initLanterns() {
    this.lanterns = [];

    // Load from App or localStorage or window.INITIAL_COMMUNITY_WISHES
    let communityData = [];
    try {
      const saved = JSON.parse(localStorage.getItem("chunmyung_community_wishes") || "null");
      if (saved && Array.isArray(saved) && saved.length > 0) {
        communityData = saved;
      } else if (window.INITIAL_COMMUNITY_WISHES && Array.isArray(window.INITIAL_COMMUNITY_WISHES)) {
        communityData = JSON.parse(JSON.stringify(window.INITIAL_COMMUNITY_WISHES));
      }
    } catch (e) {
      communityData = window.INITIAL_COMMUNITY_WISHES || [];
    }

    if (communityData.length === 0) {
      communityData = [
        { id: 101, category: "🌿 건강·장수", author: "어머니의 딸 김도반", text: "어머니 큰 수술 무사히 잘 마치시고 건강을 되찾으시길 간절히 기도합니다.", cheers: 284, date: "2026. 11. 22." },
        { id: 102, category: "🎓 시험·합격", author: "새벽별 임용고시생", text: "3년 동안 준비한 중등 임용고시, 이번에는 반드시 합격하여 아이들에게 온기를 전하는 교사가 되고 싶습니다.", cheers: 196, date: "2026. 11. 21." },
        { id: 103, category: "🏡 가족·화목", author: "두 아이의 가장", text: "우리 네 식구 아프지 않고 날마다 웃음꽃 피는 한 해가 되기를 소망합니다.", cheers: 153, date: "2026. 11. 20." }
      ];
    }

    // Fixed locations for community lanterns arranged gracefully in circles and clusters around the milky way
    const positions = [
      // Welcoming cluster near entrance / spawn (x: 1300, y: 1100)
      { x: 1220, y: 1030 },
      { x: 1380, y: 1030 },
      { x: 1180, y: 1170 },
      { x: 1420, y: 1170 },

      // Inner circle around the sacred shrine (x: 1300, y: 450)
      { x: 1050, y: 620 },
      { x: 1550, y: 620 },
      { x: 920, y: 780 },
      { x: 1680, y: 780 },
      { x: 1150, y: 880 },
      { x: 1450, y: 880 },

      // Mid-field garden pathway
      { x: 800, y: 1050 },
      { x: 1800, y: 1050 },
      { x: 1020, y: 1200 },
      { x: 1580, y: 1200 },
      { x: 700, y: 1350 },
      { x: 1900, y: 1350 },

      // Outer galaxy grove
      { x: 550, y: 700 },
      { x: 2050, y: 700 },
      { x: 450, y: 1100 },
      { x: 2150, y: 1100 },
      { x: 600, y: 1550 },
      { x: 2000, y: 1550 },
      { x: 1100, y: 1500 },
      { x: 1500, y: 1500 },
      { x: 1300, y: 1620 },

      // Sacred spring cluster
      { x: 850, y: 400 },
      { x: 1750, y: 400 },
      { x: 650, y: 350 },
      { x: 1950, y: 350 }
    ];

    communityData.forEach((w, index) => {
      const pos = positions[index % positions.length];
      const offsetX = (index >= positions.length) ? (Math.random() * 200 - 100) : 0;
      const offsetY = (index >= positions.length) ? (Math.random() * 200 - 100) : 0;

      this.lanterns.push({
        id: w.id,
        x: pos.x + offsetX,
        y: pos.y + offsetY,
        baseY: pos.y + offsetY,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.025 + 0.015,
        floatAmp: Math.random() * 8 + 6,
        category: w.category,
        author: w.author,
        text: w.text,
        cheers: w.cheers || 1,
        date: w.date || "2026. 11. 23.",
        scale: 1,
        pulseOffset: Math.random() * Math.PI * 2
      });
    });
  }

  bindEvents() {
    // Keyboard controls (WASD & Arrow keys & E & Space)
    window.addEventListener("keydown", (e) => {
      if (!this.isRunning) return;

      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === "ArrowUp" || key === "w") {
        this.keys.up = true;
        this.player.targetX = null;
        this.player.targetY = null;
        e.preventDefault();
      } else if (code === "ArrowDown" || key === "s") {
        this.keys.down = true;
        this.player.targetX = null;
        this.player.targetY = null;
        e.preventDefault();
      } else if (code === "ArrowLeft" || key === "a") {
        this.keys.left = true;
        this.player.targetX = null;
        this.player.targetY = null;
        e.preventDefault();
      } else if (code === "ArrowRight" || key === "d") {
        this.keys.right = true;
        this.player.targetX = null;
        this.player.targetY = null;
        e.preventDefault();
      } else if (code === "KeyE" || code === "Space") {
        this.interactWithNearby();
        e.preventDefault();
      } else if (code === "Escape") {
        this.close();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (!this.isRunning) return;

      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === "ArrowUp" || key === "w") this.keys.up = false;
      if (code === "ArrowDown" || key === "s") this.keys.down = false;
      if (code === "ArrowLeft" || key === "a") this.keys.left = false;
      if (code === "ArrowRight" || key === "d") this.keys.right = false;
    });

    // Canvas click / tap to move & interact
    if (this.canvas) {
      this.canvas.addEventListener("click", (e) => {
        if (!this.isRunning) return;
        const rect = this.canvas.getBoundingClientRect();
        const clickScreenX = e.clientX - rect.left;
        const clickScreenY = e.clientY - rect.top;

        // Convert to world coordinates
        const clickWorldX = clickScreenX + this.camera.x;
        const clickWorldY = clickScreenY + this.camera.y;

        // Check if clicked directly on a lantern
        let clickedLantern = null;
        for (const lantern of this.lanterns) {
          const dist = Math.hypot(lantern.x - clickWorldX, lantern.y - clickWorldY);
          if (dist < 60) {
            clickedLantern = lantern;
            break;
          }
        }

        // Check if clicked on the Grand Shrine
        const distToShrine = Math.hypot(this.shrine.x - clickWorldX, this.shrine.y - clickWorldY);
        if (distToShrine < 85) {
          this.showWeeklyTopModal();
          return;
        }

        if (clickedLantern) {
          this.showWishDetailModal(clickedLantern);
          return;
        } else {
          // Walk to clicked point
          this.player.targetX = clickWorldX;
          this.player.targetY = clickWorldY;
          this.player.pendingInteraction = null;
        }
      });
    }
  }

  start() {
    this.isRunning = true;
    this.resizeCanvas();
    if (this.container) {
      this.container.classList.remove("hidden");
    }

    // Set player nickname from logged in account if available
    if (window.App && window.App.currentAccount && window.App.currentAccount.name) {
      this.player.name = window.App.currentAccount.name;
    } else {
      this.player.name = "천명 도반";
    }

    this.updateHudCount();
    this.lastTime = performance.now();
    this.loop();
  }

  close() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.container) {
      this.container.classList.add("hidden");
    }
  }

  loop(currentTime = performance.now()) {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(dt, currentTime);
    this.render(currentTime);

    this.animFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  update(dt, currentTime) {
    // 1. Player movement
    let moveX = 0;
    let moveY = 0;

    if (this.keys.up) moveY -= 1;
    if (this.keys.down) moveY += 1;
    if (this.keys.left) moveX -= 1;
    if (this.keys.right) moveX += 1;

    // Direct click-to-move target
    if (this.player.targetX !== null && this.player.targetY !== null && moveX === 0 && moveY === 0) {
      const dx = this.player.targetX - this.player.x;
      const dy = this.player.targetY - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 6) {
        this.player.targetX = null;
        this.player.targetY = null;
        if (this.player.pendingInteraction) {
          this.showWishDetailModal(this.player.pendingInteraction);
          this.player.pendingInteraction = null;
        }
      } else {
        moveX = dx / dist;
        moveY = dy / dist;
      }
    }

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      const normX = (moveX / len) * this.player.speed;
      const normY = (moveY / len) * this.player.speed;

      this.player.x += normX;
      this.player.y += normY;
      this.player.isMoving = true;
      this.player.stepPhase += 0.22;

      // Determine facing direction
      if (Math.abs(normX) > Math.abs(normY)) {
        this.player.facing = normX > 0 ? "right" : "left";
      } else {
        this.player.facing = normY > 0 ? "down" : "up";
      }
    } else {
      this.player.isMoving = false;
    }

    // Clamp player to world bounds
    this.player.x = Math.max(50, Math.min(this.worldWidth - 50, this.player.x));
    this.player.y = Math.max(50, Math.min(this.worldHeight - 50, this.player.y));

    // 2. Camera smooth follow
    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;

    // Clamp camera
    this.camera.x = Math.max(0, Math.min(this.worldWidth - this.canvas.width, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.worldHeight - this.canvas.height, this.camera.y));

    // 3. Floating lanterns bobbing
    const timeSec = currentTime * 0.001;
    this.lanterns.forEach((l) => {
      l.y = l.baseY + Math.sin(timeSec * (l.floatSpeed * 60) + l.floatOffset) * l.floatAmp;
    });

    // 4. Proximity check
    this.nearbyLantern = null;
    let closestDist = 72;

    for (const lantern of this.lanterns) {
      const dist = Math.hypot(lantern.x - this.player.x, lantern.y - this.player.y);
      if (dist < closestDist) {
        closestDist = dist;
        this.nearbyLantern = lantern;
      }
    }

    // Check shrine proximity
    const distToShrine = Math.hypot(this.shrine.x - this.player.x, this.shrine.y - this.player.y);
    this.isNearShrine = distToShrine < 95;

    // 5. Shooting stars periodic spawn
    if (currentTime - this.lastShootingStarTime > 2800 && Math.random() < 0.4) {
      this.lastShootingStarTime = currentTime;
      this.spawnShootingStar();
    }

    // Update active shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= dt;
      s.alpha = Math.max(0, s.life / s.maxLife);
      if (s.life <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  spawnShootingStar() {
    const startX = Math.random() * (this.worldWidth * 0.7) + this.worldWidth * 0.2;
    const startY = Math.random() * 400 + 50;
    const angle = (Math.PI / 180) * (135 + (Math.random() * 20 - 10)); // diagonal downwards-left
    const speed = Math.random() * 600 + 500;
    const duration = Math.random() * 0.6 + 0.4;

    this.shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed * 0.016,
      vy: Math.sin(angle) * speed * 0.016,
      length: Math.random() * 90 + 70,
      life: duration,
      maxLife: duration,
      alpha: 1,
      color: Math.random() > 0.3 ? "#fde047" : "#7dd3fc"
    });
  }

  render(currentTime) {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply camera transform
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 1. Cosmic Night Sky Background & Milky Way Nebula
    this.renderBackground(ctx);

    // 2. Twinkling Stars
    this.renderStars(ctx, currentTime);

    // 3. Shooting Stars
    this.renderShootingStars(ctx);

    // 4. Sacred Ground Pathways & Stone Steps
    this.renderGround(ctx);

    // 5. Weekly Top 1 Sacred Golden Shrine
    this.renderGrandShrine(ctx, currentTime);

    // 6. Floating Community Lanterns
    this.renderLanterns(ctx, currentTime);

    // 7. Player Avatar
    this.renderPlayer(ctx);

    // 8. Interaction Tooltips & Highlights
    this.renderInteractionPrompts(ctx, currentTime);

    ctx.restore();

    // 9. Screen space Minimap & HUD
    this.renderMinimap(ctx);
  }

  renderBackground(ctx) {
    // Deep midnight gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.worldHeight);
    bgGrad.addColorStop(0, "#030611");
    bgGrad.addColorStop(0.35, "#0b0f26");
    bgGrad.addColorStop(0.7, "#161028");
    bgGrad.addColorStop(1, "#1c142e");

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    // Glowing Luminous Full Moon
    ctx.save();
    const moonX = 1880;
    const moonY = 220;

    const moonAura = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 120);
    moonAura.addColorStop(0, "rgba(254, 240, 138, 0.45)");
    moonAura.addColorStop(0.5, "rgba(254, 240, 138, 0.15)");
    moonAura.addColorStop(1, "rgba(254, 240, 138, 0)");
    ctx.fillStyle = moonAura;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fffbeb";
    ctx.shadowColor = "#fef08a";
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Subtle Milky Way Nebula ribbons
    ctx.save();
    ctx.globalAlpha = 0.14;
    const nebGrad = ctx.createLinearGradient(300, 200, 2200, 1400);
    nebGrad.addColorStop(0, "rgba(99, 102, 241, 0.3)");
    nebGrad.addColorStop(0.5, "rgba(217, 119, 6, 0.35)");
    nebGrad.addColorStop(1, "rgba(168, 85, 247, 0.3)");
    ctx.fillStyle = nebGrad;
    ctx.beginPath();
    ctx.ellipse(1300, 800, 1100, 480, Math.PI * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderStars(ctx, currentTime) {
    const timeSec = currentTime * 0.001;
    ctx.save();

    for (const star of this.stars) {
      const twinkle = Math.sin(timeSec * star.twinkleSpeed * 50 + star.twinkleOffset);
      const currentAlpha = Math.max(0.15, star.alpha + twinkle * 0.3);

      ctx.globalAlpha = currentAlpha;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderShootingStars(ctx) {
    if (this.shootingStars.length === 0) return;

    ctx.save();
    for (const s of this.shootingStars) {
      ctx.globalAlpha = s.alpha;
      const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
      const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.3, s.color);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Sparkle head
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderGround(ctx) {
    ctx.save();

    // Sacred central courtyard circle (소원터 대지)
    const groundGrad = ctx.createRadialGradient(1300, 1000, 200, 1300, 1000, 800);
    groundGrad.addColorStop(0, "rgba(35, 22, 17, 0.7)");
    groundGrad.addColorStop(0.6, "rgba(28, 18, 14, 0.45)");
    groundGrad.addColorStop(1, "rgba(10, 12, 24, 0)");

    ctx.fillStyle = groundGrad;
    ctx.beginPath();
    ctx.ellipse(1300, 1000, 850, 550, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stepping stones pathway (은하수 돌다리 길)
    ctx.strokeStyle = "rgba(212, 163, 89, 0.22)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.moveTo(1300, 520);
    ctx.lineTo(1300, 1650);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(650, 1000);
    ctx.lineTo(1950, 1000);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  renderGrandShrine(ctx, currentTime) {
    const shrine = this.shrine;
    const timeSec = currentTime * 0.001;

    ctx.save();

    // Sacred Shrine Altar Platform
    const altarGrad = ctx.createRadialGradient(shrine.x, shrine.y, 20, shrine.x, shrine.y, 140);
    altarGrad.addColorStop(0, "rgba(245, 158, 11, 0.35)");
    altarGrad.addColorStop(0.5, "rgba(217, 119, 6, 0.15)");
    altarGrad.addColorStop(1, "rgba(217, 119, 6, 0)");
    ctx.fillStyle = altarGrad;
    ctx.beginPath();
    ctx.arc(shrine.x, shrine.y, 140, 0, Math.PI * 2);
    ctx.fill();

    // Stone Steps & Platform
    ctx.fillStyle = "#2a1b14";
    ctx.strokeStyle = "#d4a359";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(shrine.x - 70, shrine.y + 15, 140, 32, 8);
    ctx.fill();
    ctx.stroke();

    // Grand Weekly 1st Place Golden Lantern
    const floatY = shrine.y - 30 + Math.sin(timeSec * 1.8) * 6;

    // Golden Aura
    const pulseRadius = 65 + Math.sin(timeSec * 3) * 12;
    const aura = ctx.createRadialGradient(shrine.x, floatY, 10, shrine.x, floatY, pulseRadius);
    aura.addColorStop(0, "rgba(254, 240, 138, 0.85)");
    aura.addColorStop(0.4, "rgba(245, 158, 11, 0.5)");
    aura.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(shrine.x, floatY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    // Big Lantern Emoji / Icon
    ctx.font = "46px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 18;
    ctx.fillText("🏮", shrine.x, floatY);

    // Crown above lantern
    ctx.font = "26px sans-serif";
    ctx.shadowBlur = 10;
    ctx.fillText("👑", shrine.x, floatY - 38);

    // Plaque Banner text
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1e140d";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(shrine.x - 100, shrine.y + 55, 200, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("👑 주간 최다 응원 1위 연등 제단", shrine.x, shrine.y + 68);

    ctx.restore();
  }

  renderLanterns(ctx, currentTime) {
    const timeSec = currentTime * 0.001;

    for (const l of this.lanterns) {
      ctx.save();

      // Soft ground shadow beneath lantern
      const shadowY = l.baseY + 35;
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.beginPath();
      ctx.ellipse(l.x, shadowY, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden light aura
      const auraPulse = 30 + Math.sin(timeSec * 2.5 + l.pulseOffset) * 6;
      const aura = ctx.createRadialGradient(l.x, l.y, 4, l.x, l.y, auraPulse);
      aura.addColorStop(0, "rgba(251, 191, 36, 0.7)");
      aura.addColorStop(0.5, "rgba(217, 119, 6, 0.25)");
      aura.addColorStop(1, "rgba(217, 119, 6, 0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(l.x, l.y, auraPulse, 0, Math.PI * 2);
      ctx.fill();

      // Lantern body
      ctx.font = "24px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 12;
      ctx.fillText("🏮", l.x, l.y);

      // Category & Author Badge Tag
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(26, 17, 12, 0.88)";
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(l.x - 48, l.y + 18, 96, 18, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 9px sans-serif";
      const catShort = l.category.split(" ")[1] || l.category;
      ctx.fillText(`[${catShort}] ${l.author.slice(0, 6)}`, l.x, l.y + 27);

      // Cheer heart badge
      ctx.fillStyle = "#f87171";
      ctx.font = "9px sans-serif";
      ctx.fillText(`❤️ ${l.cheers}`, l.x, l.y + 45);

      ctx.restore();
    }
  }

  renderPlayer(ctx) {
    const p = this.player;

    ctx.save();

    // 1. Lantern Handheld Glow (Illumination Circle on Ground)
    const lanternGlow = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, 110);
    lanternGlow.addColorStop(0, "rgba(254, 240, 138, 0.45)");
    lanternGlow.addColorStop(0.5, "rgba(245, 158, 11, 0.18)");
    lanternGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = lanternGlow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 110, 0, Math.PI * 2);
    ctx.fill();

    // 2. Character Ground Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 16, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Korean Traditional Scholar Avatar (선비 / 낭만 도반)
    const legOffset = p.isMoving ? Math.sin(p.stepPhase) * 4 : 0;

    // Robe Body (Dancheong Jade-Blue Hanbok)
    ctx.fillStyle = "#1e3a8a"; // royal navy
    ctx.strokeStyle = "#d4a359"; // gold border
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(p.x - 12, p.y - 12, 24, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Outer Durumagi collar
    ctx.fillStyle = "#047857"; // jade green trim
    ctx.beginPath();
    ctx.moveTo(p.x - 6, p.y - 12);
    ctx.lineTo(p.x, p.y - 2);
    ctx.lineTo(p.x + 6, p.y - 12);
    ctx.fill();

    // Traditional Gat (흑립 / 조선 모자)
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - 18, 17, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(p.x - 8, p.y - 30, 16, 14, 2);
    ctx.fill();

    // Handheld Lantern
    const lanternHandX = p.facing === "left" ? p.x - 18 : p.x + 18;
    const lanternHandY = p.y + 2 + legOffset * 0.4;

    ctx.font = "18px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 10;
    ctx.fillText("🏮", lanternHandX, lanternHandY);
    ctx.shadowBlur = 0;

    // Player Name Plate above head
    ctx.fillStyle = "rgba(17, 24, 39, 0.9)";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(p.x - 45, p.y - 48, 90, 18, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`도반 ${p.name.slice(0, 6)} (나)`, p.x, p.y - 39);

    ctx.restore();
  }

  renderInteractionPrompts(ctx, currentTime) {
    const timeSec = currentTime * 0.001;

    // If near Weekly Top Shrine
    if (this.isNearShrine) {
      ctx.save();
      const shrine = this.shrine;
      const bounceY = Math.sin(timeSec * 4) * 3;

      ctx.fillStyle = "rgba(140, 29, 29, 0.95)";
      ctx.strokeStyle = "#fde047";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(shrine.x - 120, shrine.y - 95 + bounceY, 240, 30, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("✨ [E] 또는 [클릭] 주간 1위 소원 헌사 보기 👑", shrine.x, shrine.y - 78 + bounceY);
      ctx.restore();
    }

    // If near a community lantern
    if (this.nearbyLantern) {
      const l = this.nearbyLantern;
      ctx.save();

      // Pulsing interaction ring
      const ringPulse = 28 + Math.sin(timeSec * 6) * 5;
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(l.x, l.y, ringPulse, 0, Math.PI * 2);
      ctx.stroke();

      // Floating prompt box
      const bounceY = Math.sin(timeSec * 4) * 3;
      ctx.fillStyle = "rgba(140, 29, 29, 0.95)";
      ctx.strokeStyle = "#fde047";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(l.x - 90, l.y - 42 + bounceY, 180, 26, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🙏 [E] 또는 [클릭] 소원 읽기 & 응원", l.x, l.y - 28 + bounceY);

      ctx.restore();
    }
  }

  renderMinimap(ctx) {
    const mapW = 140;
    const mapH = 96;
    const pad = 16;
    const mapX = this.canvas.width - mapW - pad;
    const mapY = pad + 45; // Below HUD

    ctx.save();

    // Minimap background
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(mapX, mapY, mapW, mapH, 8);
    ctx.fill();
    ctx.stroke();

    // Shrine dot (Gold)
    const shrineMapX = mapX + (this.shrine.x / this.worldWidth) * mapW;
    const shrineMapY = mapY + (this.shrine.y / this.worldHeight) * mapH;
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(shrineMapX, shrineMapY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Lantern dots (warm amber)
    ctx.fillStyle = "#fbbf24";
    for (const l of this.lanterns) {
      const lx = mapX + (l.x / this.worldWidth) * mapW;
      const ly = mapY + (l.y / this.worldHeight) * mapH;
      ctx.beginPath();
      ctx.arc(lx, ly, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player dot (cyan / white pulsing)
    const px = mapX + (this.player.x / this.worldWidth) * mapW;
    const py = mapY + (this.player.y / this.worldHeight) * mapH;
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px sans-serif";
    ctx.fillText("소원터 미니맵", mapX + 6, mapY + 12);

    ctx.restore();
  }

  interactWithNearby() {
    if (this.isNearShrine) {
      this.showWeeklyTopModal();
    } else if (this.nearbyLantern) {
      this.showWishDetailModal(this.nearbyLantern);
    }
  }

  showWishDetailModal(lantern) {
    const dialog = document.getElementById("wishCardDetailModal");
    if (!dialog) return;

    let cheeredIds = [];
    try {
      cheeredIds = JSON.parse(localStorage.getItem("chunmyung_cheered_wish_ids") || "[]");
    } catch (e) {}

    const isCheered = cheeredIds.includes(lantern.id);

    const titleEl = document.getElementById("wishDetailTitle");
    const authorEl = document.getElementById("wishDetailAuthor");
    const dateEl = document.getElementById("wishDetailDate");
    const textEl = document.getElementById("wishDetailText");
    const cheerCountEl = document.getElementById("wishDetailCheerCount");
    const cheerBtn = document.getElementById("wishDetailCheerBtn");

    if (titleEl) titleEl.textContent = lantern.category;
    if (authorEl) authorEl.textContent = lantern.author;
    if (dateEl) dateEl.textContent = lantern.date;
    if (textEl) textEl.textContent = `"${lantern.text}"`;
    if (cheerCountEl) cheerCountEl.textContent = lantern.cheers;

    if (cheerBtn) {
      cheerBtn.onclick = () => {
        this.cheerLantern(lantern.id);
      };
      if (isCheered) {
        cheerBtn.innerHTML = `<span>❤️</span><span>응원 완료</span><span class="ml-1 px-1.5 py-0.5 rounded-full bg-stone-900 text-[10px]">${lantern.cheers}</span>`;
        cheerBtn.className = "px-4 py-2 rounded-xl bg-[#8c1d1d] text-[#ffe8b3] font-bold border border-[#f59e0b] shadow flex items-center space-x-1.5 text-xs";
      } else {
        cheerBtn.innerHTML = `<span>🙏</span><span>따뜻한 응원 보내기</span><span class="ml-1 px-1.5 py-0.5 rounded-full bg-stone-900 text-[10px]">${lantern.cheers}</span>`;
        cheerBtn.className = "px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-white font-bold border border-[#fde68a] shadow flex items-center space-x-1.5 text-xs transition cursor-pointer";
      }
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  showWeeklyTopModal() {
    const dialog = document.getElementById("wishWeeklyTopModal");
    if (!dialog) return;

    // Find highest cheered wish
    const topWish = this.lanterns.reduce((max, w) => (w.cheers > max.cheers ? w : max), this.lanterns[0]);

    const titleEl = document.getElementById("weeklyTopDetailTitle");
    const textEl = document.getElementById("weeklyTopDetailText");
    const countEl = document.getElementById("weeklyTopDetailCount");

    if (titleEl && topWish) {
      titleEl.textContent = `[${topWish.category}] ${topWish.author} 님의 소원`;
    }
    if (textEl && topWish) {
      textEl.textContent = `"${topWish.text}"`;
    }
    if (countEl && topWish) {
      countEl.textContent = topWish.cheers;
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  cheerLantern(id) {
    const lantern = this.lanterns.find((l) => l.id === id);
    if (!lantern) return;

    lantern.cheers += 1;

    // Update in localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("chunmyung_community_wishes") || "[]");
      const match = saved.find((w) => w.id === id);
      if (match) match.cheers = lantern.cheers;
      localStorage.setItem("chunmyung_community_wishes", JSON.stringify(saved));
    } catch (e) {}

    // Record cheered id
    let cheeredIds = [];
    try {
      cheeredIds = JSON.parse(localStorage.getItem("chunmyung_cheered_wish_ids") || "[]");
    } catch (e) {}
    if (!cheeredIds.includes(id)) {
      cheeredIds.push(id);
      try {
        localStorage.setItem("chunmyung_cheered_wish_ids", JSON.stringify(cheeredIds));
      } catch (e) {}
    }

    // Refresh UI
    const countEl = document.getElementById("wishDetailCheerCount");
    if (countEl) countEl.textContent = lantern.cheers;

    const cheerBtn = document.getElementById("wishDetailCheerBtn");
    if (cheerBtn) {
      cheerBtn.innerHTML = `<span>❤️</span><span>응원 완료</span><span class="ml-1 px-1.5 py-0.5 rounded-full bg-stone-900 text-[10px]">${lantern.cheers}</span>`;
      cheerBtn.className = "px-4 py-2 rounded-xl bg-[#8c1d1d] text-[#ffe8b3] font-bold border border-[#f59e0b] shadow flex items-center space-x-1.5 text-xs";
    }

    if (window.confetti) {
      try {
        window.confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    this.showToast(`✨ [${lantern.author}] 님께 따뜻한 응원을 보냈습니다!`);
  }

  addPlayerNewLantern(newWish) {
    // Spawn right near player
    const newLantern = {
      id: newWish.id,
      x: this.player.x + (Math.random() * 40 - 20),
      y: this.player.y - 30,
      baseY: this.player.y - 30,
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.02,
      floatAmp: 8,
      category: newWish.category,
      author: newWish.author,
      text: newWish.text,
      cheers: 1,
      date: newWish.date,
      scale: 1,
      pulseOffset: 0
    };

    this.lanterns.unshift(newLantern);
    this.updateHudCount();
    this.showToast("🏮 도반님의 소원 연등이 은하수 광장 하늘에 띄워졌습니다!");
  }

  updateHudCount() {
    const el = document.getElementById("wishPlazaTotalCount");
    if (el) el.textContent = this.lanterns.length;
  }

  showToast(msg) {
    const toast = document.getElementById("wishPlazaToast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");

    setTimeout(() => {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0", "pointer-events-none");
    }, 2800);
  }
}

// Global engine instance
window.WishPlaza = new WishPlazaEngine();
