// video-kit.jsx — visual components for the UrbanOS pitch video
// Palette: night city. Deep ink blue bg, glowing roads, orange signals, cream text.
const { Sprite, useSprite, useTime, Easing, interpolate, animate, clamp } = window;

const VC = {
  bg: '#0e1320',
  bg2: '#131a2b',
  road: '#2a3550',
  roadLit: '#43537a',
  block: '#161e31',
  cream: '#f2eee3',
  dim: '#8d96ad',
  orange: '#ff7038',
  orangeSoft: 'rgba(255,112,56,.16)',
  red: '#ff4d4d',
  blue: '#4d9fff',
  green: '#3ddc84',
  font: "'Space Grotesk','Inter',system-ui,sans-serif",
  mono: "'JetBrains Mono',ui-monospace,monospace",
};

(function(){
  if (document.getElementById('vid-fonts')) return;
  const l = document.createElement('link');
  l.id='vid-fonts'; l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap';
  document.head.appendChild(l);
})();

// ── Stylized city map (SVG, 1920×1080 viewBox) ──────────────────────────────
// Roads as glowing strokes; blocks as faint fills. Deterministic layout.
function CityMap({ lit = 0, style }) {
  // lit: 0..1 — how "awake"/highlighted the road network is
  const roadCol = `rgba(${67+lit*40},${83+lit*30},${122+lit*40},1)`;
  return (
    <svg viewBox="0 0 1920 1080" width="1920" height="1080"
         style={{position:'absolute', inset:0, ...style}}>
      <defs>
        <radialGradient id="vigGrad" cx="50%" cy="46%" r="75%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(2,4,10,.65)"/>
        </radialGradient>
      </defs>
      {/* city blocks */}
      <g fill={VC.block}>
        <rect x="120" y="90" width="300" height="200" rx="10"/>
        <rect x="470" y="60" width="240" height="170" rx="10"/>
        <rect x="760" y="110" width="330" height="220" rx="10"/>
        <rect x="1150" y="70" width="280" height="190" rx="10"/>
        <rect x="1490" y="120" width="310" height="230" rx="10"/>
        <rect x="90" y="360" width="260" height="230" rx="10"/>
        <rect x="420" y="320" width="300" height="200" rx="10"/>
        <rect x="790" y="400" width="260" height="240" rx="10"/>
        <rect x="1120" y="330" width="320" height="220" rx="10"/>
        <rect x="1510" y="420" width="280" height="200" rx="10"/>
        <rect x="140" y="660" width="290" height="230" rx="10"/>
        <rect x="500" y="600" width="250" height="260" rx="10"/>
        <rect x="820" y="710" width="320" height="220" rx="10"/>
        <rect x="1210" y="630" width="270" height="240" rx="10"/>
        <rect x="1540" y="700" width="280" height="220" rx="10"/>
      </g>
      {/* river */}
      <path d="M -50 980 C 400 920, 700 1010, 1100 950 S 1850 900, 2000 960"
            stroke="#1b2742" strokeWidth="46" fill="none" strokeLinecap="round"/>
      {/* roads */}
      <g stroke={roadCol} strokeWidth="14" fill="none" strokeLinecap="round"
         style={{filter: lit>0.4 ? `drop-shadow(0 0 ${8*lit}px rgba(120,150,220,.5))` : 'none'}}>
        <path d="M -40 320 L 1960 280"/>
        <path d="M -40 630 L 1960 600"/>
        <path d="M 380 -40 L 440 1120"/>
        <path d="M 1080 -40 L 1130 1120"/>
        <path d="M 1460 -40 L 1500 1120"/>
        <path d="M -40 60 C 500 140, 1300 30, 1960 110"/>
        <path d="M 740 -40 C 760 400, 700 800, 780 1120"/>
      </g>
      {/* secondary roads */}
      <g stroke="#222c46" strokeWidth="7" fill="none">
        <path d="M -40 470 L 1960 450"/>
        <path d="M -40 820 L 1960 790"/>
        <path d="M 200 -40 L 240 1120"/>
        <path d="M 600 -40 L 640 1120"/>
        <path d="M 900 -40 L 930 1120"/>
        <path d="M 1290 -40 L 1320 1120"/>
        <path d="M 1680 -40 L 1710 1120"/>
      </g>
      <rect x="0" y="0" width="1920" height="1080" fill="url(#vigGrad)"/>
    </svg>
  );
}

// ── Rain overlay ─────────────────────────────────────────────────────────────
function Rain({ intensity = 1 }) {
  const t = useTime();
  const drops = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 70; i++) {
      arr.push({ x: (i*137.5)%1920, len: 30+(i*53)%50, speed: 900+(i*97)%500, off: (i*211)%1080 });
    }
    return arr;
  }, []);
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',opacity:intensity}}>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080">
        {drops.map((d,i)=>{
          const y = ((d.off + t*d.speed) % 1200) - 60;
          return <line key={i} x1={d.x} y1={y} x2={d.x-8} y2={y+d.len}
                       stroke="rgba(140,170,230,.28)" strokeWidth="2.5" strokeLinecap="round"/>;
        })}
      </svg>
    </div>
  );
}

// ── Signal ping (expanding rings + dot) ──────────────────────────────────────
function Ping({ x, y, color = VC.orange, born = 0, dead = Infinity, size = 1, glyph }) {
  const t = useTime();
  if (t < born) return null;
  const age = t - born;
  const appear = Easing.easeOutBack(clamp(age/0.4, 0, 1));
  let fade = 1;
  if (isFinite(dead)) {
    if (t > dead) return null;
    fade = clamp((dead - t)/0.6, 0, 1);
  }
  const ringT = (age % 1.6)/1.6;
  return (
    <div style={{position:'absolute', left:x, top:y, transform:'translate(-50%,-50%)', opacity:fade}}>
      {[0,1].map(k=>{
        const rt = (ringT + k*0.5) % 1;
        return <div key={k} style={{
          position:'absolute', left:'50%', top:'50%',
          width: 30+rt*110*size, height: 30+rt*110*size,
          transform:'translate(-50%,-50%)',
          border:`3px solid ${color}`, borderRadius:'50%',
          opacity:(1-rt)*0.5*fade,
        }}/>;
      })}
      <div style={{
        position:'relative',
        width:34*size, height:34*size, borderRadius:'50%',
        background:color, transform:`scale(${appear})`,
        boxShadow:`0 0 24px ${color}`,
        display:'grid', placeItems:'center',
        fontSize:18*size, fontFamily:VC.font, color:'#0e1320', fontWeight:700,
      }}>{glyph||''}</div>
    </div>
  );
}

// ── Caption (lower-third subtitle) ───────────────────────────────────────────
function Caption({ text, sub, start, end, y = 880, big = false, align='center' }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const inT = Easing.easeOutCubic(clamp(localTime/0.5,0,1));
        const outT = Easing.easeInCubic(clamp((localTime-(duration-0.4))/0.4,0,1));
        const op = inT*(1-outT);
        return (
          <div style={{
            position:'absolute', left:0, right:0, top:y,
            display:'flex', flexDirection:'column', alignItems: align==='left'?'flex-start':'center',
            paddingLeft: align==='left'? 120:0,
            opacity:op, transform:`translateY(${(1-inT)*26 - outT*14}px)`,
          }}>
            <div style={{
              fontFamily:VC.font, fontWeight:600, color:VC.cream,
              fontSize: big? 58:42, letterSpacing:'-0.01em', textAlign:'center',
              textShadow:'0 4px 30px rgba(0,0,0,.8)', maxWidth:1500, lineHeight:1.15,
            }}>{text}</div>
            {sub && <div style={{
              fontFamily:VC.font, fontWeight:400, color:VC.dim, fontSize:28, marginTop:10,
              textShadow:'0 3px 20px rgba(0,0,0,.8)',
            }}>{sub}</div>}
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Big centered statement ───────────────────────────────────────────────────
function Statement({ lines, start, end, accent = [], size = 76, y = '50%' }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const outT = Easing.easeInCubic(clamp((localTime-(duration-0.5))/0.5,0,1));
        return (
          <div style={{
            position:'absolute', left:0, right:0, top:y, transform:'translateY(-50%)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:6,
            opacity:1-outT,
          }}>
            {lines.map((ln,i)=>{
              const lt = clamp((localTime - i*0.28)/0.55, 0, 1);
              const e = Easing.easeOutCubic(lt);
              return (
                <div key={i} style={{
                  fontFamily:VC.font, fontWeight:700, fontSize:size, lineHeight:1.12,
                  letterSpacing:'-0.02em', textAlign:'center',
                  color: accent.includes(i)? VC.orange : VC.cream,
                  opacity:e, transform:`translateY(${(1-e)*30}px)`,
                  textShadow:'0 6px 40px rgba(0,0,0,.7)',
                }}>{ln}</div>
              );
            })}
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Camera rig: animate scale + focal point over the 1920×1080 frame ────────
function Camera({ kf, children }) {
  // kf: [{t, x, y, s}] — focal point (x,y) in frame coords and scale s
  const t = useTime();
  const xs = kf.map(k=>k.t);
  const fx = interpolate(xs, kf.map(k=>k.x), Easing.easeInOutCubic)(t);
  const fy = interpolate(xs, kf.map(k=>k.y), Easing.easeInOutCubic)(t);
  const s  = interpolate(xs, kf.map(k=>k.s), Easing.easeInOutCubic)(t);
  return (
    <div style={{
      position:'absolute', inset:0,
      transform:`scale(${s}) translate(${960-fx}px, ${540-fy}px)`,
      transformOrigin:'center',
      willChange:'transform',
    }}>{children}</div>
  );
}

// ── Stylized phone (hi-fi, dark UI) ──────────────────────────────────────────
function VPhone({ x, y, w = 340, rot = 0, children, style }) {
  const h = w*2.05;
  return (
    <div style={{
      position:'absolute', left:x, top:y, width:w, height:h,
      transform:`rotate(${rot}deg)`,
      background:'#05070d',
      borderRadius:w*0.135, padding:w*0.026,
      boxShadow:'0 30px 80px rgba(0,0,0,.6), inset 0 0 0 2px #2a3144',
      ...style,
    }}>
      <div style={{
        position:'relative', width:'100%', height:'100%',
        background:VC.bg2, borderRadius:w*0.11, overflow:'hidden',
      }}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
          width:w*0.34,height:w*0.075,background:'#05070d',borderRadius:`0 0 ${w*0.045}px ${w*0.045}px`,zIndex:50}}/>
        {children}
      </div>
    </div>
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix = '', prefix = '', start, dur = 1.4, size = 110, color = VC.cream, decimals = 0 }) {
  const t = useTime();
  const p = Easing.easeOutExpo(clamp((t-start)/dur, 0, 1));
  const v = (value*p).toFixed(decimals);
  return (
    <span style={{fontFamily:VC.font, fontWeight:700, fontSize:size, color, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em'}}>
      {prefix}{Number(v).toLocaleString('fr-FR')}{suffix}
    </span>
  );
}

// ── Timestamp label updater (for comment context) ────────────────────────────
function ScreenLabel({ rootId }) {
  const t = useTime();
  const sec = Math.floor(t);
  React.useEffect(()=>{
    const el = document.getElementById(rootId);
    if (el) el.setAttribute('data-screen-label', `t=${sec}s`);
  }, [sec, rootId]);
  return null;
}

Object.assign(window, { VC, CityMap, Rain, Ping, Caption, Statement, Camera, VPhone, Counter, ScreenLabel });
