// Promo Codes prototype
// Two screens (Product Detail + Add Promo Code) with a Use → load → toast → highlight flow.

const { useState, useEffect, useRef, useCallback } = React;

// ─── design tokens ─────────────────────────────────────────────────
const C = {
  bg: '#F1F2F8',
  card: '#FFFFFF',
  cardAlt: '#FCFCFD',
  border: '#E4E7EC',
  borderSoft: '#E6E7EB',
  borderHair: '#E8E9EB',
  borderFaint: '#F2F4F7',
  text: '#222222',
  text900: '#101828',
  text600: '#475467',
  textMuted: '#7F807F',
  textPlaceholder: '#667085',
  blue: '#0A7AFF', // tag / icon
  bluePrimary: '#0A70FF', // primary cta
  blueLink: '#025EDE', // links
  blueHighlight: '#D7E7FF', // 400ms card flash
  blueToastBg: '#EFF4FF',
  amberCoin: '#F59E0B',
  navDark: '#1D2939'
};

// ─── inline icons (lucide-style strokes) ──────────────────────────
const stroke = (props = {}) => ({
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.6,
  strokeLinecap: 'round', strokeLinejoin: 'round', ...props
});
const Icon = ({ size = 20, children, style }) =>
<svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', ...style }}>{children}</svg>;

const ChevronLeft = ({ size }) => <Icon size={size}><path {...stroke()} d="M15 6l-6 6 6 6" /></Icon>;
const SearchIcon = ({ size = 18 }) => <Icon size={size}><circle {...stroke()} cx="11" cy="11" r="7" style={{ stroke: "rgb(208, 213, 221)" }} /><path {...stroke()} d="M20 20l-3.5-3.5" style={{ stroke: "rgb(208, 213, 221)" }} /></Icon>;
const MicIcon = ({ size = 18 }) =>
<Icon size={size}>
    <rect {...stroke()} x="9" y="3" width="6" height="11" rx="3" style={{ stroke: "rgb(54, 63, 114)" }} />
    <path {...stroke()} d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" style={{ stroke: "rgb(54, 63, 114)" }} />
  </Icon>;

const CartIcon = ({ size = 20 }) =>
<Icon size={size}>
    <path {...stroke()} d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
    <circle {...stroke({ fill: 'currentColor' })} cx="10" cy="20.5" r="1.2" />
    <circle {...stroke({ fill: 'currentColor' })} cx="17.5" cy="20.5" r="1.2" />
  </Icon>;

// solid filled tag matching the Figma local_offer
const TagSolid = ({ size = 16, color = C.blue }) =>
<svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.84zM6.5 7A1.5 1.5 0 1 1 8 5.5 1.5 1.5 0 0 1 6.5 7z" fill={color} />
  </svg>;

const TagOutline = ({ size = 18, color = C.textPlaceholder }) =>
<svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.84zM13 20.01 4 11V4h7l9 9zM6.5 5A1.5 1.5 0 1 0 8 6.5 1.5 1.5 0 0 0 6.5 5z" fill={color} />
  </svg>;

const ClockIcon = ({ size = 16, color = '#7E7E7E' }) =>
<Icon size={size} style={{ color }}><circle {...stroke()} cx="12" cy="12" r="9" /><path {...stroke()} d="M12 7v5l3 2" /></Icon>;

const InfoCircle = ({ size = 16, color = '#98A2B3' }) =>
<svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path fill={color} d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z" />
  </svg>;

const CheckIcon = ({ size = 16, color = C.bluePrimary, strokeW = 2.4 }) =>
<Icon size={size} style={{ color }}><path {...stroke({ strokeWidth: strokeW })} d="M5 12.5l4.2 4.2L19 7" style={{ stroke: "rgb(241, 242, 248)" }} /></Icon>;

const XIcon = ({ size = 16, color = '#98A2B3' }) =>
<Icon size={size} style={{ color }}><path {...stroke({ strokeWidth: 2 })} d="M6 6l12 12M18 6 6 18" /></Icon>;

const PlusIcon = ({ size = 18, color = '#475467' }) =>
<Icon size={size} style={{ color }}><path {...stroke({ strokeWidth: 2 })} d="M12 5v14M5 12h14" /></Icon>;

const MinusIcon = ({ size = 18, color = '#475467' }) =>
<Icon size={size} style={{ color }}><path {...stroke({ strokeWidth: 2 })} d="M5 12h14" /></Icon>;

const InfoFilled = ({ size = 16, color = '#9DA4AE' }) =>
<svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.18)" stroke={color} strokeWidth="1.6" />
    <path d="M12 11v5M12 8v.1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
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

const CoinIcon = ({ size = 18 }) =>
<svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill="#F4B740" />
    <circle cx="12" cy="12" r="7" fill="#F59E0B" />
    <text x="12" y="15.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E" fontFamily="Barlow, sans-serif">$</text>
  </svg>;


// status bar (matches Figma: 9:41, signal/wifi/battery)
function StatusBar() {
  return (
    <div style={{
      height: 48, padding: '14px 24px 0', display: 'flex',
      alignItems: 'flex-start', justifyContent: 'space-between',
      background: '#fff', boxSizing: 'border-box',
      fontFamily: '-apple-system, "SF Pro Text", system-ui'
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#000', letterSpacing: -0.2 }}>9:41</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.6" fill="#000" /><rect x="4.5" y="5" width="3" height="6" rx="0.6" fill="#000" /><rect x="9" y="2.5" width="3" height="8.5" rx="0.6" fill="#000" /><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill="#000" /></svg>
        <svg width="15" height="11" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#000" /><path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="#000" /><circle cx="8.5" cy="10.5" r="1.5" fill="#000" /></svg>
        <svg width="25" height="12" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3" stroke="#000" strokeOpacity="0.35" fill="none" /><rect x="2" y="2" width="19" height="9" rx="1.5" fill="#000" /><rect x="23.5" y="4" width="1.6" height="5" rx="0.6" fill="#000" fillOpacity="0.4" /></svg>
      </div>
    </div>);

}

// header with back / search / cart
function Header({ onBack }) {
  return (
    <div style={{
      height: 64, background: '#fff', borderBottom: `1px solid ${C.border}`,
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      boxSizing: 'border-box'
    }}>
      <button onClick={onBack} aria-label="Back" style={{
        background: 'transparent', border: 0, padding: 0, width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#363F72', cursor: 'pointer'
      }}>
        <ChevronLeft size={24} />
      </button>
      <div style={{
        flex: 1, height: 36, borderRadius: 12, background: '#fff',
        border: `1px solid #D0D5DD`, boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
        display: 'flex', alignItems: 'center', padding: '0 8px', gap: 8,
        color: C.textPlaceholder
      }}>
        <SearchIcon size={18} />
        <span style={{ flex: 1, fontFamily: 'Barlow, sans-serif', fontSize: 14, lineHeight: '20px' }}>Search games &amp; more</span>
        <MicIcon size={18} />
      </div>
      <div style={{ position: 'relative', width: 47, height: 24, color: '#475467' }}>
        <CartIcon size={22} />
        <span style={{
          position: 'absolute', left: 24, top: 0, minWidth: 19, height: 19,
          padding: '0 6px', borderRadius: 999, background: '#fff',
          border: `1px solid ${C.border}`, color: '#D92D20',
          fontFamily: 'Barlow, sans-serif', fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box'
        }}>2</span>
      </div>
    </div>);

}

// promo code card
function PromoCard({ code, applied, loading, highlight, highlightColor, onUse, onRemove }) {
  const bg = highlight ? highlightColor || C.blueHighlight : C.card;
  return (
    <div style={{
      width: 280, borderRadius: 12,
      background: bg, border: `1px solid ${C.borderSoft}`,
      transition: 'background-color 360ms ease',
      boxSizing: 'border-box', padding: '12px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative'
    }}>
      {loading ?
      <div style={{ minHeight: 97, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </div> :

      <React.Fragment>
          <div style={{ paddingBottom: 8, borderBottom: `1px solid ${C.borderHair}`, display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 24 }}>
              <TagSolid size={16} />
              <span style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 400, lineHeight: '16px', color: C.blue, fontSize: 12 }}>{code.code}</span>
            </div>
            <span style={{
            fontFamily: 'Barlow, sans-serif', fontSize: 16, lineHeight: '24px', color: C.text,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: 48, fontWeight: "600"
          }}>{code.title}</span>
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
              <InfoCircle size={16} />
            </div>
          </div>
          <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ClockIcon size={16} color="#667085" />
              <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, lineHeight: '16px', color: '#667085' }}>{code.expires}</span>
            </div>
            {applied ?
          <button onClick={onRemove} style={{
            background: 'transparent', border: 0, padding: '0 4px', cursor: 'pointer',
            fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 14, lineHeight: '20px',
            color: C.blueLink, letterSpacing: 0.1
          }} data-comment-anchor="b72271dd2a-button-221-11">Remove</button> :

          <button onClick={onUse} style={{
            height: 36, borderRadius: 8, cursor: 'pointer',
            background: '#fff', border: `1px solid #D0D5DD`,
            boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
            fontFamily: 'Barlow, sans-serif', fontSize: 14, lineHeight: '20px',
            color: '#475467', padding: '0 24px', fontWeight: 500
          }}>Use</button>
          }
          </div>
        </React.Fragment>
      }
    </div>);

}

function Spinner() {
  return (
    <div style={{ width: 40, height: 40, position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '4px solid #E5E7EB'
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '4px solid transparent', borderTopColor: '#1A56DB',
        animation: 'spin 0.9s linear infinite'
      }} />
    </div>);

}

// section header
function SectionHeader({ title, indicator = false, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: "0px 0px 20px"

    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {indicator &&
        <span style={{
            width: 24, height: 24, padding: 3, boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} data-comment-anchor="19ddc4d58e-span-269-9">
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#98A2B3',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckIcon size={12} color="#F1F2F8" strokeW={3} />
            </span>
          </span>
        }
        <span style={{
          fontFamily: 'Barlow, sans-serif',
          letterSpacing: 1.2, color: C.text900, fontSize: "16px", fontWeight: "700"
        }}>{title}</span>
      </div>
      {action}
    </div>);

}

// expandable row
function FaqRow({ label, open: initialOpen = false, content, isFirst, isLast }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div style={{
      background: '#FCFCFD',
      border: `1px solid ${C.border}`,
      borderTopWidth: isFirst ? 1 : 0,
      borderTopLeftRadius: isFirst ? 12 : 0, borderTopRightRadius: isFirst ? 12 : 0,
      borderBottomLeftRadius: isLast ? 12 : 0, borderBottomRightRadius: isLast ? 12 : 0,
      overflow: 'hidden'
    }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        width: '100%', minHeight: 56, padding: '16px 16px',
        background: 'transparent', border: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 14,
        color: C.text900, textAlign: 'left'
      }}>
        <span>{label}</span>
        {open ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
      </button>
      {open && content &&
      <div style={{
        padding: '0 16px 16px',
        fontFamily: 'Barlow, sans-serif', fontSize: 13, lineHeight: '20px',
        color: C.text600
      }}>{content}</div>
      }
    </div>);

}

// toast
function Toast({ visible, message }) {
  return (
    <div style={{
      position: 'absolute', top: 60, left: 16, right: 16, zIndex: 50,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none'
    }}>
      <div style={{
        width: '100%', maxWidth: 344, background: '#fff',
        borderRadius: 12, border: `1px solid ${C.border}`,
        boxShadow: '0 8px 24px rgba(16,24,40,0.10), 0 2px 6px rgba(16,24,40,0.04)',
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
        transform: visible ? 'translateY(0)' : 'translateY(-160%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 320ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease'
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8, background: C.blueToastBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <CheckIcon size={18} color={C.bluePrimary} strokeW={2.6} />
        </span>
        <span style={{
          flex: 1, fontFamily: 'Barlow, sans-serif', fontSize: 14, lineHeight: '20px',
          color: C.text900, fontWeight: 500
        }}>{message}</span>
        <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <XIcon size={16} />
        </span>
      </div>
    </div>);

}

// product information row
function ProductRow({ label, isFirst, isLast }) {
  return (
    <div style={{
      background: '#FCFCFD', minHeight: 56, padding: '16px',
      borderTopLeftRadius: isFirst ? 12 : 0, borderTopRightRadius: isFirst ? 12 : 0,
      borderBottomLeftRadius: isLast ? 12 : 0, borderBottomRightRadius: isLast ? 12 : 0,
      borderBottom: isLast ? 'none' : `1px solid ${C.borderFaint}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 14, color: '#1D2939'
    }}>
      <span>{label}</span>
      <PlusIcon size={20} />
    </div>);

}

// payment summary footer (Earn points + Total + Buy Now)
function Footer() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff',
      borderTop: `1px solid ${C.border}`, zIndex: 30
    }}>
      <div style={{
        background: C.text900, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CoinIcon size={20} />
          <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 13, color: '#fff' }}>
            Earn <strong>1 Point</strong> (₦1) <span style={{ color: '#98A2B3' }}>with this purchase</span>
          </span>
        </div>
        <InfoFilled size={18} />
      </div>
      <div style={{ padding: '12px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 14, color: C.text900 }}>
            <strong>Total</strong> <span style={{ color: C.textMuted }}>(Service fee is applied)</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Barlow, sans-serif', fontSize: 16, fontWeight: 700, color: C.text900 }}>
            $50
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" fill="none" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
        <button style={{
          width: '100%', height: 48, borderRadius: 10, border: 0, cursor: 'pointer',
          background: C.bluePrimary, color: '#fff',
          fontFamily: 'Barlow, sans-serif', fontWeight: 700, fontSize: 16
        }}>Buy Now</button>
      </div>
    </div>);

}

// bottom navbar (Add Promo Code screen)
function BottomNav() {
  const items = [
  { id: 'shop', label: 'Shop', icon: ShopBag, active: true },
  { id: 'fav', label: 'Favorite', icon: HeartIcon },
  { id: 'deals', label: 'Deals', icon: TicketIcon, badge: 3 },
  { id: 'wallet', label: 'Wallet', icon: WalletIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon }];

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 62,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)',
      borderTop: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
      boxSizing: 'border-box', zIndex: 30
    }}>
      {items.map((it) => {
        const I = it.icon;
        return (
          <div key={it.id} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            position: 'relative'
          }}>
            <div style={{ position: 'relative' }}>
              <I active={it.active} />
              {it.badge &&
              <span style={{
                position: 'absolute', top: -6, right: -10, minWidth: 16, height: 16, padding: '0 4px',
                background: '#F59E0B', borderRadius: 999, color: '#fff',
                fontFamily: 'Barlow, sans-serif', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #fff', boxSizing: 'border-box'
              }}>{it.badge}</span>
              }
            </div>
            <span style={{
              fontFamily: 'Barlow, sans-serif', fontSize: 11, fontWeight: 500,
              color: it.active ? C.text900 : C.text600
            }}>{it.label}</span>
          </div>);

      })}
    </div>);

}

// ─── promo code data ────────────────────────────────────────────────
const initialCodes = [
{ id: 'a', code: 'CARRY20OFF', title: '15% off (up to US$20)', expires: 'Expires in 20 days' },
{ id: 'b', code: 'SAVE10NOW', title: '10% off (up to US$15)', expires: 'Expires in 14 days' },
{ id: 'c', code: 'FCMOBILE5', title: '$5 off FC™ Mobile', expires: 'Expires in 3 days' }];

const otherCodes = [
{ id: 'd', code: 'WELCOME25', title: '25% off first order', expires: 'Eligible for new users only' },
{ id: 'e', code: 'BUNDLE15', title: '15% off bundles', expires: 'On selected bundles' }];


// ─── product detail screen ─────────────────────────────────────────
function ProductDetail({ appliedId, onUse, onRemove, onAddPromo, loadingId, highlightId, highlightColor }) {
  const scrollerRef = useRef(null);

  // when a code is applied/removed, scroll the relevant card into view
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = appliedId || loadingId;
    if (!target) return;
    const idx = initialCodes.findIndex((c) => c.id === target);
    if (idx >= 0) el.scrollTo({ left: idx * (280 + 8), behavior: 'smooth' });
  }, [appliedId, loadingId]);

  return (
    <div style={{
      width: '100%', height: '100%', background: C.bg, position: 'relative',
      overflow: 'hidden', display: 'flex', flexDirection: 'column'
    }}>
      <StatusBar />
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 156 }}>
        <div style={{ padding: '20px 16px 0' }}>
          <SectionHeader
            title="PROMO CODE"
            indicator
            action={
            <button onClick={onAddPromo} style={{
              background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
              fontFamily: 'Barlow, sans-serif', fontSize: 14,
              lineHeight: '20px', color: C.blueLink, fontWeight: "500"
            }}>Add Promo Code</button>
            } />
          

          <div ref={scrollerRef} className="promo-scroller" style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: 16,
            margin: "0px -16px", padding: "0px 16px"
          }} data-comment-anchor="07f3041e3b-div-495-11">
            {initialCodes.map((c) =>
            <div key={c.id} style={{ scrollSnapAlign: 'start', flex: '0 0 280px' }}>
                <PromoCard
                code={c}
                applied={appliedId === c.id}
                loading={loadingId === c.id}
                highlight={highlightId === c.id}
                highlightColor={highlightColor}
                onUse={() => onUse(c.id)}
                onRemove={() => onRemove(c.id)} />
              
              </div>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: C.border, margin: '24px 16px 0' }} />

        <div style={{ padding: '24px 16px 0' }}>
          <SectionHeader title="PRODUCT INFORMATION" />
          <div style={{ borderRadius: 12, overflow: 'hidden' }}>
            <ProductRow label="How to redeem EA Sports FC™ Mobile" isFirst isLast />
          </div>
        </div>

        <div style={{ padding: '24px 16px 24px' }}>
          <SectionHeader title="FREQUENTLY ASKED QUESTIONS" />
          <div style={{ borderRadius: 12, overflow: 'hidden' }}>
            <FaqRow label="How are FC Points different to other in-game currencies?" open content="FC Points are a premium currency you can redeem for FC Mobile content, including packs, upgrades, and seasonal items." isFirst />
            <FaqRow label="Where can I use FC Points?" />
            <FaqRow label="Do FC Points expire?" />
            <FaqRow label="Can I get a refund?" isLast />
          </div>
        </div>
      </div>

      <Footer />
    </div>);

}

// ─── add promo code screen ─────────────────────────────────────────
function AddPromoScreen({ onBack, onApply, appliedId }) {
  const [tab, setTab] = useState('applicable');
  const [input, setInput] = useState('');
  const valid = input.trim().length >= 3;

  return (
    <div style={{
      width: '100%', height: '100%', background: C.bg, position: 'relative',
      overflow: 'hidden', display: 'flex', flexDirection: 'column'
    }}>
      <StatusBar />
      <Header onBack={onBack} />

      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', background: C.bg }}>
        <span style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 700, fontSize: 20, color: C.text900 }}>Promo Codes</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 78 }}>
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: '#FCFCFD', borderRadius: 12, padding: 12,
            display: 'flex', flexDirection: 'column', gap: 12
          }}>
            <div style={{
              height: 56, borderRadius: 12, border: `1px solid #D0D5DD`,
              background: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px'
            }}>
              <TagOutline size={20} color={input ? C.text900 : C.textPlaceholder} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder="Enter Promo Code"
                style={{
                  flex: 1, border: 0, outline: 'none', background: 'transparent',
                  fontFamily: 'Barlow, sans-serif', fontSize: 14, color: C.text900,
                  letterSpacing: 0.3
                }} />
              
            </div>
            <button
              disabled={!valid}
              onClick={() => {
                // accept any typed code: treat as applying first applicable
                onApply(initialCodes[0].id);
              }}
              style={{
                height: 44, borderRadius: 10, border: 0, cursor: valid ? 'pointer' : 'default',
                background: valid ? C.bluePrimary : '#A8C7FA', color: '#fff',
                fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 16,
                opacity: valid ? 1 : 0.85, transition: 'opacity 200ms'
              }}>
              Use</button>
          </div>
        </div>

        <div style={{ height: 1, background: C.border, margin: '24px 16px 0' }} />

        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            {['applicable', 'others'].map((t) =>
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
              fontFamily: 'Barlow, sans-serif', fontWeight: 700, fontSize: 16,
              color: tab === t ? C.text900 : 'rgba(16,24,40,0.4)',
              position: 'relative', paddingBottom: 6
            }}>
                {t === 'applicable' ? 'Applicable' : 'Others'}
                {tab === t &&
              <span style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: 2,
                background: C.text900, borderRadius: 2
              }} />
              }
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(tab === 'applicable' ? initialCodes : otherCodes).map((c) =>
            <FullPromoCard
              key={c.id}
              code={c}
              applied={appliedId === c.id}
              disabled={tab === 'others'}
              onUse={() => onApply(c.id)} />

            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>);

}

// full-width promo card used in Add Promo screen
function FullPromoCard({ code, applied, disabled, onUse }) {
  return (
    <div style={{
      borderRadius: 12, background: '#fff', border: `1px solid ${C.borderSoft}`,
      padding: '12px 16px', position: 'relative', opacity: disabled ? 0.6 : 1,
      display: 'flex', flexDirection: 'column', gap: 8
    }}>
      <div style={{ paddingBottom: 8, borderBottom: `1px solid ${C.borderHair}`, display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 24 }}>
          <TagSolid size={16} />
          <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, fontWeight: 400, lineHeight: '16px', color: C.blue }}>{code.code}</span>
        </div>
        <span style={{
          fontFamily: 'Barlow, sans-serif', fontSize: 16, lineHeight: '24px', color: C.text,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: 48, fontWeight: 600
        }}>{code.title}</span>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <InfoCircle size={16} />
        </div>
      </div>
      <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ClockIcon size={16} color="#667085" />
          <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, lineHeight: '16px', color: '#667085' }}>{code.expires}</span>
        </div>
        {!disabled &&
        <button onClick={onUse} style={{
          height: 36, borderRadius: 8, cursor: 'pointer',
          background: '#fff', border: `1px solid #D0D5DD`,
          boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
          fontFamily: 'Barlow, sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '20px',
          color: '#475467', padding: '0 24px'
        }}>{applied ? 'Applied' : 'Use'}</button>
        }
      </div>
    </div>);

}

// ─── tweaks defaults ────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "loadingMs": 600,
  "highlightMs": 400,
  "toastDwellMs": 1200,
  "toastStyle": "card",
  "highlightColor": "#D7E7FF"
} /*EDITMODE-END*/;

// ─── root app ──────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = typeof useTweaks === 'function' ?
  useTweaks(TWEAK_DEFAULTS) :
  [TWEAK_DEFAULTS, () => {}];

  const [screen, setScreen] = useState('detail'); // 'detail' | 'add'
  const [appliedId, setAppliedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const timersRef = useRef([]);
  useEffect(() => () => {timersRef.current.forEach(clearTimeout);}, []);
  const after = (ms, fn) => {const id = setTimeout(fn, ms);timersRef.current.push(id);return id;};

  // The full apply / remove flow
  const triggerFlow = useCallback((id, action /* 'apply' | 'remove' */) => {
    if (loadingId) return;
    setLoadingId(id);

    after(tweaks.loadingMs, () => {
      setLoadingId(null);
      if (action === 'apply') {
        setAppliedId(id);
        setHighlightId(id);
        setToast({ visible: true, message: 'Promo code applied!' });
        after(tweaks.highlightMs, () => setHighlightId(null));
      } else {
        setAppliedId(null);
        setHighlightId(id);
        setToast({ visible: true, message: 'Promo code removed' });
        after(tweaks.highlightMs, () => setHighlightId(null));
      }
      after(tweaks.toastDwellMs, () => setToast((s) => ({ ...s, visible: false })));
    });
  }, [loadingId, tweaks.loadingMs, tweaks.highlightMs, tweaks.toastDwellMs]);

  const handleUse = (id) => triggerFlow(id, 'apply');
  const handleRemove = (id) => triggerFlow(id, 'remove');
  const handleApplyFromAdd = (id) => {
    setScreen('detail');
    // small delay so the screen swap doesn't fight the loader animation
    after(220, () => triggerFlow(id, 'apply'));
  };

  return (
    <Frame>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: screen === 'detail' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 320ms cubic-bezier(.2,.8,.2,1)'
        }}>
          <ProductDetail
            appliedId={appliedId}
            loadingId={loadingId}
            highlightId={highlightId}
            highlightColor={tweaks.highlightColor}
            onUse={handleUse}
            onRemove={handleRemove}
            onAddPromo={() => setScreen('add')} />
          
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          transform: screen === 'add' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(.2,.8,.2,1)'
        }}>
          <AddPromoScreen
            appliedId={appliedId}
            onBack={() => setScreen('detail')}
            onApply={handleApplyFromAdd} />
          
        </div>
        <Toast visible={toast.visible} message={toast.message} />
      </div>

      {typeof TweaksPanel !== 'undefined' &&
      <TweaksPanel title="Tweaks">
          <TweakSection title="Timing">
            <TweakSlider label="Loading" value={tweaks.loadingMs} min={100} max={2000} step={50} onChange={(v) => setTweak('loadingMs', v)} unit="ms" />
            <TweakSlider label="Highlight" value={tweaks.highlightMs} min={100} max={1500} step={50} onChange={(v) => setTweak('highlightMs', v)} unit="ms" />
            <TweakSlider label="Toast dwell" value={tweaks.toastDwellMs} min={400} max={4000} step={100} onChange={(v) => setTweak('toastDwellMs', v)} unit="ms" />
          </TweakSection>
          <TweakSection title="Highlight color">
            <TweakColor value={tweaks.highlightColor} onChange={(v) => setTweak('highlightColor', v)} options={['#D7E7FF', '#E0F2E9', '#FFE9D6', '#EAE6FF']} />
          </TweakSection>
          <TweakSection title="Replay">
            <TweakButton onClick={() => {setAppliedId(null);setHighlightId(null);setLoadingId(null);setToast({ visible: false, message: '' });}}>Reset state</TweakButton>
          </TweakSection>
        </TweaksPanel>
      }
    </Frame>);

}

// override C.blueHighlight at runtime via tweaks
function HighlightStyle() {
  // not used; tweaks color is plumbed via inline override below if desired
  return null;
}

// device frame — simple notched iPhone-ish bezel, scales to viewport
function Frame({ children }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#FFFFFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, boxSizing: 'border-box', fontFamily: 'Barlow, system-ui, sans-serif'
    }}>
      <div style={{
        width: 390, height: 812, background: '#000',
        borderRadius: 48, padding: 8, boxSizing: 'border-box',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1.5px #1f242b inset'
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 40, overflow: 'hidden', position: 'relative',
          background: '#fff', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {children}
          </div>
          {/* iPhone home indicator safe area */}
          <div style={{ height: 34, background: '#fff', flexShrink: 0 }} />
          {/* dynamic island */}
          <div style={{
            position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 30, borderRadius: 999, background: '#000', zIndex: 100
          }} />
        </div>
      </div>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);