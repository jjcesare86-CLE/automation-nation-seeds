/* ============================================================
   Automation Nation — Voice Widget
   ------------------------------------------------------------
   A per-site voice concierge. Reads brand.json + scrapes the
   current page's editable content, then starts a VAPI call
   with that context injected as system prompt at call time.

   Config lives in brand.json:
     "voice": {
       "publicKey":      "vapi_pub_...",     // from vapi.ai dashboard
       "assistantId":    "asst_...",         // the shared assistant
       "agentName":      "Ella",
       "agentGreeting":  "Hi — ask me anything about Lumen.",
       "accent":         "#c9a353"           // widget accent color
     },
     "VOICE_WEBHOOK_URL": "https://services.leadconnectorhq.com/hooks/..."

   The widget lazy-loads @vapi-ai/web via ESM.sh only on first
   click, so pages pay nothing upfront. Transcripts POST to
   VOICE_WEBHOOK_URL on call end for downstream automation.
   ============================================================ */

(() => {
  if (window.__anVoiceLoaded) return;
  window.__anVoiceLoaded = true;

  const CSS = `
    .anv-root { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #efece7; }
    .anv-root * { box-sizing: border-box; }
    .anv-fab { display: inline-flex; align-items: center; gap: 10px; background: #0e0f11; color: var(--anv-accent, #c9a353); border: 1px solid rgba(255,255,255,.08); padding: 12px 18px; border-radius: 999px; box-shadow: 0 20px 40px rgba(0,0,0,.28), 0 6px 12px rgba(0,0,0,.16); cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; letter-spacing: .01em; transition: transform .35s cubic-bezier(.2,.9,.2,1), box-shadow .35s cubic-bezier(.2,.9,.2,1); }
    .anv-fab:hover { transform: translateY(-2px); box-shadow: 0 24px 48px rgba(0,0,0,.32), 0 8px 16px rgba(0,0,0,.2); }
    .anv-fab svg { width: 16px; height: 16px; }
    .anv-fab .anv-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--anv-accent, #c9a353); box-shadow: 0 0 12px var(--anv-accent, #c9a353); animation: anv-pulse 2s ease-in-out infinite; }
    @keyframes anv-pulse { 50% { opacity: .45; } }
    .anv-panel { display: none; width: 340px; max-width: calc(100vw - 40px); background: rgba(14, 15, 17, 0.96); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; box-shadow: 0 40px 80px rgba(0,0,0,.4), 0 12px 24px rgba(0,0,0,.2); overflow: hidden; }
    .anv-panel.on { display: block; animation: anv-in .35s cubic-bezier(.2,.9,.2,1); }
    @keyframes anv-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .anv-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,.08); }
    .anv-agent { display: flex; align-items: center; gap: 12px; }
    .anv-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--anv-accent, #c9a353), rgba(255,255,255,.08)); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 15px; color: #0e0f11; letter-spacing: -.005em; }
    .anv-agent-name { font-size: 14px; font-weight: 600; letter-spacing: -.005em; }
    .anv-agent-role { font-size: 11px; color: rgba(239,236,231,.55); margin-top: 2px; letter-spacing: .04em; }
    .anv-close { background: transparent; border: 0; color: rgba(239,236,231,.5); font-size: 22px; cursor: pointer; padding: 4px 8px; line-height: 1; font-family: inherit; border-radius: 6px; transition: background-color .3s; }
    .anv-close:hover { background: rgba(255,255,255,.06); color: #efece7; }
    .anv-body { padding: 18px; }
    .anv-greeting { font-size: 14px; line-height: 1.55; color: rgba(239,236,231,.85); margin: 0 0 14px; }
    .anv-status { font-size: 12px; color: rgba(239,236,231,.55); letter-spacing: .02em; margin: 0; min-height: 18px; display: flex; align-items: center; gap: 8px; }
    .anv-status.live { color: var(--anv-accent, #c9a353); font-weight: 500; }
    .anv-status.live::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 12px currentColor; animation: anv-pulse 1.6s ease-in-out infinite; }
    .anv-status.warn { color: #ff8a8a; }
    .anv-status.thinking::before { content: ""; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--anv-accent, #c9a353); border-right-color: transparent; animation: anv-spin 1s linear infinite; }
    @keyframes anv-spin { to { transform: rotate(360deg); } }
    .anv-transcript { margin-top: 14px; max-height: 180px; overflow-y: auto; padding: 12px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); border-radius: 8px; font-size: 12px; line-height: 1.55; }
    .anv-transcript .line { margin-bottom: 8px; }
    .anv-transcript .line:last-child { margin-bottom: 0; }
    .anv-transcript .speaker { color: rgba(239,236,231,.5); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 2px; }
    .anv-transcript .speaker.agent { color: var(--anv-accent, #c9a353); }
    .anv-actions { padding: 14px 18px 18px; display: flex; gap: 8px; }
    .anv-btn { flex: 1; padding: 12px 16px; font-family: inherit; font-size: 13px; font-weight: 500; letter-spacing: .04em; border: 0; border-radius: 10px; cursor: pointer; transition: transform .3s cubic-bezier(.2,.9,.2,1), background-color .3s; }
    .anv-btn.primary { background: var(--anv-accent, #c9a353); color: #0e0f11; }
    .anv-btn.primary:hover { transform: translateY(-1px); filter: brightness(1.08); }
    .anv-btn.secondary { background: rgba(255,255,255,.06); color: #efece7; }
    .anv-btn.secondary:hover { background: rgba(255,255,255,.12); }
    .anv-btn.hangup { background: #d13a3a; color: #fff; }
    .anv-btn.hangup:hover { background: #b12e2e; }
    .anv-mute-icon { width: 14px; height: 14px; display: inline-block; vertical-align: -2px; margin-right: 6px; }
    .anv-foot { padding: 10px 18px 14px; font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: rgba(239,236,231,.35); text-align: center; border-top: 1px solid rgba(255,255,255,.06); }
    @media (max-width: 480px) {
      .anv-root { bottom: 12px; right: 12px; left: 12px; }
      .anv-panel { width: auto; }
      .anv-fab { width: 100%; justify-content: center; }
    }
    @media (prefers-reduced-motion: reduce) {
      .anv-fab, .anv-panel, .anv-status.live::before, .anv-status.thinking::before, .anv-fab .anv-dot { animation: none !important; transition: none !important; }
    }
  `;

  // ---------- boot ----------
  const boot = async () => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Load brand.json — resolved relative to the current page
    let brand = {};
    try {
      const res = await fetch('brand.json');
      if (res.ok) brand = await res.json();
    } catch (_) {}

    const brandName = brand.brand || document.title.split('—')[0].trim() || 'this business';
    const voice = brand.voice || {};
    const agentName = voice.agentName || 'Concierge';
    const greeting = voice.agentGreeting || `Hi — ask me anything about ${brandName}.`;
    const accent = voice.accent || '#c9a353';

    // Extract page content for knowledge prompt
    const pageContent = extractContent();
    const knowledge = buildKnowledge(brand, brandName, pageContent);

    // Render
    render({ brand, brandName, agentName, greeting, accent, knowledge });
  };

  const extractContent = () => {
    const parts = [];
    const push = (label, text) => {
      const t = (text || '').trim().replace(/\s+/g, ' ');
      if (t && t.length > 3) parts.push(`${label}: ${t}`);
    };
    // Grab all headings + editable copy + section text
    document.querySelectorAll('h1, h2, h3, [data-editable]').forEach(el => {
      const label = el.dataset.editable || el.tagName.toLowerCase();
      push(label, el.textContent);
    });
    // Grab paragraph and list content within main
    const main = document.querySelector('main') || document.body;
    main.querySelectorAll('section p, section li, dl dd, dl dt').forEach(el => {
      push('body', el.textContent);
    });
    // Dedupe + cap
    const seen = new Set();
    const unique = [];
    for (const p of parts) {
      const key = p.slice(0, 80);
      if (!seen.has(key)) { seen.add(key); unique.push(p); }
    }
    return unique.slice(0, 200).join('\n');
  };

  const buildKnowledge = (brand, brandName, pageContent) => {
    const addr = brand.address || {};
    const addressLine = [addr.line1, addr.city].filter(Boolean).join(', ');
    return `You are ${brand.voice?.agentName || 'the concierge'} for ${brandName}, a knowledgeable and warm voice agent for prospective customers browsing the website right now.

BUSINESS FACTS
Name: ${brandName}
Tagline: ${brand.tagline || ''}
Phone: ${brand.phone || 'not published'}
Email: ${brand.email || 'not published'}
Address: ${addressLine || 'not published'}

WEBSITE CONTENT (source of truth for services, pricing, hours, availability):
${pageContent}

BEHAVIOR
- Answer questions from prospective customers about services, pricing, hours, availability, and process. Cite specifics from the website content above whenever possible.
- If asked about specific services, treatments, rooms, packages, or menu items, refer to the exact details, times, and prices from the website content.
- If a caller wants to book, reserve, buy, or talk to a human, offer to collect their name and phone or email so the team follows up promptly.
- Speak the way the brand speaks — warm, concise, on-brand. Do not sound like a chatbot.
- Do not invent facts about the business. If asked something you cannot verify from the website content, say so plainly and offer to have the team follow up.
- Keep responses under two sentences unless the caller asks for detail.
- Never mention that you are an AI, a language model, or that you were built with VAPI. You are the concierge for ${brandName}.

END BEHAVIOR`;
  };

  const render = ({ brand, brandName, agentName, greeting, accent, knowledge }) => {
    const root = document.createElement('div');
    root.className = 'anv-root';
    root.style.setProperty('--anv-accent', accent);
    root.innerHTML = `
      <button class="anv-fab" id="anvFab" aria-label="Open voice concierge">
        <span class="anv-dot" aria-hidden="true"></span>
        <span>Talk to ${escapeHtml(agentName)}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M12 2 c-1.7 0 -3 1.3 -3 3 v6 c0 1.7 1.3 3 3 3 s3 -1.3 3 -3 V5 c0 -1.7 -1.3 -3 -3 -3 z"/>
          <path d="M5 11 c0 3.9 3.1 7 7 7 s7 -3.1 7 -7 M12 18 v3 M9 21 h6"/>
        </svg>
      </button>
      <div class="anv-panel" id="anvPanel" role="dialog" aria-label="Voice concierge">
        <div class="anv-header">
          <div class="anv-agent">
            <div class="anv-avatar">${escapeHtml(agentName[0] || 'C')}</div>
            <div>
              <div class="anv-agent-name">${escapeHtml(agentName)}</div>
              <div class="anv-agent-role">${escapeHtml(brandName)}</div>
            </div>
          </div>
          <button class="anv-close" id="anvClose" aria-label="Close">×</button>
        </div>
        <div class="anv-body">
          <p class="anv-greeting">${escapeHtml(greeting)}</p>
          <p class="anv-status" id="anvStatus">Voice call runs in your browser — no phone dialing required.</p>
          <div class="anv-transcript" id="anvTranscript" style="display:none"></div>
        </div>
        <div class="anv-actions">
          <button class="anv-btn primary" id="anvStart">Start voice call</button>
          <button class="anv-btn secondary" id="anvMute" hidden>Mute</button>
          <button class="anv-btn hangup" id="anvHangup" hidden>Hang up</button>
        </div>
        <div class="anv-foot">Powered by Automation Nation</div>
      </div>
    `;
    document.body.appendChild(root);

    const $ = (id) => document.getElementById(id);
    const fab = $('anvFab'), panel = $('anvPanel'), close = $('anvClose');
    const start = $('anvStart'), hangup = $('anvHangup'), mute = $('anvMute');
    const status = $('anvStatus'), transcript = $('anvTranscript');

    let vapi = null;
    let muted = false;
    const messages = [];

    const openPanel = () => { panel.classList.add('on'); fab.style.display = 'none'; };
    const closePanel = () => { panel.classList.remove('on'); fab.style.display = ''; };

    fab.addEventListener('click', openPanel);
    close.addEventListener('click', () => {
      if (vapi) { try { vapi.stop(); } catch (_) {} }
      closePanel();
    });

    const setStatus = (text, kind) => {
      status.textContent = text;
      status.className = 'anv-status' + (kind ? ' ' + kind : '');
    };

    const appendTranscript = (role, text) => {
      if (!text || !text.trim()) return;
      const wrap = document.createElement('div');
      wrap.className = 'line';
      const isAgent = role === 'assistant';
      wrap.innerHTML = `<div class="speaker ${isAgent ? 'agent' : 'user'}">${isAgent ? agentName : 'You'}</div>${escapeHtml(text)}`;
      transcript.appendChild(wrap);
      transcript.style.display = 'block';
      transcript.scrollTop = transcript.scrollHeight;
      messages.push({ role, text, at: new Date().toISOString() });
    };

    start.addEventListener('click', async () => {
      const { publicKey, assistantId } = brand.voice || {};
      if (!publicKey || !assistantId) {
        setStatus('Not configured — add voice.publicKey + voice.assistantId to brand.json.', 'warn');
        return;
      }
      setStatus('Connecting to ' + agentName + '…', 'thinking');
      start.disabled = true;
      try {
        // Lazy-load VAPI Web SDK
        const mod = await import('https://esm.sh/@vapi-ai/web@2.3.9');
        const Vapi = mod.default || mod.Vapi || mod;
        vapi = new Vapi(publicKey);

        vapi.on('call-start', () => {
          setStatus('Live — you can speak now', 'live');
          start.hidden = true;
          mute.hidden = false;
          hangup.hidden = false;
        });
        vapi.on('call-end', () => {
          setStatus('Call ended.');
          start.hidden = false;
          mute.hidden = true;
          hangup.hidden = true;
          start.disabled = false;
          postTranscript(brand, brandName, messages);
        });
        vapi.on('speech-start', () => setStatus(agentName + ' is speaking…', 'live'));
        vapi.on('speech-end', () => setStatus('Listening…', 'live'));
        vapi.on('message', (m) => {
          if (m.type === 'transcript' && m.transcriptType === 'final') {
            appendTranscript(m.role, m.transcript);
          }
        });
        vapi.on('error', (e) => {
          console.warn('VAPI error', e);
          setStatus('Error: ' + ((e && (e.message || e.errorMsg)) || 'connection failed'), 'warn');
          start.hidden = false;
          mute.hidden = true;
          hangup.hidden = true;
          start.disabled = false;
        });

        await vapi.start(assistantId, {
          firstMessage: greeting,
          model: {
            provider: 'openai',
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: knowledge }]
          }
        });
      } catch (e) {
        console.warn('voice-widget start failed', e);
        setStatus('Could not start call: ' + (e.message || 'unknown'), 'warn');
        start.disabled = false;
      }
    });

    mute.addEventListener('click', () => {
      if (!vapi) return;
      muted = !muted;
      try { vapi.setMuted(muted); } catch (_) {}
      mute.textContent = muted ? 'Unmute' : 'Mute';
    });

    hangup.addEventListener('click', () => {
      if (vapi) { try { vapi.stop(); } catch (_) {} }
    });
  };

  const postTranscript = (brand, brandName, messages) => {
    const url = brand.VOICE_WEBHOOK_URL;
    if (!url || !messages.length) return;
    const body = JSON.stringify({
      brand: brandName,
      source: 'voice-widget',
      transcript: messages,
      at: new Date().toISOString(),
      page: location.href,
    });
    try { fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body }); } catch (_) {}
  };

  const escapeHtml = (s) => String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
