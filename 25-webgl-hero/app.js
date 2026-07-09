// ============================================================
// Fold — Shader Study
// Vanilla WebGL 1.0 raymarched SDF liquid metal.
// Cursor drives displacement. Idle → breathing. Reduced motion → static.
// ============================================================

(() => {
  const canvas = document.getElementById('gl');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) { canvas.style.background = '#000'; return; }

  const vertSrc = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fragSrc = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_res;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_idle;

    // ---------- hash + noise ----------
    float hash(vec3 p) {
      p = fract(p * vec3(443.897, 441.423, 437.195));
      p += dot(p, p.yzx + 19.19);
      return fract((p.x + p.y) * p.z);
    }
    float noise(vec3 p) {
      vec3 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float n = mix(
        mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      return n;
    }
    float fbm(vec3 p) {
      float s = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.02; a *= 0.5; }
      return s;
    }

    // ---------- SDF ----------
    float sdSphere(vec3 p, float r) { return length(p) - r; }
    float sdBlob(vec3 p) {
      float d = sdSphere(p, 1.05);
      float breath = 0.04 * sin(u_time * 0.5);
      float disp = 0.18 * fbm(p * 1.15 + vec3(u_time * 0.14, 0.0, u_time * 0.09)) + breath;
      float mouseDisp = 0.12 * fbm(p * 1.6 + vec3(u_mouse.x * 0.6, u_mouse.y * 0.6, u_time * 0.25));
      return d - disp - mouseDisp * (0.5 + 0.5 * u_idle);
    }

    vec3 calcNormal(vec3 p) {
      float e = 0.002;
      vec2 h = vec2(1.0, -1.0) * 0.5773;
      return normalize(
        h.xyy * sdBlob(p + h.xyy * e) +
        h.yyx * sdBlob(p + h.yyx * e) +
        h.yxy * sdBlob(p + h.yxy * e) +
        h.xxx * sdBlob(p + h.xxx * e));
    }

    float rayMarch(vec3 ro, vec3 rd) {
      float t = 0.0;
      for (int i = 0; i < 96; i++) {
        vec3 p = ro + rd * t;
        float d = sdBlob(p);
        if (d < 0.001 || t > 8.0) break;
        t += d * 0.75;
      }
      return t;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
      vec3 ro = vec3(0.0, 0.0, 3.0);
      vec3 rd = normalize(vec3(uv, -1.5));
      float t = rayMarch(ro, rd);

      vec3 col = vec3(0.0);
      if (t < 8.0) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 lightDir = normalize(vec3(0.55 + u_mouse.x * 0.3, 0.7, 0.6));

        float diff = max(dot(n, lightDir), 0.0);
        float rim  = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
        float spec = pow(max(dot(reflect(-lightDir, n), -rd), 0.0), 42.0);

        // fresnel-schlick approximation
        float f0 = 0.04;
        float fres = f0 + (1.0 - f0) * pow(1.0 - max(dot(n, -rd), 0.0), 5.0);

        // mercury base + warm bone highlight + gold rim
        vec3 mercury = vec3(0.76, 0.77, 0.80);
        vec3 bone    = vec3(0.93, 0.91, 0.85);
        vec3 gold    = vec3(0.79, 0.64, 0.32);

        col = mix(mercury * 0.4, mercury, diff);
        col += bone * spec * 1.2;
        col += gold * rim * 0.6 * fres;
        col = mix(col, bone, fres * 0.3);

        // ambient + subtle vignette
        col += 0.03;
        float vign = smoothstep(0.98, 0.3, length(uv));
        col *= vign;
      } else {
        // background — deep void with a faint gradient
        col = vec3(0.02, 0.02, 0.03) + vec3(0.0, 0.005, 0.02) * (1.0 - uv.y);
      }

      // tone-map + gamma
      col = col / (col + vec3(1.0));
      col = pow(col, vec3(0.9));
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('shader compile', gl.getShaderInfoLog(s));
    }
    return s;
  };

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a_pos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(a_pos);
  gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

  const u_res   = gl.getUniformLocation(prog, 'u_res');
  const u_mouse = gl.getUniformLocation(prog, 'u_mouse');
  const u_time  = gl.getUniformLocation(prog, 'u_time');
  const u_idle  = gl.getUniformLocation(prog, 'u_idle');

  let mx = 0, my = 0, targetMx = 0, targetMy = 0;
  let lastMove = performance.now();
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  const resize = () => {
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
  };
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', e => {
    targetMx = (e.clientX / window.innerWidth) * 2 - 1;
    targetMy = 1 - (e.clientY / window.innerHeight) * 2;
    lastMove = performance.now();
  });

  let paused = false;

  // Commission form
  const form = document.getElementById('commForm');
  const status = document.getElementById('formStatus');
  if (form) {
    let webhook = 'https://services.leadconnectorhq.com/hooks/example/ingot';
    fetch('brand.json').then(r => r.ok ? r.json() : null).then(b => { if (b?.FORM_WEBHOOK_URL) webhook = b.FORM_WEBHOOK_URL; }).catch(() => {});
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.email || !data.note) {
        status.textContent = 'Name, email, and a short note — Marek reads all three before replying.';
        return;
      }
      status.textContent = 'Sending…';
      try {
        await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source: 'ingot-atelier.web', at: new Date().toISOString() }), mode: 'no-cors' });
      } catch (_) { /* graceful */ }
      form.reset();
      status.textContent = 'Received. Marek replies personally within one business day.';
    });
  }

  const start = performance.now();
  let t = 0;

  const draw = () => {
    if (!paused) {
      const now = performance.now();
      if (!reducedMotion) t = (now - start) / 1000;
      mx += (targetMx - mx) * 0.08;
      my += (targetMy - my) * 0.08;
      const idleFor = (now - lastMove) / 1000;
      const idle = Math.min(1, Math.max(0, (idleFor - 3) / 5));
      gl.uniform2f(u_res, canvas.width, canvas.height);
      gl.uniform2f(u_mouse, mx, my);
      gl.uniform1f(u_time, t);
      gl.uniform1f(u_idle, idle);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(draw);
  };
  draw();
})();
