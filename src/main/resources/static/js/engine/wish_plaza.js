/**
 * ============================================================================
 * 천명(天命) 3D 산사(절) 은하수 소원 연등 광장 엔진 (Three.js 3D Grand Virtual Temple)
 * ============================================================================
 * - 웅장한 대형 한국 전통 사찰 대웅보전(중층 전각), 동편 범종각, 서편 명부전, 회랑
 * - 스페이스바 점프(Jump Physics: 중력, 점프속도, 착지)
 * - 마우스 이동/드래그 상·하·좌·우(위, 아래, 양옆) 360도 자유 시점 제어
 * - W(앞), S(뒤), A(좌), D(우) & 방향키 카메라 시점 기준 3D 캐릭터 보행
 * - 삼층대석탑 & 주간 1위 대황금연등 제단, 3D 한지 연등, 연화지, 홍예교, 석등, 소나무숲
 * ============================================================================
 */

class WishPlaza3DEngine {
  constructor() {
    this.container = null;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.isRunning = false;
    this.animFrameId = null;

    // Movement keys
    this.keys = {
      up: false,    // W or ArrowUp (Forward)
      down: false,  // S or ArrowDown (Backward)
      left: false,  // A or ArrowLeft (Strafe Left)
      right: false  // D or ArrowRight (Strafe Right)
    };

    // Camera Orbit around player (Free Mouse Look Up/Down/Left/Right)
    this.cameraOrbit = {
      azimuth: 0.0,         // Horizontal rotation (radians)
      elevation: 0.22,      // Vertical angle (radians) - pitch optimal for temple eye-level view
      distance: 15.0,       // Distance from player
      isDragging: false,
      prevMouseX: 0,
      prevMouseY: 0
    };

    // Player state with JUMP physics
    this.player = {
      mesh: null,
      nameTagSprite: null,
      lanternMesh: null,
      handLight: null,
      x: 0,
      y: 0,                 // Elevation (0 = grounded)
      z: 16,                // Start in courtyard near entrance
      vy: 0,                // Vertical velocity for jumping
      isGrounded: true,
      jumpSpeed: 10.5,      // Initial upward velocity on jump
      gravity: 25.0,        // Downward gravity acceleration
      targetX: null,
      targetZ: null,
      rotationY: 0,
      speed: 11.5,
      walkPhase: 0,
      isMoving: false,
      isPraying: false,
      prayPhase: 0,
      bowIndex: 0,
      upperBody: null,
      leftLeg: null,
      rightLeg: null,
      leftArm: null,
      rightArm: null,
      name: "천명 도반"
    };

    // World collections
    this.lanterns = [];         // Data + 3D meshes
    this.shootingStars = [];    // Active 3D shooting stars
    this.sparkleParticles = []; // Cheer particle effects
    this.incenseParticles = []; // Temple altar incense smoke
    this.nearbyLantern = null;
    this.isNearShrine = false;
    this.isNearBuddhaAltar = false;
    this.buddhaGroup = null;
    this.candleLightLeft = null;
    this.candleLightRight = null;
    this.audioCtx = null;
    this.lastShootingStarTime = 0;
    this.clock = null;

    // Raycaster for mouse click on 3D objects
    this.raycaster = null;
    this.mouse = null;

    // Cached materials & textures
    this.textures = {};
    this.materials = {};
  }

  /* ==========================================================================
     초기화 및 시작/종료 라이프사이클
     ========================================================================== */
  init(containerId = "wishPlazaSection") {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.getElementById("wishPlazaCanvas");
    if (!this.canvas) return;

    if (typeof THREE === "undefined") {
      console.error("Three.js is not loaded.");
      return;
    }

    if (!this.clock) {
      this.clock = new THREE.Clock();
    }

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 1. Renderer setup
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
    }

    // 2. Scene & Camera setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040612); // Midnight temple sky
    this.scene.fog = new THREE.FogExp2(0x060918, 0.0055);

    this.camera = new THREE.PerspectiveCamera(
      54,
      window.innerWidth / window.innerHeight,
      0.1,
      950
    );

    // 3. Procedural textures
    this.initProceduralTextures();

    // 4. Build Grand 3D Korean Temple Complex
    this.buildLighting();
    this.buildSkyAndStars();
    this.buildGroundAndCourtyard();
    this.buildGrandTempleHall();       // Significantly enlarged 2-story Daeungjeon
    this.buildSidePavilionsAndCorridor(); // Flanking East Bell Tower & West Hall
    this.buildStonePagodaAndShrine();
    this.buildStoneLanterns();
    this.buildLotusPondAndBridge();
    this.buildPineTreesAndNature();
    this.buildPlayerCharacter();
    this.initLanterns();

    // 5. Input Events
    this.bindEvents();

    window.addEventListener("resize", () => {
      if (this.isRunning) this.resize();
    });
  }

  start() {
    this.isRunning = true;
    if (this.container) {
      this.container.classList.remove("hidden");
    }
    this.resize();

    // Set player nickname from account if logged in
    if (window.App && window.App.currentAccount && window.App.currentAccount.name) {
      this.player.name = window.App.currentAccount.name;
    } else {
      this.player.name = "천명 도반";
    }
    this.updatePlayerNameTag();

    this.updateHudCount();
    if (this.clock) this.clock.start();
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

  resize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /* ==========================================================================
     점프 (Jump Physics) 액션
     ========================================================================== */
  jump() {
    if (this.player.isGrounded) {
      this.player.vy = this.player.jumpSpeed;
      this.player.isGrounded = false;
    }
  }

  /* ==========================================================================
     절 텍스처 및 조명 빌더
     ========================================================================== */
  initProceduralTextures() {
    // 1. Granite Pavement Texture (절마당 화강암 박석)
    const stoneCanvas = document.createElement("canvas");
    stoneCanvas.width = 512;
    stoneCanvas.height = 512;
    const sctx = stoneCanvas.getContext("2d");
    sctx.fillStyle = "#2d2621";
    sctx.fillRect(0, 0, 512, 512);

    sctx.strokeStyle = "#17120e";
    sctx.lineWidth = 4;
    const tileSize = 64;
    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        const noise = Math.floor(Math.random() * 25 - 12);
        sctx.fillStyle = `rgb(${48 + noise},${42 + noise},${36 + noise})`;
        sctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
        for (let k = 0; k < 18; k++) {
          sctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.15)";
          sctx.fillRect(x + Math.random() * tileSize, y + Math.random() * tileSize, 2, 2);
        }
      }
    }
    const stoneTex = new THREE.CanvasTexture(stoneCanvas);
    stoneTex.wrapS = THREE.RepeatWrapping;
    stoneTex.wrapT = THREE.RepeatWrapping;
    stoneTex.repeat.set(24, 24);
    this.textures.stone = stoneTex;

    // 2. Korean Dancheong Texture (단청)
    const dancheongCanvas = document.createElement("canvas");
    dancheongCanvas.width = 256;
    dancheongCanvas.height = 64;
    const dctx = dancheongCanvas.getContext("2d");
    const colors = ["#8c1d1d", "#1b493f", "#d4a359", "#1e3a8a", "#8c1d1d"];
    colors.forEach((col, idx) => {
      dctx.fillStyle = col;
      dctx.fillRect(idx * 51.2, 0, 51.2, 64);
      dctx.strokeStyle = "#ffe8b3";
      dctx.lineWidth = 2;
      dctx.strokeRect(idx * 51.2 + 2, 2, 47.2, 60);
    });
    this.textures.dancheong = new THREE.CanvasTexture(dancheongCanvas);

    // 3. Hanji Paper Texture for Lanterns
    const hanjiCanvas = document.createElement("canvas");
    hanjiCanvas.width = 256;
    hanjiCanvas.height = 256;
    const hctx = hanjiCanvas.getContext("2d");
    hctx.fillStyle = "#fff7ed";
    hctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 200; i++) {
      hctx.strokeStyle = "rgba(217, 119, 6, 0.08)";
      hctx.beginPath();
      hctx.moveTo(Math.random() * 256, Math.random() * 256);
      hctx.lineTo(Math.random() * 256, Math.random() * 256);
      hctx.stroke();
    }
    this.textures.hanji = new THREE.CanvasTexture(hanjiCanvas);

    // 4. Korean Temple Wood Floor (우물마루 바닥 텍스처)
    const woodCanvas = document.createElement("canvas");
    woodCanvas.width = 256;
    woodCanvas.height = 256;
    const wctx = woodCanvas.getContext("2d");
    wctx.fillStyle = "#3e2415";
    wctx.fillRect(0, 0, 256, 256);
    wctx.strokeStyle = "#25140b";
    wctx.lineWidth = 3;
    for (let y = 0; y < 256; y += 32) {
      wctx.strokeRect(0, y, 256, 32);
      for (let x = 0; x < 256; x += 64) {
        wctx.strokeRect(x, y, 64, 32);
      }
    }
    const woodTex = new THREE.CanvasTexture(woodCanvas);
    woodTex.wrapS = THREE.RepeatWrapping;
    woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set(12, 8);
    this.textures.woodFloor = woodTex;

    // 5. Buddhist Temple Mural / Mandala (불교 사찰 벽화 & 광배 텍스처)
    const muralCanvas = document.createElement("canvas");
    muralCanvas.width = 256;
    muralCanvas.height = 256;
    const mctx = muralCanvas.getContext("2d");
    mctx.fillStyle = "#2c170d";
    mctx.fillRect(0, 0, 256, 256);
    mctx.strokeStyle = "#d4af37";
    mctx.lineWidth = 6;
    mctx.strokeRect(8, 8, 240, 240);
    mctx.fillStyle = "#d4af37";
    mctx.beginPath();
    mctx.arc(128, 128, 54, 0, Math.PI * 2);
    mctx.fill();
    mctx.fillStyle = "#8c1d1d";
    mctx.beginPath();
    mctx.arc(128, 128, 36, 0, Math.PI * 2);
    mctx.fill();
    mctx.fillStyle = "#fef08a";
    mctx.beginPath();
    mctx.arc(128, 128, 18, 0, Math.PI * 2);
    mctx.fill();
    this.textures.mural = new THREE.CanvasTexture(muralCanvas);

    // 6. Japanese Chochin (提灯) Washi Ribbed Texture with 奉納 Calligraphy
    const chochinCanvas = document.createElement("canvas");
    chochinCanvas.width = 256;
    chochinCanvas.height = 256;
    const cctx = chochinCanvas.getContext("2d");
    cctx.fillStyle = "#fffbf0";
    cctx.fillRect(0, 0, 256, 256);

    // Horizontal bamboo ribbing (다케히고 竹ひご)
    cctx.strokeStyle = "rgba(40, 25, 15, 0.22)";
    cctx.lineWidth = 2.5;
    for (let y = 10; y < 256; y += 15) {
      cctx.beginPath();
      cctx.moveTo(0, y);
      cctx.lineTo(256, y);
      cctx.stroke();
    }

    // Vertical washi paper fibers
    for (let i = 0; i < 180; i++) {
      cctx.strokeStyle = "rgba(180, 130, 80, 0.08)";
      cctx.beginPath();
      cctx.moveTo(Math.random() * 256, Math.random() * 256);
      cctx.lineTo(Math.random() * 256, Math.random() * 256);
      cctx.stroke();
    }

    // Traditional Japanese Temple Kanji: 奉納 (Hōnō)
    cctx.fillStyle = "rgba(22, 12, 6, 0.92)";
    cctx.font = "bold 64px 'Noto Serif JP', 'Noto Serif KR', serif";
    cctx.textAlign = "center";
    cctx.textBaseline = "middle";
    cctx.fillText("奉", 128, 75);
    cctx.fillText("納", 128, 175);
    this.textures.chochin = new THREE.CanvasTexture(chochinCanvas);
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0x2d3655, 1.5);
    this.scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xb2d6ff, 2.0);
    moonLight.position.set(-80, 120, -130);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 400;
    const d = 80;
    moonLight.shadow.camera.left = -d;
    moonLight.shadow.camera.right = d;
    moonLight.shadow.camera.top = d;
    moonLight.shadow.camera.bottom = -d;
    moonLight.shadow.bias = -0.0004;
    this.scene.add(moonLight);

    // Warm sanctuary light radiating from Daeungjeon
    const templeSanctuaryLight = new THREE.PointLight(0xffa83e, 3.2, 90);
    templeSanctuaryLight.position.set(0, 14, -44);
    this.scene.add(templeSanctuaryLight);
  }

  /* ==========================================================================
     밤하늘, 별무리, 보름달, 별똥별(유성)
     ========================================================================== */
  buildSkyAndStars() {
    const starCount = 2800;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5;
      const r = 380 + Math.random() * 100;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 15;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const tone = Math.random();
      if (tone > 0.8) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.75; // Gold
      } else if (tone > 0.6) {
        colors[i * 3] = 0.78; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 1.0; // Cyan
      } else {
        colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.96; colors[i * 3 + 2] = 1.0; // White
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.92
    });
    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);

    // Full Moon (보름달)
    const moonGeo = new THREE.SphereGeometry(15, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfff7e4 });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-95, 130, -170);
    this.scene.add(moon);

    // Moon halo
    const haloGeo = new THREE.PlaneGeometry(75, 75);
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = 128;
    haloCanvas.height = 128;
    const hctx = haloCanvas.getContext("2d");
    const grad = hctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255, 246, 218, 0.75)");
    grad.addColorStop(0.35, "rgba(254, 215, 140, 0.3)");
    grad.addColorStop(0.7, "rgba(147, 197, 253, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    hctx.fillStyle = grad;
    hctx.fillRect(0, 0, 128, 128);

    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const moonHalo = new THREE.Mesh(haloGeo, haloMat);
    moonHalo.position.copy(moon.position);
    moonHalo.lookAt(0, 0, 0);
    this.scene.add(moonHalo);
  }

  spawnShootingStar() {
    const startX = (Math.random() - 0.5) * 160 - 20;
    const startY = 85 + Math.random() * 40;
    const startZ = -140 - Math.random() * 60;

    const linePoints = [
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(startX - 22, startY - 13, startZ + 16)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 1.0,
      linewidth: 2
    });
    const line = new THREE.Line(lineGeo, lineMat);
    this.scene.add(line);

    this.shootingStars.push({
      mesh: line,
      vx: -3.2,
      vy: -1.9,
      vz: 2.3,
      life: 1.0,
      maxLife: 1.0
    });
  }

  /* ==========================================================================
     절 마당(Courtyard) 및 바닥
     ========================================================================== */
  buildGroundAndCourtyard() {
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.textures.stone,
      roughness: 0.85,
      metalness: 0.12
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Central Ceremonial Pathway (답도 / 어도)
    const pathGeo = new THREE.PlaneGeometry(7.5, 95);
    const pathCanvas = document.createElement("canvas");
    pathCanvas.width = 128;
    pathCanvas.height = 512;
    const pctx = pathCanvas.getContext("2d");
    pctx.fillStyle = "#3e3227";
    pctx.fillRect(0, 0, 128, 512);
    pctx.strokeStyle = "#d4a359";
    pctx.lineWidth = 4;
    pctx.strokeRect(6, 6, 116, 500);
    for (let y = 16; y < 512; y += 32) {
      pctx.beginPath();
      pctx.arc(64, y, 7, 0, Math.PI * 2);
      pctx.stroke();
    }
    const pathTex = new THREE.CanvasTexture(pathCanvas);
    pathTex.wrapT = THREE.RepeatWrapping;
    pathTex.repeat.set(1, 6);

    const pathMat = new THREE.MeshStandardMaterial({
      map: pathTex,
      roughness: 0.65,
      metalness: 0.2
    });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.03, -8);
    path.receiveShadow = true;
    this.scene.add(path);
  }

  /* ==========================================================================
     대형 한국 전통 사찰 대웅전 (중층 전각 天命殿) - 내부 진입 가능 & 대형화 및 실재감 극대화
     ========================================================================== */
  buildGrandTempleHall() {
    const hallGroup = new THREE.Group();
    // Hall placed at z = -52.0 (Front entrance at z = -33.5, Back wall at z = -72.5)
    hallGroup.position.set(0, 0, -52.0);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.88 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x221711, roughness: 0.8 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x851717, roughness: 0.6 }); // Dancheong Vermilion
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x182028, roughness: 0.72, metalness: 0.25 }); // Korean Clay Tile

    // 1. Double-deck Stone Platform (기단 & 월대) - Width: 70m, Depth: 52m
    const lowerPlatform = new THREE.Mesh(new THREE.BoxGeometry(70, 2.0, 52), stoneMat);
    lowerPlatform.position.set(0, 1.0, 0);
    lowerPlatform.castShadow = true;
    lowerPlatform.receiveShadow = true;
    hallGroup.add(lowerPlatform);

    const upperPlatform = new THREE.Mesh(new THREE.BoxGeometry(64, 1.85, 46), stoneMat);
    upperPlatform.position.set(0, 2.925, 0);
    upperPlatform.castShadow = true;
    upperPlatform.receiveShadow = true;
    hallGroup.add(upperPlatform);

    // Front terrace extension connecting smoothly to stairs (월대 전면)
    const terrace = new THREE.Mesh(new THREE.BoxGeometry(22, 1.85, 8.0), stoneMat);
    terrace.position.set(0, 2.925, 23.0);
    terrace.receiveShadow = true;
    hallGroup.add(terrace);

    // Stone Balustrades (월대 난간석) flanking terrace
    for (let bx of [-11.2, 11.2]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 14.0), stoneMat);
      rail.position.set(bx, 4.3, 22.0);
      hallGroup.add(rail);
    }

    // Grand Ceremonial Stairs (중앙 대석계단 - 11단 넓은 석계)
    // World coordinates: from z = -22.2 down to z = -30.8.
    // In hallGroup (centered at z = -52): local Z from +29.6 to +21.2.
    for (let i = 0; i < 11; i++) {
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(19.2 - i * 0.35, 0.38, 0.98),
        stoneMat
      );
      // Height climbs from y=0.19 to y=3.66 (top y=3.85)
      stepMesh.position.set(0, 0.19 + i * 0.347, 29.6 - i * 0.84);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      hallGroup.add(stepMesh);
    }

    // 2 Guardian Stone Lions (해태상) flanking the base of the stairs (world z = -23.0)
    for (let s of [-10.5, 10.5]) {
      const lionBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 2.4), stoneMat);
      lionBase.position.set(s, 0.6, 29.0);
      hallGroup.add(lionBase);

      const lionBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 1.8), stoneMat);
      lionBody.position.set(s, 2.2, 29.0);
      hallGroup.add(lionBody);

      const lionHead = new THREE.Mesh(new THREE.SphereGeometry(0.8, 14, 14), stoneMat);
      lionHead.position.set(s, 3.4, 29.3);
      hallGroup.add(lionHead);
    }

    // 2. Interior Wooden Floor (우물마루 바닥 - 깊은 온기의 대형 목재 전각 마루)
    // Width: 60m, Depth: 40m (World z from -33.5 to -72.5)
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.textures.woodFloor,
      color: 0x5a341e,
      roughness: 0.35,
      metalness: 0.12
    });
    const templeFloor = new THREE.Mesh(new THREE.BoxGeometry(60, 0.3, 40), floorMat);
    templeFloor.position.set(0, 3.85, -1.0);
    templeFloor.receiveShadow = true;
    hallGroup.add(templeFloor);

    // 3. Walls (외벽 및 정면 개방 대문)
    // Back Wall (후벽 at local z = -20.5, world z = -72.5)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(60.5, 12.5, 1.4), wallMat);
    backWall.position.set(0, 10.0, -20.5);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    hallGroup.add(backWall);

    // Buddhist Altar Main Painting Tapestry behind Buddha (영산회상도 탱화)
    const mainMuralMat = new THREE.MeshStandardMaterial({ map: this.textures.mural, roughness: 0.5 });
    const mainMural = new THREE.Mesh(new THREE.PlaneGeometry(24.0, 8.5), mainMuralMat);
    mainMural.position.set(0, 10.5, -19.7);
    hallGroup.add(mainMural);

    // West & East Side Walls (좌우 측벽 at local x = ±29.5)
    for (let sx of [-29.5, 29.5]) {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(1.4, 12.5, 40), wallMat);
      sideWall.position.set(sx, 10.0, -1.0);
      sideWall.castShadow = true;
      sideWall.receiveShadow = true;
      hallGroup.add(sideWall);

      // Buddhist murals on side walls (신중탱화 / 감로탱화)
      const mural = new THREE.Mesh(new THREE.PlaneGeometry(16.0, 6.5), mainMuralMat);
      mural.position.set(sx > 0 ? 28.7 : -28.7, 10.2, -1.0);
      mural.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      hallGroup.add(mural);
    }

    // Front Walls & Open Central Gate (정면 외벽 at local z = 18.5, world z = -33.5)
    const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(22, 12.5, 1.2), wallMat);
    frontWallLeft.position.set(-18.5, 10.0, 18.5);
    frontWallLeft.castShadow = true;
    frontWallLeft.receiveShadow = true;
    hallGroup.add(frontWallLeft);

    const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(22, 12.5, 1.2), wallMat);
    frontWallRight.position.set(18.5, 10.0, 18.5);
    frontWallRight.castShadow = true;
    frontWallRight.receiveShadow = true;
    hallGroup.add(frontWallRight);

    // Top Entrance Lintel (정면 문설주 상인방)
    const frontLintel = new THREE.Mesh(new THREE.BoxGeometry(16, 4.2, 1.4), wallMat);
    frontLintel.position.set(0, 14.2, 18.5);
    hallGroup.add(frontLintel);

    // Open Paper Lattice Doors (활짝 열린 꽃살 창호문 양편 배치)
    const doorGeo = new THREE.PlaneGeometry(4.0, 8.5);
    const doorCanvas = document.createElement("canvas");
    doorCanvas.width = 128;
    doorCanvas.height = 256;
    const dctx = doorCanvas.getContext("2d");
    dctx.fillStyle = "#ffeedd";
    dctx.fillRect(0, 0, 128, 256);
    dctx.strokeStyle = "#5a3219";
    dctx.lineWidth = 5;
    dctx.strokeRect(4, 4, 120, 248);
    for (let y = 16; y < 256; y += 22) {
      dctx.beginPath();
      dctx.moveTo(4, y);
      dctx.lineTo(124, y);
      dctx.stroke();
    }
    for (let x = 16; x < 128; x += 22) {
      dctx.beginPath();
      dctx.moveTo(x, 4);
      dctx.lineTo(x, 252);
      dctx.stroke();
    }
    const doorTex = new THREE.CanvasTexture(doorCanvas);
    const doorMat = new THREE.MeshStandardMaterial({
      map: doorTex,
      emissive: 0xff9933,
      emissiveIntensity: 0.45,
      roughness: 0.55
    });

    const openDoorLeft = new THREE.Mesh(doorGeo, doorMat);
    openDoorLeft.position.set(-8.2, 8.2, 19.1);
    openDoorLeft.rotation.y = -Math.PI / 3;
    hallGroup.add(openDoorLeft);

    const openDoorRight = new THREE.Mesh(doorGeo, doorMat);
    openDoorRight.position.set(8.2, 8.2, 19.1);
    openDoorRight.rotation.y = Math.PI / 3;
    hallGroup.add(openDoorRight);

    // Decorative closed doors on left and right front walls
    for (let d of [-5, -4, -3, 3, 4, 5]) {
      const closedDoor = new THREE.Mesh(doorGeo, doorMat);
      closedDoor.position.set(d * 4.6, 8.4, 19.1);
      hallGroup.add(closedDoor);
    }

    // Outer Front Colonnade Pillars with carved stone plinths (주춧돌 & 기둥)
    const plinthMat = stoneMat;
    for (let p of [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]) {
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.6, 16), plinthMat);
      plinth.position.set(p * 4.6, 4.15, 19.5);
      hallGroup.add(plinth);

      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 12.0, 16), pillarMat);
      pillar.position.set(p * 4.6, 10.4, 19.5);
      pillar.castShadow = true;
      hallGroup.add(pillar);
    }

    // 8 Grand Interior Pillars (내진주 8기 with 주춧돌)
    for (let ix of [-18, 18]) {
      for (let iz of [-14, -6, 2, 10]) {
        const inPlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 0.5, 16), plinthMat);
        inPlinth.position.set(ix, 4.1, iz);
        hallGroup.add(inPlinth);

        const inPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 12.2, 16), pillarMat);
        inPillar.position.set(ix, 10.4, iz);
        inPillar.castShadow = true;
        hallGroup.add(inPillar);
      }
    }

    // Exposed Dancheong Timber Beams & Coffered Ceiling (우물천장 대들보)
    for (let bz of [-14, -6, 2, 10]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(60, 1.1, 1.4), new THREE.MeshStandardMaterial({
        map: this.textures.dancheong,
        roughness: 0.5
      }));
      beam.position.set(0, 14.8, bz);
      hallGroup.add(beam);
    }

    // 4. Buddha Altar & Sacred Sanctuary (대형 삼존불 수미단: 석가모니불 + 문수·보현보살)
    this.buddhaGroup = new THREE.Group();
    // In hallGroup, placed at local z = -12.5 (world z = -64.5)
    this.buddhaGroup.position.set(0, 3.85, -12.5);

    // Sumidan Altar Table (3단 목조 옻칠 조각 수미단 - 폭 22m, 깊이 8.5m)
    const altarMat = new THREE.MeshStandardMaterial({ color: 0x5c1111, roughness: 0.5, metalness: 0.2 });
    const altarBase = new THREE.Mesh(new THREE.BoxGeometry(22, 1.4, 8.5), altarMat);
    altarBase.position.y = 0.7;
    altarBase.castShadow = true;
    this.buddhaGroup.add(altarBase);

    const altarTop = new THREE.Mesh(new THREE.BoxGeometry(20, 0.6, 7.5), new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.4
    }));
    altarTop.position.y = 1.7;
    this.buddhaGroup.add(altarTop);

    // Golden Lotus Pedestal (중앙 연화대좌)
    const lotusMat = new THREE.MeshStandardMaterial({
      color: 0xd4a359,
      emissive: 0x926620,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.6
    });
    const lotusBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.8, 1.3, 22), lotusMat);
    lotusBase.position.y = 2.65;
    this.buddhaGroup.add(lotusBase);

    // Grand Golden Shakyamuni Buddha (중앙 대형 황금 석가모니불)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xb48210,
      emissiveIntensity: 0.45,
      roughness: 0.26,
      metalness: 0.85
    });

    const buddhaLegs = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.0, 2.0, 18), goldMat);
    buddhaLegs.position.y = 4.3;
    this.buddhaGroup.add(buddhaLegs);

    const buddhaTorso = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 2.0), goldMat);
    buddhaTorso.position.y = 6.8;
    this.buddhaGroup.add(buddhaTorso);

    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 2.4, 8), goldMat);
    leftArm.position.set(-1.55, 5.7, 0.45);
    leftArm.rotation.z = 0.5;
    leftArm.rotation.x = -0.3;
    this.buddhaGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 2.4, 8), goldMat);
    rightArm.position.set(1.55, 5.7, 0.45);
    rightArm.rotation.z = -0.5;
    rightArm.rotation.x = 0.4;
    this.buddhaGroup.add(rightArm);

    const buddhaHead = new THREE.Mesh(new THREE.SphereGeometry(1.35, 22, 22), goldMat);
    buddhaHead.position.y = 9.4;
    this.buddhaGroup.add(buddhaHead);

    const buddhaUsnisa = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 14), goldMat);
    buddhaUsnisa.position.y = 10.8;
    this.buddhaGroup.add(buddhaUsnisa);

    // Golden Halo / Mandorla (대형 황금 광배 / 신광 & 두광)
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xffe680,
      emissive: 0xffaa00,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.5,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.5, 5.2, 32), haloMat);
    halo.position.set(0, 8.8, -1.3);
    this.buddhaGroup.add(halo);

    // Flanking Attendant Bodhisattvas (좌우 협시보살 2위: 문수보살 & 보현보살)
    for (let bSide of [-6.5, 6.5]) {
      const bLotus = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 1.0, 16), lotusMat);
      bLotus.position.set(bSide, 2.5, 0.2);
      this.buddhaGroup.add(bLotus);

      const bBody = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 4.2, 12), goldMat);
      bBody.position.set(bSide, 5.1, 0.2);
      this.buddhaGroup.add(bBody);

      const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), goldMat);
      bHead.position.set(bSide, 7.6, 0.2);
      this.buddhaGroup.add(bHead);

      const bCrown = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.1, 8), new THREE.MeshStandardMaterial({
        color: 0xffeb3b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.6,
        metalness: 0.9
      }));
      bCrown.position.set(bSide, 8.6, 0.2);
      this.buddhaGroup.add(bCrown);

      const bHalo = new THREE.Mesh(new THREE.RingGeometry(0.3, 2.8, 20), haloMat);
      bHalo.position.set(bSide, 7.2, -0.6);
      this.buddhaGroup.add(bHalo);
    }

    // Incense Burner (불단 앞 청동 향로)
    const burnerMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.85, roughness: 0.3 });
    const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.65, 1.0, 14), burnerMat);
    burner.position.set(0, 2.5, 2.8);
    this.buddhaGroup.add(burner);

    // Glowing incense embers inside burner
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff2200,
      emissiveIntensity: 1.0
    }));
    ember.position.set(0, 2.95, 2.8);
    this.buddhaGroup.add(ember);

    // Candlesticks & Flickering Candle Lights (좌우 촛대)
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 });
    for (let cx of [-5.5, 5.5]) {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 1.4, 8), burnerMat);
      stand.position.set(cx, 2.7, 2.7);
      this.buddhaGroup.add(stand);

      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.75, 8), candleMat);
      candle.position.set(cx, 3.75, 2.7);
      this.buddhaGroup.add(candle);

      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshStandardMaterial({
        color: 0xffa500,
        emissive: 0xff6600,
        emissiveIntensity: 1.2
      }));
      flame.position.set(cx, 4.25, 2.7);
      this.buddhaGroup.add(flame);

      const cLight = new THREE.PointLight(0xff9922, 1.8, 14);
      cLight.position.set(cx, 4.4, 2.7);
      this.buddhaGroup.add(cLight);
      if (cx < 0) this.candleLightLeft = cLight;
      else this.candleLightRight = cLight;
    }

    // Wooden Fish Gong (목탁과 목탁채)
    const moktak = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.4
    }));
    moktak.scale.set(1.1, 0.85, 1.0);
    moktak.position.set(-2.8, 2.35, 2.8);
    this.buddhaGroup.add(moktak);

    // Singing Bowl on silk ring cushion (인경 / 싱잉볼)
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.28, 0.35, 16), new THREE.MeshStandardMaterial({
      color: 0xd4a359,
      metalness: 0.9,
      roughness: 0.2
    }));
    bowl.position.set(2.8, 2.3, 2.8);
    this.buddhaGroup.add(bowl);

    // 5 Prayer Cushions (연화문 삼배 방석 5좌)
    // In buddhaGroup, placed at local z = 7.0 (world z = -55.5)
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x8c1d1d,
      emissive: 0x3d0b0b,
      roughness: 0.7
    });
    for (let c of [-6.4, -3.2, 0, 3.2, 6.4]) {
      const cushion = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.18, 16), cushionMat);
      cushion.position.set(c, 0.12, 7.0);
      cushion.receiveShadow = true;
      this.buddhaGroup.add(cushion);

      const lotusCenter = new THREE.Mesh(new THREE.CircleGeometry(0.46, 12), new THREE.MeshStandardMaterial({
        color: 0xfde047,
        roughness: 0.5
      }));
      lotusCenter.rotation.x = -Math.PI / 2;
      lotusCenter.position.set(c, 0.22, 7.0);
      this.buddhaGroup.add(lotusCenter);
    }

    // Sacred Buddha Spotlight & Sanctuary Ambient Light
    const buddhaSpot = new THREE.SpotLight(0xfff5cc, 3.2, 42, Math.PI / 3.2, 0.35);
    buddhaSpot.position.set(0, 15, 6);
    buddhaSpot.target = lotusBase;
    this.buddhaGroup.add(buddhaSpot);

    const sanctuaryLight = new THREE.PointLight(0xffaa44, 2.2, 34);
    sanctuaryLight.position.set(0, 8.0, 2);
    this.buddhaGroup.add(sanctuaryLight);

    hallGroup.add(this.buddhaGroup);

    // Dharma Drum (법고 / 대형 사찰 북) at East interior (local x = 22, z = -8)
    const drumGroup = new THREE.Group();
    drumGroup.position.set(22.0, 3.85, -8.0);
    const drumStand = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.4, 3.2), altarMat);
    drumStand.position.y = 0.7;
    drumGroup.add(drumStand);

    const drumBody = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 2.8, 16), new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.4
    }));
    drumBody.rotation.z = Math.PI / 2;
    drumBody.position.y = 2.6;
    drumGroup.add(drumBody);

    const drumSkinMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });
    for (let ds of [-1.41, 1.41]) {
      const skin = new THREE.Mesh(new THREE.CircleGeometry(1.76, 16), drumSkinMat);
      skin.rotation.y = ds > 0 ? Math.PI / 2 : -Math.PI / 2;
      skin.position.set(ds, 2.6, 0);
      drumGroup.add(skin);
    }
    hallGroup.add(drumGroup);

    // Wooden Fish Drum (목어) at West interior (local x = -22, z = -8)
    const fishGroup = new THREE.Group();
    fishGroup.position.set(-22.0, 3.85, -8.0);
    const fishStand = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.4, 3.2), altarMat);
    fishStand.position.y = 0.7;
    fishGroup.add(fishStand);

    const fishBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.5, 1.4), new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.5
    }));
    fishBody.position.y = 2.4;
    fishGroup.add(fishBody);
    hallGroup.add(fishGroup);

    // Incense Smoke Particles System
    this.initIncenseParticles(hallGroup);

    // 5. Lower Dancheong Bracket System & Eaves
    const lowerBracket = new THREE.Mesh(new THREE.BoxGeometry(64, 1.5, 44), new THREE.MeshStandardMaterial({
      map: this.textures.dancheong,
      roughness: 0.5
    }));
    lowerBracket.position.y = 16.0;
    hallGroup.add(lowerBracket);

    const lowerRoof = new THREE.Mesh(new THREE.ConeGeometry(50, 8.5, 4, 1), roofMat);
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.scale.set(1.25, 0.65, 0.88);
    lowerRoof.position.y = 20.2;
    lowerRoof.castShadow = true;
    hallGroup.add(lowerRoof);

    // 6. Second Floor Hall (중층 2층 전각) & Upper Roof
    const upperWalls = new THREE.Mesh(new THREE.BoxGeometry(42, 9.5, 26), wallMat);
    upperWalls.position.y = 24.5;
    upperWalls.castShadow = true;
    hallGroup.add(upperWalls);

    const upperBracket = new THREE.Mesh(new THREE.BoxGeometry(45, 1.3, 29), new THREE.MeshStandardMaterial({
      map: this.textures.dancheong,
      roughness: 0.5
    }));
    upperBracket.position.y = 29.8;
    hallGroup.add(upperBracket);

    const upperRoof = new THREE.Mesh(new THREE.ConeGeometry(38, 10.5, 4, 1), roofMat);
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.scale.set(1.18, 0.72, 0.82);
    upperRoof.position.y = 35.0;
    upperRoof.castShadow = true;
    hallGroup.add(upperRoof);

    // Golden Dragon Ridge & Chiwi
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0xd4a359, metalness: 0.65, roughness: 0.28 });
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(42, 1.1, 1.2), ridgeMat);
    ridge.position.set(0, 40.2, 0);
    hallGroup.add(ridge);

    // 7. Grand Golden Temple Plaque (현판: 天 命 殿)
    const plaqueCanvas = document.createElement("canvas");
    plaqueCanvas.width = 384;
    plaqueCanvas.height = 144;
    const plctx = plaqueCanvas.getContext("2d");
    plctx.fillStyle = "#120a05";
    plctx.fillRect(0, 0, 384, 144);
    plctx.strokeStyle = "#f59e0b";
    plctx.lineWidth = 8;
    plctx.strokeRect(8, 8, 368, 128);
    plctx.fillStyle = "#fde047";
    plctx.font = "bold 56px 'Noto Serif KR', serif";
    plctx.textAlign = "center";
    plctx.textBaseline = "middle";
    plctx.fillText("天  命  殿", 192, 72);

    const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
    const plaqueGeo = new THREE.PlaneGeometry(9.0, 3.4);
    const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.35 });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, 15.2, 21.4);
    hallGroup.add(plaque);

    this.scene.add(hallGroup);
  }

  initIncenseParticles(parentGroup) {
    this.incenseParticles = [];
    const count = 30;
    const pMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.45
    });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 6, 6), pMat);
      p.position.set(
        (Math.random() - 0.5) * 0.25,
        6.7 + Math.random() * 2.8,
        -9.7 + (Math.random() - 0.5) * 0.25
      );
      p.userData = {
        baseY: 6.7,
        speed: 0.6 + Math.random() * 0.5,
        swaySpeed: 1.5 + Math.random() * 1.5,
        swayAmp: 0.08 + Math.random() * 0.08,
        offset: Math.random() * Math.PI * 2
      };
      parentGroup.add(p);
      this.incenseParticles.push(p);
    }
  }

  /* ==========================================================================
     부속 전각 (동편 범종각 & 서편 명부전 & 둘레 회랑)
     ========================================================================== */
  buildSidePavilionsAndCorridor() {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.9 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x851717, roughness: 0.6 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x182028, roughness: 0.72, metalness: 0.25 });

    // 1. East Pavilion: 범종각 (Bell Pavilion with Bronze Bell) at x = 40, z = -18
    const bellPavilion = new THREE.Group();
    bellPavilion.position.set(40, 0, -18);

    const bpBase = new THREE.Mesh(new THREE.BoxGeometry(16, 1.8, 16), stoneMat);
    bpBase.position.y = 0.9;
    bellPavilion.add(bpBase);

    // 4 Corner Pillars
    for (let cx of [-6, 6]) {
      for (let cz of [-6, 6]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 8.5, 12), pillarMat);
        p.position.set(cx, 6.0, cz);
        bellPavilion.add(p);
      }
    }

    // Temple Bell (범종 / 동종)
    const bellMat = new THREE.MeshStandardMaterial({ color: 0x8a6438, metalness: 0.85, roughness: 0.3 });
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.2, 3.6, 16), bellMat);
    bell.position.set(0, 6.5, 0);
    bellPavilion.add(bell);

    // Roof
    const bpRoof = new THREE.Mesh(new THREE.ConeGeometry(14, 4.5, 4), roofMat);
    bpRoof.rotation.y = Math.PI / 4;
    bpRoof.position.y = 12.5;
    bellPavilion.add(bpRoof);
    this.scene.add(bellPavilion);

    // 2. West Pavilion: 명부전 (West Hall) at x = -40, z = -18
    const westHall = new THREE.Group();
    westHall.position.set(-40, 0, -18);

    const whBase = new THREE.Mesh(new THREE.BoxGeometry(18, 1.8, 16), stoneMat);
    whBase.position.y = 0.9;
    westHall.add(whBase);

    const whWalls = new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 14), new THREE.MeshStandardMaterial({ color: 0x221711, roughness: 0.8 }));
    whWalls.position.y = 5.5;
    westHall.add(whWalls);

    const whRoof = new THREE.Mesh(new THREE.ConeGeometry(15, 5.2, 4), roofMat);
    whRoof.rotation.y = Math.PI / 4;
    whRoof.position.y = 11.5;
    westHall.add(whRoof);
    this.scene.add(westHall);

    // 3. Side Corridors (회랑) enclosing the perimeter
    for (let side of [-48, 48]) {
      const corridor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.2, 80), stoneMat);
      corridor.position.set(side, 2.1, -12);
      this.scene.add(corridor);

      const cRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 80.5), roofMat);
      cRoof.position.set(side, 4.5, -12);
      this.scene.add(cRoof);
    }
  }

  /* ==========================================================================
     삼층대석탑 및 주간 1위 대황금연등 제단
     ========================================================================== */
  buildStonePagodaAndShrine() {
    this.shrineGroup = new THREE.Group();
    this.shrineGroup.position.set(0, 0, -10);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x4d453d, roughness: 0.85 });

    // 1. Two-tier Pagoda Base (하대석 & 상대석) - Scaled Up
    const base1 = new THREE.Mesh(new THREE.BoxGeometry(9.6, 1.3, 9.6), stoneMat);
    base1.position.y = 0.65;
    base1.castShadow = true;
    base1.receiveShadow = true;
    this.shrineGroup.add(base1);

    const base2 = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.1, 7.4), stoneMat);
    base2.position.y = 1.85;
    base2.castShadow = true;
    this.shrineGroup.add(base2);

    // 2. Three Pagoda Tiers (탑신 & 옥개석)
    for (let tier = 0; tier < 3; tier++) {
      const scale = 1.0 - tier * 0.22;
      const bodyH = 1.6 * scale;
      const bodyW = 3.6 * scale;
      const eaveW = 5.8 * scale;

      const body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, bodyW), stoneMat);
      body.position.y = 2.4 + tier * 2.4 + bodyH / 2;
      body.castShadow = true;
      this.shrineGroup.add(body);

      const eave = new THREE.Mesh(new THREE.ConeGeometry(eaveW, 0.95 * scale, 4), stoneMat);
      eave.rotation.y = Math.PI / 4;
      eave.position.y = 2.4 + tier * 2.4 + bodyH + 0.45;
      eave.castShadow = true;
      this.shrineGroup.add(eave);
    }

    // 3. Pagoda Finial Spire (상륜부 / 보주)
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.45, 2.6, 8), stoneMat);
    spire.position.y = 10.2;
    this.shrineGroup.add(spire);

    const jewelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, roughness: 0.25 });
    const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), jewelMat);
    jewel.position.y = 11.6;
    this.shrineGroup.add(jewel);

    // 4. Grand Golden Crown Lantern (주간 1위 소원 대황금연등)
    this.grandLantern = new THREE.Group();
    this.grandLantern.position.set(0, 15.2, 0);

    const bodyGeo = new THREE.CylinderGeometry(2.4, 2.1, 3.6, 8);
    const grandMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.88,
      roughness: 0.28,
      metalness: 0.45
    });
    const grandBody = new THREE.Mesh(bodyGeo, grandMat);
    this.grandLantern.add(grandBody);

    // Royal Golden Crown (금관)
    const crownGroup = new THREE.Group();
    crownGroup.position.y = 2.2;
    const bandGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.55, 16, 1, true);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xffdf00, metalness: 0.92, roughness: 0.18 });
    const band = new THREE.Mesh(bandGeo, crownMat);
    crownGroup.add(band);

    for (let c = 0; c < 5; c++) {
      const prong = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.5, 0.24), crownMat);
      const angle = (c * Math.PI * 2) / 5;
      prong.position.set(Math.cos(angle) * 2.05, 0.95, Math.sin(angle) * 2.05);
      crownGroup.add(prong);
    }
    this.grandLantern.add(crownGroup);

    this.grandLight = new THREE.PointLight(0xffb703, 3.8, 50);
    this.grandLantern.add(this.grandLight);

    // Ground Golden Proximity Ring
    const ringGeo = new THREE.RingGeometry(4.2, 4.8, 36);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    this.shrineRing = new THREE.Mesh(ringGeo, ringMat);
    this.shrineRing.rotation.x = -Math.PI / 2;
    this.shrineRing.position.set(0, 0.05, 0);
    this.shrineGroup.add(this.shrineRing);

    this.shrineGroup.add(this.grandLantern);
    this.scene.add(this.shrineGroup);
  }

  /* ==========================================================================
     석등 및 연화지(Lotus Pond) & 홍예교(Bridge)
     ========================================================================== */
  buildStoneLanterns() {
    const lanternCoords = [
      { x: -7.0, z: 12 },
      { x: 7.0, z: 12 },
      { x: -8.0, z: 2 },
      { x: 8.0, z: 2 },
      { x: -9.5, z: -18 },
      { x: 9.5, z: -18 },
      { x: -11.0, z: -32 },
      { x: 11.0, z: -32 }
    ];

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x544c45, roughness: 0.85 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xff9922, emissive: 0xff7700, roughness: 0.2 });

    lanternCoords.forEach((pos) => {
      const slGroup = new THREE.Group();
      slGroup.position.set(pos.x, 0, pos.z);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 0.5, 8), stoneMat);
      base.position.y = 0.25;
      slGroup.add(base);

      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.0, 8), stoneMat);
      pillar.position.y = 1.25;
      slGroup.add(pillar);

      const firebox = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 1.1), glowMat);
      firebox.position.y = 2.6;
      slGroup.add(firebox);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.7, 0.8, 8), stoneMat);
      roof.position.y = 3.5;
      slGroup.add(roof);

      const light = new THREE.PointLight(0xffa238, 1.3, 16);
      light.position.set(0, 2.6, 0);
      slGroup.add(light);

      this.scene.add(slGroup);
    });
  }

  buildLotusPondAndBridge() {
    const pondGroup = new THREE.Group();
    pondGroup.position.set(0, 0, 32);

    const waterGeo = new THREE.BoxGeometry(64, 0.4, 20);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x071b2b,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.9
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.05;
    pondGroup.add(water);

    // Stone border
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.9 });
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(65, 0.5, 1.4), borderMat);
    b1.position.set(0, 0.25, -10.2);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(65, 0.5, 1.4), borderMat);
    b2.position.set(0, 0.25, 10.2);
    pondGroup.add(b1);
    pondGroup.add(b2);

    // Floating Lotus flowers
    for (let l = 0; l < 24; l++) {
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 0.06, 12),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 })
      );
      const lx = (Math.random() - 0.5) * 56;
      const lz = (Math.random() - 0.5) * 16;
      if (Math.abs(lx) > 4.5) {
        pad.position.set(lx, 0.22, lz);
        pondGroup.add(pad);

        const blossom = new THREE.Mesh(
          new THREE.ConeGeometry(0.32, 0.42, 6),
          new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: 0.35 })
        );
        blossom.position.set(lx, 0.42, lz);
        pondGroup.add(blossom);
      }
    }

    // Stone Arch Bridge (홍예교)
    const bridgeDeck = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 0.55, 21.5),
      new THREE.MeshStandardMaterial({ color: 0x4a4138, roughness: 0.85 })
    );
    bridgeDeck.position.y = 0.35;
    bridgeDeck.receiveShadow = true;
    bridgeDeck.castShadow = true;
    pondGroup.add(bridgeDeck);

    for (let side of [-3.4, 3.4]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.85, 21.5),
        new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.85 })
      );
      rail.position.set(side, 0.75, 0);
      pondGroup.add(rail);
    }
    this.scene.add(pondGroup);
  }

  buildPineTreesAndNature() {
    const treeCoords = [
      { x: -25, z: -10 }, { x: 25, z: -10 },
      { x: -32, z: 8 },   { x: 32, z: 8 },
      { x: -26, z: 26 },  { x: 26, z: 26 },
      { x: -35, z: -38 }, { x: 35, z: -38 },
      { x: -18, z: -55 }, { x: 18, z: -55 }
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x452311, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x143e26, roughness: 0.7 });

    treeCoords.forEach((tc) => {
      const pine = new THREE.Group();
      pine.position.set(tc.x, 0, tc.z);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.05, 9.5, 8), trunkMat);
      trunk.position.set(0.4, 4.75, 0);
      trunk.rotation.z = -0.09;
      trunk.castShadow = true;
      pine.add(trunk);

      for (let i = 0; i < 3; i++) {
        const crown = new THREE.Mesh(new THREE.ConeGeometry(4.5 - i * 0.9, 3.2, 8), leafMat);
        crown.position.set(0, 7.8 + i * 2.2, 0);
        crown.castShadow = true;
        pine.add(crown);
      }
      this.scene.add(pine);
    });
  }

  /* ==========================================================================
     3D 플레이어 캐릭터 (상체 그룹 & 팔다리 관절 분리 구조 - 절하기 모션 지원)
     ========================================================================== */
  buildPlayerCharacter() {
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(this.player.x, this.player.y, this.player.z);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1b2d4f, roughness: 0.7 });

    // Upper Body Pivot Group at Waist (y = 0.75m) - enables natural prostrating / bowing
    this.player.upperBody = new THREE.Group();
    this.player.upperBody.position.set(0, 0.75, 0);

    // 1. Hanbok Robe Torso (도포 상체)
    const bodyGeo = new THREE.CylinderGeometry(0.42, 0.68, 1.45, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.72;
    body.castShadow = true;
    this.player.upperBody.add(body);

    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.07, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    collar.position.set(0, 1.45, 0.05);
    collar.rotation.x = Math.PI / 3;
    this.player.upperBody.add(collar);

    // 2. Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.8 })
    );
    head.position.y = 1.78;
    head.castShadow = true;
    this.player.upperBody.add(head);

    // 3. Korean Traditional Hat (갓)
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 2.05, 0);
    const gatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(1.22, 1.22, 0.04, 24),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.3 })
    );
    hatGroup.add(gatBrim);
    const gatCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.52, 0.72, 16),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.3 })
    );
    gatCrown.position.y = 0.36;
    hatGroup.add(gatCrown);
    this.player.upperBody.add(hatGroup);

    // 4. Arms (좌우 도포 소매 팔)
    const armGeo = new THREE.CylinderGeometry(0.13, 0.16, 0.85, 8);
    this.player.leftArm = new THREE.Mesh(armGeo, bodyMat);
    this.player.leftArm.position.set(-0.52, 0.88, 0);
    this.player.upperBody.add(this.player.leftArm);

    this.player.rightArm = new THREE.Mesh(armGeo, bodyMat);
    this.player.rightArm.position.set(0.52, 0.88, 0);
    this.player.upperBody.add(this.player.rightArm);

    // 5. Hand Lantern (오른손 연등)
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0.25, -0.42, 0.32);
    const lbody = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.28, 1),
      new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff8800, emissiveIntensity: 0.9 })
    );
    lanternGroup.add(lbody);
    this.player.handLight = new THREE.PointLight(0xffb042, 1.8, 12);
    lanternGroup.add(this.player.handLight);
    this.player.rightArm.add(lanternGroup);

    this.playerGroup.add(this.player.upperBody);

    // 6. Legs (하체 다리 - 무릎 꿇기 절 모션 연동)
    const legGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.75, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    this.player.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.player.leftLeg.position.set(-0.24, 0.38, 0);
    this.playerGroup.add(this.player.leftLeg);

    this.player.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.player.rightLeg.position.set(0.24, 0.38, 0);
    this.playerGroup.add(this.player.rightLeg);

    // 7. 3D Name Tag Sprite
    this.player.nameTagSprite = this.createNameTagSprite(this.player.name);
    this.player.nameTagSprite.position.set(0, 3.5, 0);
    this.playerGroup.add(this.player.nameTagSprite);

    this.scene.add(this.playerGroup);
  }

  createNameTagSprite(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(18, 10, 6, 0.85)";
    ctx.strokeStyle = "#d4a359";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 48, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fde047";
    ctx.font = "bold 20px 'Noto Serif KR', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`도반 ${text} (나)`, 128, 32);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
  }

  updatePlayerNameTag() {
    if (!this.player.nameTagSprite) return;
    this.playerGroup.remove(this.player.nameTagSprite);
    this.player.nameTagSprite = this.createNameTagSprite(this.player.name);
    this.player.nameTagSprite.position.set(0, 3.5, 0);
    this.playerGroup.add(this.player.nameTagSprite);
  }

  /* ==========================================================================
     사찰 조명 및 소원 연등 시스템 (일본 절 느낌 · 내부 최소화 2기 · 정제된 16대 슬롯)
     ========================================================================== */
  initLanternSlots() {
    this.lanternSlots = [];
    let slotIdx = 0;

    // 1. 대웅전(본당) 실내: 불단 좌우를 은은하게 밝히는 2위의 츠리도로(釣燈籠) [내부 최소화!]
    // World coordinates: x = ±7.0, y = 8.2, z = -59.5 (flanking the sacred triad altar)
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: -7.0, y: 8.2, z: -59.5,
      zone: "본당 내진 불단 츠리도로 (좌)",
      type: "hanging",
      cordLen: 3.2
    });
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: 7.0, y: 8.2, z: -59.5,
      zone: "본당 내진 불단 츠리도로 (우)",
      type: "hanging",
      cordLen: 3.2
    });

    // 2. 본당 정면 대문 처마: 일본 사찰 특유의 정면 대형 쵸칭(提灯) 2기
    // World coordinates: x = ±5.0, y = 8.8, z = -33.2 (hanging under the entrance eave)
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: -5.0, y: 8.8, z: -33.2,
      zone: "본당 정문 대형 제등 (좌)",
      type: "hanging",
      cordLen: 2.0
    });
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: 5.0, y: 8.8, z: -33.2,
      zone: "본당 정문 대형 제등 (우)",
      type: "hanging",
      cordLen: 2.0
    });

    // 3. 중앙 대석계단 입구: 좌우 석주 유도등 2기
    // World coordinates: x = ±10.2, y = 2.2, z = -23.5
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: -10.2, y: 2.2, z: -23.5,
      zone: "대석계단 유도등 (좌)",
      type: "post"
    });
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: 10.2, y: 2.2, z: -23.5,
      zone: "대석계단 유도등 (우)",
      type: "post"
    });

    // 4. 중앙 어도(참배로): 고즈넉한 석판길 양편 4기
    const pathPoints = [
      { x: -5.2, y: 3.2, z: -15.0 }, { x: 5.2, y: 3.2, z: -15.0 },
      { x: -5.2, y: 3.2, z: -3.0 },  { x: 5.2, y: 3.2, z: -3.0 }
    ];
    for (const p of pathPoints) {
      this.lanternSlots.push({
        slotIndex: slotIdx++,
        x: p.x, y: p.y, z: p.z,
        zone: "참배로 석등",
        type: "post"
      });
    }

    // 5. 삼층석탑 둘레: 4방위 정갈한 등불 4기
    const pagodaPoints = [
      { x: 0,    z: 2.8,  name: "석탑 북측 등" },
      { x: 0,    z: 17.2, name: "석탑 남측 등" },
      { x: -7.2, z: 10.0, name: "석탑 서측 등" },
      { x: 7.2,  z: 10.0, name: "석탑 동측 등" }
    ];
    for (const p of pagodaPoints) {
      this.lanternSlots.push({
        slotIndex: slotIdx++,
        x: p.x, y: 3.2, z: p.z,
        zone: p.name,
        type: "post"
      });
    }

    // 6. 연화지 수면: 고요한 부유 연화등 2기
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: -6.5, y: 0.35, z: 31.0,
      zone: "연화지 수중등 (좌)",
      type: "float"
    });
    this.lanternSlots.push({
      slotIndex: slotIdx++,
      x: 6.5, y: 0.35, z: 31.0,
      zone: "연화지 수중등 (우)",
      type: "float"
    });
  }

  initLanterns() {
    this.initLanternSlots();

    // Clear existing lanterns
    this.lanterns.forEach((l) => {
      if (l.group) this.scene.remove(l.group);
    });
    this.lanterns = [];

    // Retrieve saved user wishes from localStorage
    let communityData = [];
    try {
      const saved = JSON.parse(localStorage.getItem("chunmyung_community_wishes") || "null");
      if (saved && Array.isArray(saved) && saved.length > 0) {
        communityData = saved;
      }
    } catch (e) {
      communityData = [];
    }

    // Populate the 16 architectural slots:
    // If communityData has wishes, the first N slots become user wishes.
    // The remaining slots (or all slots if 0 wishes) are serene Japanese Temple Lamps (기본 奉納 제등)!
    this.lanternSlots.forEach((slot, idx) => {
      if (idx < communityData.length) {
        // User Wish Lantern
        const wish = communityData[idx];
        const lanternObj = this.createLanternMesh(wish, slot, false);
        this.lanterns.push(lanternObj);
      } else {
        // Serene Default Japanese Temple Lighting Lamp (일본식 사찰 奉納 제등)
        const defaultWish = {
          id: 9000 + idx,
          category: "🕊️ 사찰 제등 (奉納)",
          author: "천명 사찰 수호 도반",
          text: "일본 사찰의 고즈넉한 정취를 담아 경내를 은은하게 밝힌 봉납 제등(奉納 提灯)입니다. [내 소원 띄우기]로 소원을 올리시면 이 등불이 도반님의 소원 연등으로 단정하게 대체되어 영구히 빛납니다.",
          cheers: 0,
          date: "사찰 상시 조명",
          isDefaultLight: true
        };
        const lanternObj = this.createLanternMesh(defaultWish, slot, true);
        this.lanterns.push(lanternObj);
      }
    });

    this.updateHudCount();
  }

  createLanternMesh(wishData, slot, isDefaultLight) {
    const group = new THREE.Group();
    group.position.set(slot.x, slot.y, slot.z);

    // Warm Candlelight Amber Glow (일본식 화지 온등)
    let hexColor = 0xffd175;
    let emissiveColor = 0xff9922;

    if (!isDefaultLight) {
      const cat = wishData.category || "";
      if (cat.includes("건강")) {
        hexColor = 0x34d399; emissiveColor = 0x059669;
      } else if (cat.includes("시험") || cat.includes("합격")) {
        hexColor = 0xfde047; emissiveColor = 0xd97706;
      } else if (cat.includes("재물") || cat.includes("사업")) {
        hexColor = 0xfbbf24; emissiveColor = 0xb45309;
      } else if (cat.includes("애정") || cat.includes("인연")) {
        hexColor = 0xf472b6; emissiveColor = 0xdb2777;
      } else if (cat.includes("마음") || cat.includes("평안")) {
        hexColor = 0x818cf8; emissiveColor = 0x4f46e5;
      }
    }

    // 1. Structural Mount / Stand based on slot type
    if (slot.type === "hanging") {
      const cordLen = slot.cordLen || 2.2;
      const cordGeo = new THREE.CylinderGeometry(0.015, 0.015, cordLen, 4);
      const cordMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
      const cord = new THREE.Mesh(cordGeo, cordMat);
      cord.position.set(0, 0.75 + cordLen / 2, 0);
      group.add(cord);

      // Brass suspension ring (금구 / 츠리토로 고리)
      const ringGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4a359, metalness: 0.85, roughness: 0.25 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0.78, 0);
      group.add(ring);
    } else if (slot.type === "post") {
      const postHeight = slot.y - 0.2;
      // Dark Hinoki / Blackened wood post with square plinth
      const postBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.35, 0.48),
        new THREE.MeshStandardMaterial({ color: 0x221a14, roughness: 0.85 })
      );
      postBase.position.set(0, -postHeight + 0.17, 0);
      group.add(postBase);

      const postPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, postHeight, 8),
        new THREE.MeshStandardMaterial({ color: 0x1a120b, roughness: 0.6 })
      );
      postPole.position.set(0, -postHeight / 2, 0);
      group.add(postPole);
    } else if (slot.type === "float") {
      const leafGeo = new THREE.CircleGeometry(0.9, 12);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7, side: THREE.DoubleSide });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.rotation.x = -Math.PI / 2;
      leaf.position.set(0, -0.65, 0);
      group.add(leaf);
    }

    // 2. Japanese Chochin (提灯) Body: softly rounded oblong washi paper lantern with black lacquer collars
    const bodyGeo = new THREE.CylinderGeometry(0.70, 0.62, 1.45, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: emissiveColor,
      emissiveIntensity: isDefaultLight ? 0.62 : 0.82,
      map: isDefaultLight ? this.textures.chochin : this.textures.hanji,
      roughness: 0.35
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    // Black Lacquered Collars (黒漆 縁) top and bottom
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.35,
      metalness: 0.15
    });
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.12, 16), collarMat);
    topCap.position.y = 0.76;
    const botCap = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.12, 16), collarMat);
    botCap.position.y = -0.76;
    group.add(topCap);
    group.add(botCap);

    // 3. Hanging Streamer (소원지) or Minimalist Silk Tassel (술)
    let streamer = null;
    if (!isDefaultLight) {
      const streamerGeo = new THREE.PlaneGeometry(0.36, 1.15);
      const streamerCanvas = document.createElement("canvas");
      streamerCanvas.width = 64;
      streamerCanvas.height = 128;
      const sctx = streamerCanvas.getContext("2d");
      sctx.fillStyle = "#fffbeb";
      sctx.fillRect(0, 0, 64, 128);
      sctx.fillStyle = "#8c1d1d";
      sctx.font = "bold 20px 'Noto Serif KR', sans-serif";
      sctx.textAlign = "center";
      sctx.fillText("소", 32, 40);
      sctx.fillText("원", 32, 80);
      const streamerTex = new THREE.CanvasTexture(streamerCanvas);
      const streamerMat = new THREE.MeshBasicMaterial({
        map: streamerTex,
        side: THREE.DoubleSide,
        transparent: true
      });
      streamer = new THREE.Mesh(streamerGeo, streamerMat);
      streamer.position.set(0, -1.38, 0);
      group.add(streamer);
    } else {
      const tasselGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.65, 8);
      const tasselMat = new THREE.MeshStandardMaterial({ color: 0x851717, roughness: 0.6 });
      const tassel = new THREE.Mesh(tasselGeo, tasselMat);
      tassel.position.set(0, -1.1, 0);
      group.add(tassel);
    }

    // 4. Illumination Point Light (소원/조명이 직접 주변 사찰 공간을 은은하게 비춤)
    const pLight = new THREE.PointLight(hexColor, isDefaultLight ? 1.2 : 1.5, 14.0);
    pLight.castShadow = false;
    group.add(pLight);

    // 5. Billboard Name Sprite (정갈한 일본 사찰 명패)
    const labelSprite = this.createWishLabelSprite(wishData, isDefaultLight);
    labelSprite.position.set(0, 1.45, 0);
    group.add(labelSprite);

    this.scene.add(group);

    return {
      id: wishData.id,
      category: wishData.category,
      author: wishData.author,
      text: wishData.text,
      cheers: wishData.cheers || 0,
      date: wishData.date || "2026. 11. 23.",
      isDefaultLight: isDefaultLight,
      slot: slot,
      group: group,
      streamer: streamer,
      pLight: pLight,
      baseY: slot.y,
      floatSpeed: 0.5 + Math.random() * 0.3,
      floatAmp: slot.type === "hanging" ? 0.06 : (slot.type === "float" ? 0.10 : 0.0),
      floatOffset: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15
    };
  }

  createWishLabelSprite(wishData, isDefaultLight) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (isDefaultLight) {
      ctx.fillStyle = "rgba(18, 14, 10, 0.78)";
      ctx.strokeStyle = "#d4a359";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(8, 8, 240, 48, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fef3c7";
      ctx.font = "bold 14px 'Noto Serif JP', 'Noto Serif KR', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🕊️ 사찰 제등 (奉納)", 128, 32);
    } else {
      ctx.fillStyle = "rgba(22, 14, 9, 0.88)";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(8, 8, 240, 48, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fed7aa";
      ctx.font = "bold 14px 'Noto Serif JP', 'Noto Serif KR', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${wishData.category} · ${wishData.author}`, 128, 32);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.6, 0.65, 1);
    return sprite;
  }

  addPlayerNewLantern(newWish) {
    // Find the first default temple light slot to replace!
    const defaultIndex = this.lanterns.findIndex((l) => l.isDefaultLight);
    let targetSlot = null;
    let replacedLantern = null;

    if (defaultIndex !== -1) {
      replacedLantern = this.lanterns[defaultIndex];
      targetSlot = replacedLantern.slot;
      if (replacedLantern.group) this.scene.remove(replacedLantern.group);

      const newLanternObj = this.createLanternMesh(newWish, targetSlot, false);
      newLanternObj.isNew = true;
      this.lanterns[defaultIndex] = newLanternObj;
    } else {
      const spawnPos = {
        x: this.player.x + Math.sin(this.player.rotationY) * 2.5,
        y: 2.5,
        z: this.player.z + Math.cos(this.player.rotationY) * 2.5,
        zone: "사찰 경내",
        type: "post"
      };
      const newLanternObj = this.createLanternMesh(newWish, spawnPos, false);
      newLanternObj.isNew = true;
      this.lanterns.unshift(newLanternObj);
    }

    this.playTempleBellSound();
    this.spawnCheerSparkles({
      x: targetSlot ? targetSlot.x : this.player.x,
      y: targetSlot ? targetSlot.y : 2.5,
      z: targetSlot ? targetSlot.z : this.player.z
    });

    this.updateHudCount();
    this.showToast("🏮 도반님의 소원이 사찰 제등을 대체하여 환한 소원 연등으로 밝혀졌습니다!");

    try {
      const activeWishes = this.lanterns
        .filter((l) => !l.isDefaultLight)
        .map((l) => ({
          id: l.id,
          category: l.category,
          author: l.author,
          text: l.text,
          cheers: l.cheers,
          date: l.date
        }));
      localStorage.setItem("chunmyung_community_wishes", JSON.stringify(activeWishes));
    } catch (e) {}
  }

  cheerLantern(wishId) {
    const lantern = this.lanterns.find((l) => l.id === wishId);
    if (!lantern) return;

    lantern.cheers = (lantern.cheers || 0) + 1;

    try {
      let cheeredIds = JSON.parse(localStorage.getItem("chunmyung_cheered_wish_ids") || "[]");
      if (!cheeredIds.includes(wishId)) cheeredIds.push(wishId);
      localStorage.setItem("chunmyung_cheered_wish_ids", JSON.stringify(cheeredIds));
    } catch (e) {}

    const countEl = document.getElementById("wishDetailCheerCount");
    const cheerBtn = document.getElementById("wishDetailCheerBtn");
    if (countEl) countEl.textContent = lantern.cheers;
    if (cheerBtn) {
      cheerBtn.innerHTML = `<span>❤️</span><span>응원 완료</span><span class="ml-1 px-1.5 py-0.5 rounded-full bg-stone-900 text-[10px]">${lantern.cheers}</span>`;
      cheerBtn.className = "px-4 py-2 rounded-xl bg-[#8c1d1d] text-[#ffe8b3] font-bold border border-[#f59e0b] shadow flex items-center space-x-1.5 text-xs";
    }

    this.spawnCheerSparkles(lantern.group.position);
    this.showToast("🙏 도반님의 소원에 따뜻한 응원을 보냈습니다!");
  }

  spawnCheerSparkles(pos) {
    const particleCount = 32;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y + 0.5;
      positions[i * 3 + 2] = pos.z;
      velocities.push(
        (Math.random() - 0.5) * 4.8,
        Math.random() * 4.5 + 1.8,
        (Math.random() - 0.5) * 4.8
      );
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffe066,
      size: 0.38,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    this.sparkleParticles.push({
      mesh: points,
      velocities: velocities,
      life: 1.0,
      maxLife: 1.0
    });
  }

  /* ==========================================================================
     입력 이벤트 (WASD / 방향키 / 스페이스바 점프 / 마우스 위아래양옆 시점 회전)
     ========================================================================== */
  bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (!this.isRunning) return;

      const code = e.code;

      if (code === "KeyW" || code === "ArrowUp") {
        this.keys.up = true;
        this.player.targetX = null;
        this.player.targetZ = null;
      } else if (code === "KeyS" || code === "ArrowDown") {
        this.keys.down = true;
        this.player.targetX = null;
        this.player.targetZ = null;
      } else if (code === "KeyA" || code === "ArrowLeft") {
        this.keys.left = true;
        this.player.targetX = null;
        this.player.targetZ = null;
      } else if (code === "KeyD" || code === "ArrowRight") {
        this.keys.right = true;
        this.player.targetX = null;
        this.player.targetZ = null;
      } else if (code === "Space") {
        // Spacebar Jump!
        this.jump();
        e.preventDefault();
      } else if (code === "KeyE") {
        // E Key for Reading Wishes
        this.interactWithNearby();
        e.preventDefault();
      } else if (code === "Escape") {
        const exitModal = document.getElementById("wishPlazaExitConfirmModal");
        if (exitModal && (exitModal.open || exitModal.hasAttribute("open"))) {
          this.cancelExit();
        } else {
          this.promptExit();
        }
        e.preventDefault();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (!this.isRunning) return;

      const code = e.code;
      if (code === "KeyW" || code === "ArrowUp") this.keys.up = false;
      if (code === "KeyS" || code === "ArrowDown") this.keys.down = false;
      if (code === "KeyA" || code === "ArrowLeft") this.keys.left = false;
      if (code === "KeyD" || code === "ArrowRight") this.keys.right = false;
    });

    // Mouse Controls for 360 Look (위, 아래, 양옆 자유 시점 - 드래그 및 포인터 락)
    if (this.canvas) {
      this.canvas.style.cursor = "grab";

      this.canvas.addEventListener("mousedown", (e) => {
        if (!this.isRunning) return;
        this.cameraOrbit.isDragging = true;
        this.canvas.style.cursor = "grabbing";
        this.cameraOrbit.prevMouseX = e.clientX;
        this.cameraOrbit.prevMouseY = e.clientY;
        this.hasDragged = false;
      });

      window.addEventListener("mousemove", (e) => {
        if (!this.isRunning) return;

        let dx = 0;
        let dy = 0;

        if (document.pointerLockElement === this.canvas) {
          dx = e.movementX;
          dy = e.movementY;
        } else if (this.cameraOrbit.isDragging) {
          dx = e.clientX - this.cameraOrbit.prevMouseX;
          dy = e.clientY - this.cameraOrbit.prevMouseY;
          this.cameraOrbit.prevMouseX = e.clientX;
          this.cameraOrbit.prevMouseY = e.clientY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.hasDragged = true;
        }

        if (dx !== 0 || dy !== 0) {
          // Look Left / Right (양옆 360도 회전)
          this.cameraOrbit.azimuth -= dx * 0.0055;
          // Look Up / Down (위, 아래 시점 조절 - 수평선 및 하늘/지면)
          this.cameraOrbit.elevation = Math.max(
            -0.35,
            Math.min(1.42, this.cameraOrbit.elevation + dy * 0.005)
          );
        }
      });

      window.addEventListener("mouseup", () => {
        this.cameraOrbit.isDragging = false;
        if (this.canvas) this.canvas.style.cursor = "grab";
      });

      // Canvas click (Raycast to click on Lanterns or Pagoda)
      this.canvas.addEventListener("click", (e) => {
        if (!this.isRunning || this.hasDragged) return;

        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Click Buddha Altar / Sanctuary inside Daeungjeon
        if (this.buddhaGroup) {
          const buddhaHits = this.raycaster.intersectObjects(this.buddhaGroup.children, true);
          if (buddhaHits.length > 0) {
            this.offerPrayerAtBuddha();
            return;
          }
        }

        // Click Grand Lantern / Pagoda
        if (this.grandLantern) {
          const grandHits = this.raycaster.intersectObjects(this.grandLantern.children, true);
          if (grandHits.length > 0) {
            this.showWeeklyTopModal();
            return;
          }
        }

        // Click floating lantern
        let clickedLantern = null;
        for (const l of this.lanterns) {
          const hits = this.raycaster.intersectObjects(l.group.children, true);
          if (hits.length > 0) {
            clickedLantern = l;
            break;
          }
        }

        if (clickedLantern) {
          this.showWishDetailModal(clickedLantern);
          return;
        }

        // Click to walk to ground position
        const groundHits = this.raycaster.intersectObjects(this.scene.children, false);
        for (const hit of groundHits) {
          if (hit.point && Math.abs(hit.point.y) < 4.5) {
            this.player.targetX = hit.point.x;
            this.player.targetZ = hit.point.z;
            break;
          }
        }
      });

      // Wheel Zoom
      this.canvas.addEventListener("wheel", (e) => {
        if (!this.isRunning) return;
        this.cameraOrbit.distance = Math.max(
          8.0,
          Math.min(36.0, this.cameraOrbit.distance + e.deltaY * 0.015)
        );
      });

      // Touch controls
      let touchStartX = 0;
      let touchStartY = 0;
      this.canvas.addEventListener("touchstart", (e) => {
        if (!this.isRunning || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });

      this.canvas.addEventListener("touchmove", (e) => {
        if (!this.isRunning || e.touches.length === 0) return;
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;

        this.cameraOrbit.azimuth -= dx * 0.008;
        this.cameraOrbit.elevation = Math.max(
          -0.30,
          Math.min(1.48, this.cameraOrbit.elevation + dy * 0.007)
        );

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });
    }
  }

  /* ==========================================================================
     상세 모달 & 상호작용
     ========================================================================== */
  interactWithNearby() {
    if (this.isNearBuddhaAltar) {
      this.offerPrayerAtBuddha();
    } else if (this.isNearShrine) {
      this.showWeeklyTopModal();
    } else if (this.nearbyLantern) {
      this.showWishDetailModal(this.nearbyLantern);
    } else {
      let closest = null;
      let minD = 9.5;
      for (const l of this.lanterns) {
        const d = Math.hypot(l.group.position.x - this.player.x, l.group.position.z - this.player.z);
        if (d < minD) {
          minD = d;
          closest = l;
        }
      }
      if (closest) {
        this.showWishDetailModal(closest);
      }
    }
  }

  /* ==========================================================================
     불교 대웅보전 합장 삼배 및 싱잉볼 타종 사운드
     ========================================================================== */
  playTempleBellSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      // Resonant harmonic frequencies of a Buddhist singing bowl / temple bell
      const harmonics = [
        { f: 261.63, g: 0.35, d: 4.5 }, // C4
        { f: 523.25, g: 0.22, d: 3.8 }, // C5
        { f: 784.88, g: 0.15, d: 3.0 }, // G5
        { f: 1046.5, g: 0.08, d: 2.2 }  // C6
      ];

      harmonics.forEach(({ f, g, d }) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(g, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + d);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + d + 0.1);
      });
    } catch (e) {
      console.warn("Temple sound audio error:", e);
    }
  }

  offerPrayerAtBuddha() {
    if (this.player.isPraying) return;
    this.player.isPraying = true;
    this.player.prayPhase = 0;
    this.player.bowIndex = 1;

    // 1. Center avatar on central prayer cushion facing the Buddha statue (facing North/-Z)
    this.player.x = 0;
    this.player.z = -55.5;
    this.player.y = 3.85;
    this.player.targetX = null;
    this.player.targetZ = null;
    this.player.rotationY = Math.PI;

    // 2. Cinematic Camera framing avatar prostrating before the towering Golden Buddha
    this.cameraOrbit.azimuth = 0.42;
    this.cameraOrbit.elevation = 0.22;
    this.cameraOrbit.distance = 9.5;

    // 3. Play serene Buddhist singing bowl chime for Bow 1
    this.playTempleBellSound();

    // 4. Emit golden lotus sparkles around player
    this.spawnCheerSparkles({
      x: this.player.x,
      y: this.player.y + 0.8,
      z: this.player.z
    });

    // 5. Show initial heartfelt toast for 1배
    this.showToast("🪷 [일배 (一拜)] 마음의 번뇌와 아집을 온전히 내려놓습니다...");
  }

  showBuddhaBlessingModal() {
    const dialog = document.getElementById("buddhaBlessingModal");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  /* ==========================================================================
     광장 퇴장 확인 다이얼로그 (ESC 키 및 헤더 ✕ 버튼 연동)
     ========================================================================== */
  promptExit() {
    // 1. If any child modal is open, close that first instead of exiting
    const otherModals = [
      "wishCardDetailModal",
      "wishWeeklyTopModal",
      "buddhaBlessingModal",
      "plazaLaunchModal"
    ];
    for (const id of otherModals) {
      const el = document.getElementById(id);
      if (el && (el.open || el.hasAttribute("open"))) {
        el.close();
        return;
      }
    }

    // 2. Open Exit Confirmation Dialog
    const exitModal = document.getElementById("wishPlazaExitConfirmModal");
    if (!exitModal) return;
    if (typeof exitModal.showModal === "function") {
      exitModal.showModal();
    } else {
      exitModal.setAttribute("open", "");
    }
  }

  cancelExit() {
    const exitModal = document.getElementById("wishPlazaExitConfirmModal");
    if (exitModal) exitModal.close();
    if (this.canvas) this.canvas.focus();
  }

  confirmExit() {
    const exitModal = document.getElementById("wishPlazaExitConfirmModal");
    if (exitModal) exitModal.close();
    if (window.App && typeof window.App.closeWishPlaza === "function") {
      window.App.closeWishPlaza();
    } else {
      this.close();
    }
  }

  showWishDetailModal(lantern) {
    const dialog = document.getElementById("wishCardDetailModal");
    if (!dialog) return;

    const titleEl = document.getElementById("wishDetailTitle");
    const authorEl = document.getElementById("wishDetailAuthor");
    const dateEl = document.getElementById("wishDetailDate");
    const textEl = document.getElementById("wishDetailText");
    const cheerCountEl = document.getElementById("wishDetailCheerCount");
    const cheerBtn = document.getElementById("wishDetailCheerBtn");

    if (lantern.isDefaultLight) {
      if (titleEl) titleEl.textContent = lantern.category;
      if (authorEl) authorEl.textContent = lantern.author;
      if (dateEl) dateEl.textContent = lantern.date;
      if (textEl) textEl.textContent = `"${lantern.text}"`;
      if (cheerCountEl) cheerCountEl.textContent = "조명 가동중";
      if (cheerBtn) {
        cheerBtn.innerHTML = `<span>🏮</span><span>이 자리에 내 소원 띄우기</span>`;
        cheerBtn.className = "px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-white font-bold border border-[#fde68a] shadow flex items-center space-x-1.5 text-xs transition cursor-pointer";
        cheerBtn.onclick = () => {
          if (dialog.close) dialog.close();
          this.openPlazaLaunchModal();
        };
      }
    } else {
      let cheeredIds = [];
      try {
        cheeredIds = JSON.parse(localStorage.getItem("chunmyung_cheered_wish_ids") || "[]");
      } catch (e) {}
      const isCheered = cheeredIds.includes(lantern.id);

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
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  openPlazaLaunchModal() {
    const dialog = document.getElementById("plazaLaunchModal");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  showWeeklyTopModal() {
    const dialog = document.getElementById("wishWeeklyTopModal");
    if (!dialog) return;

    // Pick top wish among actual user wishes
    const userWishes = this.lanterns.filter((w) => !w.isDefaultLight);
    const topWish = userWishes.length > 0
      ? userWishes.reduce((max, w) => (w.cheers > max.cheers ? w : max), userWishes[0])
      : null;

    const titleEl = document.getElementById("weeklyTopDetailTitle");
    const textEl = document.getElementById("weeklyTopDetailText");
    const countEl = document.getElementById("weeklyTopDetailCount");

    if (topWish) {
      if (titleEl) titleEl.textContent = `[${topWish.category}] ${topWish.author} 님의 소원`;
      if (textEl) textEl.textContent = `"${topWish.text}"`;
      if (countEl) countEl.textContent = `${topWish.cheers}회의 따뜻한 응원을 받았습니다`;
    } else {
      if (titleEl) titleEl.textContent = "🕊️ [주간 1위 명예의 제단] 사찰 상시 축원";
      if (textEl) textEl.textContent = `"온 세상 모든 인연의 평안과 안녕을 기원하며 정진합니다. 첫 번째 소원 연등을 띄워 도반들의 사랑과 응원을 받아보세요."`;
      if (countEl) countEl.textContent = "사찰 공식 축원 연등";
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  updateHudCount() {
    const countEl = document.getElementById("wishPlazaTotalCount");
    const statusEl = document.getElementById("wishPlazaLightingStatus");
    const wishCount = this.lanterns.filter((l) => !l.isDefaultLight).length;
    const totalCount = this.lanterns.length;
    if (countEl) countEl.textContent = wishCount;
    if (statusEl) {
      if (wishCount === 0) {
        statusEl.textContent = `사찰 기본 조명 ${totalCount}등 완비`;
      } else {
        statusEl.textContent = `소원이 조명 ${wishCount}등 대체 중 (총 ${totalCount}등)`;
      }
    }
  }

  showToast(msg) {
    const toast = document.getElementById("wishPlazaToast");
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0", "pointer-events-none");
    }, 3800);
  }

  /* ==========================================================================
     충돌 감지 시스템 (건물 및 조형물 관통 100% 방지)
     ========================================================================== */
  checkCollision(px, pz, radius = 0.65) {
    // 1. World outer boundary walls
    if (px < -43.5 || px > 43.5) return true;
    if (pz > 42.0 || pz < -61.0) return true;

    // 2. South Lotus Pond (연화지 수역 - 다리 통로만 통행 가능)
    if (pz >= 22.0 && pz <= 42.0) {
      if (Math.abs(px) > 3.2 - radius * 0.3) return true;
    }

    // 3. Central 3-Story Stone Pagoda (중앙 삼층대석탑 at x = 0, z = -10)
    if (px >= -5.0 - radius && px <= 5.0 + radius && pz >= -15.0 - radius && pz <= -5.0 + radius) {
      return true;
    }

    // 4. East Bell Pavilion (범종각 at x = 40, z = -18)
    if (px >= 31.5 - radius && px <= 48.5 + radius && pz >= -26.5 - radius && pz <= -9.5 + radius) {
      return true;
    }

    // 5. West Hall (명부전 at x = -40, z = -18)
    if (px >= -48.5 - radius && px <= -31.5 + radius && pz >= -26.5 - radius && pz <= -9.5 + radius) {
      return true;
    }

    // 6. Perimeter Side Corridors (좌우 둘레 회랑)
    if ((px <= -45.5 || px >= 45.5) && pz >= -52.0 && pz <= 28.0) {
      return true;
    }

    // 7. Guardian Stone Lions (계단 좌우 해태상 at x = ±9.2, z = -27.0)
    if (Math.hypot(px - (-9.2), pz - (-27.0)) < 1.7 + radius) return true;
    if (Math.hypot(px - 9.2, pz - (-27.0)) < 1.7 + radius) return true;

    // 8. Courtyard Stone Lanterns (석등 8기)
    const stoneLanternCoords = [
      [-7.0, 12], [7.0, 12],
      [-8.0, 2], [8.0, 2],
      [-9.5, -18], [9.5, -18],
      [-11.0, -32], [11.0, -32]
    ];
    for (const [lx, lz] of stoneLanternCoords) {
      if (Math.hypot(px - lx, pz - lz) < 1.35 + radius) return true;
    }

    // 9. Grand Temple Hall (대웅전 / 천명전) Walls & Obstacles
    // A. Back Wall of Daeungjeon (at world z ≈ -72.5)
    if (pz <= -72.0 - radius && Math.abs(px) <= 30.5) return true;

    // B. West & East Outer Walls of Daeungjeon (from world z = -33.5 to -73.0)
    if (pz <= -33.2 && pz >= -73.0) {
      if (px <= -28.5 - radius && px >= -31.5) return true;
      if (px >= 28.5 + radius && px <= 31.5) return true;
    }

    // C. Front Wall of Daeungjeon (with Open Central Entrance Portal at world z ≈ -33.5)
    if (pz <= -33.0 && pz >= -34.5) {
      if (px < -7.2 || px > 7.2) return true; // Center entrance |x| <= 7.2 is OPEN!
    }

    // D. Buddha Altar & Sacred Sanctuary Platform (inside hall at world z ≈ -64.5)
    if (px >= -11.5 - radius && px <= 11.5 + radius && pz >= -70.0 && pz <= -59.5) {
      return true;
    }

    // E. Dharma Drum & Wooden Fish Drum
    if (px >= 19.0 - radius && px <= 26.0 + radius && pz >= -64.0 && pz <= -56.0) return true;
    if (px <= -19.0 + radius && px >= -26.0 - radius && pz >= -64.0 && pz <= -56.0) return true;

    // F. Temple Platform Side Walls (기단 측면 관통 방지: world z from -22.4 to -33.0, |px| > 10.0)
    if (pz <= -22.4 && pz >= -33.0 && Math.abs(px) > 10.0) {
      return true;
    }

    return false;
  }

  /* ==========================================================================
     지형 고도 및 계단 높이 계산 (대웅전 내부 및 석계단 자연스러운 보행)
     ========================================================================== */
  getGroundElevation(px, pz) {
    // 1. South Lotus Pond Stone Arch Bridge (홍예교)
    if (pz >= 22.0 && pz <= 42.0 && Math.abs(px) <= 3.4) {
      const bridgeNorm = (pz - 22.0) / 20.0;
      return 0.35 + Math.sin(bridgeNorm * Math.PI) * 0.55;
    }

    // 2. Ceremonial Stairs leading to the Grand Temple Hall (대석계단)
    // World coordinates: from z = -22.2 down to z = -30.8, Width |px| <= 9.8
    if (pz <= -22.0 && pz >= -30.8 && Math.abs(px) <= 9.8) {
      const t = (-22.0 - pz) / 8.8; // 0.0 at -22.0, 1.0 at -30.8
      return Math.max(0.0, Math.min(3.85, t * 3.85));
    }

    // 3. Grand Temple Platform, Balustrade Terrace & Temple Interior (월대 및 전각 내부 마루)
    // World coordinates: from z = -30.8 down to z = -73.5, Width |px| <= 31.0
    if (pz < -30.8 && pz >= -73.5 && Math.abs(px) <= 31.0) {
      return 3.85;
    }

    // 4. Default Courtyard Level
    return 0.0;
  }

  /* ==========================================================================
     플레이어 이동 및 충돌 해결 (벽면 슬라이딩 지원)
     ========================================================================== */
  resolvePlayerMovement(moveDir, dt) {
    const speed = this.player.speed;
    const radius = 0.65;
    const stepX = moveDir.x * speed * dt;
    const stepZ = moveDir.z * speed * dt;

    const dist = Math.hypot(stepX, stepZ);
    const substeps = Math.max(1, Math.ceil(dist / 0.15));
    const subX = stepX / substeps;
    const subZ = stepZ / substeps;

    for (let s = 0; s < substeps; s++) {
      // 1. Try X movement
      const nextX = this.player.x + subX;
      if (!this.checkCollision(nextX, this.player.z, radius)) {
        this.player.x = nextX;
      }

      // 2. Try Z movement independently (wall sliding!)
      const nextZ = this.player.z + subZ;
      if (!this.checkCollision(this.player.x, nextZ, radius)) {
        this.player.z = nextZ;
      }
    }
  }

  /* ==========================================================================
     메인 렌더링 루프 & 물리/애니메이션 업데이트
     ========================================================================== */
  loop() {
    if (!this.isRunning) return;

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    this.update(dt, elapsedTime);
    this.renderer.render(this.scene, this.camera);

    this.animFrameId = requestAnimationFrame(() => this.loop());
  }

  update(dt, elapsedTime) {
    // 1. Jump Physics & Ground Elevation Tracking
    const groundElevation = this.getGroundElevation(this.player.x, this.player.z);

    if (!this.player.isGrounded) {
      this.player.y += this.player.vy * dt;
      this.player.vy -= this.player.gravity * dt;
      if (this.player.y <= groundElevation) {
        this.player.y = groundElevation;
        this.player.vy = 0;
        this.player.isGrounded = true;
      }
    } else {
      // Stepping up: INSTANT elevation snap so character NEVER sinks into step surface!
      if (groundElevation > this.player.y) {
        this.player.y = groundElevation;
      } else {
        this.player.y += (groundElevation - this.player.y) * Math.min(1.0, 32.0 * dt);
        if (Math.abs(this.player.y - groundElevation) < 0.02) {
          this.player.y = groundElevation;
        }
      }
    }

    // 2. Horizontal Movement relative to Camera View
    const camForward = new THREE.Vector3();
    this.camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (!this.player.isPraying) {
      if (this.keys.up) moveDir.add(camForward);       // W: Forward
      if (this.keys.down) moveDir.sub(camForward);     // S: Backward
      if (this.keys.left) moveDir.sub(camRight);       // A: Left
      if (this.keys.right) moveDir.add(camRight);      // D: Right

      // Click to move target calculation
      if (this.player.targetX !== null && this.player.targetZ !== null && moveDir.lengthSq() === 0) {
        const dx = this.player.targetX - this.player.x;
        const dz = this.player.targetZ - this.player.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.3) {
          this.player.targetX = null;
          this.player.targetZ = null;
        } else {
          moveDir.set(dx / dist, 0, dz / dist);
        }
      }
    } else {
      this.player.targetX = null;
      this.player.targetZ = null;
    }

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
      this.resolvePlayerMovement(moveDir, dt);

      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetAngle - this.player.rotationY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.player.rotationY += diff * 0.22;

      this.player.isMoving = true;
      this.player.walkPhase += dt * 9.5;
    } else {
      this.player.isMoving = false;
      this.player.walkPhase = 0;
    }

    // Prayer Bowing Animation (삼배 3회 정성 절하기 모션)
    if (this.player.isPraying) {
      this.player.isMoving = false;
      this.player.walkPhase = 0;

      const prevBowIndex = Math.min(3, Math.floor(this.player.prayPhase / (Math.PI * 2)) + 1);
      this.player.prayPhase += dt * 2.65; // ~2.37s per bow
      const currentBowIndex = Math.min(3, Math.floor(this.player.prayPhase / (Math.PI * 2)) + 1);

      if (currentBowIndex !== prevBowIndex && currentBowIndex <= 3) {
        this.player.bowIndex = currentBowIndex;
        this.playTempleBellSound();
        this.spawnCheerSparkles({ x: this.player.x, y: this.player.y + 0.8, z: this.player.z });
        if (currentBowIndex === 2) {
          this.showToast("🪷 [이배 (二拜)] 지혜와 자비의 온화한 광명을 구합니다...");
        } else if (currentBowIndex === 3) {
          this.showToast("🪷 [삼배 (三拜)] 간절한 소망이 성취되기를 지극히 발원합니다...");
        }
      }

      const totalDuration = Math.PI * 2 * 3;
      if (this.player.prayPhase < totalDuration) {
        const cycleProgress = (this.player.prayPhase % (Math.PI * 2)) / (Math.PI * 2);
        const bowAmount = Math.sin(cycleProgress * Math.PI);

        // 1. Knees bend & Hip drops onto cushion
        if (this.player.leftLeg && this.player.rightLeg) {
          this.player.leftLeg.rotation.x = -bowAmount * 1.35;
          this.player.rightLeg.rotation.x = -bowAmount * 1.35;
        }
        if (this.player.upperBody) {
          this.player.upperBody.position.y = 0.75 - bowAmount * 0.42;
          // 2. Torso deeply prostrates forward (오체투지 절하기)
          this.player.upperBody.rotation.x = bowAmount * 1.32; // ~76 degrees forward
        }
        // 3. Arms come forward together onto cushion in Hapjang
        if (this.player.leftArm && this.player.rightArm) {
          this.player.leftArm.rotation.x = bowAmount * 1.05;
          this.player.rightArm.rotation.x = bowAmount * 1.05;
          this.player.leftArm.rotation.z = bowAmount * 0.35;
          this.player.rightArm.rotation.z = -bowAmount * 0.35;
        }
      } else {
        // Bowing cycle finished: smoothly return to standing
        this.player.isPraying = false;
        if (this.player.leftLeg && this.player.rightLeg) {
          this.player.leftLeg.rotation.x = 0;
          this.player.rightLeg.rotation.x = 0;
        }
        if (this.player.upperBody) {
          this.player.upperBody.position.y = 0.75;
          this.player.upperBody.rotation.x = 0;
        }
        if (this.player.leftArm && this.player.rightArm) {
          this.player.leftArm.rotation.x = 0;
          this.player.rightArm.rotation.x = 0;
          this.player.leftArm.rotation.z = 0;
          this.player.rightArm.rotation.z = 0;
        }
        this.spawnCheerSparkles({ x: this.player.x, y: this.player.y + 1.2, z: this.player.z });
        this.showToast("🪷 [삼배 완료] 부처님 전에 삼배를 올렸습니다. 만복이 깃드시길 발원합니다.");
        this.showBuddhaBlessingModal();
      }
    } else {
      // Normal walking or idle arm/leg swing
      if (this.player.leftLeg && this.player.rightLeg) {
        if (!this.player.isGrounded) {
          this.player.leftLeg.rotation.x = -0.3;
          this.player.rightLeg.rotation.x = 0.3;
        } else if (this.player.isMoving) {
          this.player.leftLeg.rotation.x = Math.sin(this.player.walkPhase) * 0.45;
          this.player.rightLeg.rotation.x = -Math.sin(this.player.walkPhase) * 0.45;
        } else {
          this.player.leftLeg.rotation.x = 0;
          this.player.rightLeg.rotation.x = 0;
        }
      }

      if (this.player.leftArm && this.player.rightArm) {
        if (this.player.isMoving) {
          this.player.leftArm.rotation.x = -Math.sin(this.player.walkPhase) * 0.35;
          this.player.rightArm.rotation.x = Math.sin(this.player.walkPhase) * 0.35;
        } else {
          this.player.leftArm.rotation.x = 0;
          this.player.rightArm.rotation.x = 0;
        }
      }
      if (this.player.upperBody) {
        this.player.upperBody.position.y = 0.75;
        this.player.upperBody.rotation.x = 0;
      }
    }

    // Apply player position & rotation
    if (this.playerGroup) {
      this.playerGroup.position.set(this.player.x, this.player.y, this.player.z);
      if (!this.player.isPraying) {
        this.playerGroup.rotation.y = this.player.rotationY;
      }
    }

    // 3. Camera Follow (Up/Down/Left/Right Orbit around player)
    let orbitDist = this.cameraOrbit.distance;
    if (this.player.z < -33.5) {
      // Keep camera inside temple interior when entering hall
      orbitDist = Math.min(orbitDist, 13.5);
    }
    const elev = this.cameraOrbit.elevation;
    const azim = this.cameraOrbit.azimuth;

    const camX = this.player.x + orbitDist * Math.cos(elev) * Math.sin(azim);
    let camY = Math.max(this.player.y + 1.2, this.player.y + orbitDist * Math.sin(elev));
    if (this.player.z < -33.5) {
      camY = Math.min(14.2, camY); // Prevent camera clipping through roof
    }
    const camZ = this.player.z + orbitDist * Math.cos(elev) * Math.cos(azim);

    this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.16);
    this.camera.lookAt(this.player.x, this.player.y + 1.8, this.player.z);

    // 4. Floating lanterns bobbing & sway
    this.lanterns.forEach((l) => {
      l.group.position.y = l.baseY + Math.sin(elapsedTime * l.floatSpeed + l.floatOffset) * l.floatAmp;
      l.group.rotation.y += l.rotSpeed * dt;

      if (l.streamer) {
        l.streamer.rotation.z = Math.sin(elapsedTime * 2.5 + l.floatOffset) * 0.12;
      }

      if (l.isNew && l.baseY < l.targetY) {
        l.baseY += dt * 0.95;
        if (l.baseY >= l.targetY) l.isNew = false;
      }
    });

    // 5. Grand Golden Lantern Rotation & Shrine Ring
    if (this.grandLantern) {
      this.grandLantern.rotation.y += 0.015;
      this.grandLantern.position.y = 15.2 + Math.sin(elapsedTime * 1.5) * 0.45;
    }
    if (this.shrineRing) {
      this.shrineRing.rotation.z += 0.01;
    }

    // 6. Temple Altar Smoke & Candle Animations
    if (this.incenseParticles) {
      this.incenseParticles.forEach((p) => {
        p.position.y += p.userData.speed * dt;
        p.position.x = Math.sin(elapsedTime * p.userData.swaySpeed + p.userData.offset) * p.userData.swayAmp;
        if (p.position.y > 10.5) {
          p.position.y = p.userData.baseY;
        }
      });
    }
    if (this.candleLightLeft && this.candleLightRight) {
      this.candleLightLeft.intensity = 1.5 + Math.sin(elapsedTime * 9.5) * 0.3;
      this.candleLightRight.intensity = 1.5 + Math.cos(elapsedTime * 8.5) * 0.3;
    }

    // 7. Proximity check
    this.nearbyLantern = null;
    let closestDist = 5.5;

    for (const l of this.lanterns) {
      const d = Math.hypot(l.group.position.x - this.player.x, l.group.position.z - this.player.z);
      if (d < closestDist) {
        closestDist = d;
        this.nearbyLantern = l;
      }
    }

    const distToPagoda = Math.hypot(0 - this.player.x, -10 - this.player.z);
    this.isNearShrine = distToPagoda < 7.2;

    // Check Buddha Altar Proximity (inside temple hall at world z ≈ -55.5)
    const distToBuddha = Math.hypot(this.player.x, this.player.z - (-55.5));
    this.isNearBuddhaAltar = (distToBuddha < 6.8 && this.player.z < -33.5);

    const buddhaPrompt = document.getElementById("wishPlazaBuddhaPrompt");
    const mobilePrayerBtn = document.getElementById("mobilePrayerBtn");
    if (buddhaPrompt) {
      if (this.isNearBuddhaAltar) {
        buddhaPrompt.classList.remove("hidden");
      } else {
        buddhaPrompt.classList.add("hidden");
      }
    }
    if (mobilePrayerBtn) {
      if (this.isNearBuddhaAltar) {
        mobilePrayerBtn.classList.remove("hidden");
      } else {
        mobilePrayerBtn.classList.add("hidden");
      }
    }

    // 8. Shooting stars
    if (elapsedTime - this.lastShootingStarTime > 4.2 && Math.random() < 0.4) {
      this.lastShootingStarTime = elapsedTime;
      this.spawnShootingStar();
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.mesh.position.x += s.vx;
      s.mesh.position.y += s.vy;
      s.mesh.position.z += s.vz;
      s.life -= dt;
      s.mesh.material.opacity = Math.max(0, s.life / s.maxLife);
      if (s.life <= 0) {
        this.scene.remove(s.mesh);
        this.shootingStars.splice(i, 1);
      }
    }

    // 9. Cheer sparkle particles
    for (let p = this.sparkleParticles.length - 1; p >= 0; p--) {
      const sp = this.sparkleParticles[p];
      const posAttr = sp.mesh.geometry.attributes.position;
      const count = posAttr.count;

      for (let k = 0; k < count; k++) {
        posAttr.setXYZ(
          k,
          posAttr.getX(k) + sp.velocities[k * 3] * dt,
          posAttr.getY(k) + sp.velocities[k * 3 + 1] * dt,
          posAttr.getZ(k) + sp.velocities[k * 3 + 2] * dt
        );
      }
      posAttr.needsUpdate = true;
      sp.life -= dt;
      sp.mesh.material.opacity = Math.max(0, sp.life / sp.maxLife);
      if (sp.life <= 0) {
        this.scene.remove(sp.mesh);
        this.sparkleParticles.splice(p, 1);
      }
    }
  }
}

// Global Singleton Instance
window.WishPlaza = new WishPlaza3DEngine();
