import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ══════════════════════════════════════════════════════════════════════════════
// NEXUS GAMEFI PROTOCOL - Complete Unified Platform
// Features: Cross-Game Asset Composability + Decentralized Game Launcher + AI Revenue Engine
// Version: 1.0.0 | License: MIT | Zero-Cost Deployment
// ══════════════════════════════════════════════════════════════════════════════

const mockGames = [
  { id: 'g1', name: 'Ethereal Kingdoms', genre: 'RPG', players: 45230, revenue: 892000, growth: 23.5, icon: '⚔️', chain: 'Ethereum', status: 'live' },
  { id: 'g2', name: 'Neon Racers', genre: 'Racing', players: 31200, revenue: 456000, growth: 18.2, icon: '🏎️', chain: 'Polygon', status: 'live' },
  { id: 'g3', name: 'Cosmic Siege', genre: 'Strategy', players: 28900, revenue: 678000, growth: 31.8, icon: '🚀', chain: 'Arbitrum', status: 'live' },
  { id: 'g4', name: 'Shadow Arena', genre: 'Battle Royale', players: 89400, revenue: 1240000, growth: 45.2, icon: '🎯', chain: 'Optimism', status: 'featured' },
  { id: 'g5', name: 'Pixel Legends', genre: 'Platformer', players: 15600, revenue: 234000, growth: 12.1, icon: '👾', chain: 'Base', status: 'live' },
];

const mockAssets = [
  { id: 'a1', name: 'Dragon Blade', game: 'Ethereal Kingdoms', rarity: 'Legendary', price: 2.5, uses: 12450, image: '🗡️', traits: ['Fire', 'Critical'], revenue: 45000, wrapped: true },
  { id: 'a2', name: 'Quantum Shield', game: 'Cosmic Siege', rarity: 'Epic', price: 1.2, uses: 8900, image: '🛡️', traits: ['Defense'], revenue: 23000, wrapped: true },
  { id: 'a3', name: 'Velocity Boots', game: 'Neon Racers', rarity: 'Rare', price: 0.8, uses: 15600, image: '👟', traits: ['Speed'], revenue: 18000, wrapped: true },
  { id: 'a4', name: 'Phoenix Wings', game: 'Shadow Arena', rarity: 'Legendary', price: 3.8, uses: 6200, image: '🔥', traits: ['Flight'], revenue: 67000, wrapped: true },
];

const revenueData = [
  { month: 'Jan', revenue: 120000, aiUplift: 15000 },
  { month: 'Feb', revenue: 180000, aiUplift: 28000 },
  { month: 'Mar', revenue: 220000, aiUplift: 42000 },
  { month: 'Apr', revenue: 310000, aiUplift: 58000 },
  { month: 'May', revenue: 420000, aiUplift: 78000 },
  { month: 'Jun', revenue: 580000, aiUplift: 112000 },
];

const aiInsights = [
  { type: 'revenue', message: 'Increase item drop rates by 15% to boost retention', impact: '+$45K/mo', confidence: 89 },
  { type: 'churn', message: 'Players leaving at level 23 - add bonus rewards', impact: '-12% churn', confidence: 94 },
  { type: 'pricing', message: 'Premium items priced 20% too high', impact: '+$28K/mo', confidence: 86 },
  { type: 'engagement', message: 'Weekend events drive 3x more transactions', impact: '+$67K/mo', confidence: 91 },
];

const proposals = [
  { id: 1, title: 'Reduce Platform Fee to 3%', votes: 892000, quorum: 1000000, status: 'active', endDate: '3 days', support: 78 },
  { id: 2, title: 'Add Solana Chain Support', votes: 1200000, quorum: 1000000, status: 'passed', endDate: 'Ended', support: 89 },
  { id: 3, title: 'Cross-Game Tournaments', votes: 456000, quorum: 1000000, status: 'active', endDate: '5 days', support: 65 },
];

const colors = {
  primary: '#00F0FF', secondary: '#FF00E5', accent: '#FFE500', success: '#00FF94', warning: '#FF9500', error: '#FF3366',
  bg: { dark: '#0A0A12', card: '#12121F' },
  text: { primary: '#FFFFFF', secondary: '#8B8BA7', muted: '#5A5A72' },
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: colors.bg.card, borderRadius: '16px', border: `1px solid ${colors.primary}15`, padding: '24px', position: 'relative', cursor: onClick ? 'pointer' : 'default', ...style }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${colors.primary}30, transparent)` }} />
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', onClick, disabled, style = {} }) => {
  const v = { primary: { background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: colors.bg.dark, border: 'none' }, secondary: { background: 'transparent', color: colors.primary, border: `2px solid ${colors.primary}` }, ghost: { background: `${colors.primary}10`, color: colors.primary, border: `1px solid ${colors.primary}25` } };
  return <button onClick={onClick} disabled={disabled} style={{ ...v[variant], padding: '12px 24px', fontWeight: 600, fontSize: '14px', borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-flex', alignItems: 'center', gap: '8px', ...style }}>{children}</button>;
};

const Badge = ({ children, color = colors.primary }) => <span style={{ background: `${color}20`, color, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>{children}</span>;

const StatCard = ({ label, value, change, icon, color = colors.primary }) => (
  <Card>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: colors.text.secondary, fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase' }}>{label}</p>
        <h3 style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</h3>
        {change !== undefined && <span style={{ color: change >= 0 ? colors.success : colors.error, fontSize: '13px', marginTop: '8px', display: 'block' }}>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>}
      </div>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{icon}</div>
    </div>
  </Card>
);

const Modal = ({ isOpen, onClose, title, children }) => isOpen ? (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,18,0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={onClose}>
    <div style={{ background: colors.bg.card, borderRadius: '20px', border: `1px solid ${colors.primary}30`, maxWidth: '600px', width: '100%', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.primary}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 style={{ fontSize: '18px', color: colors.primary, fontWeight: 700 }}>{title}</h2><button onClick={onClose} style={{ background: 'none', border: 'none', color: colors.text.secondary, fontSize: '24px', cursor: 'pointer' }}>×</button></div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
) : null;

const Input = ({ label, placeholder, value, onChange, icon }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && <label style={{ display: 'block', marginBottom: '8px', color: colors.text.secondary, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>{label}</label>}
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.text.muted }}>{icon}</span>}
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} style={{ width: '100%', padding: icon ? '14px 14px 14px 44px' : '14px', background: colors.bg.dark, border: `1px solid ${colors.primary}25`, borderRadius: '10px', color: colors.text.primary, fontSize: '15px', outline: 'none' }} />
    </div>
  </div>
);

const ProgressBar = ({ value, max = 100, color = colors.primary }) => (
  <div style={{ width: '100%', height: '6px', background: `${color}15`, borderRadius: '3px', overflow: 'hidden' }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${colors.secondary})`, borderRadius: '3px' }} />
  </div>
);

const Navigation = ({ activePage, setActivePage, walletConnected, setWalletConnected }) => {
  const navItems = [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }, { id: 'assets', label: 'Universal Assets', icon: '🎮' }, { id: 'games', label: 'Game Launcher', icon: '🚀' }, { id: 'marketplace', label: 'Marketplace', icon: '🏪' }, { id: 'analytics', label: 'AI Analytics', icon: '🤖' }, { id: 'governance', label: 'Governance', icon: '⚖️' }, { id: 'deploy', label: 'Deploy Game', icon: '⚡' }];
  return (
    <nav style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px', background: colors.bg.card, borderRight: `1px solid ${colors.primary}15`, padding: '20px 12px', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      <div style={{ padding: '16px 12px', marginBottom: '24px' }}><h1 style={{ fontSize: '24px', fontWeight: 900, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}>NEXUS</h1><p style={{ fontSize: '9px', color: colors.text.muted, letterSpacing: '2px', marginTop: '4px', textTransform: 'uppercase' }}>GameFi Protocol v1.0</p></div>
      <div style={{ flex: 1 }}>{navItems.map(item => <button key={item.id} onClick={() => setActivePage(item.id)} style={{ width: '100%', padding: '12px 14px', marginBottom: '4px', background: activePage === item.id ? `linear-gradient(90deg, ${colors.primary}18, transparent)` : 'transparent', border: 'none', borderLeft: activePage === item.id ? `3px solid ${colors.primary}` : '3px solid transparent', borderRadius: '0 8px 8px 0', color: activePage === item.id ? colors.primary : colors.text.secondary, fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}><span style={{ fontSize: '16px' }}>{item.icon}</span>{item.label}</button>)}</div>
      <div style={{ padding: '14px', background: colors.bg.dark, borderRadius: '12px' }}>{walletConnected ? <div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.success }} /><span style={{ color: colors.success, fontSize: '11px', textTransform: 'uppercase' }}>Connected</span></div><p style={{ fontSize: '11px', color: colors.text.secondary, marginBottom: '4px' }}>0x7a3d...f91e</p><p style={{ fontSize: '13px', color: colors.primary }}>12,450 NEXUS</p><Button variant="ghost" style={{ width: '100%', marginTop: '12px', padding: '8px' }} onClick={() => setWalletConnected(false)}>Disconnect</Button></div> : <Button variant="primary" style={{ width: '100%' }} onClick={() => setWalletConnected(true)}>🔗 Connect Wallet</Button>}</div>
    </nav>
  );
};

const DashboardPage = () => {
  const pieData = [{ name: 'RPG', value: 35, color: colors.primary }, { name: 'Racing', value: 25, color: colors.secondary }, { name: 'Strategy', value: 20, color: colors.accent }, { name: 'Other', value: 20, color: colors.success }];
  return (
    <div>
      <div style={{ marginBottom: '28px' }}><h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Protocol Dashboard</h1><p style={{ color: colors.text.secondary }}>Real-time overview of the Nexus GameFi ecosystem</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}><StatCard label="Total Value Locked" value="$12.4M" change={15.3} icon="💰" color={colors.primary} /><StatCard label="Active Games" value="247" change={8.2} icon="🎮" color={colors.secondary} /><StatCard label="Cross-Game Txns" value="1.2M" change={32.1} icon="🔄" color={colors.accent} /><StatCard label="Unique Players" value="89.5K" change={21.7} icon="👥" color={colors.success} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <Card><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Revenue & AI Uplift</h3><ResponsiveContainer width="100%" height={250}><AreaChart data={revenueData}><defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={colors.primary} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="month" stroke={colors.text.muted} fontSize={11} /><YAxis stroke={colors.text.muted} fontSize={11} /><Tooltip contentStyle={{ background: colors.bg.card, border: `1px solid ${colors.primary}30`, borderRadius: '8px' }} /><Area type="monotone" dataKey="revenue" stroke={colors.primary} fill="url(#grad1)" /></AreaChart></ResponsiveContainer></Card>
        <Card><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Genre Distribution</h3><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">{pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer><div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>{pieData.map(item => <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color }} /><span style={{ fontSize: '11px', color: colors.text.secondary }}>{item.name}</span></div>)}</div></Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Recent Transactions</h3>{[{ from: 'Ethereal Kingdoms', to: 'Shadow Arena', asset: 'Dragon Blade', value: '2.5 ETH' }, { from: 'Neon Racers', to: 'Cosmic Siege', asset: 'Velocity Boots', value: '0.8 ETH' }, { from: 'Pixel Legends', to: 'Ethereal Kingdoms', asset: 'Crystal Shard', value: '0.1 ETH' }].map((tx, i) => <div key={i} style={{ padding: '12px', background: colors.bg.dark, borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔄</div><div><p style={{ fontWeight: 600, fontSize: '13px' }}>{tx.asset}</p><p style={{ fontSize: '11px', color: colors.text.muted }}>{tx.from} → {tx.to}</p></div></div><Badge color={colors.success}>{tx.value}</Badge></div>)}</Card>
        <Card><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Top Games</h3>{mockGames.slice(0, 3).map(game => <div key={game.id} style={{ padding: '12px', background: colors.bg.dark, borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${colors.secondary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{game.icon}</div><div><p style={{ fontWeight: 600, fontSize: '13px' }}>{game.name}</p><p style={{ fontSize: '11px', color: colors.text.muted }}>{game.players.toLocaleString()} players</p></div></div><span style={{ color: colors.success, fontSize: '13px' }}>+{game.growth}%</span></div>)}</Card>
      </div>
    </div>
  );
};

const UniversalAssetsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showWrapModal, setShowWrapModal] = useState(false);
  const getRarityColor = (r) => r === 'Legendary' ? colors.accent : r === 'Epic' ? colors.secondary : colors.primary;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}><div><h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Universal Assets Protocol</h1><p style={{ color: colors.text.secondary }}>Cross-game asset composability & interoperability</p></div><Button variant="primary" onClick={() => setShowWrapModal(true)}>➕ Wrap Asset</Button></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}><StatCard label="Wrapped Assets" value="12,847" change={18.5} icon="📦" color={colors.primary} /><StatCard label="Cross-Game Uses" value="2.4M" change={45.2} icon="🔗" color={colors.secondary} /><StatCard label="Creator Revenue" value="$890K" change={22.3} icon="💎" color={colors.accent} /><StatCard label="Active Licenses" value="1,245" change={31.8} icon="📜" color={colors.success} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>{mockAssets.map(asset => <Card key={asset.id} onClick={() => setSelectedAsset(asset)} style={{ cursor: 'pointer' }}><div style={{ height: '100px', background: `linear-gradient(135deg, ${colors.bg.dark}, ${getRarityColor(asset.rarity)}15)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', marginBottom: '12px' }}>{asset.image}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}><div><h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{asset.name}</h3><p style={{ fontSize: '11px', color: colors.text.secondary }}>{asset.game}</p></div><Badge color={getRarityColor(asset.rarity)}>{asset.rarity}</Badge></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', padding: '10px', background: colors.bg.dark, borderRadius: '8px' }}><div style={{ textAlign: 'center' }}><p style={{ fontSize: '9px', color: colors.text.muted }}>PRICE</p><p style={{ fontSize: '12px', color: colors.primary }}>{asset.price} ETH</p></div><div style={{ textAlign: 'center' }}><p style={{ fontSize: '9px', color: colors.text.muted }}>USES</p><p style={{ fontSize: '12px' }}>{(asset.uses/1000).toFixed(1)}K</p></div><div style={{ textAlign: 'center' }}><p style={{ fontSize: '9px', color: colors.text.muted }}>REV</p><p style={{ fontSize: '12px', color: colors.success }}>${(asset.revenue/1000).toFixed(0)}K</p></div></div></Card>)}</div>
      <Modal isOpen={showWrapModal} onClose={() => setShowWrapModal(false)} title="Wrap New Asset"><p style={{ color: colors.text.secondary, marginBottom: '20px' }}>Register your NFT for cross-game composability with automated revenue sharing.</p><Input label="Contract Address" placeholder="0x..." icon="📋" /><Input label="Token ID" placeholder="Enter token ID" /><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '8px', color: colors.text.secondary, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Revenue Share</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>{[5, 10, 15, 20].map(pct => <button key={pct} style={{ padding: '12px', background: pct === 10 ? `${colors.primary}20` : colors.bg.dark, border: `2px solid ${pct === 10 ? colors.primary : 'transparent'}`, borderRadius: '8px', color: colors.text.primary, cursor: 'pointer' }}>{pct}%</button>)}</div></div><div style={{ display: 'flex', gap: '12px' }}><Button variant="secondary" style={{ flex: 1 }} onClick={() => setShowWrapModal(false)}>Cancel</Button><Button variant="primary" style={{ flex: 1 }}>🔗 Wrap Asset</Button></div></Modal>
      <Modal isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={selectedAsset?.name || ''}>{selectedAsset && <div><div style={{ height: '160px', background: `linear-gradient(135deg, ${colors.bg.dark}, ${getRarityColor(selectedAsset.rarity)}15)`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', marginBottom: '20px' }}>{selectedAsset.image}</div><div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}><Badge color={getRarityColor(selectedAsset.rarity)}>{selectedAsset.rarity}</Badge><Badge color={colors.primary}>{selectedAsset.game}</Badge>{selectedAsset.wrapped && <Badge color={colors.success}>✓ Wrapped</Badge>}</div><h4 style={{ fontSize: '12px', color: colors.text.muted, marginBottom: '10px', textTransform: 'uppercase' }}>Cross-Game Effects</h4><div style={{ background: colors.bg.dark, borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>{[{ game: 'Battle Royale', effect: '+5% Damage' }, { game: 'Racing', effect: '+3% Speed' }, { game: 'Strategy', effect: '+10% Power' }].map((e, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? `1px solid ${colors.primary}10` : 'none' }}><span style={{ color: colors.text.secondary, fontSize: '13px' }}>{e.game}</span><span style={{ color: colors.success, fontSize: '13px' }}>{e.effect}</span></div>)}</div><div style={{ display: 'flex', gap: '12px' }}><Button variant="secondary" style={{ flex: 1 }}>📊 Analytics</Button><Button variant="primary" style={{ flex: 1 }}>🛒 License</Button></div></div>}</Modal>
    </div>
  );
};

const GameLauncherPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const featured = mockGames.find(g => g.status === 'featured');
  return (
    <div>
      <div style={{ marginBottom: '28px' }}><h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Decentralized Game Launcher</h1><p style={{ color: colors.text.secondary }}>Discover, play, and earn across the ecosystem</p></div>
      <Card style={{ background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}12)`, marginBottom: '24px', padding: '28px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><Badge color={colors.accent}>🔥 Featured</Badge><h2 style={{ fontSize: '24px', fontWeight: 800, margin: '12px 0' }}>{featured?.name}</h2><p style={{ color: colors.text.secondary, maxWidth: '400px', marginBottom: '16px' }}>Epic battle royale with full Web3 integration.</p><div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}><Button variant="primary">▶️ Play Now</Button><span style={{ color: colors.text.secondary, fontSize: '13px' }}>🟢 {featured?.players.toLocaleString()} Online</span></div></div><div style={{ width: '140px', height: '140px', borderRadius: '20px', background: colors.bg.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>{featured?.icon}</div></div></Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{mockGames.map(game => <Card key={game.id} onClick={() => setSelectedGame(game)}><div style={{ height: '120px', background: `linear-gradient(135deg, ${colors.bg.dark}, ${colors.primary}10)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '14px' }}>{game.icon}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}><div><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{game.name}</h3><p style={{ fontSize: '12px', color: colors.text.secondary }}>{game.genre}</p></div><Badge color={colors.primary}>{game.chain}</Badge></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: colors.bg.dark, borderRadius: '8px', marginBottom: '12px' }}><div><p style={{ fontSize: '9px', color: colors.text.muted }}>PLAYERS</p><p style={{ fontSize: '14px' }}>{(game.players/1000).toFixed(1)}K</p></div><div><p style={{ fontSize: '9px', color: colors.text.muted }}>GROWTH</p><p style={{ fontSize: '14px', color: colors.success }}>+{game.growth}%</p></div></div><Button variant="ghost" style={{ width: '100%' }}>▶️ Launch</Button></Card>)}</div>
      <Modal isOpen={!!selectedGame} onClose={() => setSelectedGame(null)} title={selectedGame?.name || ''}>{selectedGame && <div><div style={{ height: '160px', background: `linear-gradient(135deg, ${colors.bg.dark}, ${colors.primary}15)`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', marginBottom: '20px' }}>{selectedGame.icon}</div><div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}><Badge color={colors.primary}>{selectedGame.genre}</Badge><Badge color={colors.secondary}>{selectedGame.chain}</Badge></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>{[{ label: 'Players', value: `${(selectedGame.players/1000).toFixed(1)}K` }, { label: 'Revenue', value: `$${(selectedGame.revenue/1000).toFixed(0)}K`, color: colors.success }, { label: 'Growth', value: `+${selectedGame.growth}%`, color: colors.accent }].map((s, i) => <div key={i} style={{ padding: '12px', background: colors.bg.dark, borderRadius: '8px', textAlign: 'center' }}><p style={{ fontSize: '10px', color: colors.text.muted }}>{s.label}</p><p style={{ fontSize: '18px', color: s.color || colors.text.primary }}>{s.value}</p></div>)}</div><Button variant="primary" style={{ width: '100%' }}>▶️ Play Now</Button></div>}</Modal>
    </div>
  );
};

const MarketplacePage = () => {
  const [filter, setFilter] = useState('all');
  const listings = [...mockAssets.map(a => ({ ...a, type: 'sale' })), { id: 'r1', name: 'Shadow Cloak', game: 'Shadow Arena', rarity: 'Epic', price: 0.05, type: 'rent', image: '🦇' }];
  const getRarityColor = (r) => r === 'Legendary' ? colors.accent : r === 'Epic' ? colors.secondary : colors.primary;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}><div><h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Cross-Game Marketplace</h1><p style={{ color: colors.text.secondary }}>Buy, sell, and rent assets across the ecosystem</p></div><Button variant="primary">📤 List Asset</Button></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}><StatCard label="24h Volume" value="$2.4M" change={28.5} icon="📈" color={colors.primary} /><StatCard label="Active Listings" value="45.2K" change={12.3} icon="🏷️" color={colors.secondary} /><StatCard label="Floor Price" value="0.05 ETH" change={-3.2} icon="📉" color={colors.warning} /><StatCard label="Unique Owners" value="12.8K" change={15.7} icon="👤" color={colors.success} /></div>
      <Card style={{ marginBottom: '20px', padding: '14px' }}><div style={{ display: 'flex', gap: '8px' }}>{['all', 'sale', 'rent', 'auction'].map(f => <button key={f} onClick={() => setFilter(f)} style={{ padding: '10px 16px', background: filter === f ? colors.primary : 'transparent', color: filter === f ? colors.bg.dark : colors.text.secondary, border: filter === f ? 'none' : `1px solid ${colors.primary}25`, borderRadius: '20px', fontWeight: 600, fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize' }}>{f === 'all' ? '🌐 All' : f === 'sale' ? '💰 Sale' : f === 'rent' ? '⏱️ Rent' : '🔨 Auction'}</button>)}</div></Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>{listings.filter(l => filter === 'all' || l.type === filter).map(l => <Card key={l.id} style={{ padding: '14px' }}><div style={{ position: 'absolute', top: '12px', right: '12px' }}><Badge color={l.type === 'rent' ? colors.accent : colors.success}>{l.type === 'rent' ? '⏱️ Rent' : '💰 Sale'}</Badge></div><div style={{ height: '90px', background: `linear-gradient(135deg, ${colors.bg.dark}, ${getRarityColor(l.rarity)}15)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '12px' }}>{l.image}</div><h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>{l.name}</h3><p style={{ fontSize: '11px', color: colors.text.secondary, marginBottom: '10px' }}>{l.game}</p><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: colors.bg.dark, borderRadius: '8px' }}><div><p style={{ fontSize: '9px', color: colors.text.muted }}>PRICE</p><p style={{ fontSize: '14px', color: colors.primary }}>{l.price} ETH</p></div><Button variant="ghost" style={{ padding: '6px 12px', fontSize: '11px' }}>{l.type === 'rent' ? 'Rent' : 'Buy'}</Button></div></Card>)}</div>
    </div>
  );
};

const AIAnalyticsPage = () => (
  <div>
    <div style={{ marginBottom: '28px' }}><h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>AI Revenue Optimization</h1><p style={{ color: colors.text.secondary }}>Machine learning insights to maximize performance</p></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}><StatCard label="Revenue Uplift" value="+$245K" change={23.5} icon="📈" color={colors.success} /><StatCard label="Churn Reduction" value="-18%" change={18} icon="🛡️" color={colors.primary} /><StatCard label="ARPU Increase" value="+32%" change={32} icon="💎" color={colors.accent} /><StatCard label="Predictions Made" value="1.2M" change={45.2} icon="🤖" color={colors.secondary} /></div>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
      <Card><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Predictive Analytics</h3><ResponsiveContainer width="100%" height={280}><AreaChart data={revenueData}><defs><linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={colors.accent} stopOpacity={0.3}/><stop offset="95%" stopColor={colors.accent} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="month" stroke={colors.text.muted} fontSize={11} /><YAxis stroke={colors.text.muted} fontSize={11} /><Tooltip contentStyle={{ background: colors.bg.card, border: `1px solid ${colors.primary}30`, borderRadius: '8px' }} /><Area type="monotone" dataKey="aiUplift" stroke={colors.accent} fill="url(#aiGrad)" name="AI Uplift" /></AreaChart></ResponsiveContainer></Card>
      <Card><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>🤖 AI Recommendations</h3>{aiInsights.map((insight, i) => <div key={i} style={{ padding: '12px', background: colors.bg.dark, borderRadius: '8px', marginBottom: '10px', borderLeft: `3px solid ${insight.type === 'revenue' ? colors.success : insight.type === 'churn' ? colors.warning : colors.primary}` }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><Badge color={insight.type === 'revenue' ? colors.success : insight.type === 'churn' ? colors.warning : colors.primary}>{insight.type}</Badge><span style={{ fontSize: '11px', color: colors.success }}>{insight.impact}</span></div><p style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '8px' }}>{insight.message}</p><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '9px', color: colors.text.muted }}>Confidence:</span><div style={{ flex: 1 }}><ProgressBar value={insight.confidence} color={colors.primary} /></div><span style={{ fontSize: '11px', color: colors.primary }}>{insight.confidence}%</span></div></div>)}</Card>
    </div>
    <Card><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>One-Click Optimizations</h3><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>{[{ title: 'Dynamic Pricing', desc: 'AI-adjusted prices', status: 'active', savings: '+$12K/mo', icon: '💹' }, { title: 'Churn Prevention', desc: 'Auto rewards', status: 'active', savings: '-15% churn', icon: '🛡️' }, { title: 'Token Emission', desc: 'Optimized schedule', status: 'pending', savings: '+15% price', icon: '📈' }, { title: 'Engagement Boost', desc: 'Personalized quests', status: 'active', savings: '+23% DAU', icon: '🎯' }].map((opt, i) => <div key={i} style={{ padding: '18px', background: colors.bg.dark, borderRadius: '12px', position: 'relative' }}><div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: opt.status === 'active' ? colors.success : colors.warning, borderRadius: '12px 12px 0 0' }} /><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}><span style={{ fontSize: '24px' }}>{opt.icon}</span><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.status === 'active' ? colors.success : colors.warning }} /></div><h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{opt.title}</h4><p style={{ fontSize: '11px', color: colors.text.secondary, marginBottom: '12px' }}>{opt.desc}</p><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '12px', color: colors.success }}>{opt.savings}</span><Button variant="ghost" style={{ padding: '4px 10px', fontSize: '10px' }}>{opt.status === 'active' ? '⚙️' : '▶️'}</Button></div></div>)}</div></Card>
  </div>
);

const GovernancePage = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}><div><h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Protocol Governance</h1><p style={{ color: colors.text.secondary }}>Shape the future through decentralized voting</p></div><Button variant="primary">📝 Create Proposal</Button></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}><StatCard label="Voting Power" value="4.2M" change={8.5} icon="⚡" color={colors.primary} /><StatCard label="Active Proposals" value="12" change={20} icon="📋" color={colors.secondary} /><StatCard label="Participation" value="67%" change={5.2} icon="📊" color={colors.accent} /><StatCard label="Passed" value="89" change={12.3} icon="✅" color={colors.success} /></div>
    <Card style={{ marginBottom: '24px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Your Voting Power</h3><div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}><span style={{ fontSize: '32px', color: colors.primary }}>12,450</span><span style={{ color: colors.text.secondary }}>NEXUS</span></div></div><div style={{ display: 'flex', gap: '10px' }}><Button variant="secondary">🔗 Delegate</Button><Button variant="primary">➕ Stake More</Button></div></div></Card>
    <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Active Proposals</h2>
    {proposals.map(p => <Card key={p.id} style={{ marginBottom: '14px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}><div style={{ flex: 1 }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Badge color={p.status === 'active' ? colors.primary : colors.success}>{p.status === 'active' ? '🔵 Active' : '✅ Passed'}</Badge><span style={{ fontSize: '11px', color: colors.text.muted }}>{p.status === 'active' ? `Ends in ${p.endDate}` : p.endDate}</span></div><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{p.title}</h3><div style={{ marginBottom: '6px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '11px', color: colors.text.secondary }}>{(p.votes/1000000).toFixed(2)}M / {(p.quorum/1000000).toFixed(0)}M votes</span><span style={{ fontSize: '11px', color: colors.success }}>{p.support}% support</span></div><div style={{ display: 'flex', gap: '2px' }}><div style={{ height: '6px', borderRadius: '3px 0 0 3px', background: colors.success, width: `${p.support}%` }} /><div style={{ height: '6px', borderRadius: '0 3px 3px 0', background: colors.error, width: `${100-p.support}%` }} /></div></div></div>{p.status === 'active' && <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}><Button variant="ghost" style={{ color: colors.success, borderColor: colors.success, padding: '8px 14px', fontSize: '12px' }}>👍 For</Button><Button variant="ghost" style={{ color: colors.error, borderColor: colors.error, padding: '8px 14px', fontSize: '12px' }}>👎 Against</Button></div>}</div></Card>)}
  </div>
);

const DeployGamePage = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ name: '', chain: 'polygon', model: 'play-to-earn', nft: true, governance: true });
  const chains = [{ id: 'ethereum', name: 'Ethereum', icon: '⟠', fee: 'High' }, { id: 'polygon', name: 'Polygon', icon: '⬡', fee: 'Very Low' }, { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', fee: 'Low' }, { id: 'base', name: 'Base', icon: '🔷', fee: 'Very Low' }, { id: 'solana', name: 'Solana', icon: '◎', fee: 'Very Low' }];
  const models = [{ id: 'play-to-earn', name: 'Play-to-Earn', desc: 'Players earn tokens', icon: '🎮' }, { id: 'free-to-play', name: 'Free-to-Play', desc: 'Free with purchases', icon: '🆓' }, { id: 'hybrid', name: 'Hybrid', desc: 'Combine models', icon: '🔀' }];
  return (
    <div>
      <div style={{ marginBottom: '28px' }}><h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>One-Click Game Deployment</h1><p style={{ color: colors.text.secondary }}>Deploy your Web3 game with pre-audited contracts — free</p></div>
      <Card style={{ marginBottom: '24px', padding: '24px 32px' }}><div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}><div style={{ position: 'absolute', top: '18px', left: '60px', right: '60px', height: '3px', background: `${colors.primary}20` }}><div style={{ width: `${((step-1)/3)*100}%`, height: '100%', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }} /></div>{[{ n: 1, t: 'Game Info', i: '📝' }, { n: 2, t: 'Blockchain', i: '⛓️' }, { n: 3, t: 'Economy', i: '💰' }, { n: 4, t: 'Deploy', i: '🚀' }].map(s => <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: s.n < step ? 'pointer' : 'default', position: 'relative', zIndex: 1 }} onClick={() => s.n < step && setStep(s.n)}><div style={{ width: '40px', height: '40px', borderRadius: '50%', background: s.n <= step ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.bg.dark, border: s.n <= step ? 'none' : `2px solid ${colors.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '8px' }}>{s.n < step ? '✓' : s.i}</div><span style={{ fontSize: '11px', color: s.n <= step ? colors.text.primary : colors.text.muted, fontWeight: 600 }}>{s.t}</span></div>)}</div></Card>
      <Card style={{ minHeight: '380px' }}>
        {step === 1 && <div><h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>📝 Game Details</h3><Input label="Game Name" placeholder="Enter your game name" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} icon="🎮" /><Input label="Description" placeholder="Describe your game" icon="📄" /><Input label="Website URL" placeholder="https://yourgame.com" icon="🌐" /></div>}
        {step === 2 && <div><h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>⛓️ Select Chain</h3><div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>{chains.map(c => <div key={c.id} onClick={() => setConfig({...config, chain: c.id})} style={{ padding: '18px', background: config.chain === c.id ? `${colors.primary}15` : colors.bg.dark, border: `2px solid ${config.chain === c.id ? colors.primary : 'transparent'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'center' }}><div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div><h4 style={{ fontSize: '13px', marginBottom: '6px' }}>{c.name}</h4><Badge color={c.fee === 'Very Low' ? colors.success : colors.warning}>{c.fee}</Badge></div>)}</div></div>}
        {step === 3 && <div><h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>💰 Game Economy</h3><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>{models.map(m => <div key={m.id} onClick={() => setConfig({...config, model: m.id})} style={{ padding: '18px', background: config.model === m.id ? `${colors.primary}15` : colors.bg.dark, border: `2px solid ${config.model === m.id ? colors.primary : 'transparent'}`, borderRadius: '12px', cursor: 'pointer' }}><div style={{ fontSize: '24px', marginBottom: '8px' }}>{m.icon}</div><h4 style={{ fontSize: '13px', marginBottom: '4px' }}>{m.name}</h4><p style={{ fontSize: '11px', color: colors.text.secondary }}>{m.desc}</p></div>)}</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>{[{ k: 'nft', l: 'NFT Marketplace', i: '🖼️' }, { k: 'governance', l: 'DAO Governance', i: '⚖️' }].map(f => <div key={f.k} onClick={() => setConfig({...config, [f.k]: !config[f.k]})} style={{ padding: '14px', background: config[f.k] ? `${colors.secondary}15` : colors.bg.dark, border: `2px solid ${config[f.k] ? colors.secondary : 'transparent'}`, borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '20px' }}>{f.i}</span><span style={{ fontSize: '13px' }}>{f.l}</span><div style={{ marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '4px', background: config[f.k] ? colors.secondary : 'transparent', border: `2px solid ${config[f.k] ? colors.secondary : colors.text.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.bg.dark, fontSize: '10px' }}>{config[f.k] && '✓'}</div></div>)}</div></div>}
        {step === 4 && <div style={{ textAlign: 'center', padding: '20px 0' }}><div style={{ width: '90px', height: '90px', margin: '0 auto 20px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🚀</div><h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>Ready to Deploy!</h3><p style={{ color: colors.text.secondary, marginBottom: '24px' }}>Your Web3 game configuration is complete.</p><div style={{ background: colors.bg.dark, borderRadius: '12px', padding: '18px', textAlign: 'left', maxWidth: '400px', margin: '0 auto 20px' }}>{[{ l: 'Game Name', v: config.name || 'My Game' }, { l: 'Chain', v: chains.find(c => c.id === config.chain)?.name }, { l: 'Model', v: models.find(m => m.id === config.model)?.name }, { l: 'NFT', v: config.nft ? '✅' : '❌', c: config.nft ? colors.success : colors.text.muted }, { l: 'Governance', v: config.governance ? '✅' : '❌', c: config.governance ? colors.success : colors.text.muted }].map((r, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? `1px solid ${colors.primary}10` : 'none' }}><span style={{ color: colors.text.secondary, fontSize: '13px' }}>{r.l}</span><span style={{ fontSize: '13px', color: r.c || colors.text.primary }}>{r.v}</span></div>)}</div><div style={{ background: `${colors.success}10`, border: `1px solid ${colors.success}25`, borderRadius: '10px', padding: '14px', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>{['✅ Pre-audited contracts', '✅ Gas fees covered', '✅ ~2 min deploy', '✅ 100% permissionless'].map((t, i) => <p key={i} style={{ color: colors.success, fontSize: '12px', marginBottom: i < 3 ? '4px' : 0 }}>{t}</p>)}</div></div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: `1px solid ${colors.primary}15` }}><Button variant="secondary" onClick={() => setStep(Math.max(1, step-1))} disabled={step === 1}>← Previous</Button><Button variant="primary" onClick={() => setStep(Math.min(4, step+1))}>{step === 4 ? '🚀 Deploy Now — Free' : 'Continue →'}</Button></div>
      </Card>
    </div>
  );
};

export default function NexusGameFi() {
  const [activePage, setActivePage] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const renderPage = () => { switch (activePage) { case 'dashboard': return <DashboardPage />; case 'assets': return <UniversalAssetsPage />; case 'games': return <GameLauncherPage />; case 'marketplace': return <MarketplacePage />; case 'analytics': return <AIAnalyticsPage />; case 'governance': return <GovernancePage />; case 'deploy': return <DeployGamePage />; default: return <DashboardPage />; } };
  return (
    <div style={{ minHeight: '100vh', background: colors.bg.dark, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`* { margin: 0; padding: 0; box-sizing: border-box; } body { background: ${colors.bg.dark}; color: ${colors.text.primary}; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${colors.bg.dark}; } ::-webkit-scrollbar-thumb { background: ${colors.primary}40; border-radius: 3px; }`}</style>
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at 15% 15%, ${colors.primary}06 0%, transparent 50%), radial-gradient(ellipse at 85% 85%, ${colors.secondary}06 0%, transparent 50%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Navigation activePage={activePage} setActivePage={setActivePage} walletConnected={walletConnected} setWalletConnected={setWalletConnected} />
      <main style={{ marginLeft: '240px', padding: '28px 32px', position: 'relative', zIndex: 2, minHeight: '100vh' }}>
        {renderPage()}
        <div style={{ marginTop: '40px', padding: '20px 0', borderTop: `1px solid ${colors.primary}10`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><p style={{ fontSize: '11px', color: colors.text.muted }}>© 2025 Nexus GameFi Protocol — Fully Decentralized & Permissionless</p><div style={{ display: 'flex', gap: '16px' }}>{['Docs', 'GitHub', 'Discord', 'Twitter'].map(l => <a key={l} href="#" style={{ fontSize: '11px', color: colors.text.secondary, textDecoration: 'none' }}>{l}</a>)}</div></div>
      </main>
    </div>
  );
}
