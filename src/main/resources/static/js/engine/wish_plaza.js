/**
 * ============================================================================
 * 천명(天命) 3D 산사(절) 은하수 소원 연등 광장 엔진 (Three.js 3D Virtual Temple)
 * ============================================================================
 * - 한국 전통 사찰(대웅보전, 삼층석탑, 석등, 연화지, 홍예교, 소나무, 대나무) 3D 구현
 * - 3D 밤하늘 별무리(Starfield), 보름달(Full Moon), 실시간 유성(Shooting Stars)
 * - W(앞), S(뒤), A(좌), D(우) & 방향키 카메라 기준 3D 캐릭터 보행 이동
 * - 마우스 드래그 / 터치 드래그 3D 360도 시점 회전 및 줌
 * - 3D 부유 연등(Wish Lanterns) & 주간 1위 소원 대황금연등 제단
 * - 근접 인터랙션([E] 키 / 마우스 3D Raycast 클릭) & 실시간 연등 띄우기
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

    // Camera control state (Orbit around player)
    this.cameraOrbit = {
      azimuth: 0.0,         // Horizontal rotation around player
      elevation: 0.38,      // Vertical angle (radians)
      distance: 14.5,       // Distance from player
      isDragging: false,
      prevMouseX: 0,
      prevMouseY: 0
    };

    // Player state
    this.player = {
      mesh: null,
      nameTagSprite: null,
      lanternMesh: null,
      handLight: null,
      x: 0,
      y: 0,
      z: 16,                // Start in courtyard near entrance
      targetX: null,
      targetZ: null,
      rotationY: 0,
      speed: 10.5,
      walkPhase: 0,
      isMoving: false,
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
    this.nearbyLantern = null;
    this.isNearShrine = false;
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

    // Ensure Three.js is loaded
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
      this.renderer.toneMappingExposure = 1.1;
    }

    // 2. Scene & Camera setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050713); // Deep midnight Korean indigo
    this.scene.fog = new THREE.FogExp2(0x070b1a, 0.0075);

    this.camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      800
    );

    // 3. Procedural procedural textures
    this.initProceduralTextures();

    // 4. Build 3D Korean Temple World
    this.buildLighting();
    this.buildSkyAndStars();
    this.buildGroundAndCourtyard();
    this.buildTempleMainHall();
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

    // Update player nickname from logged in account
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
     절(사찰) 텍스처 및 조명 빌더
     ========================================================================== */
  initProceduralTextures() {
    // 1. Granite Pavement Texture (절마당 화강암 박석)
    const stoneCanvas = document.createElement("canvas");
    stoneCanvas.width = 512;
    stoneCanvas.height = 512;
    const sctx = stoneCanvas.getContext("2d");
    sctx.fillStyle = "#2b2520";
    sctx.fillRect(0, 0, 512, 512);

    // Stone tile joints
    sctx.strokeStyle = "#16120e";
    sctx.lineWidth = 4;
    const tileSize = 64;
    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        // Subtle granite speckles
        const noise = Math.floor(Math.random() * 25 - 12);
        const r = Math.min(255, Math.max(0, 48 + noise));
        const g = Math.min(255, Math.max(0, 42 + noise));
        const b = Math.min(255, Math.max(0, 36 + noise));
        sctx.fillStyle = `rgb(${r},${g},${b})`;
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
    stoneTex.repeat.set(16, 16);
    this.textures.stone = stoneTex;

    // 2. Korean Traditional Dancheong Tile Texture (처마 단청)
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
  }

  buildLighting() {
    // Soft moonlight ambient
    const ambientLight = new THREE.AmbientLight(0x283250, 1.4);
    this.scene.add(ambientLight);

    // Directional moonlight from the full moon
    const moonLight = new THREE.DirectionalLight(0xaad0ff, 1.8);
    moonLight.position.set(-60, 90, -110);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 300;
    const d = 55;
    moonLight.shadow.camera.left = -d;
    moonLight.shadow.camera.right = d;
    moonLight.shadow.camera.top = d;
    moonLight.shadow.camera.bottom = -d;
    moonLight.shadow.bias = -0.0005;
    this.scene.add(moonLight);

    // Warm temple sanctuary ambient fill
    const templeSanctuaryLight = new THREE.PointLight(0xffa238, 2.4, 60);
    templeSanctuaryLight.position.set(0, 8, -32);
    this.scene.add(templeSanctuaryLight);
  }

  /* ==========================================================================
     밤하늘, 별무리, 보름달, 별똥별(유성)
     ========================================================================== */
  buildSkyAndStars() {
    // 1. Starfield (2200 stars)
    const starCount = 2200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Upper hemisphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5; // upper hemisphere
      const r = 320 + Math.random() * 80;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 15;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Star color tones (white, warm golden, cyan blue)
      const tone = Math.random();
      if (tone > 0.8) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.75; // Gold
      } else if (tone > 0.6) {
        colors[i * 3] = 0.78; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 1.0; // Cyan
      } else {
        colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.96; colors[i * 3 + 2] = 1.0; // Pure white
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.92
    });
    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);

    // 2. Full Moon (신비로운 보름달)
    const moonGeo = new THREE.SphereGeometry(12, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xfff5dd
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-75, 105, -145);
    this.scene.add(moon);

    // Moon halo / glow
    const haloGeo = new THREE.PlaneGeometry(55, 55);
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = 128;
    haloCanvas.height = 128;
    const hctx = haloCanvas.getContext("2d");
    const grad = hctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255, 244, 210, 0.75)");
    grad.addColorStop(0.35, "rgba(254, 215, 140, 0.28)");
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
    // Diagonal 3D shooting star with particle trail
    const startX = (Math.random() - 0.5) * 140 - 20;
    const startY = 75 + Math.random() * 35;
    const startZ = -120 - Math.random() * 50;

    const linePoints = [
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(startX - 18, startY - 11, startZ + 14)
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
      vx: -2.8,
      vy: -1.7,
      vz: 2.1,
      life: 1.0,
      maxLife: 1.0
    });
  }

  /* ==========================================================================
     절 마당(Courtyard) 및 바닥
     ========================================================================== */
  buildGroundAndCourtyard() {
    // 1. Granite Ground Plane
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.textures.stone,
      roughness: 0.85,
      metalness: 0.12
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Central Ceremonial Pathway (답도 / 어도)
    const pathGeo = new THREE.PlaneGeometry(5.2, 70);
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
      pctx.arc(64, y, 6, 0, Math.PI * 2);
      pctx.stroke();
    }
    const pathTex = new THREE.CanvasTexture(pathCanvas);
    pathTex.wrapT = THREE.RepeatWrapping;
    pathTex.repeat.set(1, 4);

    const pathMat = new THREE.MeshStandardMaterial({
      map: pathTex,
      roughness: 0.65,
      metalness: 0.2
    });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.03, -4);
    path.receiveShadow = true;
    this.scene.add(path);
  }

  /* ==========================================================================
     한국 전통 대웅전 (천명전 大雄寶殿) 3D 빌더
     ========================================================================== */
  buildTempleMainHall() {
    const hallGroup = new THREE.Group();
    hallGroup.position.set(0, 0, -36);

    // 1. Stone Foundation Platform (기단)
    const platformGeo = new THREE.BoxGeometry(32, 2.2, 22);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3a322c, roughness: 0.9 });
    const platform = new THREE.Mesh(platformGeo, stoneMat);
    platform.position.y = 1.1;
    platform.castShadow = true;
    platform.receiveShadow = true;
    hallGroup.add(platform);

    // Stone Steps (기단 석계단)
    for (let i = 0; i < 4; i++) {
      const stepGeo = new THREE.BoxGeometry(10 - i * 0.8, 0.35, 1.2);
      const step = new THREE.Mesh(stepGeo, stoneMat);
      step.position.set(0, 0.18 + i * 0.35, 11.2 + (3 - i) * 0.8);
      step.castShadow = true;
      step.receiveShadow = true;
      hallGroup.add(step);
    }

    // 2. Hall Walls (회벽 & 창호문)
    const wallGeo = new THREE.BoxGeometry(28, 8.5, 18);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x241812, roughness: 0.8 });
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = 2.2 + 4.25;
    walls.castShadow = true;
    walls.receiveShadow = true;
    hallGroup.add(walls);

    // Traditional Paper Lattice Doors (꽃살 창호문 with warm inner glow)
    for (let d = -3; d <= 3; d++) {
      const doorGeo = new THREE.PlaneGeometry(2.8, 6.2);
      const doorCanvas = document.createElement("canvas");
      doorCanvas.width = 128;
      doorCanvas.height = 256;
      const dctx = doorCanvas.getContext("2d");
      dctx.fillStyle = "#ffeedd";
      dctx.fillRect(0, 0, 128, 256);
      dctx.strokeStyle = "#5a3219";
      dctx.lineWidth = 5;
      dctx.strokeRect(4, 4, 120, 248);
      // Lattice grid
      for (let y = 16; y < 256; y += 24) {
        dctx.beginPath();
        dctx.moveTo(4, y);
        dctx.lineTo(124, y);
        dctx.stroke();
      }
      for (let x = 16; x < 128; x += 24) {
        dctx.beginPath();
        dctx.moveTo(x, 4);
        dctx.lineTo(x, 252);
        dctx.stroke();
      }
      const doorTex = new THREE.CanvasTexture(doorCanvas);
      const doorMat = new THREE.MeshStandardMaterial({
        map: doorTex,
        emissive: 0xff9933,
        emissiveIntensity: 0.42,
        roughness: 0.6
      });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(d * 3.6, 5.3, 9.05);
      hallGroup.add(door);
    }

    // 3. Wooden Pillars (배흘림 기둥)
    const pillarGeo = new THREE.CylinderGeometry(0.55, 0.65, 8.5, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x801818, roughness: 0.6 }); // Dancheong Red
    for (let p = -4; p <= 4; p++) {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(p * 3.5, 6.45, 9.3);
      pillar.castShadow = true;
      hallGroup.add(pillar);
    }

    // 4. Korean Dancheong Bracket System (공포/익공)
    const bracketGeo = new THREE.BoxGeometry(31, 0.9, 21);
    const bracketMat = new THREE.MeshStandardMaterial({
      map: this.textures.dancheong,
      roughness: 0.5
    });
    const bracket = new THREE.Mesh(bracketGeo, bracketMat);
    bracket.position.y = 10.9;
    bracket.castShadow = true;
    hallGroup.add(bracket);

    // 5. Multi-tier Korean Hip-and-Gable Roof (팔작지붕 / 기와 지붕)
    // Lower tier eave
    const lowerRoofGeo = new THREE.ConeGeometry(24, 5.5, 4, 1);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x182028, // Korean black clay tile (기와)
      roughness: 0.72,
      metalness: 0.25
    });
    const lowerRoof = new THREE.Mesh(lowerRoofGeo, roofMat);
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.scale.set(1.15, 0.65, 0.85);
    lowerRoof.position.y = 13.5;
    lowerRoof.castShadow = true;
    hallGroup.add(lowerRoof);

    // Upper main roof ridge (용마루 & 내림마루)
    const upperRoofGeo = new THREE.ConeGeometry(19, 6.2, 4, 1);
    const upperRoof = new THREE.Mesh(upperRoofGeo, roofMat);
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.scale.set(1.12, 0.75, 0.82);
    upperRoof.position.y = 16.5;
    upperRoof.castShadow = true;
    hallGroup.add(upperRoof);

    // Golden Roof Ridge Ornament (치미 / 용마루 장식)
    const ridgeGeo = new THREE.BoxGeometry(22, 0.55, 0.65);
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0xd4a359, metalness: 0.6, roughness: 0.3 });
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridge.position.set(0, 19.4, 0);
    hallGroup.add(ridge);

    // 6. Temple Plaque (현판: 天命殿 천명전)
    const plaqueCanvas = document.createElement("canvas");
    plaqueCanvas.width = 256;
    plaqueCanvas.height = 96;
    const plctx = plaqueCanvas.getContext("2d");
    plctx.fillStyle = "#120a05";
    plctx.fillRect(0, 0, 256, 96);
    plctx.strokeStyle = "#f59e0b";
    plctx.lineWidth = 6;
    plctx.strokeRect(6, 6, 244, 84);
    plctx.fillStyle = "#fde047";
    plctx.font = "bold 38px 'Noto Serif KR', serif";
    plctx.textAlign = "center";
    plctx.textBaseline = "middle";
    plctx.fillText("天 命 殿", 128, 48);

    const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
    const plaqueGeo = new THREE.PlaneGeometry(5.2, 2.0);
    const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.4 });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, 9.8, 10.6);
    hallGroup.add(plaque);

    this.scene.add(hallGroup);
  }

  /* ==========================================================================
     삼층석탑 및 주간 1위 대황금연등 제단
     ========================================================================== */
  buildStonePagodaAndShrine() {
    this.shrineGroup = new THREE.Group();
    this.shrineGroup.position.set(0, 0, -8);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x473f38, roughness: 0.85 });

    // 1. Two-tier Pagoda Base (하대석 & 상대석)
    const base1 = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.9, 6.4), stoneMat);
    base1.position.y = 0.45;
    base1.castShadow = true;
    base1.receiveShadow = true;
    this.shrineGroup.add(base1);

    const base2 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.8, 4.8), stoneMat);
    base2.position.y = 1.3;
    base2.castShadow = true;
    this.shrineGroup.add(base2);

    // 2. Three Pagoda Tiers (탑신 & 옥개석)
    for (let tier = 0; tier < 3; tier++) {
      const scale = 1.0 - tier * 0.22;
      const bodyH = 1.1 * scale;
      const bodyW = 2.4 * scale;
      const eaveW = 3.8 * scale;

      // Body stone (탑신석)
      const body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, bodyW), stoneMat);
      body.position.y = 1.7 + tier * 1.6 + bodyH / 2;
      body.castShadow = true;
      this.shrineGroup.add(body);

      // Eaves roof stone with upturned corners (옥개석)
      const eave = new THREE.Mesh(new THREE.ConeGeometry(eaveW, 0.65 * scale, 4), stoneMat);
      eave.rotation.y = Math.PI / 4;
      eave.position.y = 1.7 + tier * 1.6 + bodyH + 0.3;
      eave.castShadow = true;
      this.shrineGroup.add(eave);
    }

    // 3. Pagoda Finial Spire (상륜부 / 보주)
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.3, 1.8, 8), stoneMat);
    spire.position.y = 6.8;
    this.shrineGroup.add(spire);

    const jewelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, roughness: 0.3 });
    const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), jewelMat);
    jewel.position.y = 7.7;
    this.shrineGroup.add(jewel);

    // 4. Grand Golden Crown Lantern (주간 1위 소원 대황금연등)
    this.grandLantern = new THREE.Group();
    this.grandLantern.position.set(0, 10.2, 0);

    // Octagonal glowing body
    const bodyGeo = new THREE.CylinderGeometry(1.6, 1.4, 2.4, 8);
    const grandMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.85,
      roughness: 0.3,
      metalness: 0.4
    });
    const grandBody = new THREE.Mesh(bodyGeo, grandMat);
    this.grandLantern.add(grandBody);

    // Royal Golden Crown (금관) on top of the lantern
    const crownGroup = new THREE.Group();
    crownGroup.position.y = 1.5;
    const bandGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.4, 16, 1, true);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xffdf00, metalness: 0.9, roughness: 0.2 });
    const band = new THREE.Mesh(bandGeo, crownMat);
    crownGroup.add(band);

    // 4 Crown tree branches (출자형 입식)
    for (let c = 0; c < 4; c++) {
      const prong = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.1, 0.18), crownMat);
      const angle = (c * Math.PI) / 2;
      prong.position.set(Math.cos(angle) * 1.35, 0.65, Math.sin(angle) * 1.35);
      crownGroup.add(prong);
    }
    this.grandLantern.add(crownGroup);

    // Grand Light
    this.grandLight = new THREE.PointLight(0xffb703, 3.2, 35);
    this.grandLight.position.set(0, 0, 0);
    this.grandLantern.add(this.grandLight);

    // Ground Golden Proximity Ring
    const ringGeo = new THREE.RingGeometry(2.8, 3.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    this.shrineRing = new THREE.Mesh(ringGeo, ringMat);
    this.shrineRing.rotation.x = -Math.PI / 2;
    this.shrineRing.position.set(0, 0.05, 0);
    this.shrineGroup.add(this.shrineRing);

    this.shrineGroup.add(this.grandLantern);
    this.scene.add(this.shrineGroup);
  }

  /* ==========================================================================
     석등(Stone Lanterns) 및 연화지(Lotus Pond) & 홍예교(Bridge)
     ========================================================================== */
  buildStoneLanterns() {
    const lanternCoords = [
      { x: -5.5, z: 8 },
      { x: 5.5, z: 8 },
      { x: -6.5, z: -1 },
      { x: 6.5, z: -1 },
      { x: -7.5, z: -16 },
      { x: 7.5, z: -16 }
    ];

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x524b44, roughness: 0.85 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xff9922, emissive: 0xff7700, roughness: 0.2 });

    lanternCoords.forEach((pos) => {
      const slGroup = new THREE.Group();
      slGroup.position.set(pos.x, 0, pos.z);

      // Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.4, 8), stoneMat);
      base.position.y = 0.2;
      slGroup.add(base);

      // Pillar
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 8), stoneMat);
      pillar.position.y = 1.0;
      slGroup.add(pillar);

      // Firebox with glowing core
      const firebox = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), glowMat);
      firebox.position.y = 2.1;
      slGroup.add(firebox);

      // Roof stone
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.65, 8), stoneMat);
      roof.position.y = 2.8;
      slGroup.add(roof);

      // Warm PointLight
      const light = new THREE.PointLight(0xffa238, 1.1, 14);
      light.position.set(0, 2.1, 0);
      slGroup.add(light);

      this.scene.add(slGroup);
    });
  }

  buildLotusPondAndBridge() {
    // 1. Lotus Pond (연화지) on the Southern courtyard edge
    const pondGroup = new THREE.Group();
    pondGroup.position.set(0, 0, 26);

    const waterGeo = new THREE.BoxGeometry(48, 0.3, 16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x081c2c,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.05;
    pondGroup.add(water);

    // Stone border around pond
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.9 });
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(49, 0.4, 1.2), borderMat);
    b1.position.set(0, 0.2, -8.2);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(49, 0.4, 1.2), borderMat);
    b2.position.set(0, 0.2, 8.2);
    pondGroup.add(b1);
    pondGroup.add(b2);

    // Floating Lotus flowers & pads
    for (let l = 0; l < 18; l++) {
      const padGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 12);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });
      const pad = new THREE.Mesh(padGeo, padMat);
      const lx = (Math.random() - 0.5) * 42;
      const lz = (Math.random() - 0.5) * 12;
      if (Math.abs(lx) > 3.5) { // Leave space for bridge
        pad.position.set(lx, 0.22, lz);
        pondGroup.add(pad);

        // Lotus blossom
        const lotusGeo = new THREE.ConeGeometry(0.28, 0.35, 6);
        const lotusMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: 0.3 });
        const blossom = new THREE.Mesh(lotusGeo, lotusMat);
        blossom.position.set(lx, 0.38, lz);
        pondGroup.add(blossom);
      }
    }

    // 2. Stone Arch Bridge (홍예교 / 무지개 돌다리) across the pond
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, 0.3, 0);

    const bridgeDeck = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.45, 17.5),
      new THREE.MeshStandardMaterial({ color: 0x4a4138, roughness: 0.85 })
    );
    bridgeDeck.receiveShadow = true;
    bridgeDeck.castShadow = true;
    bridgeGroup.add(bridgeDeck);

    // Stone balustrade railings
    for (let side of [-2.4, 2.4]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.75, 17.5),
        new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.85 })
      );
      rail.position.set(side, 0.6, 0);
      bridgeGroup.add(rail);
    }
    pondGroup.add(bridgeGroup);

    this.scene.add(pondGroup);
  }

  /* ==========================================================================
     자연 경관 (소나무 & 대나무 숲 & 사찰 담장)
     ========================================================================== */
  buildPineTreesAndNature() {
    const treeCoords = [
      { x: -18, z: -10 },
      { x: 18, z: -10 },
      { x: -22, z: 6 },
      { x: 22, z: 6 },
      { x: -17, z: 22 },
      { x: 17, z: 22 },
      { x: -25, z: -28 },
      { x: 25, z: -28 }
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x452311, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x143e26, roughness: 0.7 });

    treeCoords.forEach((tc) => {
      const pine = new THREE.Group();
      pine.position.set(tc.x, 0, tc.z);

      // Curved trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 7.5, 8), trunkMat);
      trunk.position.set(0.3, 3.75, 0);
      trunk.rotation.z = -0.08;
      trunk.castShadow = true;
      pine.add(trunk);

      // Layered pine crowns
      for (let i = 0; i < 3; i++) {
        const crown = new THREE.Mesh(new THREE.ConeGeometry(3.6 - i * 0.7, 2.4, 8), leafMat);
        crown.position.set(0, 6.2 + i * 1.7, 0);
        crown.castShadow = true;
        pine.add(crown);
      }

      this.scene.add(pine);
    });

    // Temple Walls (토담 / 한옥 기와 담장) around courtyard
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x33261d, roughness: 0.9 });
    const tileMat = new THREE.MeshStandardMaterial({ color: 0x1c2128, roughness: 0.6 });

    for (let side of [-28, 28]) {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 70), wallMat);
      sideWall.position.set(side, 1.4, -4);
      sideWall.castShadow = true;
      sideWall.receiveShadow = true;
      this.scene.add(sideWall);

      const wallRoof = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 70.5), tileMat);
      wallRoof.position.set(side, 2.9, -4);
      this.scene.add(wallRoof);
    }
  }

  /* ==========================================================================
     3D 플레이어 캐릭터 (천명 도반 아바타)
     ========================================================================== */
  buildPlayerCharacter() {
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(this.player.x, 0, this.player.z);

    // 1. Hanbok Robe Body (도포 / 두루마기)
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.75, 1.85, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1b2d4f, // Midnight royal navy
      roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.25;
    body.castShadow = true;
    this.playerGroup.add(body);

    // White Hanbok collar (동정)
    const collarGeo = new THREE.TorusGeometry(0.44, 0.08, 8, 16);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 2.1, 0.05);
    collar.rotation.x = Math.PI / 3;
    this.playerGroup.add(collar);

    // 2. Head
    const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.8 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.45;
    head.castShadow = true;
    this.playerGroup.add(head);

    // 3. Korean Traditional Hat (흑립 / 갓)
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 2.75, 0);
    const gatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.25, 0.04, 24),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.3 })
    );
    hatGroup.add(gatBrim);
    const gatCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, 0.75, 16),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.3 })
    );
    gatCrown.position.y = 0.38;
    hatGroup.add(gatCrown);
    this.playerGroup.add(hatGroup);

    // 4. Legs (for walk animation)
    const legGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.75, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }); // Korean traditional posun (버선)

    this.player.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.player.leftLeg.position.set(-0.25, 0.38, 0);
    this.playerGroup.add(this.player.leftLeg);

    this.player.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.player.rightLeg.position.set(0.25, 0.38, 0);
    this.playerGroup.add(this.player.rightLeg);

    // 5. Hand-held Lantern (손등불)
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0.65, 1.2, 0.45);

    const lbody = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32, 1),
      new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff8800, emissiveIntensity: 0.9 })
    );
    lanternGroup.add(lbody);

    this.player.handLight = new THREE.PointLight(0xffb042, 1.8, 10);
    this.player.handLight.position.set(0, 0, 0);
    lanternGroup.add(this.player.handLight);

    this.playerGroup.add(lanternGroup);

    // 6. 3D Name Tag Sprite
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
     3D 소원 연등 초기화 및 생성
     ========================================================================== */
  initLanterns() {
    // Clear existing
    this.lanterns.forEach((l) => {
      if (l.group) this.scene.remove(l.group);
    });
    this.lanterns = [];

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
        { id: 101, category: "🌿 건강·장수", author: "어머니의 딸 김도반", text: "다음 주 어머니 큰 수술 무사히 잘 마치시고, 다시 환하게 웃으시며 온 가족 모여 따뜻한 밥상 함께할 수 있기를 간절히 기도합니다.", cheers: 284, date: "2026. 11. 22." },
        { id: 102, category: "🎓 시험·합격", author: "새벽별 임용고시생", text: "3년 동안 준비한 중등 임용고시, 이번에는 반드시 합격하여 아이들에게 온기를 전하는 교사가 되고 싶습니다.", cheers: 196, date: "2026. 11. 21." },
        { id: 103, category: "🏡 가족·화목", author: "두 아이의 가장", text: "우리 네 식구 아프지 않고 날마다 웃음꽃 피는 한 해가 되기를 소망합니다.", cheers: 153, date: "2026. 11. 20." }
      ];
    }

    // 3D coordinates graceful layout in temple courtyard (near player entrance & along path)
    const positions = [
      // Close to spawn / entrance for instant interaction
      { x: -3.8, y: 3.2, z: 12.5 },
      { x: 3.8, y: 3.4, z: 12.5 },
      { x: -5.2, y: 3.8, z: 5.5 },
      { x: 5.2, y: 3.6, z: 5.5 },
      { x: -4.2, y: 4.1, z: -2.5 },
      { x: 4.2, y: 3.9, z: -2.5 },

      // Around the stone pagoda & lotus pond
      { x: -8.5, y: 4.5, z: -8.0 },
      { x: 8.5, y: 4.4, z: -8.0 },
      { x: -11.0, y: 5.2, z: 18.0 },
      { x: 11.0, y: 5.0, z: 18.0 },
      { x: -14.0, y: 5.8, z: -15.0 },
      { x: 14.0, y: 5.6, z: -15.0 },
      { x: 0.0, y: 6.2, z: -22.0 }
    ];

    communityData.forEach((w, idx) => {
      const pos = positions[idx % positions.length];
      const offsetX = (idx >= positions.length) ? (Math.random() * 8 - 4) : 0;
      const offsetZ = (idx >= positions.length) ? (Math.random() * 8 - 4) : 0;
      const finalPos = {
        x: pos.x + offsetX,
        y: pos.y + Math.random() * 0.8,
        z: pos.z + offsetZ
      };

      const lanternObj = this.createLanternMesh(w, finalPos);
      this.lanterns.push(lanternObj);
    });

    this.updateHudCount();
  }

  createLanternMesh(wishData, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    // Color theme based on category
    let hexColor = 0xffa500;
    let emissiveColor = 0xff7700;
    const cat = wishData.category || "";
    if (cat.includes("건강")) {
      hexColor = 0x34d399; emissiveColor = 0x059669; // Emerald green
    } else if (cat.includes("시험") || cat.includes("합격")) {
      hexColor = 0xfde047; emissiveColor = 0xd97706; // Amber gold
    } else if (cat.includes("재물") || cat.includes("사업")) {
      hexColor = 0xfbbf24; emissiveColor = 0xb45309; // Rich gold
    } else if (cat.includes("애정") || cat.includes("인연")) {
      hexColor = 0xf472b6; emissiveColor = 0xdb2777; // Rose pink
    } else if (cat.includes("마음") || cat.includes("평안")) {
      hexColor = 0x818cf8; emissiveColor = 0x4f46e5; // Indigo violet
    }

    // Octagonal Hanji Lantern Body
    const bodyGeo = new THREE.CylinderGeometry(0.65, 0.55, 1.15, 8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: emissiveColor,
      emissiveIntensity: 0.72,
      map: this.textures.hanji,
      roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    // Dark wooden caps on top and bottom
    const capGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.08, 8);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.5 });
    const topCap = new THREE.Mesh(capGeo, capMat);
    topCap.position.y = 0.6;
    const botCap = new THREE.Mesh(capGeo, capMat);
    botCap.position.y = -0.6;
    group.add(topCap);
    group.add(botCap);

    // Hanging Wish Streamer (소원지)
    const streamerGeo = new THREE.PlaneGeometry(0.3, 0.95);
    const streamerCanvas = document.createElement("canvas");
    streamerCanvas.width = 64;
    streamerCanvas.height = 128;
    const sctx = streamerCanvas.getContext("2d");
    sctx.fillStyle = "#fffbeb";
    sctx.fillRect(0, 0, 64, 128);
    sctx.fillStyle = "#8c1d1d";
    sctx.font = "bold 18px 'Noto Serif KR', sans-serif";
    sctx.textAlign = "center";
    sctx.fillText("소", 32, 38);
    sctx.fillText("원", 32, 72);
    const streamerTex = new THREE.CanvasTexture(streamerCanvas);
    const streamerMat = new THREE.MeshBasicMaterial({
      map: streamerTex,
      side: THREE.DoubleSide,
      transparent: true
    });
    const streamer = new THREE.Mesh(streamerGeo, streamerMat);
    streamer.position.set(0, -1.15, 0);
    group.add(streamer);

    // Localized warm point light
    const pLight = new THREE.PointLight(hexColor, 1.2, 8.5);
    pLight.position.set(0, 0, 0);
    group.add(pLight);

    // 3D Category & Author label sprite
    const labelSprite = this.createWishLabelSprite(wishData);
    labelSprite.position.set(0, 1.15, 0);
    group.add(labelSprite);

    this.scene.add(group);

    return {
      id: wishData.id,
      category: wishData.category,
      author: wishData.author,
      text: wishData.text,
      cheers: wishData.cheers || 0,
      date: wishData.date || "2026. 11. 23.",
      group: group,
      streamer: streamer,
      pLight: pLight,
      baseY: pos.y,
      floatSpeed: 0.8 + Math.random() * 0.6,
      floatAmp: 0.35 + Math.random() * 0.2,
      floatOffset: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.4
    };
  }

  createWishLabelSprite(wishData) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(22, 14, 9, 0.82)";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 48, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fed7aa";
    ctx.font = "bold 15px 'Noto Serif KR', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${wishData.category} · ${wishData.author}`, 128, 32);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  }

  addPlayerNewLantern(newWish) {
    // Spawn near the player
    const spawnPos = {
      x: this.player.x + Math.sin(this.player.rotationY) * 2.2,
      y: 1.2,
      z: this.player.z + Math.cos(this.player.rotationY) * 2.2
    };

    const lanternObj = this.createLanternMesh(newWish, spawnPos);
    lanternObj.isNew = true;
    lanternObj.targetY = 4.0 + Math.random() * 1.5;
    this.lanterns.unshift(lanternObj);

    this.updateHudCount();
    this.showToast("🏮 도반님의 소원 연등이 은하수 사찰 광장 밤하늘에 띄워졌습니다!");

    // Save to localStorage
    try {
      const serializable = this.lanterns.map((l) => ({
        id: l.id,
        category: l.category,
        author: l.author,
        text: l.text,
        cheers: l.cheers,
        date: l.date
      }));
      localStorage.setItem("chunmyung_community_wishes", JSON.stringify(serializable));
    } catch (e) {}
  }

  cheerLantern(wishId) {
    const lantern = this.lanterns.find((l) => l.id === wishId);
    if (!lantern) return;

    lantern.cheers = (lantern.cheers || 0) + 1;

    // Save cheered IDs in localStorage
    try {
      let cheeredIds = JSON.parse(localStorage.getItem("chunmyung_cheered_wish_ids") || "[]");
      if (!cheeredIds.includes(wishId)) cheeredIds.push(wishId);
      localStorage.setItem("chunmyung_cheered_wish_ids", JSON.stringify(cheeredIds));
    } catch (e) {}

    // Update modal UI elements if opened
    const countEl = document.getElementById("wishDetailCheerCount");
    const cheerBtn = document.getElementById("wishDetailCheerBtn");
    if (countEl) countEl.textContent = lantern.cheers;
    if (cheerBtn) {
      cheerBtn.innerHTML = `<span>❤️</span><span>응원 완료</span><span class="ml-1 px-1.5 py-0.5 rounded-full bg-stone-900 text-[10px]">${lantern.cheers}</span>`;
      cheerBtn.className = "px-4 py-2 rounded-xl bg-[#8c1d1d] text-[#ffe8b3] font-bold border border-[#f59e0b] shadow flex items-center space-x-1.5 text-xs";
    }

    // Spawn 3D sparkle fireworks particles around the lantern
    this.spawnCheerSparkles(lantern.group.position);

    // Confetti if available
    if (typeof confetti === "function") {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    this.showToast(`✨ [${lantern.author}] 님께 따뜻한 응원을 보냈습니다!`);
  }

  spawnCheerSparkles(pos) {
    const particleCount = 28;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y + 0.5;
      positions[i * 3 + 2] = pos.z;

      velocities.push(
        (Math.random() - 0.5) * 4.5,
        Math.random() * 4.2 + 1.5,
        (Math.random() - 0.5) * 4.5
      );
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffe066,
      size: 0.35,
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
     입력 이벤트 (WASD / 방향키 / 마우스 3D 드래그 & 클릭)
     ========================================================================== */
  bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (!this.isRunning) return;

      const code = e.code;
      const key = e.key.toLowerCase();

      // W, S, A, D & Arrow Keys
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
      if (code === "KeyW" || code === "ArrowUp") this.keys.up = false;
      if (code === "KeyS" || code === "ArrowDown") this.keys.down = false;
      if (code === "KeyA" || code === "ArrowLeft") this.keys.left = false;
      if (code === "KeyD" || code === "ArrowRight") this.keys.right = false;
    });

    // Mouse drag for 3D Camera Orbit
    if (this.canvas) {
      this.canvas.addEventListener("mousedown", (e) => {
        if (!this.isRunning) return;
        this.cameraOrbit.isDragging = true;
        this.cameraOrbit.prevMouseX = e.clientX;
        this.cameraOrbit.prevMouseY = e.clientY;
        this.hasDragged = false;
      });

      window.addEventListener("mousemove", (e) => {
        if (!this.isRunning || !this.cameraOrbit.isDragging) return;

        const deltaX = e.clientX - this.cameraOrbit.prevMouseX;
        const deltaY = e.clientY - this.cameraOrbit.prevMouseY;

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          this.hasDragged = true;
        }

        this.cameraOrbit.azimuth -= deltaX * 0.006;
        this.cameraOrbit.elevation = Math.max(
          0.12,
          Math.min(1.25, this.cameraOrbit.elevation + deltaY * 0.005)
        );

        this.cameraOrbit.prevMouseX = e.clientX;
        this.cameraOrbit.prevMouseY = e.clientY;
      });

      window.addEventListener("mouseup", () => {
        this.cameraOrbit.isDragging = false;
      });

      // Canvas click (Raycasting to click on Lanterns or walk to ground)
      this.canvas.addEventListener("click", (e) => {
        if (!this.isRunning || this.hasDragged) return;

        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 1. Check if clicked Grand Pagoda / Lantern
        if (this.grandLantern) {
          const grandHits = this.raycaster.intersectObjects(this.grandLantern.children, true);
          if (grandHits.length > 0) {
            this.showWeeklyTopModal();
            return;
          }
        }

        // 2. Check if clicked a floating wish lantern
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

        // 3. Click to walk to ground position
        const groundHits = this.raycaster.intersectObjects(this.scene.children, false);
        for (const hit of groundHits) {
          if (hit.point && Math.abs(hit.point.y) < 0.5) {
            this.player.targetX = hit.point.x;
            this.player.targetZ = hit.point.z;
            break;
          }
        }
      });

      // Mouse wheel zoom
      this.canvas.addEventListener("wheel", (e) => {
        if (!this.isRunning) return;
        this.cameraOrbit.distance = Math.max(
          7.0,
          Math.min(32.0, this.cameraOrbit.distance + e.deltaY * 0.015)
        );
      });

      // Touch events for mobile
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
          0.12,
          Math.min(1.25, this.cameraOrbit.elevation + dy * 0.007)
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
    if (this.isNearShrine) {
      this.showWeeklyTopModal();
    } else if (this.nearbyLantern) {
      this.showWishDetailModal(this.nearbyLantern);
    } else {
      // Find closest lantern if any within generous range
      let closest = null;
      let minD = 8.5;
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

  updateHudCount() {
    const countEl = document.getElementById("wishPlazaTotalCount");
    if (countEl) {
      countEl.textContent = this.lanterns.length;
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
    // 1. Calculate movement relative to Camera View
    // Camera forward vector projected on XZ plane
    const camForward = new THREE.Vector3();
    this.camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDir = new THREE.Vector3(0, 0, 0);
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

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
      this.player.x += moveDir.x * this.player.speed * dt;
      this.player.z += moveDir.z * this.player.speed * dt;

      // Restrict player inside temple courtyard
      this.player.x = Math.max(-25, Math.min(25, this.player.x));
      this.player.z = Math.max(-30, Math.min(32, this.player.z));

      // Character facing direction
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      // Smooth rotation
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

    // Apply player position & rotation
    if (this.playerGroup) {
      this.playerGroup.position.set(this.player.x, 0, this.player.z);
      this.playerGroup.rotation.y = this.player.rotationY;

      // Leg swing animation when walking
      if (this.player.leftLeg && this.player.rightLeg) {
        if (this.player.isMoving) {
          this.player.leftLeg.rotation.x = Math.sin(this.player.walkPhase) * 0.45;
          this.player.rightLeg.rotation.x = -Math.sin(this.player.walkPhase) * 0.45;
        } else {
          this.player.leftLeg.rotation.x = 0;
          this.player.rightLeg.rotation.x = 0;
        }
      }
    }

    // 2. Camera follow (Third-Person Orbit)
    const orbitDist = this.cameraOrbit.distance;
    const elev = this.cameraOrbit.elevation;
    const azim = this.cameraOrbit.azimuth;

    const camX = this.player.x + orbitDist * Math.cos(elev) * Math.sin(azim);
    const camY = Math.max(1.5, orbitDist * Math.sin(elev));
    const camZ = this.player.z + orbitDist * Math.cos(elev) * Math.cos(azim);

    // Damped camera movement
    this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.15);
    this.camera.lookAt(this.player.x, 1.8, this.player.z);

    // 3. Floating lanterns bobbing & sway
    this.lanterns.forEach((l) => {
      // Bobbing
      l.group.position.y = l.baseY + Math.sin(elapsedTime * l.floatSpeed + l.floatOffset) * l.floatAmp;
      l.group.rotation.y += l.rotSpeed * dt;

      // Streamer sway
      if (l.streamer) {
        l.streamer.rotation.z = Math.sin(elapsedTime * 2.5 + l.floatOffset) * 0.12;
      }

      // Smooth rise if new
      if (l.isNew && l.baseY < l.targetY) {
        l.baseY += dt * 0.9;
        if (l.baseY >= l.targetY) l.isNew = false;
      }
    });

    // 4. Grand Golden Lantern Rotation & Crown Glow
    if (this.grandLantern) {
      this.grandLantern.rotation.y += 0.015;
      this.grandLantern.position.y = 10.2 + Math.sin(elapsedTime * 1.5) * 0.4;
    }
    if (this.shrineRing) {
      this.shrineRing.rotation.z += 0.01;
    }

    // 5. Proximity check
    this.nearbyLantern = null;
    let closestDist = 5.2;

    for (const l of this.lanterns) {
      const d = Math.hypot(l.group.position.x - this.player.x, l.group.position.z - this.player.z);
      if (d < closestDist) {
        closestDist = d;
        this.nearbyLantern = l;
      }
    }

    // Pagoda shrine proximity
    const distToPagoda = Math.hypot(0 - this.player.x, -8 - this.player.z);
    this.isNearShrine = distToPagoda < 5.8;

    // 6. Shooting star periodic spawn
    if (elapsedTime - this.lastShootingStarTime > 4.5 && Math.random() < 0.4) {
      this.lastShootingStarTime = elapsedTime;
      this.spawnShootingStar();
    }

    // Update shooting stars
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

    // Update cheer sparkle particles
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
