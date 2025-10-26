import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { PlusCircle, User, LayoutDashboard, ListOrdered, ShoppingBag, BarChart, DollarSign, Globe, TrendingUp, LocateFixed, Zap, Bot, Send, Loader2, QrCode, CheckCircle, MessageSquare, LineChart, Users } from 'lucide-react';

// --- MOCK API & UTILITY DATA ---

// Mock useAuth (Replace with your actual import)
const useAuth = () => ({ user: { username: "Akash Verma" }, logout: () => console.log("Logout triggered") }); 

// Stable AI Guidance Data
const AI_PRICE_GUIDANCE = {
    region: 'South India (Karnataka)',
    millet: 'Ragi',
    currentMSP: 33.70, 
    predictedPrice: 47.50,
    priceTrend: 'Strong Growth',
    summary: 'AI analysis suggests holding inventory until next month to maximize returns, driven by urban demand for processed Ragi products. Target a selling price of ₹48.00/kg by November.',
};

// Multilingual Mock Map
const langMap = {
    en: { overview: 'Overview', listings: 'My Listings', orders: 'Orders', portal: 'Seller Portal', welcome: 'Welcome', support: 'AI Support', community: 'Community Chat', analytics: 'Analytics' },
    hi: { overview: 'अवलोकन', listings: 'मेरी सूची', orders: 'आदेश', portal: 'विक्रेता पोर्टल', welcome: 'आपका स्वागत है', support: 'एआई समर्थन', community: 'समुदाय चैट', analytics: 'विश्लेषण' }
};

// Gemini API Configuration (for live functionality of the support bot)
const API_KEY = "AIzaSyBAR2QZKwR8qrsBq5zIUwxWJ7pI6g96Mk0"; 
const LLM_MODEL = "gemini-2.5-flash"; 

// --------------------------------------------------------------------------------
// --- GEMINI SELLER SUPPORT CHATBOT UTILITY ---
// --------------------------------------------------------------------------------

async function getSellerSupportAdvice(prompt) {
    const systemPrompt = `You are the 'Shree Anna' Seller Support AI. Your role is to provide concise, factual, and helpful advice related to millet sales, FPO schemes, government subsidies, traceability, and platform rules (e.g., FSSAI compliance). Be formal and keep responses under 4 sentences.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_MODEL}:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            temperature: 0.3 
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
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I couldn't process that. Try asking a question about a scheme or platform rule.";

    } catch (error) {
        console.error("Gemini API Call Failed:", error);
        return "I am currently offline due to a network connection issue. For eligibility, please check the 'Profile' section for FSSAI status.";
    }
}


// --------------------------------------------------------------------------------
// --- SUB-COMPONENTS (TABS) ---
// --------------------------------------------------------------------------------

// 1. Overview Component
function Overview({ lang }) {
    const { user } = useAuth();
    const t = langMap[lang];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-3">{t.welcome}, {user?.username || 'FPO Seller'}</h2>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-emerald-500"><p className="text-sm text-gray-500">Active Listings</p><strong className="text-3xl font-bold text-emerald-700">5</strong></div>
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-amber-500"><p className="text-sm text-gray-500">Pending Orders</p><strong className="text-3xl font-bold text-amber-700">2</strong></div>
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-blue-500"><p className="text-sm text-gray-500">Total Earnings (YTD)</p><strong className="text-3xl font-bold text-blue-700">₹1,200</strong></div>
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-purple-500"><p className="text-sm text-gray-500">Traceability Lot IDs</p><strong className="text-3xl font-bold text-purple-700">8</strong></div>
            </div>

            {/* AI Price Guidance Section */}
            <div className="p-6 bg-purple-50 rounded-xl shadow-inner border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 flex items-center">
                    <BarChart size={20} className="mr-2"/> AI Price Guidance: {AI_PRICE_GUIDANCE.millet}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Regional Forecast ({AI_PRICE_GUIDANCE.region})</p>
                        <strong className="text-2xl text-purple-600 font-extrabold">₹{AI_PRICE_GUIDANCE.predictedPrice.toFixed(2)}/kg</strong>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Min. Support Price (MSP)</p>
                        <strong className="text-2xl text-gray-700 font-extrabold">₹{AI_PRICE_GUIDANCE.currentMSP.toFixed(2)}/kg</strong>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Price Trend</p>
                        <strong className="text-2xl text-green-600 font-extrabold flex items-center">{AI_PRICE_GUIDANCE.priceTrend} <TrendingUp size={20} className="ml-1"/></strong>
                    </div>
                </div>
                <p className="mt-4 text-sm text-purple-700 italic border-t border-purple-200 pt-3">
                    {AI_PRICE_GUIDANCE.summary}
                </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-4 pt-4">
                <Link to="listings/new" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-md flex items-center gap-2">
                    <PlusCircle size={20}/> New Listing (Upload Lot ID)
                </Link>
                <Link to="ai-support" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center gap-2">
                    <Bot size={20}/> Ask AI Support
                </Link>
            </div>
        </div>
    );
}

// 2. Listings Component
function Listings() {
    const demoListings = [
        { id: 1, crop: 'Ragi', qty: '200 kg', price: '₹40/kg', lotId: 'LOT-KA-001', status: 'Active', quality: 'A+' },
        { id: 2, crop: 'Jowar', qty: '150 kg', price: '₹45/kg', lotId: 'LOT-MH-005', status: 'Active', quality: 'A' },
        { id: 3, crop: 'Bajra', qty: '500 kg', price: '₹35/kg', lotId: 'LOT-RJ-012', status: 'Sold', quality: 'B' },
    ];
    
    const statusMap = { 'Active': 'bg-green-100 text-green-700', 'Sold': 'bg-gray-200 text-gray-700' };
    const qualityMap = { 'A+': 'bg-emerald-600', 'A': 'bg-amber-500', 'B': 'bg-red-500' };
    const logisticsMap = { 'A+': 'Priority', 'A': 'Standard', 'B': 'Optimization Req.' }; 

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-2xl font-bold">My Listings (Traceability & Quality Score)</h3>
                <Link to="/farmer/listings/new" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-md flex items-center gap-2">
                    <PlusCircle size={18}/> New Listing
                </Link>
            </div>
            
            <div className="space-y-4">
                {demoListings.map(d => (
                    <div key={d.id} className="p-4 bg-white rounded-xl shadow-lg grid grid-cols-4 items-center transition duration-200 hover:border-l-4 hover:border-blue-500">
                        
                        {/* 1. Crop Info */}
                        <div className="col-span-1">
                            <div className="font-extrabold text-xl text-gray-800">{d.crop}</div>
                            <div className="text-sm text-gray-600">{d.qty} • {d.price}</div>
                        </div>
                        
                        {/* 2. Traceability/Quality Info */}
                        <div className="col-span-1 text-center">
                            <div className="text-sm font-medium text-gray-500 flex items-center justify-center">
                                <LocateFixed size={16} className="mr-1"/> Lot ID: {d.lotId}
                            </div>
                            <div className="mt-1">
                                <span className={`text-xs font-bold text-white px-2 py-1 rounded ${qualityMap[d.quality]}`}>Quality: {d.quality}</span>
                            </div>
                        </div>
                        
                        {/* 3. AI Logistics Status */}
                        <div className="col-span-1 text-center">
                            <div className="text-sm font-medium text-gray-500">AI Logistics Status</div>
                            <div className="mt-1 font-semibold text-blue-600">{logisticsMap[d.quality]}</div>
                        </div>

                        {/* 4. Status and Action */}
                        <div className="col-span-1 flex-shrink-0 text-right space-y-1">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusMap[d.status]}`}>{d.status}</span>
                            <div className="text-sm text-blue-600 hover:underline cursor-pointer">Edit/Promote</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. Orders Component
function Orders() {
    const demoOrders = [
        { id: 101, buyer: 'Millet Munch Startup', total: '₹4,500', date: '2025-10-20', status: 'Pending Logistics' },
        { id: 102, buyer: 'Bulk Processor Inc.', total: '₹12,000', date: '2025-10-15', status: 'Payment Received' },
    ];
    
    const statusMap = { 'Pending Logistics': 'bg-amber-100 text-amber-700', 'Payment Received': 'bg-green-100 text-green-700' };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3">Active Orders</h3>
            <div className="space-y-3">
                {demoOrders.map(order => (
                    <div key={order.id} className="p-4 bg-white rounded-xl shadow-lg border-l-4 border-blue-400 flex justify-between items-center">
                        <div className="flex-1">
                            <div className="font-semibold text-gray-800">Order #{order.id} - {order.buyer}</div>
                            <div className="text-sm text-gray-600">Placed on: {order.date}</div>
                        </div>
                        <div className="flex items-center space-x-4 text-right">
                            <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
                                <QrCode size={18}/> Generate QR
                            </button>
                            <div>
                                <strong className="text-lg font-bold text-blue-700">{order.total}</strong>
                                <div className={`text-xs font-semibold mt-1 px-3 py-1 rounded-full ${statusMap[order.status]}`}>{order.status}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500 pt-3">QR code generation is mandatory upon shipment for seamless consumer traceability.</p>
        </div>
    );
}

// 4. AI Support Component (Gemini Chat Feature)
function AISupport({ lang }) {
    const [messages, setMessages] = useState([{ sender: 'AI', text: "Welcome! I am the Shree Anna Support Bot. Ask me about subsidy eligibility, platform rules, or FSSAI compliance." }]);
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
            const aiResponseText = await getSellerSupportAdvice(userQuery); 
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
                <Bot size={24} className="mr-2 text-indigo-600"/> {langMap[lang].support} & Scheme Guidance
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
                                <span>AI is typing...</span>
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
                        placeholder="Ask about subsidies, FSSAI, or platform rules..."
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

// 5. Community Component (New Mock Chat Feature)
function Community() {
    const mockMessages = [
        { id: 1, user: 'Akash Verma', time: '10 min ago', text: 'Has anyone faced issues with the new Lot ID verification in Maharashtra? Getting a "Pending" status.' },
        { id: 2, user: 'SHG Mahila Shakti', time: '5 min ago', text: 'We just got A+ quality score on our new Bajra batch! Excited to see the price premium. Thank you, Shree Anna platform!' },
        { id: 3, user: 'Logistics Co. Official', time: '2 min ago', text: 'To Akash: Please clear your Lot ID metadata fields. Pending status usually means a data mismatch. Check profile settings.' },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3 flex items-center">
                <Users size={24} className="mr-2 text-emerald-600"/> FPO & Seller Community Forum
            </h3>
            <p className="text-gray-600 text-sm">Connect with other FPOs, SHGs, and official partners for peer support and regional market insights.</p>

            <div className="space-y-4 h-[550px] overflow-y-auto p-4 bg-gray-50 rounded-xl shadow-inner">
                {mockMessages.map(msg => (
                    <div key={msg.id} className="p-4 bg-white rounded-lg shadow border-l-4 border-emerald-400">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800">{msg.user}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.text}</p>
                    </div>
                ))}
                
                {/* Mock Input for interaction */}
                <div className="p-3 bg-white border rounded-lg flex space-x-2 sticky bottom-0 z-10">
                    <input type="text" placeholder="Post a question or share a market update..." className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"/>
                    <button className="bg-emerald-600 text-white px-3 rounded-lg flex items-center"><Send size={16}/></button>
                </div>
            </div>
        </div>
    );
}

// 6. Analytics Component (Mock Analytics Placeholder)
function Analytics() {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3 flex items-center">
                <LineChart size={24} className="mr-2 text-blue-600"/> Sales and Performance Analytics
            </h3>
            <p className="text-gray-600">This section provides in-depth data visualization tools to track your FPO's performance, revenue growth, and market demand correlation.</p>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-400 h-64 flex items-center justify-center">
                    <p className="font-semibold text-blue-500">Sales Volume Chart (Placeholder)</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-400 h-64 flex items-center justify-center">
                    <p className="font-semibold text-blue-500">Top Performing Millet Chart (Placeholder)</p>
                </div>
            </div>
        </div>
    );
}


// 7. Profile Component (Fixed with Dummy Data)
function Profile() { 
    const { user } = useAuth();
    // Dummy Data for Akash Verma
    const profileData = {
        name: user?.username || "Akash Verma",
        role: "Individual Farmer / SHG Member",
        memberSince: "2024-03-15",
        fssaiStatus: "Verified",
        organicStatus: "Applied (Pending)",
        location: "Krishnapura, Karnataka",
        totalSales: "₹25,000",
        avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=AV&backgroundColor=a855f7&scale=80" // Random Avatar
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg space-y-6">
            <h3 className="text-2xl font-bold border-b pb-3">My Profile & Certification</h3>
            
            {/* User Info Block */}
            <div className="flex items-center gap-6 p-4 border rounded-xl bg-gray-50 shadow-inner">
                <img src={profileData.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-indigo-600"/>
                <div>
                    <div className="text-2xl font-extrabold text-gray-800">{profileData.name}</div>
                    <div className="text-sm text-gray-600">{profileData.role}</div>
                </div>
            </div>
            
            {/* Certification & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Certification */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg text-indigo-700">Official Status</h4>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">FSSAI Status:</span>
                        <span className="font-semibold text-green-600 flex items-center">{profileData.fssaiStatus} <CheckCircle size={16} className="ml-1"/></span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">Organic Certification:</span>
                        <span className="font-semibold text-amber-600">{profileData.organicStatus}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600">Platform ID:</span>
                        <span className="font-semibold text-gray-800">USR-73456</span>
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg text-indigo-700">Performance Metrics</h4>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">Member Since:</span>
                        <span className="font-semibold text-gray-800">{profileData.memberSince}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="font-medium text-gray-600">Total Sales Volume:</span>
                        <span className="font-semibold text-gray-800">{profileData.totalSales}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600">Location:</span>
                        <span className="font-semibold text-gray-800">{profileData.location}</span>
                    </div>
                </div>
            </div>
            
            <button className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200">
                Update Information
            </button>
        </div>
    ); 
}


// --------------------------------------------------------------------------------
// --- MAIN DASHBOARD COMPONENT ---
// --------------------------------------------------------------------------------

export default function FarmerDashboard() {
    const location = useLocation();
    const { logout } = useAuth();
    const [lang, setLang] = useState('en');

    // Helper function to determine active link class
    const getLinkClass = (path) => 
        location.pathname === path || (path === '/farmer' && location.pathname === '/farmer/')
            ? 'px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg'
            : 'px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg';

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            
            <div className="max-w-7xl mx-auto">
                
                {/* Top Header Bar */}
                <div className="flex items-center justify-between p-4 mb-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-600">
                    <h1 className="text-2xl font-extrabold text-indigo-700 flex items-center">
                        <ShoppingBag size={24} className="mr-2"/> Shree Anna Seller Dashboard
                    </h1>
                    
                    {/* Multilingual Selector */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Globe size={20} className="text-gray-600"/>
                            <select 
                                onChange={(e) => setLang(e.target.value)} 
                                value={lang}
                                className="text-sm border rounded p-1 bg-white focus:ring-indigo-500"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिन्दी (Hindi)</option>
                            </select>
                        </div>
                        <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-indigo-600 underline">Logout</button>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="md:flex md:gap-6">
                    
                    {/* Sidebar Navigation */}
                    <aside className="md:w-64 mb-6 md:mb-0">
                        <div className="p-4 bg-white rounded-xl shadow-lg sticky top-4">
                            <h3 className="text-lg font-bold mb-3 border-b pb-2 text-indigo-700">{langMap[lang].portal}</h3>
                            <nav className="flex flex-col gap-1">
                                <Link to="/farmer" className={getLinkClass('/farmer')}>
                                    <LayoutDashboard size={18} className="inline mr-2"/> {langMap[lang].overview}
                                </Link>
                                <Link to="/farmer/listings" className={getLinkClass('/farmer/listings')}>
                                    <ListOrdered size={18} className="inline mr-2"/> {langMap[lang].listings}
                                </Link>
                                <Link to="/farmer/orders" className={getLinkClass('/farmer/orders')}>
                                    <ShoppingBag size={18} className="inline mr-2"/> {langMap[lang].orders}
                                </Link>
                                <Link to="/farmer/analytics" className={getLinkClass('/farmer/analytics')}>
                                    <LineChart size={18} className="inline mr-2"/> {langMap[lang].analytics}
                                </Link>
                                <Link to="/farmer/ai-support" className={getLinkClass('/farmer/ai-support')}>
                                    <Zap size={18} className="inline mr-2 text-purple-600"/> {langMap[lang].support}
                                </Link>
                                <Link to="/farmer/community" className={getLinkClass('/farmer/community')}>
                                    <MessageSquare size={18} className="inline mr-2 text-emerald-600"/> {langMap[lang].community}
                                </Link>
                                <Link to="/farmer/profile" className={getLinkClass('/farmer/profile')}>
                                    <User size={18} className="inline mr-2"/> Profile
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Section */}
                    <section className="flex-1 bg-white p-6 rounded-xl shadow-lg">
                        <Routes>
                            <Route path="/" element={<Overview lang={lang} />} />
                            <Route path="listings" element={<Listings />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="ai-support" element={<AISupport lang={lang} />} /> 
                            <Route path="community" element={<Community />} /> {/* NEW ROUTE */}
                            <Route path="analytics" element={<Analytics />} /> {/* NEW ROUTE */}
                            {/* Mock New Listing page */}
                            <Route path="listings/new" element={<div className="p-4 space-y-4">
                                <h2 className="text-2xl font-bold">New Listing (Lot ID Upload)</h2>
                                <p className="text-gray-600">Upload your product details and attach the Lot ID (from harvest) for automatic traceability mapping and AI Quality Pre-Check.</p>
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Upload Lot ID / Product Data</button>
                                </div>} 
                            />
                        </Routes>
                    </section>
                </div>
            </div>
        </div>
    );
}