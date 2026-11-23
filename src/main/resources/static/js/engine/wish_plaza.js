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
      elevation: 0.32,      // Vertical angle (radians) - pitch
      distance: 16.0,       // Distance from player
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
     대형 한국 전통 사찰 대웅전 (중층 전각 天命殿) - 크기 대폭 확장
     ========================================================================== */
  buildGrandTempleHall() {
    const hallGroup = new THREE.Group();
    hallGroup.position.set(0, 0, -48);

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.9 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x221711, roughness: 0.8 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x851717, roughness: 0.6 }); // Dancheong Vermilion
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x182028, roughness: 0.72, metalness: 0.25 }); // Korean Clay Tile

    // 1. Double-deck Stone Platform (기단 & 월대) - Width: 60m, Depth: 38m
    const lowerPlatform = new THREE.Mesh(new THREE.BoxGeometry(64, 2.0, 42), stoneMat);
    lowerPlatform.position.y = 1.0;
    lowerPlatform.castShadow = true;
    lowerPlatform.receiveShadow = true;
    hallGroup.add(lowerPlatform);

    const upperPlatform = new THREE.Mesh(new THREE.BoxGeometry(56, 1.8, 34), stoneMat);
    upperPlatform.position.y = 2.9;
    upperPlatform.castShadow = true;
    upperPlatform.receiveShadow = true;
    hallGroup.add(upperPlatform);

    // Grand Ceremonial Stairs (중앙 대석계단)
    for (let i = 0; i < 7; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(16 - i * 0.7, 0.45, 1.3), stoneMat);
      step.position.set(0, 0.22 + i * 0.45, 17.2 + (6 - i) * 0.9);
      step.castShadow = true;
      step.receiveShadow = true;
      hallGroup.add(step);
    }

    // 2 Guardian Stone Lions (해태/사자상) flanking the stairs
    for (let s of [-9.2, 9.2]) {
      const lionBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 2.2), stoneMat);
      lionBase.position.set(s, 0.6, 21.0);
      hallGroup.add(lionBase);

      const lionBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.8, 1.6), stoneMat);
      lionBody.position.set(s, 2.1, 21.0);
      hallGroup.add(lionBody);

      const lionHead = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), stoneMat);
      lionHead.position.set(s, 3.2, 21.2);
      hallGroup.add(lionHead);
    }

    // 2. First Floor Hall (1층 대전각) - Width: 50m, Height: 12m, Depth: 28m
    const lowerWalls = new THREE.Mesh(new THREE.BoxGeometry(50, 11.5, 28), wallMat);
    lowerWalls.position.y = 3.8 + 5.75;
    lowerWalls.castShadow = true;
    lowerWalls.receiveShadow = true;
    hallGroup.add(lowerWalls);

    // Traditional Paper Lattice Doors (꽃살 창호문 9쌍 with warm inner glow)
    for (let d = -4; d <= 4; d++) {
      const doorGeo = new THREE.PlaneGeometry(3.6, 8.5);
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
        emissiveIntensity: 0.48,
        roughness: 0.55
      });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(d * 5.0, 8.2, 14.1);
      hallGroup.add(door);
    }

    // Front Colonnade Pillars (1층 배흘림 기둥 12기)
    for (let p = -5; p <= 5; p++) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 12.0, 16), pillarMat);
      pillar.position.set(p * 4.8, 9.8, 14.4);
      pillar.castShadow = true;
      hallGroup.add(pillar);
    }

    // Lower Dancheong Bracket System (1층 다포계 공포)
    const lowerBracket = new THREE.Mesh(new THREE.BoxGeometry(54, 1.4, 32), new THREE.MeshStandardMaterial({
      map: this.textures.dancheong,
      roughness: 0.5
    }));
    lowerBracket.position.y = 15.5;
    hallGroup.add(lowerBracket);

    // Lower Eave Roof (1층 기와 처마)
    const lowerRoof = new THREE.Mesh(new THREE.ConeGeometry(42, 7.5, 4, 1), roofMat);
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.scale.set(1.25, 0.65, 0.88);
    lowerRoof.position.y = 19.5;
    lowerRoof.castShadow = true;
    hallGroup.add(lowerRoof);

    // 3. Second Floor Hall (중층 2층 전각) - Width: 36m, Height: 9.5m, Depth: 20m
    const upperWalls = new THREE.Mesh(new THREE.BoxGeometry(36, 9.0, 20), wallMat);
    upperWalls.position.y = 23.5;
    upperWalls.castShadow = true;
    upperWalls.receiveShadow = true;
    hallGroup.add(upperWalls);

    // Upper Dancheong Bracket System (2층 공포)
    const upperBracket = new THREE.Mesh(new THREE.BoxGeometry(39, 1.2, 23), new THREE.MeshStandardMaterial({
      map: this.textures.dancheong,
      roughness: 0.5
    }));
    upperBracket.position.y = 28.5;
    hallGroup.add(upperBracket);

    // Upper Grand Hip-and-Gable Roof (2층 팔작지붕) - Height: 38m!
    const upperRoof = new THREE.Mesh(new THREE.ConeGeometry(32, 9.8, 4, 1), roofMat);
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.scale.set(1.18, 0.72, 0.82);
    upperRoof.position.y = 33.2;
    upperRoof.castShadow = true;
    hallGroup.add(upperRoof);

    // Golden Dragon Ridge & Chiwi (치미 / 용마루 장식)
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0xd4a359, metalness: 0.65, roughness: 0.28 });
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(36, 0.95, 1.1), ridgeMat);
    ridge.position.set(0, 38.2, 0);
    hallGroup.add(ridge);

    // 4. Grand Golden Temple Plaque (현판: 天 命 殿)
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
    const plaqueGeo = new THREE.PlaneGeometry(8.5, 3.2);
    const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.35 });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, 14.8, 16.3);
    hallGroup.add(plaque);

    this.scene.add(hallGroup);
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
     3D 플레이어 캐릭터
     ========================================================================== */
  buildPlayerCharacter() {
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(this.player.x, this.player.y, this.player.z);

    // 1. Hanbok Robe Body (도포)
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.75, 1.85, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1b2d4f, roughness: 0.7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.25;
    body.castShadow = true;
    this.playerGroup.add(body);

    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.08, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    collar.position.set(0, 2.1, 0.05);
    collar.rotation.x = Math.PI / 3;
    this.playerGroup.add(collar);

    // 2. Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.8 })
    );
    head.position.y = 2.45;
    head.castShadow = true;
    this.playerGroup.add(head);

    // 3. Korean Traditional Hat (갓)
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

    // 4. Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.75, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    this.player.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.player.leftLeg.position.set(-0.25, 0.38, 0);
    this.playerGroup.add(this.player.leftLeg);

    this.player.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.player.rightLeg.position.set(0.25, 0.38, 0);
    this.playerGroup.add(this.player.rightLeg);

    // 5. Hand Lantern
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0.65, 1.2, 0.45);
    const lbody = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32, 1),
      new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff8800, emissiveIntensity: 0.9 })
    );
    lanternGroup.add(lbody);
    this.player.handLight = new THREE.PointLight(0xffb042, 1.8, 12);
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

    const positions = [
      { x: -4.5, y: 3.5, z: 12.5 },
      { x: 4.5, y: 3.6, z: 12.5 },
      { x: -6.5, y: 4.1, z: 5.5 },
      { x: 6.5, y: 3.9, z: 5.5 },
      { x: -5.5, y: 4.5, z: -3.5 },
      { x: 5.5, y: 4.3, z: -3.5 },
      { x: -11.0, y: 5.2, z: -10.0 },
      { x: 11.0, y: 5.0, z: -10.0 },
      { x: -14.0, y: 5.8, z: 20.0 },
      { x: 14.0, y: 5.6, z: 20.0 },
      { x: -18.0, y: 6.2, z: -18.0 },
      { x: 18.0, y: 6.0, z: -18.0 },
      { x: 0.0, y: 7.2, z: -28.0 }
    ];

    communityData.forEach((w, idx) => {
      const pos = positions[idx % positions.length];
      const offsetX = (idx >= positions.length) ? (Math.random() * 10 - 5) : 0;
      const offsetZ = (idx >= positions.length) ? (Math.random() * 10 - 5) : 0;
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

    let hexColor = 0xffa500;
    let emissiveColor = 0xff7700;
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

    const bodyGeo = new THREE.CylinderGeometry(0.75, 0.65, 1.35, 8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: emissiveColor,
      emissiveIntensity: 0.75,
      map: this.textures.hanji,
      roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    const capGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.1, 8);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.5 });
    const topCap = new THREE.Mesh(capGeo, capMat);
    topCap.position.y = 0.72;
    const botCap = new THREE.Mesh(capGeo, capMat);
    botCap.position.y = -0.72;
    group.add(topCap);
    group.add(botCap);

    // Hanging Wish Streamer (소원지)
    const streamerGeo = new THREE.PlaneGeometry(0.35, 1.1);
    const streamerCanvas = document.createElement("canvas");
    streamerCanvas.width = 64;
    streamerCanvas.height = 128;
    const sctx = streamerCanvas.getContext("2d");
    sctx.fillStyle = "#fffbeb";
    sctx.fillRect(0, 0, 64, 128);
    sctx.fillStyle = "#8c1d1d";
    sctx.font = "bold 20px 'Noto Serif KR', sans-serif";
    sctx.textAlign = "center";
    sctx.fillText("소", 32, 42);
    sctx.fillText("원", 32, 82);
    const streamerTex = new THREE.CanvasTexture(streamerCanvas);
    const streamerMat = new THREE.MeshBasicMaterial({
      map: streamerTex,
      side: THREE.DoubleSide,
      transparent: true
    });
    const streamer = new THREE.Mesh(streamerGeo, streamerMat);
    streamer.position.set(0, -1.35, 0);
    group.add(streamer);

    const pLight = new THREE.PointLight(hexColor, 1.4, 10.0);
    group.add(pLight);

    const labelSprite = this.createWishLabelSprite(wishData);
    labelSprite.position.set(0, 1.35, 0);
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
      floatAmp: 0.4 + Math.random() * 0.25,
      floatOffset: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.4
    };
  }

  createWishLabelSprite(wishData) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(22, 14, 9, 0.85)";
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
    sprite.scale.set(2.6, 0.65, 1);
    return sprite;
  }

  addPlayerNewLantern(newWish) {
    const spawnPos = {
      x: this.player.x + Math.sin(this.player.rotationY) * 2.5,
      y: 1.5,
      z: this.player.z + Math.cos(this.player.rotationY) * 2.5
    };

    const lanternObj = this.createLanternMesh(newWish, spawnPos);
    lanternObj.isNew = true;
    lanternObj.targetY = 4.8 + Math.random() * 1.8;
    this.lanterns.unshift(lanternObj);

    this.updateHudCount();
    this.showToast("🏮 도반님의 소원 연등이 은하수 사찰 광장 밤하늘에 띄워졌습니다!");

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

    if (typeof confetti === "function") {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }

    this.showToast(`✨ [${lantern.author}] 님께 따뜻한 응원을 보냈습니다!`);
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

    // Mouse Controls for 360 Look (위, 아래, 양옆 자유 시점)
    if (this.canvas) {
      this.canvas.addEventListener("mousedown", (e) => {
        if (!this.isRunning) return;
        this.cameraOrbit.isDragging = true;
        this.cameraOrbit.prevMouseX = e.clientX;
        this.cameraOrbit.prevMouseY = e.clientY;
        this.hasDragged = false;
      });

      let lastMoveX = null;
      let lastMoveY = null;

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
          if (Math.abs(dx) > 2 || Math.abs(dy) > 2) this.hasDragged = true;
        } else if (e.target === this.canvas && lastMoveX !== null && lastMoveY !== null) {
          // Free look when cursor moves over canvas
          dx = (e.clientX - lastMoveX) * 0.75;
          dy = (e.clientY - lastMoveY) * 0.75;
        }

        lastMoveX = e.clientX;
        lastMoveY = e.clientY;

        if (dx !== 0 || dy !== 0) {
          // Look Left / Right (양옆)
          this.cameraOrbit.azimuth -= dx * 0.0055;
          // Look Up / Down (위, 아래) - expanded range to look straight up at sky/moon and down
          this.cameraOrbit.elevation = Math.max(
            -0.30,
            Math.min(1.48, this.cameraOrbit.elevation + dy * 0.005)
          );
        }
      });

      window.addEventListener("mouseup", () => {
        this.cameraOrbit.isDragging = false;
      });

      // Canvas click (Raycast to click on Lanterns or Pagoda)
      this.canvas.addEventListener("click", (e) => {
        if (!this.isRunning || this.hasDragged) return;

        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

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
          if (hit.point && Math.abs(hit.point.y) < 0.6) {
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
    if (this.isNearShrine) {
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
    // 1. Jump Physics Update
    if (!this.player.isGrounded) {
      this.player.y += this.player.vy * dt;
      this.player.vy -= this.player.gravity * dt;
      if (this.player.y <= 0) {
        this.player.y = 0;
        this.player.vy = 0;
        this.player.isGrounded = true;
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

      // Temple boundaries
      this.player.x = Math.max(-38, Math.min(38, this.player.x));
      this.player.z = Math.max(-42, Math.min(38, this.player.z));

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

    // Apply player position & rotation
    if (this.playerGroup) {
      this.playerGroup.position.set(this.player.x, this.player.y, this.player.z);
      this.playerGroup.rotation.y = this.player.rotationY;

      if (this.player.leftLeg && this.player.rightLeg) {
        if (!this.player.isGrounded) {
          // Jumping pose
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
    }

    // 3. Camera Follow (Up/Down/Left/Right Orbit around player)
    const orbitDist = this.cameraOrbit.distance;
    const elev = this.cameraOrbit.elevation;
    const azim = this.cameraOrbit.azimuth;

    const camX = this.player.x + orbitDist * Math.cos(elev) * Math.sin(azim);
    const camY = Math.max(1.2, this.player.y + orbitDist * Math.sin(elev));
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

    // 6. Proximity check
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

    // 7. Shooting stars
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

    // 8. Cheer sparkle particles
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
