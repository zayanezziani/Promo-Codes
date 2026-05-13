// Product Detail + Checkout Prototype
// Flow: Product Detail → click "Proceed to Checkout" → Checkout page auto-scrolls
// through Player Info → Payment Method → Get a Discount → Contact Info → Promo Code
// as each section is progressively filled.

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── design tokens (from Figma) ──────────────────────────────────────
const C = {
  bg: '#F1F2F8',
  surface: '#FFFFFF',
  surfaceAlt: '#FCFCFD',
  border: '#E4E7EC',
  borderSoft: '#E6E7EB',
  borderHair: '#E8E9EB',
  borderFaint: '#F2F4F7',
  borderInput: '#D0D5DD',
  text: '#222222',
  text900: '#101828',
  textHeader: '#1D2939',
  text600: '#475467',
  text500: '#667085',
  textMuted: '#7F807F',
  bluePrimary: '#025EDE',    // primary brand
  bluePrice: '#175CD3',      // price highlight
  blueLight: '#D7E7FF',      // selected card bg / chip
  blueLighter: '#EFF4FF',
  blueDark: '#024DB6',       // text on blueLight
  blueLink: '#025EDE',
  successGreen: '#039855',
  warning: '#F79009',
  amberCoin: '#F59E0B',
  navDark: '#1D2939',
  white: '#FFFFFF',
  hairline: '#F2F4F7'
};

// ─── icon helpers ───────────────────────────────────────────────────
const stroke = (props = {}) => ({
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.6,
  strokeLinecap: 'round', strokeLinejoin: 'round', ...props
});
const Icon = ({ size = 20, children, style }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', ...style }}>{children}</svg>;

const ChevronLeft = ({ size = 24, color = C.textHeader }) =>
  <Icon size={size} style={{ color }}><path {...stroke({ strokeWidth: 2 })} d="M15 6l-6 6 6 6" /></Icon>;
const ChevronUp = ({ size = 20, color = C.text900 }) =>
  <Icon size={size} style={{ color }}><path {...stroke({ strokeWidth: 2 })} d="M6 15l6-6 6 6" /></Icon>;
const SearchIcon = ({ size = 18 }) =>
  <Icon size={size} style={{ color: '#D0D5DD' }}>
    <circle {...stroke()} cx="11" cy="11" r="7" />
    <path {...stroke()} d="M20 20l-3.5-3.5" />
  </Icon>;
const MicIcon = ({ size = 18 }) =>
  <Icon size={size} style={{ color: '#363F72' }}>
    <rect {...stroke()} x="9" y="3" width="6" height="11" rx="3" />
    <path {...stroke()} d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
  </Icon>;
const CartIcon = ({ size = 20 }) =>
  <Icon size={size}>
    <path {...stroke()} d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
    <circle {...stroke({ fill: 'currentColor' })} cx="10" cy="20.5" r="1.2" />
    <circle {...stroke({ fill: 'currentColor' })} cx="17.5" cy="20.5" r="1.2" />
  </Icon>;
const ShieldIcon = ({ size = 12, color = C.textHeader }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', color }}>
    <path {...stroke({ strokeWidth: 1.8 })} d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
  </svg>;
const ZapIcon = ({ size = 12, color = C.textHeader }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', color }}>
    <path {...stroke({ strokeWidth: 1.8 })} d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>;
const GlobeIcon = ({ size = 12, color = C.textHeader }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', color }}>
    <circle {...stroke({ strokeWidth: 1.8 })} cx="12" cy="12" r="9" />
    <path {...stroke({ strokeWidth: 1.8 })} d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>;
const TagSolid = ({ size = 12, color = C.white }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.84zM6.5 7A1.5 1.5 0 1 1 8 5.5 1.5 1.5 0 0 1 6.5 7z" fill={color} />
  </svg>;
const TagOutlineLg = ({ size = 16, color = '#7E7E7E' }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.84zM13 20.01 4 11V4h7l9 9zM6.5 5A1.5 1.5 0 1 0 8 6.5 1.5 1.5 0 0 0 6.5 5z" fill={color} />
  </svg>;
const PromoTagIcon = ({ size = 24, color = '#F97316' }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.84z" fill={color} />
    <circle cx="9" cy="9" r="1.8" fill="#fff" />
    <circle cx="14.5" cy="14.5" r="1.5" fill="#fff" />
    <path d="M8 16l8-8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
const AwardIcon = ({ size = 12, color = C.white }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <circle cx="12" cy="9" r="6" fill="none" stroke={color} strokeWidth="2" />
    <path d="M8.5 14 7 22l5-3 5 3-1.5-8" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>;
const CheckIcon = ({ size = 16, color = C.bluePrimary, strokeW = 2.4 }) =>
  <Icon size={size} style={{ color }}>
    <path {...stroke({ strokeWidth: strokeW })} d="M5 12.5l4.2 4.2L19 7" />
  </Icon>;
const CheckCircleFilled = ({ size = 24, color = C.successGreen }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="9" fill={color} />
    <path d="M7.5 12.5l3 3 6-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const CheckCirclePending = ({ size = 24 }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="9" fill="#98A2B3" />
    <path d="M7.5 12.5l3 3 6-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const HelpCircle = ({ size = 20, color = C.text500 }) =>
  <Icon size={size} style={{ color }}>
    <circle {...stroke()} cx="12" cy="12" r="9" />
    <path {...stroke()} d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.7.4-1.1 1-1.1 1.7v.5M12 17v.1" />
  </Icon>;
const XIcon = ({ size = 16, color = '#98A2B3' }) =>
  <Icon size={size} style={{ color }}>
    <path {...stroke({ strokeWidth: 2 })} d="M6 6l12 12M18 6 6 18" />
  </Icon>;
const PlusIcon = ({ size = 18, color = '#475467' }) =>
  <Icon size={size} style={{ color }}>
    <path {...stroke({ strokeWidth: 2 })} d="M12 5v14M5 12h14" />
  </Icon>;
const MinusIcon = ({ size = 18, color = '#475467' }) =>
  <Icon size={size} style={{ color }}>
    <path {...stroke({ strokeWidth: 2 })} d="M5 12h14" />
  </Icon>;
const InfoCircle = ({ size = 16, color = '#98A2B3' }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path fill={color} d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z" />
  </svg>;

// nav icons
const ShopBag = ({ active }) =>
  <Icon size={22} style={{ color: active ? C.text900 : C.navDark }}>
    <path {...stroke()} d="M5 8h14l-1 12a2 2 0 0 1-2 1.8H8A2 2 0 0 1 6 20zM9 8a3 3 0 0 1 6 0" />
  </Icon>;
const HeartIcon = ({ active }) =>
  <Icon size={22} style={{ color: active ? C.text900 : C.navDark }}>
    <path {...stroke()} d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </Icon>;
const TicketIcon = ({ active }) =>
  <Icon size={22} style={{ color: active ? C.text900 : C.navDark }}>
    <path {...stroke()} d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
    <path {...stroke()} d="M10 7v10" strokeDasharray="2 2" />
  </Icon>;
const WalletIcon = ({ active }) =>
  <Icon size={22} style={{ color: active ? C.text900 : C.navDark }}>
    <path {...stroke()} d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM17 12.5h.01" strokeWidth="1.7" />
  </Icon>;
const ProfileIcon = ({ active }) =>
  <Icon size={22} style={{ color: active ? C.text900 : C.navDark }}>
    <circle {...stroke()} cx="12" cy="12" r="9" />
    <circle {...stroke()} cx="12" cy="10" r="3" />
    <path {...stroke()} d="M5.5 19a7 7 0 0 1 13 0" />
  </Icon>;

// product-detail header: back / search / cart
function ProductHeader({ onBack }) {
  return (
    <div style={{
      height: 64, background: C.white, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0
    }}>
      <button onClick={onBack} aria-label="Back" style={{
        background: 'transparent', border: 0, padding: 0, width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.textHeader, cursor: 'pointer'
      }}>
        <ChevronLeft size={24} />
      </button>
      <div style={{
        flex: 1, height: 36, borderRadius: 12, background: C.white,
        border: `1px solid ${C.borderInput}`,
        boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
        display: 'flex', alignItems: 'center', padding: '0 8px', gap: 8,
        color: C.text500
      }}>
        <SearchIcon size={18} />
        <span style={{ flex: 1, fontFamily: 'Barlow, sans-serif', fontSize: 16, lineHeight: '20px' }}>
          Search games &amp; more
        </span>
        <MicIcon size={18} />
      </div>
      <div style={{ position: 'relative', width: 47, height: 24, color: C.text600 }}>
        <CartIcon size={22} />
        <span style={{
          position: 'absolute', left: 24, top: 0, minWidth: 19, height: 19,
          padding: '0 6px', borderRadius: 999, background: C.white,
          border: `1px solid ${C.border}`, color: '#D92D20',
          fontFamily: 'Barlow, sans-serif', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box'
        }}>2</span>
      </div>
    </div>
  );
}

// checkout header: back / Checkout title centered
function CheckoutHeader({ onBack }) {
  return (
    <div style={{
      height: 64, background: C.white, padding: '14px 16px',
      display: 'flex', alignItems: 'center', flexShrink: 0,
      position: 'relative', borderBottom: `1px solid ${C.border}`
    }}>
      <button onClick={onBack} aria-label="Back" style={{
        background: 'transparent', border: 0, padding: 0, width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.textHeader, cursor: 'pointer', zIndex: 1
      }}>
        <ChevronLeft size={24} />
      </button>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Barlow, sans-serif', fontWeight: 700, fontSize: 18,
        color: C.text900, pointerEvents: 'none'
      }}>Checkout</div>
    </div>
  );
}

// ─── product cover ──────────────────────────────────────────────────
function ProductCover() {
  return (
    <div style={{ background: C.white, flexShrink: 0 }}>
      <div style={{ padding: '16px', display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{
          width: 100, height: 100, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
          background: '#0B3D2E',
          backgroundImage: 'url(uploads/fc-mobile-cover.png)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 16,
            lineHeight: '20px', color: C.text900, letterSpacing: 0.2
          }}>EA SPORTS FC™ MOBILE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Pill icon={<ShieldIcon size={12} />} label="Secure Payment" />
              <Pill icon={<ZapIcon size={12} />} label="Official Partner" />
            </div>
            <Pill icon={<GlobeIcon size={12} />}>
              <span style={{ color: C.text900 }}>Global with </span>
              <span style={{ color: C.bluePrimary, textDecoration: 'underline' }}>exclusions</span>
            </Pill>
          </div>
        </div>
      </div>
    </div>
  );
}
function Pill({ icon, label, children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 20
    }}>
      {icon}
      <span style={{
        fontFamily: 'Barlow, sans-serif', fontSize: 14, lineHeight: '16px',
        color: C.textHeader
      }}>{children || label}</span>
    </div>
  );
}

// chip row
function ChipRow({ active, onChange, chips }) {
  return (
    <div className="chip-scroller" style={{
      background: C.white, display: 'flex', gap: 16, padding: '8px 16px',
      overflowX: 'auto', flexShrink: 0, borderBottom: `1px solid ${C.borderFaint}`
    }}>
      {chips.map(chip => {
        const isActive = chip.id === active;
        return (
          <button
            key={chip.id}
            onClick={() => onChange(chip.id)}
            style={{
              flexShrink: 0,
              background: isActive ? C.blueLight : 'transparent',
              border: 0, padding: isActive ? '4px 20px' : '2px 8px',
              borderRadius: 16, cursor: 'pointer',
              fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
              lineHeight: '20px',
              color: isActive ? C.blueDark : C.text600,
              whiteSpace: 'nowrap'
            }}
          >{chip.label}</button>
        );
      })}
    </div>
  );
}

// ─── bundle tile (rectangular) ──────────────────────────────────────
function BundleTile({ bundle, selected, onSelect }) {
  const bgImg = 'uploads/fc-bundle.png';
  return (
    <div
      onClick={onSelect}
      style={{
        position: 'relative', cursor: 'pointer',
        paddingTop: bundle.badge ? 4 : 0
      }}
    >
      <div style={{
        width: '100%', height: 72, borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${selected ? C.bluePrimary : C.border}`,
        background: selected ? C.blueLight : C.white,
        display: 'flex', alignItems: 'center',
        transition: 'background-color 200ms ease, border-color 200ms ease'
      }}>
        <div style={{
          padding: '8px 12px 8px 8px', display: 'flex',
          flex: 1, alignItems: 'center', gap: 12, minWidth: 0
        }}>
          <div style={{
            width: 84, height: 53, borderRadius: 4, overflow: 'hidden', flexShrink: 0,
            background: `url(${bgImg}) center/cover`
          }} />
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 14,
                lineHeight: '16px', color: C.text900, whiteSpace: 'nowrap'
              }}>{bundle.points} FC Points</div>
              {bundle.sub && (
                <div style={{
                  fontFamily: 'Barlow, sans-serif', fontWeight: 400, fontSize: 13,
                  lineHeight: '14px', color: C.text500, whiteSpace: 'nowrap'
                }}>{bundle.sub}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <div style={{
                fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 16,
                lineHeight: '20px', color: C.bluePrice, whiteSpace: 'nowrap'
              }}>${bundle.price}</div>
              {bundle.discount && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 2,
                    background: C.successGreen, color: C.white, borderRadius: 16,
                    padding: '2px 4px',
                    fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 12,
                    lineHeight: '14px'
                  }}>
                    <TagSolid size={10} />
                    {bundle.discount}
                  </span>
                  {bundle.original && (
                    <span style={{
                      fontFamily: 'Barlow, sans-serif', fontSize: 12, lineHeight: '14px',
                      color: C.text600, textDecoration: 'line-through'
                    }}>${bundle.original}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {bundle.badge && (
        <div style={{
          position: 'absolute', top: 0, left: -4,
          display: 'flex', alignItems: 'center', height: 18, zIndex: 2
        }}>
          <div style={{
            background: bundle.badgeColor || C.warning, color: C.white,
            padding: '2px 6px 2px 4px', borderRadius: '4px 0 0 4px',
            fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 12,
            lineHeight: '14px',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <AwardIcon size={10} />
            {bundle.badge}
          </div>
          <svg width="8" height="18" viewBox="0 0 8 18" style={{ display: 'block' }}>
            <path d="M0 0 H7 L2 9 L7 18 H0 Z" fill={bundle.badgeColor || C.warning} />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── footer ─────────────────────────────────────────────────────────
function StickyFooter({ total, cta, onClick, ctaDisabled }) {
  return (
    <div style={{
      background: C.white, borderTop: `1px solid ${C.border}`,
      padding: '12px 16px 16px', flexShrink: 0
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
            lineHeight: '20px', color: C.text600
          }}>Total</span>
          <span style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 400, fontSize: 14,
            lineHeight: '16px', color: C.text500
          }}>(Service fee is applied)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 700, fontSize: 18,
            lineHeight: '24px', color: C.text900,
            transition: 'all 250ms ease'
          }}>${total}</span>
          <ChevronUp size={20} />
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={ctaDisabled}
        style={{
          width: '100%', height: 48, borderRadius: 8, border: 0,
          cursor: ctaDisabled ? 'default' : 'pointer',
          background: ctaDisabled ? '#A8C7FA' : C.bluePrimary,
          color: C.white,
          fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 18,
          lineHeight: '24px',
          boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
          transition: 'background-color 200ms ease'
        }}
      >{cta}</button>
    </div>
  );
}

// ─── section description (checkout) ─────────────────────────────────
function SectionDescription({ title, done, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {done ? <CheckCircleFilled size={24} /> : <CheckCirclePending size={24} />}
        <span style={{
          fontFamily: 'Barlow, sans-serif', fontWeight: 700, fontSize: 18,
          lineHeight: '24px', color: C.text900, letterSpacing: 0.3
        }}>{title}</span>
      </div>
      {action}
    </div>
  );
}

function SectionDescriptionWithSubtitle({ title, done, subtitle, trailing }) {
  return (
    <div style={{ paddingBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {done ? <CheckCircleFilled size={24} /> : <CheckCirclePending size={24} />}
          <span style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 700, fontSize: 18,
            lineHeight: '24px', color: C.text900, letterSpacing: 0.3
          }}>{title}</span>
        </div>
        {subtitle && (
          <span style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 400, fontSize: 14,
            lineHeight: '16px', color: C.text900
          }}>{subtitle}</span>
        )}
      </div>
      {trailing && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 0 }}>
          {trailing}
        </div>
      )}
    </div>
  );
}

// ─── promo code carousel (matches Promo Codes Figma) ───────────────
const PROMO_CODES = [
  { id: 'a', code: 'CARRY20OFF', title: '15% off (up to US$20)', expires: 'Expires in 20 days' },
  { id: 'b', code: 'SAVE10NOW',  title: '10% off (up to US$15)', expires: 'Expires in 14 days' },
  { id: 'c', code: 'FCMOBILE5',  title: '$5 off FC™ Mobile',     expires: 'Expires in 3 days' }
];

function Spinner({ size = 40 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '4px solid #E5E7EB'
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '4px solid transparent', borderTopColor: C.bluePrimary,
        animation: 'spin 0.9s linear infinite'
      }} />
    </div>
  );
}

function PromoCard({ code, applied, loading, highlight, onUse, onRemove }) {
  const bg = highlight ? C.blueLight : C.surface;
  return (
    <div style={{
      width: 280, height: 145, borderRadius: 12,
      background: bg, border: `1px solid ${C.borderSoft}`,
      transition: 'background-color 360ms ease',
      boxSizing: 'border-box', padding: '12px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', flexShrink: 0
    }}>
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <div style={{
            paddingBottom: 8, borderBottom: `1px solid ${C.borderHair}`,
            display: 'flex', flexDirection: 'column', gap: 4, position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 24 }}>
              <TagSolid size={16} color={C.bluePrimary} />
              <span style={{
                fontFamily: 'Barlow, sans-serif', fontWeight: 400,
                lineHeight: '16px', color: C.bluePrimary, fontSize: 14
              }}>{code.code}</span>
            </div>
            <span style={{
              fontFamily: 'Barlow, sans-serif', fontSize: 18, lineHeight: '24px', color: C.text,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden', minHeight: 48, fontWeight: 600
            }}>{code.title}</span>
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
              <InfoCircle size={16} />
            </div>
          </div>
          <div style={{
            height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ display: 'block', color: '#667085' }}>
                <circle {...stroke()} cx="12" cy="12" r="9" />
                <path {...stroke()} d="M12 7v5l3 2" />
              </svg>
              <span style={{
                fontFamily: 'Barlow, sans-serif', fontSize: 14, lineHeight: '16px', color: '#667085'
              }}>{code.expires}</span>
            </div>
            {applied ? (
              <button onClick={onRemove} style={{
                background: 'transparent', border: 0, padding: '0 4px', cursor: 'pointer',
                fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 16, lineHeight: '20px',
                color: C.bluePrimary, letterSpacing: 0.1
              }}>Remove</button>
            ) : (
              <button onClick={onUse} style={{
                height: 36, borderRadius: 8, cursor: 'pointer',
                background: C.white, border: `1px solid ${C.borderInput}`,
                boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
                fontFamily: 'Barlow, sans-serif', fontSize: 16, lineHeight: '20px',
                color: C.text600, padding: '0 24px', fontWeight: 500
              }}>Use</button>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function PromoToast({ visible, message }) {
  return (
    <div style={{
      position: 'absolute', top: 60, left: 16, right: 16, zIndex: 50,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none'
    }}>
      <div style={{
        width: '100%', maxWidth: 344, background: C.white,
        borderRadius: 12, border: `1px solid ${C.border}`,
        boxShadow: '0 8px 24px rgba(16,24,40,0.10), 0 2px 6px rgba(16,24,40,0.04)',
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
        transform: visible ? 'translateY(0)' : 'translateY(-160%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 320ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease'
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8, background: C.blueLighter,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <CheckIcon size={18} color={C.bluePrimary} strokeW={2.6} />
        </span>
        <span style={{
          flex: 1, fontFamily: 'Barlow, sans-serif', fontSize: 16, lineHeight: '20px',
          color: C.text900, fontWeight: 500
        }}>{message}</span>
        <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <XIcon size={16} />
        </span>
      </div>
    </div>
  );
}

// ─── product detail screen ──────────────────────────────────────────
const BUNDLES = [
  { id: 'b1', points: '1,050',  price: 5,  original: 6,  discount: '5% off',  badge: 'Most Popular', sub: 'Starter pack' },
  { id: 'b2', points: '2,200',  price: 8,  original: 10, discount: '10% off', sub: '+10% bonus silver' },
  { id: 'b3', points: '5,900',  price: 12, original: 15, discount: '15% off', sub: '+15% bonus silver' },
  { id: 'b4', points: '12,000', price: 20, original: 25, discount: '20% off', sub: '+20% bonus silver' }
];

const CHIPS = [
  { id: 'all',   label: 'All (6)' },
  { id: 'b10',   label: '10% Bonus Silver (4)' },
  { id: 'b20',   label: '20% Bonus Silver (4)' }
];

function ProductDetail({ onProceed }) {
  const [activeChip, setActiveChip] = useState('all');
  const [selectedId, setSelectedId] = useState('b1');
  const selected = BUNDLES.find(b => b.id === selectedId) || BUNDLES[0];

  return (
    <div style={{
      width: '100%', height: '100%', background: C.bg,
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <ProductHeader />
      <ProductCover />
      <ChipRow active={activeChip} onChange={setActiveChip} chips={CHIPS} />

      <div className="scroller" style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '16px', display: 'flex', flexDirection: 'column', gap: 12
      }}>
        {BUNDLES.map(b => (
          <BundleTile
            key={b.id}
            bundle={b}
            selected={selectedId === b.id}
            onSelect={() => setSelectedId(b.id)}
          />
        ))}
        <button style={{
          marginTop: 8, height: 40, padding: 0, border: 0,
          background: 'transparent', color: C.bluePrimary, cursor: 'pointer',
          fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
          lineHeight: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          alignSelf: 'center'
        }}>
          See more
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" fill="none" stroke={C.bluePrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <StickyFooter
        total={selected.price}
        cta="Proceed to Checkout"
        onClick={() => onProceed(selected)}
      />
    </div>
  );
}

// ─── checkout: input field with default / filled / focused states ───
// ease-out micro-interactions: state transitions feel snappy on enter, gentle on settle
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

function InputField({ value, onChange, placeholder, type = 'text', inputMode, pattern }) {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;
  const borderColor = focused
    ? C.bluePrimary
    : filled
      ? '#98A2B3'
      : C.borderInput;
  return (
    <div style={{
      height: 56, padding: '0 16px', borderRadius: 8,
      border: `1px solid ${borderColor}`,
      background: C.white, display: 'flex', alignItems: 'center', gap: 8,
      transition: `border-color 220ms ${EASE_OUT}, box-shadow 220ms ${EASE_OUT}`,
      boxShadow: focused
        ? '0 0 0 3px rgba(2, 94, 222, 0.12)'
        : '0 1px 2px rgba(16, 24, 40, 0.05)'
    }}>
      <input
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, height: '100%', border: 0, outline: 'none', background: 'transparent',
          fontFamily: 'Barlow, sans-serif', fontSize: 16, lineHeight: '20px',
          color: filled ? C.text900 : C.text500,
          transition: `color 220ms ${EASE_OUT}`,
          padding: 0
        }}
      />
      <HelpCircle size={20} />
    </div>
  );
}

// ─── checkout: payment row ──────────────────────────────────────────
function PaymentRow({ method, selected, onSelect, isFirst, isLast }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? C.blueLight : C.surfaceAlt,
        padding: '16px 12px',
        borderTopLeftRadius: isFirst ? 12 : 0, borderTopRightRadius: isFirst ? 12 : 0,
        borderBottomLeftRadius: isLast ? 12 : 0, borderBottomRightRadius: isLast ? 12 : 0,
        border: selected ? `1px solid ${C.bluePrimary}` : `1px solid transparent`,
        borderBottom: selected
          ? `1px solid ${C.bluePrimary}`
          : (isLast ? '1px solid transparent' : `1px solid ${C.border}`),
        marginBottom: selected ? -1 : 0,
        position: 'relative', zIndex: selected ? 1 : 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', transition: 'background-color 200ms ease, border-color 200ms ease',
        minHeight: 56
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          border: `1.5px solid ${selected ? C.bluePrimary : C.borderInput}`,
          background: selected ? C.blueLight : C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'border-color 200ms ease, background-color 200ms ease'
        }}>
          {selected && <div style={{
            width: 8, height: 8, borderRadius: '50%', background: C.bluePrimary
          }} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
            lineHeight: '20px', color: C.text900
          }}>{method.name}</span>
          {method.sub && (
            <span style={{
              fontFamily: 'Barlow, sans-serif', fontWeight: 400, fontSize: 14,
              lineHeight: '16px', color: C.text500
            }}>{method.sub}</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {method.trailing}
      </div>
    </div>
  );
}

// brand logo tiles
const LogoTile = ({ children, width = 34 }) => (
  <div style={{
    width, height: 24, borderRadius: 4,
    background: C.white, border: `1px solid ${C.borderFaint}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  }}>{children}</div>
);

const VisaLogo = () => (
  <svg width="22" height="8" viewBox="0 0 22 8"><text x="0" y="7" fontFamily="Arial Black, sans-serif" fontSize="8" fontWeight="900" fill="#1A1F71" fontStyle="italic">VISA</text></svg>
);
const MasterLogo = () => (
  <svg width="20" height="14" viewBox="0 0 20 14">
    <circle cx="7" cy="7" r="6" fill="#EB001B" />
    <circle cx="13" cy="7" r="6" fill="#F79E1B" />
    <path d="M10 2.4a6 6 0 0 1 0 9.2 6 6 0 0 1 0-9.2z" fill="#FF5F00" />
  </svg>
);
const StanbicLogo = () => (
  <svg width="14" height="16" viewBox="0 0 14 16">
    <path d="M7 0.6 L13.2 3 L13.2 8.4 C13.2 12 10.6 14.6 7 15.4 C3.4 14.6 0.8 12 0.8 8.4 L0.8 3 Z" fill="#0A2244" />
    <path d="M4.4 6.4 C4.4 5.4 5.2 4.8 6.2 4.8 C7.2 4.8 7.8 5.2 8 5.8 L7 6.4 C6.9 6 6.6 5.8 6.2 5.8 C5.8 5.8 5.6 6 5.6 6.4 C5.6 7 8.2 6.6 8.2 8.6 C8.2 9.6 7.4 10.4 6.2 10.4 C5 10.4 4.2 9.8 4 9 L5.2 8.4 C5.3 8.9 5.6 9.2 6.2 9.2 C6.7 9.2 6.9 9 6.9 8.7 C6.9 8 4.4 8.5 4.4 6.4 Z" fill="#fff" />
  </svg>
);
const ProvidusLogo = () => (
  <svg width="18" height="14" viewBox="0 0 18 14">
    <rect x="0" y="0.8" width="18" height="2" rx="0.6" fill="#F2B721" />
    <rect x="2" y="4" width="14" height="2" rx="0.6" fill="#F2B721" />
    <rect x="4" y="7.2" width="10" height="2" rx="0.6" fill="#F2B721" />
    <rect x="6" y="10.4" width="6" height="2" rx="0.6" fill="#F2B721" />
  </svg>
);
const GTBankLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <rect width="18" height="18" rx="2" fill="#E03A2A" />
    <rect x="2.2" y="2.2" width="3.2" height="3.2" fill="#fff" />
    <text x="9" y="13.6" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4.6" fontWeight="700" fill="#fff" letterSpacing="-0.1">GTBank</text>
  </svg>
);
const PagaLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="2.6" r="1.3" fill="#F37423" />
    <circle cx="12.4" cy="5.2" r="1.3" fill="#F37423" />
    <circle cx="13.4" cy="10" r="1.3" fill="#F37423" />
    <circle cx="10" cy="13.4" r="1.3" fill="#F37423" />
    <circle cx="4.6" cy="12.4" r="1.3" fill="#F37423" />
    <circle cx="2.6" cy="7.6" r="1.3" fill="#F37423" />
    <circle cx="4.4" cy="3.4" r="1.3" fill="#F37423" />
  </svg>
);
const ChipperLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="8" fill="#111" />
    <path d="M10.2 6.4 C9.7 5.6 8.9 5.2 8 5.2 C6.4 5.2 5.2 6.4 5.2 8 C5.2 9.6 6.4 10.8 8 10.8 C8.9 10.8 9.7 10.4 10.2 9.6" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const AffirmLogo = () => (
  <svg width="32" height="10" viewBox="0 0 32 10">
    <text x="0" y="8" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700" fill="#0FA0EA">affirm</text>
    <circle cx="29" cy="2.5" r="1.2" fill="#0FA0EA" />
  </svg>
);
const KudaLogo = () => (
  <svg width="12" height="14" viewBox="0 0 12 14">
    <path d="M0.6 0.6 L2.4 0.6 L2.4 13.4 L0.6 13.4 Z" fill="#40196D" />
    <path d="M3.6 0.6 L5.4 0.6 L11.4 6.4 L5.4 13.4 L3.6 13.4 L8.8 7 Z" fill="#40196D" />
  </svg>
);
const GemsLogo = () => (
  <svg width="22" height="14" viewBox="0 0 22 14">
    <path d="M3 4 L6.4 1 L10.4 1 L13.8 4 L8.4 13 Z" fill="#7BC8FF" stroke="#3FA5E0" strokeWidth="0.6" strokeLinejoin="round" />
    <path d="M3 4 L8.4 5.4 L13.8 4" fill="none" stroke="#3FA5E0" strokeWidth="0.6" />
    <path d="M9.8 4 L13.4 1 L17.4 1 L20.8 4 L15.4 13 Z" fill="#A8DBFF" stroke="#3FA5E0" strokeWidth="0.6" strokeLinejoin="round" />
    <path d="M9.8 4 L15.4 5.4 L20.8 4" fill="none" stroke="#3FA5E0" strokeWidth="0.6" />
  </svg>
);

// ─── checkout screen ────────────────────────────────────────────────
function Checkout({ bundle, onBack, onComplete }) {
  const [typedPlayerId, setTypedPlayerId] = useState('');
  const [savedDetails, setSavedDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [useDiscount, setUseDiscount] = useState(false);
  const [contactChoice, setContactChoice] = useState(null); // 'profile' | 'different'
  const [promoLoadingId, setPromoLoadingId] = useState(null);
  const [promoAppliedId, setPromoAppliedId] = useState(null);
  const [promoHighlightId, setPromoHighlightId] = useState(null);
  const [promoToast, setPromoToast] = useState({ visible: false, message: '' });

  const timersRef = useRef([]);
  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);
  const after = (ms, fn) => { const id = setTimeout(fn, ms); timersRef.current.push(id); return id; };

  // each section's check turns green once the user has completed it
  const done = {
    player:   typedPlayerId.trim().length > 0,
    payment:  selectedPayment !== null,
    discount: useDiscount,
    contact:  contactChoice !== null,
    promo:    promoAppliedId !== null
  };

  const total = useMemo(() => {
    let t = bundle.price + 2;
    if (useDiscount) t -= 3;
    if (promoAppliedId) t -= 1;
    return Math.max(t, 1);
  }, [bundle.price, useDiscount, promoAppliedId]);

  const canCheckout = done.player && done.payment && done.contact;

  const handleUsePromo = (id) => {
    if (promoLoadingId || promoAppliedId) return;
    setPromoLoadingId(id);
    after(700, () => {
      setPromoLoadingId(null);
      setPromoAppliedId(id);
      setPromoHighlightId(id);
      setPromoToast({ visible: true, message: 'Promo code applied!' });
      after(450, () => setPromoHighlightId(null));
      after(1300, () => setPromoToast(s => ({ ...s, visible: false })));
    });
  };
  const handleRemovePromo = (id) => {
    if (promoLoadingId) return;
    setPromoLoadingId(id);
    after(700, () => {
      setPromoLoadingId(null);
      setPromoAppliedId(null);
      setPromoHighlightId(null);
      setPromoToast({ visible: true, message: 'Promo code removed' });
      after(1300, () => setPromoToast(s => ({ ...s, visible: false })));
    });
  };

  const paymentMethods = [
    { id: 'card',     name: 'Card', trailing: (<><LogoTile width={34}><VisaLogo /></LogoTile><LogoTile width={34}><MasterLogo /></LogoTile></>) },
    { id: 'ussd',     name: 'USSD', trailing: (<>
      <LogoTile width={34}><StanbicLogo /></LogoTile>
      <LogoTile width={34}><ProvidusLogo /></LogoTile>
      <LogoTile width={34}><GTBankLogo /></LogoTile>
      <span style={{
        fontFamily:'Barlow, sans-serif', fontSize:12, fontWeight:500,
        color:'#98A2B3', border:`1px solid ${C.borderInput}`, borderRadius:4,
        padding:'2px 8px', letterSpacing:1, textTransform:'uppercase', lineHeight:'16px'
      }}>+13</span>
    </>) },
    { id: 'paga',     name: 'Paga',     trailing: <LogoTile width={34}><PagaLogo /></LogoTile> },
    { id: 'chipper',  name: 'Chipper',  trailing: <LogoTile width={34}><ChipperLogo /></LogoTile> },
    { id: 'transfer', name: 'Bank Transfer', trailing: <LogoTile width={42}><AffirmLogo /></LogoTile> },
    { id: 'kuda',     name: 'Kuda Bank',     trailing: <LogoTile width={34}><KudaLogo /></LogoTile> },
    { id: 'gems',     name: 'Gems', sub: 'Balance: 5,000', trailing: (<>
      <div style={{
        padding:'2px 8px', borderRadius:4, background:'#ECFDF3',
        border:'1px solid #D1FADF', color:'#027A48',
        fontFamily:'Barlow, sans-serif', fontSize:12, fontWeight:500, lineHeight:'16px'
      }}>Cost: 400</div>
      <LogoTile width={34}><GemsLogo /></LogoTile>
    </>) }
  ];

  return (
    <div style={{
      width: '100%', height: '100%', background: C.bg,
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <CheckoutHeader onBack={onBack} />

      <div className="scroller" style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '0 16px 24px', scrollBehavior: 'smooth'
      }}>
        {/* Player Information */}
        <div style={{ paddingTop: 24 }}>
          <SectionDescription title="PLAYER INFORMATION" done={done.player} />
          <div style={{
            background: C.surfaceAlt, borderRadius: 12, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 12
          }}>
            <InputField
              value={typedPlayerId}
              onChange={setTypedPlayerId}
              placeholder="Player ID"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <label
              onClick={() => setSavedDetails(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'Barlow, sans-serif', fontSize: 15, color: C.text600,
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                border: `1.5px solid ${savedDetails ? C.bluePrimary : C.borderInput}`,
                background: savedDetails ? C.bluePrimary : C.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all 220ms ${EASE_OUT}`
              }}>
                {savedDetails && <CheckIcon size={12} color="#fff" strokeW={3} />}
              </div>
              Save details for next time
            </label>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ paddingTop: 40 }}>
          <SectionDescriptionWithSubtitle
            title="PAYMENT METHODS"
            done={done.payment}
            subtitle="All transactions are secure and encrypted"
            trailing={
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                  fontFamily: 'Barlow, sans-serif', fontWeight: 400, fontSize: 12,
                  lineHeight: '16px', whiteSpace: 'nowrap'
                }}>
                  <span style={{ color: C.text900 }}>SAFE CHECKOUT</span>
                  <span style={{ color: '#027A48' }}>GUARANTEED</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" fill="none" stroke="#475467" strokeWidth="1.4" />
                  <path d="M11 3a8 8 0 0 1 0 16M3 11h16" fill="none" stroke="#475467" strokeWidth="1.4" />
                  <path d="M6 7q5 2 10 0M6 15q5 -2 10 0" fill="none" stroke="#475467" strokeWidth="1.2" />
                  <circle cx="18" cy="18" r="5" fill="#027A48" />
                  <path d="M15.8 18l1.6 1.6 3.2-3.2" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            }
          />
          <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.borderFaint}` }}>
            {paymentMethods.map((m, i) => (
              <PaymentRow
                key={m.id}
                method={m}
                selected={selectedPayment === m.id}
                onSelect={() => setSelectedPayment(m.id)}
                isFirst={i === 0}
                isLast={i === paymentMethods.length - 1}
              />
            ))}
          </div>
          <button style={{
            marginTop: 0, width: '100%', height: 44, borderRadius: 8,
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: 'Barlow, sans-serif', fontSize: 15, color: C.text600
          }}>
            Can&apos;t find my payment method? <span style={{ color: C.bluePrimary, fontWeight: 600 }}>Let us know!</span>
          </button>
        </div>

        {/* Get a Discount */}
        <div style={{ paddingTop: 40 }}>
          <SectionDescription title="GET A DISCOUNT" done={done.discount} />
          <div style={{
            background: C.surfaceAlt, borderRadius: 12,
            border: `1px solid ${useDiscount ? C.bluePrimary : C.borderFaint}`,
            padding: 16, display: 'flex', alignItems: 'center', gap: 12,
            position: 'relative', overflow: 'hidden',
            transition: `border-color 220ms ${EASE_OUT}`,
            cursor: 'pointer'
          }}
          onClick={() => setUseDiscount(v => !v)}
          >
            <div style={{
              width: 18, height: 18, borderRadius: 4,
              border: `1.5px solid ${useDiscount ? C.bluePrimary : C.borderInput}`,
              background: useDiscount ? C.bluePrimary : C.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: `all 220ms ${EASE_OUT}`
            }}>
              {useDiscount && <CheckIcon size={12} color="#fff" strokeW={3} />}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{
                fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 16,
                lineHeight: '20px', color: C.text900
              }}>700,000 Points</span>
              <span style={{
                fontFamily: 'Barlow, sans-serif', fontWeight: 400, fontSize: 14,
                lineHeight: '16px', color: C.text500
              }}>Spend Points and pay <strong style={{ color: C.text900 }}>$3 less</strong></span>
            </div>
            <img
              src="https://res.cloudinary.com/dk6ygi5j6/image/upload/v1778591095/CDP_fz03xk.png"
              alt=""
              style={{
                width: 93.12, height: 87.62, display: 'block',
                position: 'absolute', right: -27, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ paddingTop: 40 }}>
          <SectionDescription title="CONTACT INFORMATION" done={done.contact} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              onClick={() => setContactChoice('profile')}
              style={{
                background: contactChoice === 'profile' ? C.blueLighter : C.surfaceAlt,
                border: `1px solid ${contactChoice === 'profile' ? C.bluePrimary : C.borderFaint}`,
                borderRadius: '12px 12px 0 0',
                padding: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: `all 220ms ${EASE_OUT}`
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `1.5px solid ${contactChoice === 'profile' ? C.bluePrimary : C.borderInput}`,
                background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {contactChoice === 'profile' && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.bluePrimary }} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
                  lineHeight: '20px', color: C.text900
                }}>Use profile information</span>
                <span style={{
                  fontFamily: 'Barlow, sans-serif', fontWeight: 400, fontSize: 14,
                  lineHeight: '16px', color: C.text500
                }}>contact@zayan.design   |   +212639182215</span>
              </div>
            </div>
            <div
              onClick={() => setContactChoice('different')}
              style={{
                background: contactChoice === 'different' ? C.blueLighter : C.surfaceAlt,
                border: `1px solid ${contactChoice === 'different' ? C.bluePrimary : C.borderFaint}`,
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: `all 220ms ${EASE_OUT}`
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `1.5px solid ${contactChoice === 'different' ? C.bluePrimary : C.borderInput}`,
                background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {contactChoice === 'different' && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.bluePrimary }} />
                )}
              </div>
              <span style={{
                fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
                lineHeight: '20px', color: C.text900
              }}>Use different information</span>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div style={{ paddingTop: 40 }}>
          <SectionDescription
            title="PROMO CODE"
            done={done.promo}
            action={
              <button style={{
                background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
                fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
                lineHeight: '20px', color: C.bluePrimary
              }}>Add Promo Code</button>
            }
          />
          <div className="scroller" style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: 16,
            margin: '0 -16px', padding: '0 16px'
          }}>
            {PROMO_CODES.map(c => (
              <div key={c.id} style={{ scrollSnapAlign: 'start', flex: '0 0 280px' }}>
                <PromoCard
                  code={c}
                  applied={promoAppliedId === c.id}
                  loading={promoLoadingId === c.id}
                  highlight={promoHighlightId === c.id}
                  onUse={() => handleUsePromo(c.id)}
                  onRemove={() => handleRemovePromo(c.id)}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      <StickyFooter
        total={total}
        cta="Buy Now"
        onClick={onComplete}
        ctaDisabled={!canCheckout}
      />
      <PromoToast visible={promoToast.visible} message={promoToast.message} />
    </div>
  );
}

function Row({ k, v, bold, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{
        fontFamily: 'Barlow, sans-serif', fontSize: 15, lineHeight: '20px',
        color: C.text600, fontWeight: bold ? 600 : 400
      }}>{k}</span>
      <span style={{
        fontFamily: 'Barlow, sans-serif', fontSize: 15, lineHeight: '20px',
        color: color || C.text900, fontWeight: bold ? 700 : 500
      }}>{v}</span>
    </div>
  );
}

function ExpandableRow({ label, isFirst, isLast, content, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: C.surfaceAlt,
      borderBottom: isLast ? 'none' : `1px solid ${C.borderFaint}`
    }}>
      <button
        onClick={() => content && setOpen(o => !o)}
        style={{
          width: '100%', minHeight: 56, padding: '16px',
          background: 'transparent', border: 0,
          cursor: content ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 16,
          color: C.text900, textAlign: 'left'
        }}
      >
        <span>{label}</span>
        {open ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
      </button>
      {open && content && (
        <div style={{
          padding: '0 16px 16px',
          fontFamily: 'Barlow, sans-serif', fontSize: 15, lineHeight: '20px',
          color: C.text600
        }}>{content}</div>
      )}
    </div>
  );
}

// stylized coin stack for "Get a Discount"
function CoinStack() {
  return (
    <svg width="64" height="44" viewBox="0 0 64 44" style={{ display: 'block' }}>
      <ellipse cx="44" cy="32" rx="14" ry="10" fill="#F59E0B" />
      <ellipse cx="44" cy="29" rx="14" ry="10" fill="#FBBF24" />
      <ellipse cx="44" cy="29" rx="10" ry="7" fill="#F59E0B" opacity="0.3" />
      <ellipse cx="22" cy="22" rx="11" ry="8" fill="#F59E0B" />
      <ellipse cx="22" cy="19" rx="11" ry="8" fill="#FBBF24" />
      <ellipse cx="22" cy="19" rx="7.5" ry="5" fill="#F59E0B" opacity="0.3" />
      <ellipse cx="36" cy="12" rx="10" ry="7" fill="#F59E0B" />
      <ellipse cx="36" cy="9" rx="10" ry="7" fill="#FBBF24" />
      <ellipse cx="36" cy="9" rx="6.5" ry="4.2" fill="#F59E0B" opacity="0.3" />
    </svg>
  );
}

// ─── root app ───────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState('detail');
  const [chosenBundle, setChosenBundle] = useState(BUNDLES[0]);
  const [checkoutKey, setCheckoutKey] = useState(0);

  const handleProceed = (bundle) => {
    setChosenBundle(bundle);
    setCheckoutKey(k => k + 1); // force a fresh checkout each time
    setScreen('checkout');
  };
  const handleBack = () => setScreen('detail');
  const handleComplete = () => setScreen('detail');

  return (
    <Frame>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: screen === 'detail' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 360ms cubic-bezier(.2,.8,.2,1)'
        }}>
          <ProductDetail onProceed={handleProceed} />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          transform: screen === 'checkout' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 360ms cubic-bezier(.2,.8,.2,1)'
        }}>
          <Checkout
            key={checkoutKey}
            bundle={chosenBundle}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </Frame>
  );
}

// app shell — responsive across all iPhone widths (375 → 430), capped so it stays mobile on desktop
function Frame({ children }) {
  return (
    <div style={{
      width: '100%', maxWidth: 430, minHeight: '100dvh', height: '100dvh',
      margin: '0 auto',
      background: '#fff', position: 'relative', overflow: 'hidden',
      fontFamily: 'Barlow, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
      {/* iPhone home indicator safe area */}
      <div style={{ height: 34, background: '#fff', flexShrink: 0 }} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
