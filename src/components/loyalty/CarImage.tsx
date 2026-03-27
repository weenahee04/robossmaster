'use client';

import { useState, useMemo } from 'react';
import { CAR_COLORS } from '@/lib/car-images';

interface CarImageProps {
  make?: string;
  model?: string;
  color?: string;
  className?: string;
}

type BodyType = 'sedan' | 'suv' | 'pickup' | 'hatchback' | 'motorcycle';

const BODY_TYPE_MAP: Record<string, BodyType> = {
  'fortuner': 'suv', 'c-hr': 'suv', 'corolla cross': 'suv', 'rush': 'suv',
  'hr-v': 'suv', 'cr-v': 'suv', 'br-v': 'suv', 'wr-v': 'suv',
  'cx-3': 'suv', 'cx-5': 'suv', 'cx-30': 'suv', 'cx-60': 'suv',
  'kicks': 'suv', 'x-trail': 'suv', 'terra': 'suv',
  'xpander': 'suv', 'pajero sport': 'suv', 'outlander': 'suv',
  'mu-x': 'suv', 'jimny': 'suv', 'everest': 'suv',
  'captiva': 'suv', 'trailblazer': 'suv', 'zs': 'suv', 'hs': 'suv',
  'gla': 'suv', 'glc': 'suv', 'gle': 'suv', 'gls': 'suv',
  'x1': 'suv', 'x3': 'suv', 'x5': 'suv', 'x7': 'suv', 'ix': 'suv',
  'q3': 'suv', 'q5': 'suv', 'q7': 'suv', 'e-tron': 'suv',
  'nx': 'suv', 'rx': 'suv', 'ux': 'suv', 'lx': 'suv',
  'xc40': 'suv', 'xc60': 'suv', 'xc90': 'suv',
  'cayenne': 'suv', 'macan': 'suv',
  'haval h6': 'suv', 'haval jolion': 'suv', 'tank 300': 'suv',
  'atto 3': 'suv', 'xv': 'suv', 'forester': 'suv', 'outback': 'suv',
  'territory': 'suv', 'land cruiser': 'suv',
  'hilux revo': 'pickup', 'hilux vigo': 'pickup',
  'navara': 'pickup', 'triton': 'pickup',
  'd-max': 'pickup', 'bt-50': 'pickup',
  'ranger': 'pickup', 'colorado': 'pickup', 'extender': 'pickup',
  'yaris': 'hatchback', 'jazz': 'hatchback', 'note': 'hatchback',
  'mazda2': 'hatchback', 'mazda3': 'hatchback', 'swift': 'hatchback',
  'mirage': 'hatchback', 'mg3': 'hatchback', 'mg4': 'hatchback',
  'a-class': 'hatchback', '1 series': 'hatchback', 'a3': 'hatchback',
  'ct': 'hatchback', 'bz4x': 'hatchback', 'leaf': 'hatchback',
  'i4': 'hatchback', 'dolphin': 'hatchback',
  'ora good cat': 'hatchback', 'good cat': 'hatchback',
  'v-ii': 'motorcycle', 'x': 'motorcycle',
};

function getBodyType(make?: string, model?: string): BodyType {
  if (!model) return 'sedan';
  return BODY_TYPE_MAP[model.toLowerCase().trim()] || 'sedan';
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const IMAGIN_KEY = process.env.NEXT_PUBLIC_IMAGIN_KEY || 'hrjavascript-mastery';

const PAINT_MAP: Record<string, string> = {
  black: 'imagin-black', white: 'imagin-white', silver: 'imagin-silver',
  gray: 'imagin-grey', red: 'imagin-red', blue: 'imagin-blue',
  brown: 'imagin-brown', green: 'imagin-green', orange: 'imagin-orange', yellow: 'imagin-yellow',
};

const MAKE_API: Record<string, string> = {
  'mercedes-benz': 'mercedes-benz', 'gwm': 'great-wall',
};

function getImaginUrl(make: string, model?: string, color?: string): string {
  const m = make.toLowerCase().trim();
  const apiMake = MAKE_API[m] || m;
  const paint = PAINT_MAP[color || 'black'] || 'imagin-black';
  let url = `https://cdn.imagin.studio/getimage?customer=${IMAGIN_KEY}&make=${encodeURIComponent(apiMake)}&paintDescription=${paint}&angle=23&width=800&zoomType=fullscreen`;
  if (model) {
    const fam = model.toLowerCase().trim().replace(/\s+/g, '-');
    url += `&modelFamily=${encodeURIComponent(fam)}`;
  }
  return url;
}

function SedanSVG({ c, h, s }: { c: string; h: string; s: string }) {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={h}/><stop offset="50%" stopColor={c}/><stop offset="100%" stopColor={s}/></linearGradient>
        <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a6d8c"/><stop offset="100%" stopColor="#1a2a3a"/></linearGradient>
      </defs>
      <ellipse cx="200" cy="175" rx="160" ry="12" fill="rgba(0,0,0,0.3)"/>
      <path d="M52 130Q52 115 68 112L332 112Q348 115 348 130L348 150Q348 158 340 160L60 160Q52 158 52 150Z" fill="url(#bs)"/>
      <path d="M108 112L130 68Q135 60 145 58L255 58Q265 60 270 68L292 112Z" fill="url(#bs)"/>
      <path d="M134 110L152 72Q155 66 162 65L210 65L210 110Z" fill="url(#gs)" opacity="0.85"/>
      <path d="M222 110L222 65L250 65Q256 66 258 72L272 110Z" fill="url(#gs)" opacity="0.85"/>
      <rect x="338" y="120" width="14" height="16" rx="4" fill="#ffe066" opacity="0.9"/>
      <rect x="50" y="122" width="10" height="14" rx="3" fill="#ff3333" opacity="0.85"/>
      <line x1="200" y1="65" x2="200" y2="155" stroke={s} strokeWidth="0.8" opacity="0.4"/>
      <circle cx="296" cy="160" r="24" fill="#1a1a1a"/><circle cx="296" cy="160" r="18" fill="#333"/><circle cx="296" cy="160" r="10" fill="#555"/><circle cx="296" cy="160" r="4" fill="#888"/>
      <circle cx="110" cy="160" r="24" fill="#1a1a1a"/><circle cx="110" cy="160" r="18" fill="#333"/><circle cx="110" cy="160" r="10" fill="#555"/><circle cx="110" cy="160" r="4" fill="#888"/>
      <line x1="68" y1="132" x2="332" y2="132" stroke={h} strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

function SUVsvg({ c, h, s }: { c: string; h: string; s: string }) {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={h}/><stop offset="50%" stopColor={c}/><stop offset="100%" stopColor={s}/></linearGradient>
        <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a6d8c"/><stop offset="100%" stopColor="#1a2a3a"/></linearGradient>
      </defs>
      <ellipse cx="200" cy="178" rx="165" ry="14" fill="rgba(0,0,0,0.3)"/>
      <path d="M48 125Q48 108 66 105L334 105Q352 108 352 125L352 152Q352 162 342 164L58 164Q48 162 48 152Z" fill="url(#bv)"/>
      <path d="M96 105L115 52Q118 44 128 42L272 42Q282 44 285 52L304 105Z" fill="url(#bv)"/>
      <path d="M120 103L136 56Q138 50 144 48L195 48L195 103Z" fill="url(#gv)" opacity="0.85"/>
      <path d="M210 103L210 48L256 48Q262 50 264 56L280 103Z" fill="url(#gv)" opacity="0.85"/>
      <path d="M284 103L268 56L284 56Q292 58 296 70L302 103Z" fill="url(#gv)" opacity="0.7"/>
      <rect x="340" y="114" width="16" height="18" rx="4" fill="#ffe066" opacity="0.9"/>
      <rect x="46" y="116" width="12" height="16" rx="3" fill="#ff3333" opacity="0.85"/>
      <line x1="118" y1="42" x2="286" y2="42" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
      <line x1="195" y1="48" x2="195" y2="158" stroke={s} strokeWidth="0.8" opacity="0.4"/>
      <path d="M280 155Q310 130 330 155" fill={s} opacity="0.25"/>
      <path d="M70 155Q90 130 120 155" fill={s} opacity="0.25"/>
      <circle cx="302" cy="164" r="28" fill="#1a1a1a"/><circle cx="302" cy="164" r="21" fill="#333"/><circle cx="302" cy="164" r="12" fill="#555"/><circle cx="302" cy="164" r="5" fill="#888"/>
      <circle cx="102" cy="164" r="28" fill="#1a1a1a"/><circle cx="102" cy="164" r="21" fill="#333"/><circle cx="102" cy="164" r="12" fill="#555"/><circle cx="102" cy="164" r="5" fill="#888"/>
    </svg>
  );
}

function PickupSVG({ c, h, s }: { c: string; h: string; s: string }) {
  return (
    <svg viewBox="0 0 440 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={h}/><stop offset="50%" stopColor={c}/><stop offset="100%" stopColor={s}/></linearGradient>
        <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a6d8c"/><stop offset="100%" stopColor="#1a2a3a"/></linearGradient>
      </defs>
      <ellipse cx="220" cy="178" rx="185" ry="14" fill="rgba(0,0,0,0.3)"/>
      <path d="M40 110L40 155Q40 162 48 164L160 164L160 105L50 105Q40 105 40 110Z" fill="url(#bp)"/>
      <rect x="48" y="108" width="108" height="50" rx="2" fill={s} opacity="0.3"/>
      <path d="M160 105L370 105Q388 108 388 125L388 152Q388 162 378 164L160 164Z" fill="url(#bp)"/>
      <path d="M170 105L192 55Q196 46 206 44L290 44Q300 46 304 55L326 105Z" fill="url(#bp)"/>
      <path d="M198 103L214 58Q216 52 222 50L255 50L255 103Z" fill="url(#gp)" opacity="0.85"/>
      <path d="M268 103L268 50L284 50Q290 52 294 58L312 103Z" fill="url(#gp)" opacity="0.85"/>
      <rect x="376" y="114" width="16" height="18" rx="4" fill="#ffe066" opacity="0.9"/>
      <rect x="36" y="118" width="10" height="14" rx="3" fill="#ff3333" opacity="0.85"/>
      <circle cx="340" cy="164" r="28" fill="#1a1a1a"/><circle cx="340" cy="164" r="21" fill="#333"/><circle cx="340" cy="164" r="12" fill="#555"/><circle cx="340" cy="164" r="5" fill="#888"/>
      <circle cx="108" cy="164" r="28" fill="#1a1a1a"/><circle cx="108" cy="164" r="21" fill="#333"/><circle cx="108" cy="164" r="12" fill="#555"/><circle cx="108" cy="164" r="5" fill="#888"/>
    </svg>
  );
}

function HatchbackSVG({ c, h, s }: { c: string; h: string; s: string }) {
  return (
    <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bh" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={h}/><stop offset="50%" stopColor={c}/><stop offset="100%" stopColor={s}/></linearGradient>
        <linearGradient id="gh" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a6d8c"/><stop offset="100%" stopColor="#1a2a3a"/></linearGradient>
      </defs>
      <ellipse cx="190" cy="175" rx="150" ry="12" fill="rgba(0,0,0,0.3)"/>
      <path d="M52 128Q52 114 68 110L312 110Q328 114 328 128L328 148Q328 158 320 160L60 160Q52 158 52 148Z" fill="url(#bh)"/>
      <path d="M100 110L122 62Q126 54 136 52L245 52Q255 54 260 68L282 110Z" fill="url(#bh)"/>
      <path d="M66 110L100 110L100 74Q98 68 92 68L72 88Z" fill="url(#bh)"/>
      <path d="M128 108L144 66Q146 60 152 58L196 58L196 108Z" fill="url(#gh)" opacity="0.85"/>
      <path d="M208 108L208 58L240 58Q246 60 248 66L262 108Z" fill="url(#gh)" opacity="0.85"/>
      <path d="M78 92L98 72L98 108L74 108Z" fill="url(#gh)" opacity="0.7"/>
      <rect x="318" y="118" width="14" height="16" rx="4" fill="#ffe066" opacity="0.9"/>
      <rect x="50" y="118" width="10" height="14" rx="3" fill="#ff3333" opacity="0.85"/>
      <circle cx="276" cy="160" r="24" fill="#1a1a1a"/><circle cx="276" cy="160" r="18" fill="#333"/><circle cx="276" cy="160" r="10" fill="#555"/><circle cx="276" cy="160" r="4" fill="#888"/>
      <circle cx="108" cy="160" r="24" fill="#1a1a1a"/><circle cx="108" cy="160" r="18" fill="#333"/><circle cx="108" cy="160" r="10" fill="#555"/><circle cx="108" cy="160" r="4" fill="#888"/>
    </svg>
  );
}

function MotorcycleSVG({ c, h, s }: { c: string; h: string; s: string }) {
  return (
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={h}/><stop offset="100%" stopColor={s}/></linearGradient>
      </defs>
      <ellipse cx="180" cy="175" rx="140" ry="10" fill="rgba(0,0,0,0.25)"/>
      <circle cx="100" cy="150" r="38" fill="#1a1a1a"/><circle cx="100" cy="150" r="30" fill="#333"/><circle cx="100" cy="150" r="16" fill="#555"/><circle cx="100" cy="150" r="6" fill="#888"/>
      <circle cx="275" cy="150" r="38" fill="#1a1a1a"/><circle cx="275" cy="150" r="30" fill="#333"/><circle cx="275" cy="150" r="16" fill="#555"/><circle cx="275" cy="150" r="6" fill="#888"/>
      <path d="M120 130L180 90L240 110L260 130" stroke="#444" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M140 135L170 115L195 118L180 145Z" fill="#444"/>
      <path d="M148 100Q165 78 200 82Q210 84 210 95L195 110L165 108Z" fill="url(#bm)"/>
      <path d="M120 102Q130 88 150 90L148 100L120 112Z" fill="#222"/>
      <path d="M100 118Q108 100 120 102L120 112L100 125Z" fill="#333"/>
      <line x1="240" y1="85" x2="270" y2="140" stroke="#666" strokeWidth="4" strokeLinecap="round"/>
      <line x1="244" y1="85" x2="278" y2="140" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
      <path d="M230 78Q240 72 255 78" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <circle cx="272" cy="98" r="8" fill="#ffe066" opacity="0.8"/>
      <rect x="88" y="108" width="8" height="5" rx="2" fill="#ff3333" opacity="0.8"/>
      <path d="M100 148L75 140Q68 138 66 134" stroke="#888" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M255 120Q275 108 295 120" stroke={c} strokeWidth="3" fill="none"/>
      <path d="M78 128Q100 115 122 128" stroke={c} strokeWidth="3" fill="none"/>
    </svg>
  );
}

function SvgFallback({ make, model, color }: { make?: string; model?: string; color?: string }) {
  const bodyType = getBodyType(make, model);
  const hex = CAR_COLORS.find(co => co.id === color)?.hex || '#666666';
  const h = lighten(hex, 50);
  const s = darken(hex, 40);
  const props = { c: hex, h, s };

  if (bodyType === 'suv') return <SUVsvg {...props} />;
  if (bodyType === 'pickup') return <PickupSVG {...props} />;
  if (bodyType === 'hatchback') return <HatchbackSVG {...props} />;
  if (bodyType === 'motorcycle') return <MotorcycleSVG {...props} />;
  return <SedanSVG {...props} />;
}

export default function CarImage({ make, model, color, className }: CarImageProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const imaginUrl = useMemo(() => {
    if (!IMAGIN_KEY || !make) return '';
    return getImaginUrl(make, model || undefined, color || undefined);
  }, [make, model, color]);

  if (!make) {
    return <div className={className}><SvgFallback /></div>;
  }

  if (IMAGIN_KEY && imaginUrl && !imgFailed) {
    return (
      <div className={className}>
        <img
          src={imaginUrl}
          alt={`${make} ${model || ''}`}
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return <div className={className}><SvgFallback make={make} model={model} color={color} /></div>;
}
