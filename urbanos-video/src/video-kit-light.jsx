// video-kit-light.jsx — light-theme components for the UrbanOS user video
const { Sprite, useSprite, useTime, Easing, interpolate, animate, clamp } = window;

const LC = {
  bg: '#f5f1e8',          // warm paper
  bg2: '#ffffff',
  road: '#ffffff',
  roadEdge: '#d8d2c4',
  block: '#eae4d6',
  blockEdge: '#ddd5c3',
  ink: '#26241f',
  dim: '#8d8678',
  orange: '#e8642f',
  orangeSoft: '#fbe3d6',
  green: '#1f8a5b',
  blue: '#2f6fd6',
  red: '#d6373b',
  font: "'Space Grotesk','Inter',system-ui,sans-serif",
  mono: "'JetBrains Mono',ui-monospace,monospace",
};

// ── Daylight city map (1920×1080) — same street grid as the night map ───────
function CityMapLight({ style }) {
  return (
    <svg viewBox="0 0 1920 1080" width="1920" height="1080"
         style={{position:'absolute', inset:0, ...style}}>
      <rect width="1920" height="1080" fill={LC.bg}/>
      {/* parks */}
      <g fill="#dde7d2">
        <rect x="470" y="60" width="240" height="170" rx="12"/>
        <rect x="1210" y="630" width="270" height="240" rx="12"/>
      </g>
      {/* blocks */}
      <g fill={LC.block} stroke={LC.blockEdge} strokeWidth="2">
        <rect x="120" y="90" width="300" height="200" rx="10"/>
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
        <rect x="1540" y="700" width="280" height="220" rx="10"/>
      </g>
      {/* river */}
      <path d="M -50 980 C 400 920, 700 1010, 1100 950 S 1850 900, 2000 960"
            stroke="#bcd3e8" strokeWidth="46" fill="none" strokeLinecap="round"/>
      {/* main roads : white with soft edge */}
      <g stroke={LC.roadEdge} strokeWidth="20" fill="none" strokeLinecap="round">
        <path d="M -40 320 L 1960 280"/>
        <path d="M -40 630 L 1960 600"/>
        <path d="M 380 -40 L 440 1120"/>
        <path d="M 1080 -40 L 1130 1120"/>
        <path d="M 1460 -40 L 1500 1120"/>
        <path d="M -40 60 C 500 140, 1300 30, 1960 110"/>
        <path d="M 740 -40 C 760 400, 700 800, 780 1120"/>
      </g>
      <g stroke={LC.road} strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M -40 320 L 1960 280"/>
        <path d="M -40 630 L 1960 600"/>
        <path d="M 380 -40 L 440 1120"/>
        <path d="M 1080 -40 L 1130 1120"/>
        <path d="M 1460 -40 L 1500 1120"/>
        <path d="M -40 60 C 500 140, 1300 30, 1960 110"/>
        <path d="M 740 -40 C 760 400, 700 800, 780 1120"/>
      </g>
      {/* secondary roads */}
      <g stroke="#efe9dc" strokeWidth="8" fill="none">
        <path d="M -40 470 L 1960 450"/>
        <path d="M -40 820 L 1960 790"/>
        <path d="M 200 -40 L 240 1120"/>
        <path d="M 600 -40 L 640 1120"/>
        <path d="M 900 -40 L 930 1120"/>
        <path d="M 1290 -40 L 1320 1120"/>
        <path d="M 1680 -40 L 1710 1120"/>
      </g>
    </svg>
  );
}

// ── Light captions / statements ──────────────────────────────────────────────
function LCaption({ text, sub, start, end, y = 880, big = false }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const inT = Easing.easeOutCubic(clamp(localTime/0.5,0,1));
        const outT = Easing.easeInCubic(clamp((localTime-(duration-0.4))/0.4,0,1));
        return (
          <div style={{
            position:'absolute', left:0, right:0, top:y,
            display:'flex', flexDirection:'column', alignItems:'center',
            opacity:inT*(1-outT), transform:`translateY(${(1-inT)*26 - outT*14}px)`,
          }}>
            <div style={{
              fontFamily:LC.font, fontWeight:600, color:LC.ink,
              fontSize: big? 58:42, letterSpacing:'-0.01em', textAlign:'center',
              maxWidth:1500, lineHeight:1.15,
              textShadow:'0 2px 18px rgba(245,241,232,.9)',
            }}>{text}</div>
            {sub && <div style={{
              fontFamily:LC.font, fontWeight:400, color:LC.dim, fontSize:28, marginTop:10,
            }}>{sub}</div>}
          </div>
        );
      }}
    </Sprite>
  );
}

function LStatement({ lines, start, end, accent = [], size = 76, y = '50%' }) {
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
                  fontFamily:LC.font, fontWeight:700, fontSize:size, lineHeight:1.12,
                  letterSpacing:'-0.02em', textAlign:'center',
                  color: accent.includes(i)? LC.orange : LC.ink,
                  opacity:e, transform:`translateY(${(1-e)*30}px)`,
                }}>{ln}</div>
              );
            })}
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Ping adapted to light bg ─────────────────────────────────────────────────
function LPing({ x, y, color = LC.orange, born = 0, dead = Infinity, size = 1, glyph }) {
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
          opacity:(1-rt)*0.45*fade,
        }}/>;
      })}
      <div style={{
        position:'relative',
        width:36*size, height:36*size, borderRadius:'50%',
        background:color, transform:`scale(${appear})`,
        boxShadow:`0 6px 18px rgba(38,36,31,.3)`,
        border:'3px solid #fff',
        display:'grid', placeItems:'center',
        fontSize:17*size, fontFamily:LC.font, color:'#fff', fontWeight:700,
      }}>{glyph||''}</div>
    </div>
  );
}

// ── Car dot following keyframes ──────────────────────────────────────────────
function Car({ kf, color = LC.ink }) {
  // kf: [{t,x,y}] — position keyframes; orientation from movement direction
  const t = useTime();
  const xs = kf.map(k=>k.t);
  const x = interpolate(xs, kf.map(k=>k.x), Easing.easeInOutSine)(t);
  const y = interpolate(xs, kf.map(k=>k.y), Easing.easeInOutSine)(t);
  const x2 = interpolate(xs, kf.map(k=>k.x), Easing.easeInOutSine)(t+0.1);
  const y2 = interpolate(xs, kf.map(k=>k.y), Easing.easeInOutSine)(t+0.1);
  const ang = Math.atan2(y2-y, x2-x)*180/Math.PI;
  return (
    <div style={{position:'absolute', left:x, top:y, transform:`translate(-50%,-50%) rotate(${ang}deg)`}}>
      <div style={{width:46, height:26, borderRadius:9, background:color,
        boxShadow:'0 4px 12px rgba(38,36,31,.35)', position:'relative'}}>
        <div style={{position:'absolute',right:4,top:4,bottom:4,width:10,borderRadius:5,background:'#f5f1e8',opacity:.85}}/>
      </div>
    </div>
  );
}

// ── Light phone ──────────────────────────────────────────────────────────────
function LPhone({ x, y, w = 340, rot = 0, children, style }) {
  const h = w*2.05;
  return (
    <div style={{
      position:'absolute', left:x, top:y, width:w, height:h,
      transform:`rotate(${rot}deg)`,
      background:'#26241f',
      borderRadius:w*0.135, padding:w*0.026,
      boxShadow:'0 30px 70px rgba(38,36,31,.35)',
      ...style,
    }}>
      <div style={{
        position:'relative', width:'100%', height:'100%',
        background:LC.bg2, borderRadius:w*0.11, overflow:'hidden',
      }}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
          width:w*0.34,height:w*0.075,background:'#26241f',borderRadius:`0 0 ${w*0.045}px ${w*0.045}px`,zIndex:50}}/>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { LC, CityMapLight, LCaption, LStatement, LPing, Car, LPhone });
