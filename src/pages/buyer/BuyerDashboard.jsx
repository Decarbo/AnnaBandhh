import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, LayoutDashboard, Factory, ListOrdered, User, Zap, Bot, Send, Loader2, LocateFixed, Globe, CheckCircle, Package, MessageSquare, Briefcase, TrendingUp } from 'lucide-react';

// --- MOCK API & UTILITY DATA ---

// Mock useAuth (Replace with your actual import)
// Updated default user for this file to Niraj Prajapati
const useAuth = () => ({ user: { username: "Niraj Prajapati" }, logout: () => console.log("Logout triggered") }); 

// Mock Data for Traceability Lookup
const TRACE_MOCK = {
    'LOT-KA-001': { crop: 'Ragi', seller: 'FPO Sahyadri', harvestDate: '2025-09-01', location: 'Krishnapura, KA', qualityScore: 'A+', defects: 'None', fssai: true },
    'LOT-MH-005': { crop: 'Jowar', seller: 'SHG Nari Shakti', harvestDate: '2025-08-20', location: 'Pune, MH', qualityScore: 'A', defects: 'Minor moisture', fssai: true },
};

// Multilingual Mock Map
const langMap = {
    en: { overview: 'Dashboard', market: 'Marketplace', orders: 'My Orders', portal: 'Buyer Portal', welcome: 'Welcome', profile: 'Profile', traceability: 'Traceability Lookup', aidemo: 'AI Innovation Hub' },
    hi: { overview: 'डैशबोर्ड', market: 'मार्केटप्लेस', orders: 'मेरे आदेश', portal: 'खरीदार पोर्टल', welcome: 'आपका स्वागत है', profile: 'प्रोफ़ाइल', traceability: 'ट्रेसिबिलिटी लुकअप', aidemo: 'एआई इनोवेशन हब' }
};

// Gemini API Configuration 
const API_KEY = "AIzaSyA_sNcFFKKl9CncGmKtEpYFEmQ6lfT04m4"; 
const LLM_MODEL = "gemini-2.5-flash"; 

// --------------------------------------------------------------------------------
// --- GEMINI INNOVATION CHATBOT UTILITY ---
// --------------------------------------------------------------------------------

async function getInnovationAdvice(prompt) {
    const systemPrompt = `You are the 'Shree Anna' Product Innovation AI. Your role is to help buyers (processors/startups) develop new value-added millet products. Suggest creative and feasible recipes, product mixes, or market positioning strategies. Be innovative and focus on high-protein, gluten-free, or snack categories. Keep responses under 4 sentences.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_MODEL}:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            temperature: 0.8 
        },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorBody.error?.message || response.statusText}`);
        }

        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "Innovation idea processing failed. Try a different query.";

    } catch (error) {
        console.error("Gemini API Call Failed:", error);
        return "Innovation AI is temporarily offline due to a network error. Try brainstorming a high-fiber snack idea manually!";
    }
}

// --------------------------------------------------------------------------------
// --- SUB-COMPONENTS (TABS) ---
// --------------------------------------------------------------------------------

// 1. Buyer Overview Component (Focus on Quick Actions)
function BuyerOverview({ lang }) {
    const { user } = useAuth();
    const t = langMap[lang];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-3">{t.welcome}, {user?.username || 'Buyer'}</h2>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-blue-500"><p className="text-sm text-gray-500">Active Bulk Orders</p><strong className="text-3xl font-bold text-blue-700">3</strong></div>
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-amber-500"><p className="text-sm text-gray-500">Listings Tracked</p><strong className="text-3xl font-bold text-amber-700">12</strong></div>
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-purple-500"><p className="text-sm text-gray-500">Certifications Verified</p><strong className="text-3xl font-bold text-purple-700">A+ Lots</strong></div>
            </div>

            {/* Search/Filter Bar */}
            <div className="p-4 bg-gray-100 rounded-xl flex items-center gap-3 shadow-inner border">
                <Search className="text-gray-500"/>
                <input className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-emerald-500" placeholder="Search Ragi, FPOs, Lot ID, or Organic certified sellers..." />
                <Link to="/buyer/market" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700">Go</Link>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4 pt-4">
                <Link to="market" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-md flex items-center gap-2">
                    <Package size={20}/> Browse Bulk Supply
                </Link>
                <Link to="ai-hub" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center gap-2">
                    <Zap size={20}/> Launch AI Innovation Hub
                </Link>
            </div>
        </div>
    );
}

// 2. Marketplace Component (Enhanced Listings)
function Market() {
    const demo = [
        {id:1, crop:'Ragi', seller:'FPO Sahyadri', qty:'200 MT', price:'₹40/kg', lotId: 'LOT-KA-001', quality: 'A+'},
        {id:2, crop:'Jowar', seller:'SHG Nari Shakti', qty:'150 MT', price:'₹45/kg', lotId: 'LOT-MH-005', quality: 'A'},
        {id:3, crop:'Barnyard Millet', seller:'Organic Farm Co.', qty:'50 MT', price:'₹62/kg', lotId: 'LOT-GJ-010', quality: 'A+'},
    ];
    
    const qualityMap = { 'A+': 'bg-emerald-600', 'A': 'bg-amber-500' };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3">Verified Bulk Market Listings</h3>
            
            <div className="space-y-4">
                {demo.map(d=> (
                    <div key={d.id} className="p-4 bg-white rounded-xl shadow-lg border-l-4 border-emerald-400 flex justify-between items-center transition duration-200 hover:shadow-xl">
                        
                        {/* Left Side: Product Details */}
                        <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-xl text-gray-800">{d.crop} — <span className="text-sm font-normal text-gray-600">by {d.seller} (Verified FPO)</span></div>
                            <div className="text-sm text-gray-600 mt-1">{d.qty} available • <strong className='text-lg text-emerald-700'>{d.price}</strong></div>
                        </div>
                        
                        {/* Middle: Traceability & Quality Score */}
                        <div className="hidden md:block text-center mx-4">
                            <span className={`text-xs font-bold text-white px-2 py-1 rounded ${qualityMap[d.quality]}`}>Quality: {d.quality}</span>
                            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                                <LocateFixed size={14} className="mr-1"/> Lot ID: {d.lotId}
                            </div>
                        </div>

                        {/* Right Side: Action */}
                        <div className="flex-shrink-0 text-right space-y-1">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 flex items-center gap-1">
                                <ShoppingCart size={18}/> Request Order
                            </button>
                            <Link to={`/buyer/traceability?lot=${d.lotId}`} className="text-sm text-blue-600 hover:underline block">View Full Trace</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. AI Innovation Hub (Gemini Chat)
function AIHub({ lang }) {
    const [messages, setMessages] = useState([{ sender: 'AI', text: "Welcome to the Product Innovation Hub! I can help you brainstorm new millet-based product ideas. Try asking: 'Suggest a high-protein snack recipe using Jowar and Bajra.'" }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const userQuery = input.trim();
        if (userQuery === '') return;
        
        const userMessage = { sender: 'You', text: userQuery };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const aiResponseText = await getInnovationAdvice(userQuery); 
            setMessages((prev) => [...prev, { sender: 'AI', text: aiResponseText }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: 'AI', text: 'An unexpected error occurred. Please check network/console.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3 flex items-center">
                <Zap size={24} className="mr-2 text-indigo-600"/> {langMap[lang].aidemo} (Product Innovation)
            </h3>
            <div className="bg-white rounded-lg shadow-2xl flex flex-col h-[550px] border border-indigo-300">
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${
                                msg.sender === 'You' 
                                ? 'bg-blue-100 text-blue-900 rounded-br-none' 
                                : 'bg-indigo-100 text-indigo-900 rounded-tl-none'
                            }`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-700 p-3 rounded-lg text-sm flex items-center">
                                <Loader2 size={16} className="mr-2 animate-spin text-indigo-600" />
                                <span>AI is generating ideas...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for new product ideas or nutritional data..."
                        className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-r-lg flex items-center transition disabled:opacity-50"
                        disabled={loading}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// 4. Traceability Lookup
function TraceabilityLookup() {
    const [lotId, setLotId] = useState('');
    const [traceData, setTraceData] = useState(null);

    const handleLookup = () => {
        const data = TRACE_MOCK[lotId.toUpperCase()];
        if (data) {
            setTraceData(data);
        } else {
            setTraceData({ error: 'Lot ID not found or invalid.' });
        }
    };
    
    // Auto-populate mock data for quick demo
    useState(() => setLotId('LOT-KA-001'), []);

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3 flex items-center">
                <LocateFixed size={24} className="mr-2 text-blue-600"/> Farm-to-Fork Traceability Lookup
            </h3>
            <p className="text-gray-600 text-sm">Verify the origin and quality of any purchased lot using its unique blockchain Lot ID.</p>

            <div className="p-4 bg-gray-100 rounded-xl flex items-center space-x-3 shadow-inner">
                <input 
                    type="text" 
                    value={lotId} 
                    onChange={(e) => setLotId(e.target.value)}
                    placeholder="Enter Lot ID (e.g., LOT-KA-001)" 
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500" 
                />
                <button onClick={handleLookup} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Verify Lot
                </button>
            </div>
            
            {traceData && (
                <div className={`p-6 rounded-xl shadow-lg ${traceData.error ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'} border-l-4`}>
                    {traceData.error ? (
                        <p className="font-medium text-red-700">{traceData.error}</p>
                    ) : (
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-gray-800">{traceData.crop} Details (Lot ID: {lotId.toUpperCase()})</h4>
                            <p className="text-sm font-medium">Source: <span className='font-semibold'>{traceData.seller}</span></p>
                            <p className="text-sm font-medium">Harvest Location: <span className='font-semibold'>{traceData.location}</span></p>
                            <p className="text-sm font-medium">Quality Score: <span className='font-semibold'>{traceData.qualityScore}</span></p>
                            <p className="text-sm font-medium flex items-center">FSSAI Compliant: <CheckCircle size={16} className='text-green-600 ml-2'/> Yes</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// 5. Orders and Profile (Basic components remain for routing)
function Orders() {
    const demoOrders = [
        { id: 201, product: 'Ragi (Bulk)', supplier: 'FPO Sahyadri', amount: '₹12,000', status: 'In Transit', date: '2025-10-25' },
        { id: 202, product: 'Jowar Flakes', supplier: 'Millet Munch', amount: '₹4,500', status: 'Delivered', date: '2025-10-10' },
    ];
    const statusMap = { 'In Transit': 'bg-blue-100 text-blue-700', 'Delivered': 'bg-green-100 text-green-700' };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3">My Bulk Orders</h3>
            <div className='space-y-4'>
                {demoOrders.map(order => (
                    <div key={order.id} className="p-4 bg-white rounded-xl shadow-lg border-l-4 border-blue-600 flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-gray-800">{order.product} from {order.supplier}</div>
                            <div className="text-sm text-gray-600">Ordered: {order.date}</div>
                        </div>
                        <div className="text-right">
                            <strong className="text-lg font-bold text-blue-700">{order.amount}</strong>
                            <div className={`text-xs font-semibold mt-1 px-3 py-1 rounded-full ${statusMap[order.status]}`}>{order.status}</div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500 pt-3">Orders feature automatic updates via integrated logistics partners.</p>
        </div>
    ); 
}

// 6. Profile Component (Updated for Niraj Prajapati)
function Profile() { 
    const { user } = useAuth();
    // Dummy Data for Niraj Prajapati
    const profileData = {
        name: user?.username || "Niraj Prajapati",
        role: "Millet Processor / Startup Owner",
        company: "Innovate Millets Co.",
        memberSince: "2024-05-01",
        fssaiStatus: "Registered",
        procurementVolume: "45 MT (Quarterly)",
        location: "Pune, Maharashtra",
        avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=NP&backgroundColor=059669&scale=80" // Random Avatar
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3">Buyer Profile & Sourcing Details</h3>
            
            {/* User Info Block */}
            <div className="flex items-center gap-6 p-4 border rounded-xl bg-gray-50 shadow-inner">
                <img src={profileData.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-emerald-600"/>
                <div>
                    <div className="text-2xl font-extrabold text-gray-800">{profileData.name}</div>
                    <div className="text-sm text-gray-600 flex items-center"><Briefcase size={14} className='mr-1'/> {profileData.company} ({profileData.role})</div>
                </div>
            </div>
            
            {/* Sourcing Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Official Status */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg text-emerald-700">Official Status</h4>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">FSSAI Status:</span>
                        <span className="font-semibold text-green-600 flex items-center">{profileData.fssaiStatus} <CheckCircle size={16} className="ml-1"/></span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">Procurement Location:</span>
                        <span className="font-semibold text-gray-800">{profileData.location}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600">Platform ID:</span>
                        <span className="font-semibold text-gray-800">BUY-45123</span>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg text-emerald-700">Sourcing Metrics</h4>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">Member Since:</span>
                        <span className="font-semibold text-gray-800">{profileData.memberSince}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">Quarterly Volume:</span>
                        <span className="font-semibold text-gray-800">{profileData.procurementVolume}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600">Highest Quality Lot:</span>
                        <span className="font-semibold text-gray-800">Ragi (A+)</span>
                    </div>
                </div>
            </div>
            
            <button className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-200">
                Update Sourcing Preferences
            </button>
        </div>
    ); 
}


// --------------------------------------------------------------------------------
// --- MAIN DASHBOARD COMPONENT ---
// --------------------------------------------------------------------------------

export default function BuyerDashboard() {
    const location = useLocation();
    const { logout } = useAuth();
    const [lang, setLang] = useState('en');
    const t = langMap[lang];

    // Helper function to determine active link class
    const getLinkClass = (path) => 
        location.pathname === path || (path === '/buyer' && location.pathname === '/buyer/')
            ? 'px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg'
            : 'px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg';

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            
            <div className="max-w-7xl mx-auto">
                
                {/* Top Header Bar */}
                <div className="flex items-center justify-between p-4 mb-6 bg-white rounded-xl shadow-lg border-t-4 border-emerald-600">
                    <h1 className="text-2xl font-extrabold text-emerald-700 flex items-center">
                        <Factory size={24} className="mr-2"/> Shree Anna Buyer Portal
                    </h1>
                    
                    {/* Multilingual Selector */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Globe size={20} className="text-gray-600"/>
                            <select 
                                onChange={(e) => setLang(e.target.value)} 
                                value={lang}
                                className="text-sm border rounded p-1 bg-white focus:ring-emerald-500"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिन्दी (Hindi)</option>
                            </select>
                        </div>
                        <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-emerald-600 underline">Logout</button>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="md:flex md:gap-6">
                    
                    {/* Sidebar Navigation */}
                    <aside className="md:w-64 mb-6 md:mb-0">
                        <div className="p-4 bg-white rounded-xl shadow-lg sticky top-4">
                            <h3 className="text-lg font-bold mb-3 border-b pb-2 text-emerald-700">{t.portal}</h3>
                            <nav className="flex flex-col gap-1">
                                <Link to="/buyer" className={getLinkClass('/buyer')}>
                                    <LayoutDashboard size={18} className="inline mr-2"/> {t.overview}
                                </Link>
                                <Link to="/buyer/market" className={getLinkClass('/buyer/market')}>
                                    <Package size={18} className="inline mr-2"/> {t.market}
                                </Link>
                                <Link to="/buyer/orders" className={getLinkClass('/buyer/orders')}>
                                    <ShoppingCart size={18} className="inline mr-2"/> {t.orders}
                                </Link>
                                <Link to="/buyer/traceability" className={getLinkClass('/buyer/traceability')}>
                                    <LocateFixed size={18} className="inline mr-2 text-blue-600"/> {t.traceability}
                                </Link>
                                <Link to="/buyer/ai-hub" className={getLinkClass('/buyer/ai-hub')}>
                                    <Zap size={18} className="inline mr-2 text-indigo-600"/> {t.aidemo}
                                </Link>
                                <Link to="/buyer/profile" className={getLinkClass('/buyer/profile')}>
                                    <User size={18} className="inline mr-2"/> {t.profile}
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Section */}
                    <section className="flex-1 bg-white p-6 rounded-xl shadow-lg">
                        <Routes>
                            <Route path="/" element={<BuyerOverview lang={lang} />} />
                            <Route path="market" element={<Market />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="ai-hub" element={<AIHub lang={lang} />} />
                            <Route path="traceability" element={<TraceabilityLookup />} />
                        </Routes>
                    </section>
                </div>
            </div>
        </div>
    );
}