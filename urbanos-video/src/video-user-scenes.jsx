// video-user-scenes.jsx — « Une journée avec UrbanOS » (thème clair, POV utilisatrice)
const { Sprite, useSprite, useTime, Easing, interpolate, animate, clamp, Camera, Counter } = window;
const { LC, CityMapLight, LCaption, LStatement, LPing, Car, LPhone } = window;

// check volant (confirmation citoyenne)
function LFlyCheck({ fromX, fromY, toX, toY, born }){
  const t = useTime();
  if (t < born || t > born+0.9) return null;
  const p = Easing.easeInOutCubic(clamp((t-born)/0.8,0,1));
  const x = fromX + (toX-fromX)*p;
  const y = fromY + (toY-fromY)*p - Math.sin(p*Math.PI)*70;
  return (
    <div style={{position:'absolute',left:x,top:y,transform:'translate(-50%,-50%)',
      width:34,height:34,borderRadius:'50%',background:LC.green,border:'3px solid #fff',
      display:'grid',placeItems:'center',fontSize:17,color:'#fff',fontWeight:700,
      fontFamily:LC.font, opacity:p>0.95?(1-(p-0.95)/0.05):1,
      boxShadow:'0 6px 16px rgba(38,36,31,.25)'}}>✓</div>
  );
}

// carte de notification (espace écran)
function NotifCard({ start, end, x=120, y=120, w=560, title, sub, tone=LC.orange }){
  return (
    <Sprite start={start} end={end}>
      {({localTime,duration})=>{
        const e=Easing.easeOutBack(clamp(localTime/0.6,0,1));
        const o=1-Easing.easeInCubic(clamp((localTime-(duration-0.4))/0.4,0,1));
        return (
          <div style={{position:'absolute',left:x,top:y,width:w,
            transform:`scale(${e})`,transformOrigin:'top left',opacity:o,
            background:'#fff',border:`3px solid ${tone}`,borderRadius:20,
            padding:'18px 24px',boxShadow:'0 18px 50px rgba(38,36,31,.18)',
            display:'flex',gap:16,alignItems:'center',fontFamily:LC.font}}>
            <div style={{width:54,height:54,borderRadius:16,background:tone,flex:'none',
              display:'grid',placeItems:'center',fontSize:26,color:'#fff'}}>⚠</div>
            <div>
              <div style={{fontWeight:700,fontSize:27,color:LC.ink,lineHeight:1.1}}>{title}</div>
              <div style={{fontSize:21,color:LC.dim,marginTop:4}}>{sub}</div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Acte continu sur carte · 0–56 s ──────────────────────────────────────────
function USceneVille(){
  return (
    <Sprite start={0} end={56}>
      {({localTime: t})=>(
        <React.Fragment>
          <Camera kf={[
            {t:0,   x:340,  y:400, s:1.7},
            {t:8,   x:780,  y:360, s:1.6},
            {t:10.5,x:1180, y:400, s:1.22},
            {t:14,  x:1100, y:400, s:1.35},
            {t:19,  x:1120, y:560, s:1.45},
            {t:24,  x:1430, y:580, s:1.45},
            {t:28,  x:1380, y:580, s:1.62},
            {t:43,  x:1380, y:580, s:1.55},
            {t:49,  x:1020, y:540, s:1.0},
            {t:56,  x:980,  y:540, s:1.05},
          ]}>
            <CityMapLight/>

            {/* itinéraire prévu (avant déviation) */}
            <Sprite start={0} end={15}>
              <svg style={{position:'absolute',inset:0}} viewBox="0 0 1920 1080" width="1920" height="1080">
                <path d="M -40 320 L 1960 280" stroke={LC.blue} strokeWidth="8"
                      strokeDasharray="20 14" fill="none" opacity="0.35"/>
              </svg>
            </Sprite>
            {/* déviation proposée */}
            <Sprite start={12} end={26}>
              {({localTime:lt})=>{
                const draw=Easing.easeInOutCubic(clamp(lt/1.2,0,1));
                return (
                  <svg style={{position:'absolute',inset:0}} viewBox="0 0 1920 1080" width="1920" height="1080">
                    <path d="M 1093 298 L 1110 612 L 1960 593"
                          stroke={LC.green} strokeWidth="9" fill="none"
                          strokeDasharray="1300" strokeDashoffset={1300*(1-draw)}
                          strokeLinecap="round" opacity="0.8"/>
                  </svg>
                );
              }}
            </Sprite>

            {/* accident devant elle */}
            <LPing x={1500} y={288} born={10.2} dead={48} color={LC.red} glyph="!"/>
            {/* inondation qu'elle découvre */}
            <Sprite start={29.5} end={56}>
              <LPing x={1700} y={601} born={29.5} color={LC.blue} glyph="≈"/>
            </Sprite>

            {/* la voiture d'Amina */}
            <Car kf={[
              {t:0.5,x:-80, y:324},
              {t:9,  x:700, y:307},
              {t:14, x:1060,y:299},
              {t:15.5,x:1097,y:330},
              {t:19, x:1107,y:560},
              {t:20.5,x:1135,y:611},
              {t:25, x:1480,y:605},
              {t:56, x:1480,y:605},
            ]} color={LC.ink}/>

            {/* confirmations qui convergent vers son signal */}
            <LFlyCheck fromX={1560} fromY={440} toX={1700} toY={601} born={36.0}/>
            <LFlyCheck fromX={1880} fromY={470} toX={1700} toY={601} born={36.5}/>
            <LFlyCheck fromX={1620} fromY={760} toX={1700} toY={601} born={37.0}/>
            <LFlyCheck fromX={1860} fromY={730} toX={1700} toY={601} born={37.5}/>
            <Sprite start={38.2} end={48}>
              {({localTime:lt})=>{
                const e=Easing.easeOutBack(clamp(lt/0.5,0,1));
                return (
                  <div style={{position:'absolute',left:1700,top:518,transform:`translate(-50%,-100%) scale(${e})`,
                    background:'#fff',border:`3px solid ${LC.green}`,borderRadius:999,
                    padding:'8px 20px',fontFamily:LC.font,fontWeight:600,fontSize:24,color:LC.ink,
                    boxShadow:'0 10px 30px rgba(38,36,31,.18)'}}>
                    ✓ confirmé ×5
                  </div>
                );
              }}
            </Sprite>

            {/* effet d'onde : la ville est prévenue */}
            {[[300,250],[700,180],[520,470],[940,460],[260,690],[700,820],[1180,800],[920,940],[1350,420],[160,420]].map(([x,y],i)=>(
              <Sprite key={i} start={45+i*0.25} end={56}>
                {({localTime:lt})=>{
                  const e=Easing.easeOutBack(clamp(lt/0.5,0,1));
                  return (
                    <div style={{position:'absolute',left:x,top:y,transform:`translate(-50%,-50%) scale(${e})`,
                      width:30,height:30,borderRadius:'50%',background:'#fff',
                      border:`3px solid ${LC.orange}`,display:'grid',placeItems:'center',
                      fontSize:14,boxShadow:'0 4px 12px rgba(38,36,31,.18)'}}>📱</div>
                  );
                }}
              </Sprite>
            ))}
          </Camera>

          {/* ── couches espace écran ── */}
          <Sprite start={0.6} end={6}>
            {({localTime:lt,duration})=>{
              const e=Easing.easeOutCubic(clamp(lt/0.6,0,1));
              const o=1-Easing.easeInCubic(clamp((lt-(duration-0.5))/0.5,0,1));
              return (
                <div style={{position:'absolute',left:120,top:110,opacity:e*o}}>
                  <div style={{fontFamily:LC.mono,fontSize:26,color:LC.dim,letterSpacing:'.12em'}}>MARDI · 07:02 · YAOUNDÉ</div>
                </div>
              );
            }}
          </Sprite>

          <NotifCard start={10.8} end={16.5} x={1180} y={110}
                     title="Accident à 1,2 km" sub="Déviation proposée · +3 min seulement" tone={LC.red}/>

          {/* l'écran de signalement, en vignette téléphone */}
          <Sprite start={26} end={33}>
            {({localTime:lt,duration})=>{
              const e=Easing.easeOutBack(clamp(lt/0.7,0,1));
              const o=1-Easing.easeInCubic(clamp((lt-(duration-0.4))/0.4,0,1));
              const tapped = lt>2.2;
              const tapPulse = 1 + (lt>2 && lt<2.35 ? Math.sin((lt-2)*Math.PI/0.35)*0.08 : 0);
              return (
                <div style={{position:'absolute',left:110,top:170,transform:`scale(${e})`,transformOrigin:'top left',opacity:o}}>
                  <LPhone x={0} y={0} w={310}>
                    <div style={{position:'absolute',inset:0,padding:'52px 20px 20px',display:'flex',flexDirection:'column',gap:14,fontFamily:LC.font}}>
                      <div style={{fontWeight:700,fontSize:24,color:LC.ink}}>Route inondée devant vous ?</div>
                      <div style={{fontSize:17,color:LC.dim}}>📍 Position détectée · Axe Omnisports</div>
                      <div style={{flex:1}}/>
                      {!tapped ? (
                        <div style={{background:LC.orange,borderRadius:18,padding:'24px 0',textAlign:'center',
                          fontWeight:700,fontSize:25,color:'#fff',transform:`scale(${tapPulse})`,
                          boxShadow:'0 12px 30px rgba(232,100,47,.4)'}}>≈ Signaler l'inondation</div>
                      ) : (
                        <div style={{background:LC.green,borderRadius:18,padding:'24px 0',textAlign:'center',
                          fontWeight:700,fontSize:25,color:'#fff'}}>✓ Envoyé</div>
                      )}
                      <div style={{fontSize:15,color:LC.dim,textAlign:'center'}}>3 secondes · géolocalisé · hors-ligne OK</div>
                    </div>
                  </LPhone>
                </div>
              );
            }}
          </Sprite>

          {/* chip mairie informée */}
          <Sprite start={50} end={56}>
            {({localTime:lt})=>{
              const e=Easing.easeOutCubic(clamp(lt/0.5,0,1));
              return (
                <div style={{position:'absolute',left:'50%',top:120,transform:`translateX(-50%) translateY(${(1-e)*-20}px)`,opacity:e,
                  background:'#fff',border:`3px solid ${LC.ink}`,borderRadius:999,padding:'14px 30px',
                  fontFamily:LC.font,fontWeight:600,fontSize:26,color:LC.ink,
                  boxShadow:'0 14px 36px rgba(38,36,31,.15)'}}>
                  🏛 Mairie informée · équipe de pompage dépêchée
                </div>
              );
            }}
          </Sprite>

          {/* sous-titres */}
          <LCaption start={1.4}  end={8}    big text="07h02. Amina prend la route du travail."/>
          <LCaption start={10.8} end={15.8} text="UrbanOS la prévient avant le bouchon."
                    sub="Accident signalé par d'autres conducteurs, 12 min plus tôt."/>
          <LCaption start={16.2} end={21.5} text="Elle suit la déviation. +3 min au lieu de +40."/>
          <LCaption start={23.5} end={26.5} text="Plus loin, une route inondée. Personne ne l'a encore signalée."/>
          <LCaption start={27.5} end={33}   text="Un geste. 3 secondes. C'est signalé."/>
          <LCaption start={35}   end={41}   text="D'autres conducteurs confirment. Le signal devient fiable."/>
          <LCaption start={44.5} end={50}   text="Le signal d'Amina prévient des centaines de conducteurs."/>
          <LCaption start={50.5} end={56}   text="Et la ville intervient — avant l'embouteillage."/>
        </React.Fragment>
      )}
    </Sprite>
  );
}

// ── Bénéfices · 56–66 s ───────────────────────────────────────────────────────
function USceneBenefices(){
  const items = [
    ['⏱','Du temps gagné','Alertée avant les bouchons,\ndéviée avant les dangers.'],
    ['🛡','Des trajets plus sûrs','Inondations, accidents, nids-de-poule :\nvus avant d\'y être.'],
    ['◎','Une ville plus réactive','Chaque signal aide des centaines\nd\'autres habitants.'],
  ];
  return (
    <Sprite start={56} end={66}>
      {({localTime:lt})=>(
        <div style={{position:'absolute',inset:0,background:LC.bg}}>
          <LStatement start={56.3} end={66} size={62} y={'22%'}
            lines={['Avec UrbanOS, chaque trajet','rend la ville plus sûre.']} accent={[1]}/>
          <div style={{position:'absolute',left:0,right:0,top:430,display:'flex',justifyContent:'center',gap:44}}>
            {items.map(([g,t,d],i)=>{
              const e=Easing.easeOutCubic(clamp((lt-1.3-i*0.35)/0.7,0,1));
              return (
                <div key={t} style={{width:430,background:'#fff',border:`3px solid ${LC.ink}`,
                  borderRadius:26,padding:'40px 36px',textAlign:'center',
                  opacity:e,transform:`translateY(${(1-e)*40}px)`,
                  boxShadow:'0 20px 50px rgba(38,36,31,.1)',fontFamily:LC.font}}>
                  <div style={{width:84,height:84,margin:'0 auto',borderRadius:24,background:LC.orangeSoft,
                    display:'grid',placeItems:'center',fontSize:40}}>{g}</div>
                  <div style={{fontWeight:700,fontSize:33,color:LC.ink,marginTop:22}}>{t}</div>
                  <div style={{fontSize:23,color:LC.dim,marginTop:12,lineHeight:1.4,whiteSpace:'pre-line'}}>{d}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Sprite>
  );
}

// ── Signature · 66–74 s ───────────────────────────────────────────────────────
function USceneOutro(){
  return (
    <Sprite start={66} end={74.01}>
      {({localTime:lt})=>{
        const logoIn = Easing.easeOutBack(clamp((lt-0.4)/0.8,0,1));
        const tagIn  = Easing.easeOutCubic(clamp((lt-1.3)/0.7,0,1));
        const byIn   = Easing.easeOutCubic(clamp((lt-2.1)/0.7,0,1));
        return (
          <div style={{position:'absolute',inset:0,background:LC.bg}}>
            <CityMapLight style={{opacity:.35, transform:`scale(${1.1+lt*0.004})`}}/>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:26}}>
              <div style={{display:'flex',alignItems:'center',gap:26,transform:`scale(${logoIn})`,opacity:logoIn}}>
                <div style={{width:104,height:104,borderRadius:28,background:LC.orange,
                  display:'grid',placeItems:'center',fontSize:50,color:'#fff',
                  boxShadow:'0 20px 50px rgba(232,100,47,.4)'}}>◎</div>
                <div style={{fontFamily:LC.font,fontWeight:700,fontSize:104,color:LC.ink,letterSpacing:'-0.02em'}}>UrbanOS</div>
              </div>
              <div style={{fontFamily:LC.font,fontSize:38,color:LC.ink,opacity:tagIn,transform:`translateY(${(1-tagIn)*18}px)`}}>
                Votre trajet, plus sûr. Votre ville, <span style={{color:LC.orange,fontWeight:600}}>plus intelligente</span>.
              </div>
              <div style={{fontFamily:LC.font,fontSize:25,color:LC.dim,opacity:byIn,marginTop:14}}>
                Gratuit · pensé pour les réseaux faibles · Porté par NGABANG Ludovic Aggaï
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

Object.assign(window, { USceneVille, USceneBenefices, USceneOutro });
