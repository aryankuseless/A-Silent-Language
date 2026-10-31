// Animated 2D presenter who stands beside the slides and acts out each point.
// Teacher.slide(i) plays a slide's intro then its idle loop; Teacher.build(i, n) plays the action for click n.
(() => {
const SKIN = '#e9c3a4', SKIN_D = '#cfa283', LINE = '#2b1a12', HAIR = '#2b211a', GOLD = '#e8c27a', SHIRT = '#f4efe6', CUFF = '#ddd0ab', PANTS = '#3a3127', BOOT = '#1a1410';

// every hand shape is drawn with the wrist at 0,0 and the fingers pointing down (+y)
const HANDS = {
  open: '<path d="M-11,2 Q-13,14 -12,24 L-11,40 Q-9,44 -7,40 L-6,29 L-5,43 Q-3,47 -1,43 L0,29 L1,44 Q3,48 5,44 L6,29 L7,40 Q9,44 11,40 L12,22 Q17,16 22,12 Q25,7 20,6 Q15,8 11,11 L11,2 Z"/>',
  fist: '<path d="M-12,2 Q-15,18 -9,27 Q0,32 9,27 Q15,18 12,2 Z"/><path d="M-7,19 Q-4,22 -1,19 M1,19 Q4,22 7,19" fill="none"/>',
  point: '<path d="M-4,22 L-4,48 Q-1,52 2,48 L2,22 Z"/><path d="M-12,2 Q-15,18 -9,27 Q0,31 9,27 Q15,18 12,2 Z"/>',
  thumb: '<path d="M10,7 L29,5 Q34,9 29,13 L10,15 Z"/><path d="M-12,2 Q-15,18 -9,27 Q0,32 9,27 Q15,18 12,2 Z"/><path d="M-7,19 Q-4,22 -1,19 M1,19 Q4,22 7,19" fill="none"/>',
  ok: '<path d="M-6,26 L-6,42 Q-4,46 -2,42 L-1,28 L1,44 Q3,48 5,44 L6,28 L7,40 Q9,44 11,40 L12,22 L11,2 L-11,2 Q-13,14 -10,24 Z"/>' +
      `<circle cx="-11" cy="31" r="7" fill="none" stroke="${LINE}" stroke-width="7"/><circle cx="-11" cy="31" r="7" fill="none" stroke="${SKIN}" stroke-width="3.5"/>`
};

const MOUTH = {
  neutral: ['M-10,-38 Q0,-35 10,-38', 0],
  smile: ['M-13,-41 Q0,-29 13,-41', 0],
  big: ['M-15,-42 Q0,-22 15,-42 Q0,-36 -15,-42Z', 1],
  frown: ['M-11,-33 Q0,-41 11,-33', 0],
  o: ['M-5,-37 Q-5,-31 0,-31 Q5,-31 5,-37 Q5,-43 0,-43 Q-5,-43 -5,-37Z', 1],
  shh: ['M-4,-37 Q-4,-33 0,-33 Q4,-33 4,-37 Q4,-41 0,-41 Q-4,-41 -4,-37Z', 1],
  flat: ['M-9,-37 L9,-37', 0],
  fake: ['M-19,-43 Q0,-24 19,-43 Q0,-37 -19,-43Z', 1],
  worried: ['M-9,-35 Q0,-40 9,-35', 0],
  talk1: ['M-10,-40 Q0,-26 10,-40 Q0,-36 -10,-40Z', 1],
  talk2: ['M-8,-39 Q0,-32 8,-39 Q0,-37 -8,-39Z', 1]
};
// mouth, then brows as [left dy, left rotation, right dy, right rotation]
const FACE = {
  neutral: ['neutral', [0, 0, 0, 0]],
  smile: ['smile', [-2, 0, -2, 0]],
  big: ['big', [-4, 0, -4, 0]],
  frown: ['frown', [3, 14, 3, -14]],
  surprised: ['o', [-7, 0, -7, 0]],
  skeptic: ['flat', [2, 8, -8, -8]],
  shh: ['shh', [-2, 0, -2, 0]],
  fake: ['fake', [-1, -16, -1, 16]],
  worried: ['worried', [-2, -14, -2, 14]]
};

const handSet = () => Object.entries(HANDS).map(([k, v]) => `<g data-h="${k}" style="display:none">${v}</g>`).join('');

const svg = `
<svg viewBox="-150 0 490 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="tCloth" x1="0" x2="1"><stop offset="0" stop-color="#9a8a63"/><stop offset="1" stop-color="#665a3e"/></linearGradient>
    <linearGradient id="tGown" x1="0" x2="1"><stop offset="0" stop-color="#2a7350"/><stop offset="1" stop-color="#174a33"/></linearGradient>
    <radialGradient id="tSkin" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f5d8c0"/><stop offset="1" stop-color="${SKIN}"/></radialGradient>
  </defs>
  <ellipse cx="150" cy="590" rx="88" ry="9" fill="rgba(0,0,0,.4)"/>

  <g id="tPartner" opacity="0" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round">
    <rect x="-260" y="-13" width="230" height="26" rx="12" fill="url(#tGown)"/>
    <rect x="-40" y="-14" width="14" height="28" rx="5" fill="${SHIRT}"/>
    <g transform="translate(-27,0) rotate(-90)" fill="${SKIN}">${HANDS.open}</g>
  </g>

  <g stroke="${LINE}" stroke-width="3" stroke-linejoin="round">
    <path d="M106,366 L103,560 L141,560 L149,380 Z" fill="${PANTS}"/>
    <path d="M151,380 L159,560 L197,560 L194,366 Z" fill="${PANTS}"/>
    <path d="M104,480 L103,560 L141,560 L144,480 Z" fill="${BOOT}"/>
    <path d="M157,480 L159,560 L197,560 L196,480 Z" fill="${BOOT}"/>
    <path d="M97,557 Q93,580 102,587 L148,587 Q152,571 143,557 Z" fill="${BOOT}"/>
    <path d="M157,557 Q148,571 152,587 L198,587 Q207,580 203,557 Z" fill="${BOOT}"/>
    <path d="M112,500 Q120,494 128,500 M166,500 Q174,494 182,500" stroke="#4a4038" stroke-width="2" fill="none"/>
  </g>

  <g id="tTorso" stroke="${LINE}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <rect x="139" y="166" width="22" height="38" fill="${SKIN_D}"/>
    <path d="M92,214 Q98,196 128,192 L172,192 Q202,196 208,214 L215,300 Q213,350 197,373 L103,373 Q87,350 85,300 Z" fill="url(#tCloth)"/>
    <path d="M150,206 L150,372" stroke="#4a3f2b" stroke-width="2.5"/>
    <g fill="#3a2e1e" stroke-width="1.5"><circle cx="150" cy="262" r="3.6"/><circle cx="150" cy="292" r="3.6"/><circle cx="150" cy="322" r="3.6"/></g>
    <path d="M104,234 L136,234 L136,262 L104,262 Z M164,234 L196,234 L196,262 L164,262 Z" fill="#8a7a55" stroke-width="2.5"/>
    <path d="M104,234 L136,234 L134,246 L106,246 Z M164,234 L196,234 L194,246 L166,246 Z" fill="#7a6b48" stroke-width="2"/>
    <path d="M200,214 L112,348" stroke="#3a2a1a" stroke-width="8"/>
    <rect x="90" y="346" width="120" height="14" rx="4" fill="#3a2418"/>
    <rect x="141" y="344" width="18" height="18" rx="3" fill="#b8a46a"/>
    <path d="M126,192 L150,212 L174,192 L163,187 L150,199 L137,187 Z" fill="${CUFF}"/>
    <path d="M146,201 L154,201 L157,238 L150,246 L143,238 Z" fill="#4a3826" stroke-width="2.5"/>

    <g id="tHead">
      <ellipse cx="-40" cy="-62" rx="7" ry="10" fill="${SKIN}"/>
      <ellipse cx="40" cy="-62" rx="7" ry="10" fill="${SKIN}"/>
      <ellipse cx="0" cy="-66" rx="40" ry="46" fill="url(#tSkin)"/>
      <g fill="${HAIR}" stroke="${HAIR}">
        <path d="M-41,-70 Q-44,-104 -10,-114 Q28,-120 41,-94 L41,-74 Q36,-92 18,-97 Q-2,-101 -18,-92 Q-32,-84 -41,-70 Z"/>
        <path d="M16,-98 Q-6,-98 -22,-88 Q-34,-80 -37,-66 Q-26,-80 -10,-87 Q4,-93 16,-98 Z"/>
      </g>
      <g fill="#e07a6a" stroke="none" opacity=".22"><circle cx="-24" cy="-48" r="7"/><circle cx="24" cy="-48" r="7"/></g>
      <g id="tEyes">
        <ellipse cx="-14" cy="-66" rx="7.5" ry="8.5" fill="#fff" stroke-width="2"/>
        <ellipse cx="14" cy="-66" rx="7.5" ry="8.5" fill="#fff" stroke-width="2"/>
        <g id="tPupils" stroke="none"><circle cx="-14" cy="-65" r="4.3" fill="${LINE}"/><circle cx="14" cy="-65" r="4.3" fill="${LINE}"/>
          <circle cx="-12.5" cy="-67" r="1.4" fill="#fff"/><circle cx="15.5" cy="-67" r="1.4" fill="#fff"/></g>
      </g>
      <path id="tBrowL" d="M-22,-83 Q-14,-88 -6,-83" fill="none" stroke-width="4"/>
      <path id="tBrowR" d="M6,-83 Q14,-88 22,-83" fill="none" stroke-width="4"/>
      <path d="M0,-60 Q-5,-50 2,-48" fill="none" stroke-width="2.5"/>
      <path id="tMouth" d="" stroke-width="3"/>
      <rect x="-7.5" y="-47.5" width="15" height="7" rx="1.5" fill="${HAIR}" stroke="${HAIR}" stroke-width="1"/>
      <g id="tWaves" fill="none" stroke="${GOLD}" stroke-width="3.5" opacity="0">
        <path d="M-52,-50 Q-60,-38 -52,-26"/><path d="M-63,-57 Q-75,-38 -63,-19"/><path d="M-74,-64 Q-90,-38 -74,-12"/>
      </g>
    </g>

    <g id="tArmA">
      <rect x="-13" y="-6" width="26" height="96" rx="13" fill="url(#tCloth)"/>
      <circle cx="0" cy="0" r="17" fill="url(#tCloth)"/>
      <g id="tForeA">
        <rect x="-11" y="-6" width="22" height="82" rx="11" fill="url(#tCloth)"/>
        <rect x="-12" y="66" width="24" height="12" rx="5" fill="${CUFF}"/>
        <g id="tHandA" fill="${SKIN}" stroke-width="2.5">
          <g id="tStick" opacity="0"><line x1="-1" y1="28" x2="-1" y2="178" stroke="#6b4423" stroke-width="5"/><circle cx="-1" cy="180" r="4.5" fill="${SHIRT}" stroke-width="2"/></g>
          ${handSet()}
        </g>
      </g>
    </g>
    <g id="tArmB">
      <rect x="-13" y="-6" width="26" height="96" rx="13" fill="url(#tCloth)"/>
      <circle cx="0" cy="0" r="17" fill="url(#tCloth)"/>
      <g id="tForeB">
        <rect x="-11" y="-6" width="22" height="82" rx="11" fill="url(#tCloth)"/>
        <rect x="-9" y="52" width="18" height="9" rx="3" fill="${GOLD}" stroke-width="2"/>
        <rect x="-12" y="66" width="24" height="12" rx="5" fill="${CUFF}"/>
        <g id="tHandB" fill="${SKIN}" stroke-width="2.5">${handSet()}</g>
      </g>
    </g>
  </g>
</svg>`;

// ---------- poses ----------
// A is the arm on the screen-left (toward the slide text), B the screen-right one.
// Each arm is [wrist x, wrist y, hand angle, hand shape]; hand angle 0 = fingers down, 90 = left, -90 = right, 180 = up.
const D = { A: [90, 368, 0, 'open'], B: [210, 368, 0, 'open'], dy: 0, sq: 1, lean: 0, tilt: 0, hdy: 0, lx: 0, ly: 0,
  face: 'smile', talk: 0, stick: 0, waves: 0, partner: 0, pdy: 0, blink: 'n' };
const P = o => Object.assign({}, D, o);
const V = (base, o) => Object.assign({}, base, o);
const HIP_B = [196, 352, -20, 'fist'], HIP_A = [104, 352, 20, 'fist'];

const POSE = {};
POSE.rest = P({});
POSE.hips = P({ A: HIP_A, B: HIP_B });
POSE.explainA = P({ A: [54, 300, 55, 'open'], B: HIP_B, talk: 1, lx: -.6 });
POSE.explainB = P({ A: [42, 282, 76, 'open'], B: HIP_B, talk: 1, lx: -.6, tilt: -3 });
POSE.eyeTalkA = V(POSE.explainA, { lx: 0, ly: 0 });
POSE.eyeTalkB = V(POSE.explainB, { lx: 0, ly: 0, tilt: 2 });
POSE.pointBoard = P({ A: [-6, 300, 82, 'point'], B: HIP_B, stick: 1, lx: -1, tilt: -4, talk: 1 });
POSE.pointHigh = P({ A: [0, 222, 118, 'point'], B: HIP_B, stick: 1, lx: -1, ly: -.6, tilt: -6, talk: 1 });
POSE.shh = P({ A: HIP_A, B: [152, 204, 180, 'point'], face: 'shh' });
POSE.crossed = P({ A: [180, 284, -70, 'fist'], B: [120, 292, 70, 'fist'], face: 'frown', ly: 1, tilt: 6, hdy: 3 });
POSE.openWide = P({ A: [-14, 246, 125, 'open'], B: [314, 246, -125, 'open'], face: 'big', dy: -4 });
POSE.palmsUp = P({ A: [58, 268, 100, 'open'], B: [242, 268, -100, 'open'], talk: 1 });
POSE.palmsUp2 = V(POSE.palmsUp, { A: [52, 258, 108, 'open'], B: [248, 258, -108, 'open'] });
POSE.accuse1 = P({ A: [22, 232, 104, 'point'], B: HIP_B, face: 'frown', talk: 1, lean: -2, lx: -1 });
POSE.accuse2 = V(POSE.accuse1, { A: [36, 242, 96, 'point'] });
POSE.eyes = P({ A: HIP_A, B: [178, 182, 165, 'point'] });
POSE.nod = V(POSE.palmsUp, { talk: 0, face: 'big', tilt: 9, ly: .5 });
POSE.speakBig = P({ A: [40, 276, 62, 'open'], B: HIP_B, talk: 1, waves: 1, lx: -.5 });
POSE.speakJab = V(POSE.speakBig, { A: [54, 302, 46, 'open'] });
POSE.fingerUp = P({ A: [70, 206, 178, 'point'], B: HIP_B, face: 'neutral' });
POSE.shake = P({ A: HIP_A, B: [250, 330, -90, 'open'], partner: 1, lx: 1 });
POSE.shake2 = V(POSE.shake, { B: [250, 338, -90, 'open'] });
POSE.shakeDown = P({ A: HIP_A, B: [250, 322, -62, 'open'], partner: 1, pdy: 10, face: 'skeptic', lx: 1 });
POSE.shakeLimp = P({ A: HIP_A, B: [246, 344, -18, 'open'], partner: 1, pdy: 6, face: 'worried', lx: 1, dy: 4 });
POSE.watch = P({ A: HIP_A, B: [160, 264, -100, 'fist'], tilt: 8, lx: .3, ly: 1, face: 'neutral' });
POSE.watchTap = V(POSE.watch, { A: [150, 262, -60, 'point'], face: 'worried' });
POSE.thumb = P({ A: [56, 262, -90, 'thumb'], B: HIP_B, face: 'big' });
POSE.ok = P({ A: [56, 246, 180, 'ok'], B: HIP_B, face: 'big' });
POSE.collar = P({ A: [134, 212, 170, 'fist'], B: [166, 212, -170, 'fist'], tilt: -4 });
POSE.slouch = P({ dy: 14, sq: .95, tilt: 10, hdy: 4, ly: 1, face: 'fake', talk: 1, A: [100, 384, 0, 'open'], B: [200, 384, 0, 'open'] });
POSE.sigh = V(POSE.slouch, { dy: 20, sq: .93, tilt: 13, talk: 0, A: [100, 390, 0, 'open'], B: [200, 390, 0, 'open'] });
POSE.shrug = P({ A: [36, 250, 150, 'open'], B: [264, 250, -150, 'open'], dy: -6, face: 'surprised' });
POSE.neck = P({ A: [100, 384, 0, 'open'], B: [176, 204, 170, 'open'], dy: 10, tilt: 6, ly: .6, face: 'worried', blink: 'fast' });
POSE.neck2 = V(POSE.neck, { B: [182, 214, 160, 'open'] });
POSE.bow = P({ dy: 30, sq: .9, tilt: 16, hdy: 6, ly: 1, A: [124, 336, -30, 'open'], B: [176, 336, 30, 'open'] });
POSE.welcome = P({ A: [-4, 262, 110, 'open'], B: [304, 262, -110, 'open'], face: 'big' });
POSE.welcome2 = V(POSE.welcome, { A: [4, 276, 100, 'open'], B: [296, 276, -100, 'open'], tilt: 3 });
const pointAt = (y, h) => V(POSE.pointHigh, { A: [10, y, h, 'point'] });

// ---------- what the teacher does on each slide ----------
// a step is [pose, move ms, hold ms]; "loop" repeats after the steps finish
const EXPLAIN = [[POSE.explainA, 700, 900], [POSE.explainB, 700, 900]];
// a friendly nod with open palms; no raised-hand waves for this character
const GREET = [[V(POSE.palmsUp, { talk: 0, face: 'big' }), 500, 200], [POSE.nod, 300, 200], [V(POSE.palmsUp, { talk: 0, face: 'big' }), 300, 300]];
const SCRIPT = [
  // 1 · title: Speaker 1's silent, arms-crossed opening, then opening up
  { intro: [[POSE.crossed, 900, 5200], [POSE.openWide, 700, 900], ...GREET], loop: [[POSE.hips, 800, 4000]] },
  // 2 · wordless
  { intro: [[POSE.shh, 700, 2400], [POSE.pointBoard, 700, 2200]], loop: EXPLAIN },
  // 3 · kinesics: palms up, pointing, eye contact
  { intro: [[POSE.pointBoard, 700, 2000]], loop: EXPLAIN, builds: {
    1: { loop: [[POSE.palmsUp, 700, 700], [POSE.palmsUp2, 700, 700]] },
    2: { loop: [[POSE.accuse1, 260, 140], [POSE.accuse2, 260, 140]] },
    3: { steps: [[POSE.eyes, 600, 1600]], loop: [[POSE.eyeTalkA, 700, 900], [POSE.eyeTalkB, 700, 900]] } } },
  // 4 · paralanguage: emphasis, then the dramatic pause
  { intro: [[POSE.pointBoard, 700, 1800]], loop: EXPLAIN, builds: {
    1: { loop: [[POSE.speakBig, 350, 250], [POSE.speakJab, 350, 250]] },
    2: { loop: [[POSE.speakJab, 350, 250], [POSE.speakBig, 350, 250]] },
    3: { steps: [[POSE.fingerUp, 600, 0]] } } },
  // 5 · proxemics: points at the zones, then three handshakes with someone off-stage
  { intro: [[POSE.pointHigh, 700, 2600]], loop: EXPLAIN, builds: {
    1: { loop: [[POSE.shake, 600, 300], [POSE.shake2, 250, 100], [POSE.shake, 250, 600]] },
    2: { steps: [[POSE.shakeDown, 600, 0]] },
    3: { steps: [[POSE.shakeLimp, 700, 0]] } } },
  // 6 · chronemics: checks the watch, early, late, attire
  { intro: [[POSE.watch, 700, 900], [POSE.watchTap, 350, 250], [POSE.watch, 300, 250], [POSE.watchTap, 300, 250], [POSE.watch, 300, 700]], loop: EXPLAIN, builds: {
    1: { steps: [[POSE.thumb, 600, 0]] },
    2: { loop: [[POSE.watchTap, 260, 140], [POSE.watch, 260, 140]] },
    3: { steps: [[POSE.collar, 700, 1600]], loop: EXPLAIN } } },
  // 7 · culture: thumbs up, OK sign, eye contact
  { intro: [[POSE.pointBoard, 700, 2000]], loop: EXPLAIN, builds: {
    1: { steps: [[POSE.thumb, 600, 0]] },
    2: { steps: [[POSE.ok, 600, 0]] },
    3: { steps: [[POSE.eyes, 600, 1200], [V(POSE.hips, { ly: 1, tilt: 6, face: 'neutral' }), 700, 0]] } } },
  // 8 · incongruence: says "I'm excited" while slouching
  { intro: [], loop: [[POSE.slouch, 800, 1600], [POSE.sigh, 900, 900]], builds: {
    1: { steps: [[POSE.shrug, 400, 0]] },
    2: { loop: [[POSE.neck, 400, 600], [POSE.neck2, 400, 600]] } } },
  // 9 · blueprint: points from the iceberg's tip down to what's hidden
  { intro: [[pointAt(240, 152), 700, 2200]], loop: EXPLAIN, builds: {
    1: { steps: [[pointAt(240, 145), 500, 0]] }, 2: { steps: [[pointAt(240, 139), 500, 0]] },
    3: { steps: [[pointAt(240, 131), 500, 0]] }, 4: { steps: [[pointAt(240, 123), 500, 0]] } } },
  // 10 · thank you: bow, wave, invite questions
  { intro: [[POSE.bow, 900, 900], [POSE.rest, 700, 150], ...GREET], loop: [[POSE.welcome, 800, 1600], [POSE.welcome2, 800, 1600]] }
];

// ---------- rig ----------
const host = document.createElement('div');
host.className = 'teacher';
host.innerHTML = svg;
document.body.appendChild(host);
const q = id => host.querySelector('#' + id);
const el = { torso: q('tTorso'), head: q('tHead'), eyes: q('tEyes'), pupils: q('tPupils'), browL: q('tBrowL'), browR: q('tBrowR'),
  mouth: q('tMouth'), waves: q('tWaves'), stick: q('tStick'), partner: q('tPartner'),
  A: { arm: q('tArmA'), fore: q('tForeA'), hand: q('tHandA'), sx: 98, sy: 214, shape: '' },
  B: { arm: q('tArmB'), fore: q('tForeB'), hand: q('tHandB'), sx: 202, sy: 214, shape: '' } };

const L1 = 84, L2 = 80, DEG = 180 / Math.PI;
// two-bone IK: returns absolute rotations (0 = hanging down) for the upper arm and forearm, elbow kept outward
function ik(sx, sy, tx, ty, side) {
  const d = Math.min(Math.max(Math.hypot(tx - sx, ty - sy), 10), L1 + L2 - .5);
  const a = Math.atan2(ty - sy, tx - sx);
  const al = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  let best = null;
  for (const s of [1, -1]) {
    const p1 = a + s * al, ex = sx + Math.cos(p1) * L1, ey = sy + Math.sin(p1) * L1;
    const score = (side === 'A' ? -ex : ex) + ey * .6;
    if (!best || score > best.score) best = { score, p1, ex, ey };
  }
  return [best.p1 * DEG - 90, Math.atan2(ty - best.ey, tx - best.ex) * DEG - 90];
}

const clone = o => JSON.parse(JSON.stringify(o));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
function mix(a, b, t) {
  const o = {};
  for (const k in b) {
    if (Array.isArray(b[k])) o[k] = [lerp(a[k][0], b[k][0], t), lerp(a[k][1], b[k][1], t), lerp(a[k][2], b[k][2], t), t < .45 ? a[k][3] : b[k][3]];
    else if (typeof b[k] === 'number') o[k] = lerp(a[k], b[k], t);
    else o[k] = t < .5 ? a[k] : b[k];
  }
  o.brows = FACE[b.face][1].map((v, i) => lerp((a.brows || FACE[a.face][1])[i], v, t));
  return o;
}

let state = clone(POSE.rest), from = state, to = POSE.rest, t0 = 0, dur = 1, holdUntil = 0, steps = [], si = 0, loop = null;
function run(seq, lp) { steps = seq || []; loop = lp || null; si = -1; advance(performance.now()); }
function advance(now) {
  si++;
  if (si >= steps.length) {
    if (!loop || !loop.length) { steps = []; return; }
    steps = loop; si = 0;
  }
  const [pose, ms, hold] = steps[si];
  from = clone(state); to = pose; t0 = now; dur = Math.max(1, ms); holdUntil = now + ms + (hold || 0);
}

function setArm(side, s) {
  const a = el[side], [x, y, h, shape] = s[side];
  const [t1, t2] = ik(a.sx, a.sy, x, y, side);
  a.arm.setAttribute('transform', `translate(${a.sx},${a.sy}) rotate(${t1})`);
  a.fore.setAttribute('transform', `translate(0,${L1}) rotate(${t2 - t1})`);
  a.hand.setAttribute('transform', `translate(0,${L2}) rotate(${h - t2})${side === 'B' ? ' scale(-1,1)' : ''}`);
  if (a.shape !== shape) {
    a.hand.querySelectorAll('[data-h]').forEach(g => g.style.display = g.dataset.h === shape ? '' : 'none');
    a.shape = shape;
  }
}

let nextBlink = 0, blinkEnd = 0, nextTalk = 0, talkKey = 'talk1', mouthKey = '';
function render(now) {
  const s = state, br = Math.sin(now / 700);
  el.torso.setAttribute('transform', `translate(0,${s.dy + br * .8}) translate(150,372) rotate(${s.lean}) scale(1,${s.sq + br * .005}) translate(-150,-372)`);
  el.head.setAttribute('transform', `translate(150,198) rotate(${s.tilt + Math.sin(now / 1300) * 1.5}) translate(0,${s.hdy}) scale(1.12)`);
  setArm('A', s); setArm('B', s);

  el.pupils.setAttribute('transform', `translate(${s.lx * 3.5},${s.ly * 3})`);
  if (now > nextBlink) { blinkEnd = now + 130; nextBlink = now + (s.blink === 'fast' ? 260 + Math.random() * 200 : 2400 + Math.random() * 2600); }
  el.eyes.setAttribute('transform', `translate(0,-66) scale(1,${now < blinkEnd ? .1 : 1}) translate(0,66)`);
  const b = s.brows || FACE[s.face][1];
  el.browL.setAttribute('transform', `translate(0,${b[0]}) rotate(${b[1]},-14,-82)`);
  el.browR.setAttribute('transform', `translate(0,${b[2]}) rotate(${b[3]},14,-82)`);

  if (s.talk && now > nextTalk) {
    const opts = ['talk1', 'talk2', FACE[s.face][0]];
    talkKey = opts[Math.floor(Math.random() * opts.length)];
    nextTalk = now + 90 + Math.random() * 120;
  }
  const mk = s.talk ? talkKey : FACE[s.face][0];
  if (mk !== mouthKey) {
    el.mouth.setAttribute('d', MOUTH[mk][0]);
    el.mouth.setAttribute('fill', MOUTH[mk][1] ? '#6b2020' : 'none');
    mouthKey = mk;
  }

  el.waves.setAttribute('opacity', s.waves.toFixed(2));
  [...el.waves.children].forEach((p, i) => p.setAttribute('opacity', (.35 + .65 * Math.max(0, Math.sin(now / 160 - i * .9))).toFixed(2)));
  el.stick.setAttribute('opacity', s.stick.toFixed(2));
  el.partner.setAttribute('opacity', s.partner.toFixed(2));
  // someone off-stage on the right reaches in to shake the teacher's right-side hand
  el.partner.setAttribute('transform', `translate(${s.B[0] + 48 + (1 - s.partner) * 150},${s.B[1] + s.pdy + s.dy}) scale(-1,1)`);
}

function frame(now) {
  const p = Math.min(1, (now - t0) / dur);
  state = mix(from, to, ease(p));
  if (steps.length && now >= holdUntil) advance(now);
  render(now);
  requestAnimationFrame(frame);
}

window.Teacher = {
  slide(i) {
    const sc = SCRIPT[i];
    if (sc) run(sc.intro, sc.loop);
  },
  build(i, n) {
    const sc = SCRIPT[i];
    if (!sc) return;
    if (!n) { run([], sc.loop); return; }
    const b = sc.builds && sc.builds[n];
    if (b) run(b.steps, b.loop);
  }
};

render(performance.now());
requestAnimationFrame(frame);
setTimeout(() => host.classList.add('on'), 200);
})();
