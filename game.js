/**
 * CYBER ARENA - Jogo de Ação e Sobrevivência em Arena Única
 * 100% Vanilla JavaScript - Canvas 2D + Web Audio API
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SISTEMA DE ÁUDIO PROCEDURAL (Web Audio API)
     Gera efeitos sonoros sem depender de arquivos externos ou falhas de rede.
     ========================================================================== */
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('cyber_arena_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('cyber_arena_muted', this.muted);
      return this.muted;
    }

    playShoot() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    playHit() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {}
    }

    playExplosion(heavy = false) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const dur = heavy ? 0.45 : 0.28;

        // Buffer de ruído branco
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(heavy ? 350 : 600, now);
        filter.frequency.linearRampToValueAtTime(30, now + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(heavy ? 0.35 : 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + dur);
      } catch (e) {}
    }

    playPowerup() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          gain.gain.setValueAtTime(0.18, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.08);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.06);
          osc.stop(now + (idx + 1) * 0.08);
        });
      } catch (e) {}
    }

    playDash() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {}
    }

    playBomb() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.7);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.7);
      } catch (e) {}
    }

    playGameOver() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [320, 290, 240, 180];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);

          gain.gain.setValueAtTime(0.2, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.01, now + (idx + 1) * 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.18);
          osc.stop(now + (idx + 1) * 0.2);
        });
      } catch (e) {}
    }
  }

  /* ==========================================================================
     2. GERENCIADOR DE ENTRADA (Teclado, Mouse e Toque Mobile)
     ========================================================================== */
  class InputManager {
    constructor(canvas) {
      this.canvas = canvas;
      this.keys = {};
      this.mouse = { x: 0, y: 0, isDown: false, isMoving: false };
      this.touchMove = { x: 0, y: 0, active: false };
      this.isTouchDevice = false;

      // Callbacks
      this.onDash = null;
      this.onBomb = null;

      this.initKeyboard();
      this.initMouse();
      this.initTouch();
    }

    initKeyboard() {
      window.addEventListener('keydown', (e) => {
        this.keys[e.code] = true;
        if (e.code === 'Space') {
          e.preventDefault();
          if (this.onDash) this.onDash();
        }
        if (e.code === 'KeyE' || e.code === 'KeyQ') {
          e.preventDefault();
          if (this.onBomb) this.onBomb();
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
      });
    }

    initMouse() {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.isMoving = true;
      });

      this.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          this.mouse.isDown = true;
        } else if (e.button === 2) {
          e.preventDefault();
          if (this.onDash) this.onDash();
        }
      });

      window.addEventListener('mouseup', () => {
        this.mouse.isDown = false;
      });

      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    initTouch() {
      const joystickZone = document.getElementById('joystick-zone');
      const joystickBase = document.getElementById('joystick-base');
      const joystickKnob = document.getElementById('joystick-knob');
      const btnDash = document.getElementById('btn-touch-dash');
      const btnBomb = document.getElementById('btn-touch-bomb');

      let touchId = null;
      let baseCenter = { x: 0, y: 0 };
      const maxRadius = 45;

      const handleTouchStart = (e) => {
        this.isTouchDevice = true;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (touchId === null) {
            touchId = t.identifier;
            const rect = joystickBase.getBoundingClientRect();
            baseCenter = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            };
            this.updateJoystick(t.clientX, t.clientY, baseCenter, maxRadius, joystickKnob);
          }
        }
      };

      const handleTouchMove = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            this.updateJoystick(t.clientX, t.clientY, baseCenter, maxRadius, joystickKnob);
          }
        }
      };

      const handleTouchEnd = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            touchId = null;
            this.touchMove.x = 0;
            this.touchMove.y = 0;
            this.touchMove.active = false;
            joystickKnob.style.transform = `translate(0px, 0px)`;
          }
        }
      };

      joystickZone.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });
      window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

      // Botões touch
      btnDash.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.isTouchDevice = true;
        if (this.onDash) this.onDash();
      });

      btnBomb.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.isTouchDevice = true;
        if (this.onBomb) this.onBomb();
      });
    }

    updateJoystick(clientX, clientY, baseCenter, maxRadius, knob) {
      let dx = clientX - baseCenter.x;
      let dy = clientY - baseCenter.y;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      knob.style.transform = `translate(${dx}px, ${dy}px)`;

      this.touchMove.x = dx / maxRadius;
      this.touchMove.y = dy / maxRadius;
      this.touchMove.active = dist > 6;
    }

    getMovementVector() {
      let vx = 0;
      let vy = 0;

      // Teclado
      if (this.keys['KeyW'] || this.keys['ArrowUp']) vy -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) vy += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) vx -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) vx += 1;

      // Normaliza teclado
      if (vx !== 0 && vy !== 0) {
        const len = Math.hypot(vx, vy);
        vx /= len;
        vy /= len;
      }

      // Toque prevalece se ativo
      if (this.touchMove.active) {
        vx = this.touchMove.x;
        vy = this.touchMove.y;
      }

      return { x: vx, y: vy };
    }
  }

  /* ==========================================================================
     3. SISTEMA DE PARTÍCULAS E EFEITOS VISUAIS
     ========================================================================== */
  class Particle {
    constructor(x, y, vx, vy, color, size, life, glow = true) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.size = size;
      this.maxLife = life;
      this.life = life;
      this.glow = glow;
    }

    update(dt) {
      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.life -= dt;
      return this.life > 0;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      if (this.glow) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.size * alpha), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class FloatingText {
    constructor(text, x, y, color, size = 16) {
      this.text = text;
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = size;
      this.life = 0.9;
      this.maxLife = 0.9;
    }

    update(dt) {
      this.y -= 35 * dt;
      this.life -= dt;
      return this.life > 0;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${this.size}px 'Orbitron', sans-serif`;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  class Shockwave {
    constructor(x, y, maxRadius, color) {
      this.x = x;
      this.y = y;
      this.radius = 5;
      this.maxRadius = maxRadius;
      this.color = color;
      this.life = 0.45;
      this.maxLife = 0.45;
    }

    update(dt) {
      this.life -= dt;
      const progress = 1 - (this.life / this.maxLife);
      this.radius = 5 + progress * (this.maxRadius - 5);
      return this.life > 0;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 4 * alpha;
      ctx.shadowBlur = 14;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ==========================================================================
     4. ENTIDADES: JOGADOR, PROJÉTEIS, INIMIGOS E ITENS
     ========================================================================== */

  // PROJÉTIL
  class Bullet {
    constructor(x, y, angle, speed, damage, isPlayer = true, color = '#00f3ff') {
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.speed = speed;
      this.angle = angle;
      this.damage = damage;
      this.isPlayer = isPlayer;
      this.color = color;
      this.radius = isPlayer ? 4 : 5;
      this.life = 2.2;
    }

    update(dt, width, height) {
      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;
      this.life -= dt;

      // Colisão com bordas da arena
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        return false;
      }
      return this.life > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;

      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Traço de laser aerodinâmico
      ctx.beginPath();
      ctx.roundRect(-8, -2.5, 16, 5, 2.5);
      ctx.fill();

      // Centro brilhante
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -1, 8, 2);

      ctx.restore();
    }
  }

  // JOGADOR
  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.radius = 16;
      this.speed = 4.8;
      this.friction = 0.88;
      this.angle = 0;

      // Atributos de Vida & Defesa
      this.maxHp = 100;
      this.hp = 100;
      this.shield = 0;
      this.maxShield = 50;
      this.invulnerableTimer = 0;

      // Disparo
      this.fireCooldown = 0;
      this.baseFireRate = 0.16; // segundos entre tiros
      this.bulletDamage = 25;
      this.tripleShotTimer = 0;
      this.overdriveTimer = 0;

      // Dash (Esquiva)
      this.dashCooldown = 0;
      this.dashMaxCooldown = 1.4;
      this.dashDuration = 0;
      this.isDashing = false;

      // Bombas EMP
      this.bombs = 1;
      this.maxBombs = 3;

      // Estatísticas da partida
      this.score = 0;
      this.kills = 0;
    }

    dash() {
      if (this.dashCooldown <= 0) {
        this.dashCooldown = this.dashMaxCooldown;
        this.dashDuration = 0.18;
        this.isDashing = true;
        this.invulnerableTimer = 0.25;

        // Impulso forte na direção do movimento ou mira
        let dirX = this.vx;
        let dirY = this.vy;
        if (Math.hypot(dirX, dirY) < 0.1) {
          dirX = Math.cos(this.angle);
          dirY = Math.sin(this.angle);
        } else {
          const l = Math.hypot(dirX, dirY);
          dirX /= l;
          dirY /= l;
        }

        this.vx = dirX * 14;
        this.vy = dirY * 14;
        return true;
      }
      return false;
    }

    takeDamage(amount) {
      if (this.invulnerableTimer > 0 || this.isDashing) return false;

      let remaining = amount;
      if (this.shield > 0) {
        if (this.shield >= remaining) {
          this.shield -= remaining;
          remaining = 0;
        } else {
          remaining -= this.shield;
          this.shield = 0;
        }
      }

      this.hp -= remaining;
      this.invulnerableTimer = 0.7; // i-frames
      return true;
    }

    update(dt, input, width, height, particles) {
      // Cooldowns
      if (this.dashCooldown > 0) this.dashCooldown -= dt;
      if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
      if (this.fireCooldown > 0) this.fireCooldown -= dt;
      if (this.tripleShotTimer > 0) this.tripleShotTimer -= dt;
      if (this.overdriveTimer > 0) this.overdriveTimer -= dt;

      if (this.dashDuration > 0) {
        this.dashDuration -= dt;
        if (this.dashDuration <= 0) this.isDashing = false;
      }

      // Movimentação
      const move = input.getMovementVector();
      let currentSpeed = this.speed;
      if (this.overdriveTimer > 0) currentSpeed *= 1.35;

      if (!this.isDashing) {
        this.vx += move.x * currentSpeed * 0.35;
        this.vy += move.y * currentSpeed * 0.35;
        this.vx *= this.friction;
        this.vy *= this.friction;
      }

      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;

      // Confinar dentro da arena
      const padding = this.radius + 6;
      if (this.x < padding) { this.x = padding; this.vx = 0; }
      if (this.x > width - padding) { this.x = width - padding; this.vx = 0; }
      if (this.y < padding) { this.y = padding; this.vy = 0; }
      if (this.y > height - padding) { this.y = height - padding; this.vy = 0; }

      // Rastro do propulsor (partículas)
      if (Math.hypot(this.vx, this.vy) > 0.8 && Math.random() < 0.6) {
        const backAngle = this.angle + Math.PI + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 2 + 1;
        const pColor = this.isDashing ? '#00f3ff' : (this.overdriveTimer > 0 ? '#ffb800' : '#00f3ff');
        particles.push(new Particle(
          this.x - Math.cos(this.angle) * 12,
          this.y - Math.sin(this.angle) * 12,
          Math.cos(backAngle) * speed,
          Math.sin(backAngle) * speed,
          pColor,
          this.isDashing ? 4 : 2.5,
          0.3,
          true
        ));
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Efeito de piscar na invulnerabilidade
      if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Aura de Escudo
      if (this.shield > 0) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Corpo da Nave Cyber
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.overdriveTimer > 0 ? '#ffb800' : '#00f3ff';

      // Asas laterais
      ctx.fillStyle = '#0a192f';
      ctx.strokeStyle = this.overdriveTimer > 0 ? '#ffb800' : '#00f3ff';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(18, 0);               // Nariz
      ctx.lineTo(-14, -13);            // Asa Esquerda
      ctx.lineTo(-8, 0);               // Traseira central
      ctx.lineTo(-14, 13);             // Asa Direita
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit / Núcleo de Energia
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.arc(2, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // TIPOS DE INIMIGOS
  const ENEMY_TYPES = {
    DRONE: {
      name: 'drone',
      hp: 35,
      speed: 2.7,
      score: 100,
      color: '#ff0055',
      radius: 12,
      shape: 'triangle'
    },
    BRUISER: {
      name: 'bruiser',
      hp: 120,
      speed: 1.4,
      score: 280,
      color: '#b026ff',
      radius: 20,
      shape: 'hex'
    },
    DASH: {
      name: 'dasher',
      hp: 55,
      speed: 2.1,
      dashSpeed: 6.2,
      score: 220,
      color: '#ffb800',
      radius: 14,
      shape: 'diamond'
    },
    SPITTER: {
      name: 'spitter',
      hp: 65,
      speed: 1.6,
      score: 250,
      color: '#00ff88',
      radius: 15,
      shape: 'circle'
    }
  };

  class Enemy {
    constructor(x, y, typeDef) {
      this.x = x;
      this.y = y;
      this.type = typeDef;
      this.hp = typeDef.hp;
      this.maxHp = typeDef.hp;
      this.speed = typeDef.speed;
      this.radius = typeDef.radius;
      this.color = typeDef.color;
      this.score = typeDef.score;
      this.angle = 0;
      this.rot = 0;

      // Especialidade para Dashers
      this.dashTimer = 2.0 + Math.random() * 1.5;
      this.isCharging = false;
      this.chargeTime = 0;

      // Especialidade para Spitters
      this.shootCooldown = 2.2 + Math.random() * 1.2;
    }

    update(dt, player, bullets, particles, width, height) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.hypot(dx, dy);
      this.angle = Math.atan2(dy, dx);
      this.rot += dt * 3;

      // Comportamentos específicos
      if (this.type.name === 'dasher') {
        this.dashTimer -= dt;
        if (this.dashTimer <= 0) {
          if (!this.isCharging) {
            // Inicia carga
            this.isCharging = true;
            this.chargeTime = 0.55;
            this.chargeAngle = this.angle;
          } else {
            this.chargeTime -= dt;
            if (this.chargeTime > 0) {
              // Carga rápida
              this.x += Math.cos(this.chargeAngle) * this.type.dashSpeed * dt * 60;
              this.y += Math.sin(this.chargeAngle) * this.type.dashSpeed * dt * 60;
            } else {
              this.isCharging = false;
              this.dashTimer = 3.0 + Math.random() * 1.5;
            }
          }
        } else {
          // Perseguição normal
          this.x += Math.cos(this.angle) * this.speed * dt * 60;
          this.y += Math.sin(this.angle) * this.speed * dt * 60;
        }
      } else if (this.type.name === 'spitter') {
        // Tenta manter distância
        if (dist > 220) {
          this.x += Math.cos(this.angle) * this.speed * dt * 60;
          this.y += Math.sin(this.angle) * this.speed * dt * 60;
        } else if (dist < 150) {
          this.x -= Math.cos(this.angle) * this.speed * 0.8 * dt * 60;
          this.y -= Math.sin(this.angle) * this.speed * 0.8 * dt * 60;
        }

        // Disparo
        this.shootCooldown -= dt;
        if (this.shootCooldown <= 0) {
          this.shootCooldown = 2.5 + Math.random() * 0.8;
          bullets.push(new Bullet(this.x, this.y, this.angle, 4.2, 16, false, '#00ff88'));
        }
      } else {
        // Perseguição direta (Drone e Bruiser)
        this.x += Math.cos(this.angle) * this.speed * dt * 60;
        this.y += Math.sin(this.angle) * this.speed * dt * 60;
      }

      // Confinar dentro da arena
      this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
      this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = '#0a0d18';
      ctx.lineWidth = 2.2;

      // Alerta de carga do Dasher
      if (this.isCharging && Math.floor(Date.now() / 40) % 2 === 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
      }

      const r = this.radius;

      if (this.type.shape === 'triangle') {
        // Drone
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(-r, -r * 0.7);
        ctx.lineTo(-r * 0.5, 0);
        ctx.lineTo(-r, r * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (this.type.shape === 'hex') {
        // Bruiser (Pesado)
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Núcleo interno
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type.shape === 'diamond') {
        // Dasher
        ctx.beginPath();
        ctx.moveTo(r * 1.2, 0);
        ctx.lineTo(0, -r * 0.8);
        ctx.lineTo(-r * 0.8, 0);
        ctx.lineTo(0, r * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Spitter
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bocal de tiro
        ctx.fillStyle = this.color;
        ctx.fillRect(4, -3, r - 2, 6);
      }

      ctx.restore();

      // Barra de Vida Superior (se tiver dano)
      if (this.hp < this.maxHp) {
        const barW = this.radius * 2;
        const barH = 3;
        const pct = Math.max(0, this.hp / this.maxHp);
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.x - barW / 2, this.y - this.radius - 8, barW, barH);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - barW / 2, this.y - this.radius - 8, barW * pct, barH);
        ctx.restore();
      }
    }
  }

  // POWER-UPS E ITENS COLETÁVEIS
  const POWERUP_TYPES = [
    { type: 'medkit', label: '+HP', color: '#00ff88', icon: '💚' },
    { type: 'triple', label: 'TRIPLO', color: '#ffb800', icon: '⚡' },
    { type: 'shield', label: 'ESCUDO', color: '#38bdf8', icon: '🛡️' },
    { type: 'bomb', label: '+EMP', color: '#ff0055', icon: '💥' },
    { type: 'overdrive', label: 'OVERDRIVE', color: '#00f3ff', icon: '🔥' }
  ];

  class PowerUp {
    constructor(x, y, pType = null) {
      this.x = x;
      this.y = y;
      this.data = pType || POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
      this.radius = 14;
      this.life = 16; // some após 16s
      this.pulse = 0;
    }

    update(dt) {
      this.life -= dt;
      this.pulse += dt * 4;
      return this.life > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      const pulseScale = 1 + Math.sin(this.pulse) * 0.12;
      ctx.scale(pulseScale, pulseScale);

      // Círculo externo brilhante
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.data.color;
      ctx.strokeStyle = this.data.color;
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';

      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rótulo / Ícone
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.data.icon, 0, 1);

      ctx.restore();
    }
  }

  /* ==========================================================================
     5. NÚCLEO DO JOGO (GAME LOOP, HUD E ESTADO)
     ========================================================================== */
  class CyberArenaGame {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');

      this.sound = new SoundFX();
      this.input = new InputManager(this.canvas);

      // Estados de Jogo: 'START', 'PLAYING', 'PAUSED', 'GAMEOVER'
      this.state = 'START';
      this.lastTime = 0;
      this.elapsedTime = 0;
      this.screenShake = 0;

      // Coleções
      this.player = null;
      this.enemies = [];
      this.bullets = [];
      this.powerups = [];
      this.particles = [];
      this.floatingTexts = [];
      this.shockwaves = [];

      // Dificuldade e Spawn
      this.wave = 1;
      this.spawnTimer = 0;
      this.baseSpawnInterval = 1.6;
      this.difficultyRampTimer = 0;

      // Sistema de Combo
      this.combo = 1.0;
      this.comboTimer = 0;
      this.maxComboTimer = 3.5;

      // Elementos do DOM
      this.dom = {
        score: document.getElementById('score-display'),
        combo: document.getElementById('combo-display'),
        comboFill: document.getElementById('combo-bar-fill'),
        comboCard: document.getElementById('combo-container'),
        timer: document.getElementById('timer-display'),
        hpFill: document.getElementById('hp-bar-fill'),
        shieldFill: document.getElementById('shield-bar-fill'),
        hpText: document.getElementById('hp-text'),
        buffBox: document.getElementById('buff-indicator'),
        buffIcon: document.getElementById('buff-icon'),
        buffText: document.getElementById('buff-text'),
        buffFill: document.getElementById('buff-timer-fill'),
        centerBanner: document.getElementById('center-banner'),
        bannerTitle: document.getElementById('banner-title'),
        bannerSub: document.getElementById('banner-subtitle'),
        bombBadge: document.getElementById('bomb-count-badge'),
        dashOverlay: document.getElementById('dash-cd-overlay'),
        btnSound: document.getElementById('btn-sound'),
        iconSoundOn: document.getElementById('icon-sound-on'),
        iconSoundOff: document.getElementById('icon-sound-off'),
        btnPause: document.getElementById('btn-pause'),
        iconPause: document.getElementById('icon-pause'),
        iconPlay: document.getElementById('icon-play'),
        startOverlay: document.getElementById('start-overlay'),
        pauseOverlay: document.getElementById('pause-overlay'),
        gameoverOverlay: document.getElementById('gameover-overlay'),
        finalScore: document.getElementById('final-score'),
        highScore: document.getElementById('high-score'),
        finalTime: document.getElementById('final-time'),
        finalKills: document.getElementById('final-kills'),
        finalWave: document.getElementById('final-wave'),
        btnStart: document.getElementById('btn-start'),
        btnResume: document.getElementById('btn-resume'),
        btnRestartPause: document.getElementById('btn-restart-pause'),
        btnRestart: document.getElementById('btn-restart')
      };

      this.initEvents();
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      // Loop Inicial
      requestAnimationFrame((t) => this.loop(t));
    }

    initEvents() {
      // Controles do jogador
      this.input.onDash = () => {
        if (this.state === 'PLAYING' && this.player) {
          if (this.player.dash()) {
            this.sound.playDash();
            this.screenShake = 3;
          }
        }
      };

      this.input.onBomb = () => {
        if (this.state === 'PLAYING' && this.player && this.player.bombs > 0) {
          this.triggerBomb();
        }
      };

      // Botões UI
      this.dom.btnStart.addEventListener('click', () => {
        this.sound.init();
        this.startNewGame();
      });

      this.dom.btnRestart.addEventListener('click', () => {
        this.sound.init();
        this.startNewGame();
      });

      this.dom.btnRestartPause.addEventListener('click', () => {
        this.startNewGame();
      });

      this.dom.btnResume.addEventListener('click', () => {
        this.togglePause();
      });

      this.dom.btnPause.addEventListener('click', () => {
        this.togglePause();
      });

      this.dom.btnSound.addEventListener('click', () => {
        const isMuted = this.sound.toggleMute();
        this.updateSoundIcon(isMuted);
      });

      // Atualiza ícone de som inicial
      this.updateSoundIcon(this.sound.muted);
    }

    updateSoundIcon(muted) {
      if (muted) {
        this.dom.iconSoundOn.classList.add('hidden');
        this.dom.iconSoundOff.classList.remove('hidden');
      } else {
        this.dom.iconSoundOn.classList.remove('hidden');
        this.dom.iconSoundOff.classList.add('hidden');
      }
    }

    resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      this.ctx.scale(dpr, dpr);
      this.arenaWidth = window.innerWidth;
      this.arenaHeight = window.innerHeight;
    }

    startNewGame() {
      this.state = 'PLAYING';
      this.elapsedTime = 0;
      this.wave = 1;
      this.spawnTimer = 0.5;
      this.difficultyRampTimer = 0;
      this.combo = 1.0;
      this.comboTimer = 0;
      this.screenShake = 0;

      this.player = new Player(this.arenaWidth / 2, this.arenaHeight / 2);
      this.enemies = [];
      this.bullets = [];
      this.powerups = [];
      this.particles = [];
      this.floatingTexts = [];
      this.shockwaves = [];

      // Ocultar modais
      this.dom.startOverlay.classList.add('hidden');
      this.dom.pauseOverlay.classList.add('hidden');
      this.dom.gameoverOverlay.classList.add('hidden');

      this.updateHUD();
      this.showBanner('SISTEMA PRONTO', 'SOBREVIVA ÀS ONDAS CIBERNÉTICAS!');
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.dom.pauseOverlay.classList.remove('hidden');
        this.dom.iconPause.classList.add('hidden');
        this.dom.iconPlay.classList.remove('hidden');
      } else if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        this.dom.pauseOverlay.classList.add('hidden');
        this.dom.iconPause.classList.remove('hidden');
        this.dom.iconPlay.classList.add('hidden');
      }
    }

    triggerBomb() {
      this.player.bombs--;
      this.sound.playBomb();
      this.screenShake = 16;
      this.shockwaves.push(new Shockwave(this.player.x, this.player.y, Math.hypot(this.arenaWidth, this.arenaHeight), '#ffb800'));

      // Destrói ou causa dano maciço a todos os inimigos
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        this.killEnemy(e, i, true);
      }
      this.bullets = this.bullets.filter(b => b.isPlayer); // limpa balas inimigas

      this.showBanner('PULSO EMP ATIVADO', 'ARENA PURGADA!');
      this.updateHUD();
    }

    showBanner(title, subtitle) {
      this.dom.bannerTitle.textContent = title;
      this.dom.bannerSub.textContent = subtitle;
      this.dom.centerBanner.classList.remove('hidden');

      // Reinicia animação CSS
      this.dom.centerBanner.style.animation = 'none';
      void this.dom.centerBanner.offsetWidth; // força reflow
      this.dom.centerBanner.style.animation = 'bannerPop 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';

      setTimeout(() => {
        this.dom.centerBanner.classList.add('hidden');
      }, 2200);
    }

    /* ================= SPAWN DE INIMIGOS E ITENS ================= */
    spawnEnemy() {
      // Posição de surgimento nas bordas da arena
      let x, y;
      const margin = 20;
      const edge = Math.floor(Math.random() * 4); // 0: topo, 1: direita, 2: baixo, 3: esquerda

      if (edge === 0) {
        x = Math.random() * this.arenaWidth;
        y = -margin;
      } else if (edge === 1) {
        x = this.arenaWidth + margin;
        y = Math.random() * this.arenaHeight;
      } else if (edge === 2) {
        x = Math.random() * this.arenaWidth;
        y = this.arenaHeight + margin;
      } else {
        x = -margin;
        y = Math.random() * this.arenaHeight;
      }

      // Escolhe tipo com base no tempo de sobrevivência
      let typeDef = ENEMY_TYPES.DRONE;
      const rand = Math.random();

      if (this.elapsedTime > 50 && rand < 0.25) {
        typeDef = ENEMY_TYPES.SPITTER;
      } else if (this.elapsedTime > 30 && rand < 0.45) {
        typeDef = ENEMY_TYPES.DASH;
      } else if (this.elapsedTime > 15 && rand < 0.65) {
        typeDef = ENEMY_TYPES.BRUISER;
      }

      this.enemies.push(new Enemy(x, y, typeDef));
    }

    spawnPowerup(x, y) {
      if (this.powerups.length < 5) {
        this.powerups.push(new PowerUp(x, y));
      }
    }

    /* ================= GAME LOOP PRINCIPAL ================= */
    loop(currentTime) {
      if (!this.lastTime) this.lastTime = currentTime;
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // trava dt para evitar saltos
      this.lastTime = currentTime;

      if (this.state === 'PLAYING') {
        this.update(dt);
      }

      this.render();
      requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
      this.elapsedTime += dt;
      this.difficultyRampTimer += dt;

      // Aumento gradativo de onda a cada 20 segundos
      const currentWave = Math.floor(this.elapsedTime / 20) + 1;
      if (currentWave > this.wave) {
        this.wave = currentWave;
        this.sound.playPowerup();
        this.showBanner(`ONDA ${this.wave}`, 'INTENSIDADE DO INIMIGO AUMENTADA!');
      }

      // Temporizador de Spawn (fica mais rápido com o tempo)
      this.spawnTimer -= dt;
      const spawnInterval = Math.max(0.4, this.baseSpawnInterval - (this.wave * 0.12));
      if (this.spawnTimer <= 0) {
        this.spawnTimer = spawnInterval;
        // Spawna mais de 1 inimigo se estiver em ondas avançadas
        const spawnCount = 1 + Math.floor(this.wave / 3);
        for (let i = 0; i < spawnCount; i++) {
          this.spawnEnemy();
        }
      }

      // Combo Decay
      if (this.comboTimer > 0) {
        this.comboTimer -= dt;
        if (this.comboTimer <= 0) {
          this.combo = 1.0;
        }
      }

      // Mira e Disparo do Jogador
      this.handlePlayerAimAndShoot(dt);

      // Atualiza Jogador
      this.player.update(dt, this.input, this.arenaWidth, this.arenaHeight, this.particles);

      // Atualiza Projéteis
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        const b = this.bullets[i];
        if (!b.update(dt, this.arenaWidth, this.arenaHeight)) {
          this.bullets.splice(i, 1);
          continue;
        }

        // Colisão de projéteis do jogador com inimigos
        if (b.isPlayer) {
          for (let j = this.enemies.length - 1; j >= 0; j--) {
            const e = this.enemies[j];
            const dist = Math.hypot(b.x - e.x, b.y - e.y);
            if (dist < b.radius + e.radius) {
              // Impacto
              e.hp -= b.damage;
              this.sound.playHit();
              this.createImpactParticles(b.x, b.y, b.color, 4);

              if (e.hp <= 0) {
                this.killEnemy(e, j);
              }
              this.bullets.splice(i, 1);
              break;
            }
          }
        } else {
          // Colisão de projéteis inimigos com o jogador
          const dist = Math.hypot(b.x - this.player.x, b.y - this.player.y);
          if (dist < b.radius + this.player.radius) {
            if (this.player.takeDamage(b.damage)) {
              this.sound.playHit();
              this.screenShake = 7;
              this.createImpactParticles(this.player.x, this.player.y, '#ff0055', 8);
              this.checkPlayerDeath();
            }
            this.bullets.splice(i, 1);
          }
        }
      }

      // Atualiza Inimigos
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        e.update(dt, this.player, this.bullets, this.particles, this.arenaWidth, this.arenaHeight);

        // Colisão física com o jogador
        const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
        if (dist < e.radius + this.player.radius) {
          if (this.player.takeDamage(20)) {
            this.sound.playHit();
            this.screenShake = 9;
            this.createImpactParticles(this.player.x, this.player.y, '#ff0055', 10);
            this.checkPlayerDeath();
          }
        }
      }

      // Atualiza Power-ups
      for (let i = this.powerups.length - 1; i >= 0; i--) {
        const p = this.powerups[i];
        if (!p.update(dt)) {
          this.powerups.splice(i, 1);
          continue;
        }

        const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y);
        if (dist < p.radius + this.player.radius + 10) {
          this.collectPowerup(p);
          this.powerups.splice(i, 1);
        }
      }

      // Atualiza Partículas
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (!this.particles[i].update(dt)) {
          this.particles.splice(i, 1);
        }
      }

      // Textos Flutuantes
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        if (!this.floatingTexts[i].update(dt)) {
          this.floatingTexts.splice(i, 1);
        }
      }

      // Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        if (!this.shockwaves[i].update(dt)) {
          this.shockwaves.splice(i, 1);
        }
      }

      // Tremor de tela
      if (this.screenShake > 0) {
        this.screenShake -= dt * 18;
        if (this.screenShake < 0) this.screenShake = 0;
      }

      this.updateHUD();
    }

    handlePlayerAimAndShoot(dt) {
      if (!this.player) return;

      // Prioridade 1: Mouse apontado ou clique no desktop
      // Prioridade 2: Inimigo mais próximo (mira assistida / mobile)
      let targetAngle = this.player.angle;
      let shouldFire = false;

      let nearestEnemy = null;
      let minDist = Infinity;

      for (const e of this.enemies) {
        const d = Math.hypot(e.x - this.player.x, e.y - this.player.y);
        if (d < minDist) {
          minDist = d;
          nearestEnemy = e;
        }
      }

      if (this.input.mouse.isMoving || this.input.mouse.isDown) {
        targetAngle = Math.atan2(this.input.mouse.y - this.player.y, this.input.mouse.x - this.player.x);
        shouldFire = true; // no mouse dispara continuamente ou ao clicar
      } else if (nearestEnemy) {
        targetAngle = Math.atan2(nearestEnemy.y - this.player.y, nearestEnemy.x - this.player.x);
        shouldFire = true;
      }

      // Suavização da rotação do jogador
      this.player.angle = targetAngle;

      // Disparo automático
      if (shouldFire && this.player.fireCooldown <= 0) {
        let cd = this.player.baseFireRate;
        if (this.player.overdriveTimer > 0) cd *= 0.55;
        this.player.fireCooldown = cd;

        this.sound.playShoot();

        // Disparo normal vs Triplo
        if (this.player.tripleShotTimer > 0) {
          const spread = 0.22;
          this.bullets.push(new Bullet(this.player.x, this.player.y, this.player.angle, 11, this.player.bulletDamage, true, '#ffb800'));
          this.bullets.push(new Bullet(this.player.x, this.player.y, this.player.angle - spread, 11, this.player.bulletDamage, true, '#ffb800'));
          this.bullets.push(new Bullet(this.player.x, this.player.y, this.player.angle + spread, 11, this.player.bulletDamage, true, '#ffb800'));
        } else {
          this.bullets.push(new Bullet(this.player.x, this.player.y, this.player.angle, 11, this.player.bulletDamage, true, '#00f3ff'));
        }
      }
    }

    killEnemy(enemy, index, fromBomb = false) {
      this.enemies.splice(index, 1);
      this.player.kills++;

      // Atualiza Combo
      this.combo = Math.min(5.0, +(this.combo + 0.2).toFixed(1));
      this.comboTimer = this.maxComboTimer;

      // Pontuação com multiplicador de combo
      const gainedPoints = Math.round(enemy.score * this.combo);
      this.player.score += gainedPoints;

      this.sound.playExplosion(enemy.type.name === 'bruiser');
      this.createExplosionParticles(enemy.x, enemy.y, enemy.color, enemy.type.name === 'bruiser' ? 24 : 14);

      // Texto de pontuação flutuante
      this.floatingTexts.push(new FloatingText(
        `+${gainedPoints}`,
        enemy.x,
        enemy.y - 10,
        this.combo >= 2.0 ? '#ffb800' : '#00f3ff',
        this.combo >= 3.0 ? 18 : 14
      ));

      // Chance de Drop de Power-up (12% em mortes normais, 25% no bruiser)
      const dropChance = enemy.type.name === 'bruiser' ? 0.35 : 0.12;
      if (!fromBomb && Math.random() < dropChance) {
        this.spawnPowerup(enemy.x, enemy.y);
      }
    }

    collectPowerup(powerup) {
      this.sound.playPowerup();
      const type = powerup.data.type;
      let label = powerup.data.label;

      if (type === 'medkit') {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 35);
        label = '+35 HP';
      } else if (type === 'shield') {
        this.player.shield = this.player.maxShield;
        label = 'ESCUDO ATIVADO';
      } else if (type === 'triple') {
        this.player.tripleShotTimer = 11;
        label = 'DISPARO TRIPLO';
      } else if (type === 'overdrive') {
        this.player.overdriveTimer = 9;
        label = 'OVERDRIVE';
      } else if (type === 'bomb') {
        this.player.bombs = Math.min(this.player.maxBombs, this.player.bombs + 1);
        label = '+1 BOMBA EMP';
      }

      this.floatingTexts.push(new FloatingText(label, powerup.x, powerup.y - 12, powerup.data.color, 16));
      this.createExplosionParticles(powerup.x, powerup.y, powerup.data.color, 12);
    }

    checkPlayerDeath() {
      if (this.player.hp <= 0) {
        this.player.hp = 0;
        this.state = 'GAMEOVER';
        this.sound.playGameOver();
        this.createExplosionParticles(this.player.x, this.player.y, '#00f3ff', 35);
        this.screenShake = 20;

        // Salvar Recorde
        const prevBest = parseInt(localStorage.getItem('cyber_arena_best') || '0', 10);
        const finalScore = this.player.score;
        if (finalScore > prevBest) {
          localStorage.setItem('cyber_arena_best', finalScore.toString());
        }

        const bestScore = Math.max(prevBest, finalScore);

        // Preenche modal de Game Over
        this.dom.finalScore.textContent = finalScore.toLocaleString();
        this.dom.highScore.textContent = bestScore.toLocaleString();
        this.dom.finalTime.textContent = this.formatTime(this.elapsedTime);
        this.dom.finalKills.textContent = this.player.kills.toString();
        this.dom.finalWave.textContent = this.wave.toString();

        setTimeout(() => {
          this.dom.gameoverOverlay.classList.remove('hidden');
        }, 600);
      }
    }

    createImpactParticles(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1;
        this.particles.push(new Particle(
          x, y,
          Math.cos(angle) * spd,
          Math.sin(angle) * spd,
          color,
          Math.random() * 2.5 + 1.5,
          0.25
        ));
      }
    }

    createExplosionParticles(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 6 + 1.5;
        this.particles.push(new Particle(
          x, y,
          Math.cos(angle) * spd,
          Math.sin(angle) * spd,
          color,
          Math.random() * 3.5 + 1.5,
          Math.random() * 0.4 + 0.3,
          true
        ));
      }
    }

    formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }

    updateHUD() {
      if (!this.player) return;

      // Pontos & Tempo
      this.dom.score.textContent = this.player.score.toLocaleString();
      this.dom.timer.textContent = this.formatTime(this.elapsedTime);

      // Barra de Vida e Escudo
      const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      this.dom.hpFill.style.width = `${hpPct}%`;
      this.dom.hpText.textContent = `${Math.ceil(this.player.hp)}/${this.player.maxHp}`;

      const shieldPct = Math.max(0, (this.player.shield / this.player.maxShield) * 100);
      this.dom.shieldFill.style.width = `${shieldPct}%`;

      // Barra de Combo
      if (this.combo > 1.0) {
        this.dom.combo.textContent = `x${this.combo.toFixed(1)}`;
        const comboPct = (this.comboTimer / this.maxComboTimer) * 100;
        this.dom.comboFill.style.width = `${comboPct}%`;
      } else {
        this.dom.combo.textContent = `x1.0`;
        this.dom.comboFill.style.width = `0%`;
      }

      // Badges e Cooldowns dos botões mobile
      this.dom.bombBadge.textContent = this.player.bombs.toString();
      if (this.player.dashCooldown > 0) {
        const cdPct = (this.player.dashCooldown / this.player.dashMaxCooldown) * 100;
        this.dom.dashOverlay.style.height = `${cdPct}%`;
      } else {
        this.dom.dashOverlay.style.height = `0%`;
      }

      // Indicador de Buff
      if (this.player.tripleShotTimer > 0) {
        this.dom.buffBox.classList.remove('hidden');
        this.dom.buffIcon.textContent = '⚡';
        this.dom.buffText.textContent = 'DISPARO TRIPLO';
        this.dom.buffFill.style.width = `${(this.player.tripleShotTimer / 11) * 100}%`;
      } else if (this.player.overdriveTimer > 0) {
        this.dom.buffBox.classList.remove('hidden');
        this.dom.buffIcon.textContent = '🔥';
        this.dom.buffText.textContent = 'OVERDRIVE MÁXIMO';
        this.dom.buffFill.style.width = `${(this.player.overdriveTimer / 9) * 100}%`;
      } else {
        this.dom.buffBox.classList.add('hidden');
      }
    }

    /* ================= RENDERIZAÇÃO ================= */
    render() {
      const ctx = this.ctx;
      const w = this.arenaWidth;
      const h = this.arenaHeight;

      ctx.save();

      // Aplica Tremor de tela (Screen Shake)
      if (this.screenShake > 0) {
        const ox = (Math.random() - 0.5) * this.screenShake;
        const oy = (Math.random() - 0.5) * this.screenShake;
        ctx.translate(ox, oy);
      }

      // Fundo Escuro com Gradiente
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, w, h);

      // Grid Neon Cibernético
      this.drawCyberGrid(ctx, w, h);

      // Borda Pulsante da Arena
      this.drawArenaBorders(ctx, w, h);

      // Power-ups
      for (const p of this.powerups) p.draw(ctx);

      // Balas
      for (const b of this.bullets) b.draw(ctx);

      // Inimigos
      for (const e of this.enemies) e.draw(ctx);

      // Jogador
      if (this.player && this.state !== 'GAMEOVER') {
        this.player.draw(ctx);
      }

      // Ondas de Choque
      for (const sw of this.shockwaves) sw.draw(ctx);

      // Partículas
      for (const pt of this.particles) pt.draw(ctx);

      // Textos Flutuantes
      for (const ft of this.floatingTexts) ft.draw(ctx);

      ctx.restore();
    }

    drawCyberGrid(ctx, w, h) {
      const gridSize = 45;
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.lineWidth = 1;

      // Linhas verticais
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Linhas horizontais
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawArenaBorders(ctx, w, h) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 243, 255, 0.4)';
      ctx.lineWidth = 3;

      ctx.strokeRect(4, 4, w - 8, h - 8);

      // Detalhes nos quatro cantos
      const corner = 28;
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 4;

      // Canto superior esquerdo
      ctx.beginPath();
      ctx.moveTo(4, 4 + corner);
      ctx.lineTo(4, 4);
      ctx.lineTo(4 + corner, 4);
      ctx.stroke();

      // Canto superior direito
      ctx.beginPath();
      ctx.moveTo(w - 4 - corner, 4);
      ctx.lineTo(w - 4, 4);
      ctx.lineTo(w - 4, 4 + corner);
      ctx.stroke();

      // Canto inferior esquerdo
      ctx.beginPath();
      ctx.moveTo(4, h - 4 - corner);
      ctx.lineTo(4, h - 4);
      ctx.lineTo(4 + corner, h - 4);
      ctx.stroke();

      // Canto inferior direito
      ctx.beginPath();
      ctx.moveTo(w - 4 - corner, h - 4);
      ctx.lineTo(w - 4, h - 4);
      ctx.lineTo(w - 4, h - 4 - corner);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Inicialização quando a página carrega
  window.addEventListener('DOMContentLoaded', () => {
    new CyberArenaGame();
  });
})();
