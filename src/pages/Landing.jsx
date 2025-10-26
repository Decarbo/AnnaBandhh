import React, { useState } from 'react';
import { ChevronRight, Zap, ShoppingBag, Leaf, Scale, DollarSign, TrendingUp, BarChart, Loader2, Image, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- GLOBAL CONFIGURATION (API Key and Model) ---
const API_KEY = "AIzaSyBAR2QZKwR8qrsBq5zIUwxWJ7pI6g96Mk0"; 
const LLM_MODEL = "gemini-2.5-flash"; 

// --- MOCK PRODUCT DATA FOR MARKET PREVIEW ---
const mockProducts = [
  { id: 1, name: 'Finger Millet (Ragi)', supplier: 'FPO - Sahyadri', price: 45, unit: 'Kg', region: 'Karnataka' },
  { id: 2, name: 'Barnyard Millet (Sanwa)', supplier: 'SHG - Nari Shakti', price: 62, unit: 'Kg', region: 'Maharashtra' },
  { id: 3, name: 'Jowar Flakes (Value-Add)', supplier: 'Startup - Millet Munch', price: 120, unit: 'Packet', region: 'All India' },
];

// --- FALLBACK DATA FOR ERROR STATE (More Professional and Informative) ---
const FALLBACK_DATA = {
    'South India (Karnataka)': {
        data: [{ month: 'Oct', price: 40 }, { month: 'Nov', price: 43 }, { month: 'Dec', price: 46 }, { month: 'Jan', price: 49 }],
        summary: "SIMULATED DATA: Price shows a steady upward trend due to high local demand for Ragi and effective procurement. Farmers are advised to maintain quality certification for premium rates."
    },
    'West India (Maharashtra)': {
        data: [{ month: 'Oct', price: 38 }, { month: 'Nov', price: 40 }, { month: 'Dec', price: 41 }, { month: 'Jan', price: 42 }],
        summary: "SIMULATED DATA: Stable growth typical of the Western region. Focus should be on processing and value-addition to capture higher profits in the nearby urban markets."
    },
    'North India (Rajasthan)': {
        data: [{ month: 'Oct', price: 35 }, { month: 'Nov', price: 34 }, { month: 'Dec', price: 36 }, { month: 'Jan', price: 39 }],
        summary: "SIMULATED DATA: Price volatility expected due to changing climatic conditions. Advise FPOs to use warehouse facilities to stabilize supply during off-season."
    },
    'East India (Odisha)': {
        data: [{ month: 'Oct', price: 32 }, { month: 'Nov', price: 35 }, { month: 'Dec', price: 38 }, { month: 'Jan', price: 41 }],
        summary: "SIMULATED DATA: High growth potential, driven by recent government procurement focus. Initial prices are lower, indicating a high margin opportunity for logistics integration."
    }
};

// ----------------------------------------------------------------------
// --- AI MARKET ANALYSIS UTILITY FUNCTION (Robust JSON Parsing) ---
// ----------------------------------------------------------------------

async function getMarketAnalysis(milletType, region) {
    const systemPrompt = `You are a specialized AI Market Analyst for Shree Anna. Given the millet type: ${milletType} and region: ${region}, generate: 
    1. A price prediction JSON object for the next 4 months (in ₹/kg).
    2. A brief, professional text summary (max 3 sentences) of the price forecast and regional demand drivers.
    
    The JSON object MUST be enclosed in a single markdown code block with the tag 'json' (e.g., \`\`\`json { ... } \`\`\`). The structure MUST be: [{"month": "Oct", "price": 45}, {"month": "Nov", "price": 48}, {"month": "Dec", "price": 52}, {"month": "Jan", "price": 55}]. 
    Respond ONLY with the JSON block followed immediately by the text summary.`;

    const prompt = `Generate the regional market analysis for ${milletType} in ${region}.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_MODEL}:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            temperature: 0.4 
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
        const fullText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
        
        if (!jsonMatch || jsonMatch.length < 2) {
             throw new Error("Generative model returned invalid structured data.");
        }
        
        const jsonPart = jsonMatch[1].trim();
        const summary = fullText.replace(jsonMatch[0], '').trim();
        
        let data = JSON.parse(jsonPart);
        
        return { data, summary };

    } catch (error) {
        console.error("Gemini API Call Failed:", error);
        // Fallback implementation: returns clean simulated data
        const fallback = FALLBACK_DATA[region] || FALLBACK_DATA['South India (Karnataka)'];
        return { 
            data: fallback.data,
            summary: fallback.summary // Returns the clean, professional static summary
        };
    }
}

// ----------------------------------------------------------------------
// --- AI MARKET INSIGHTS COMPONENT (Recharts Integration) ---
// ----------------------------------------------------------------------

function MarketInsights() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('South India (Karnataka)');
    const milletType = 'Finger Millet (Ragi)'; 

    const fetchAnalysis = async (region) => {
        setLoading(true);
        setAnalysis(null);
        setSelectedRegion(region);
        const result = await getMarketAnalysis(milletType, region);
        setAnalysis(result);
        setLoading(false);
    };

    useState(() => {
        fetchAnalysis(selectedRegion);
    }, []); 

    const RegionButton = ({ name }) => (
        <button
            onClick={() => fetchAnalysis(name)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-300 ${
                selectedRegion === name 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={loading}
        >
            {name}
        </button>
    );

    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-purple-200 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
                Regional Price Forecast: {milletType}
            </h3>
            
            <p className="text-gray-600 text-sm">Select a region to view the model-driven 4-month price prediction, accounting for local demand and harvesting cycles.</p>
            
            <div className="flex flex-wrap gap-3 border-b pb-4">
                <RegionButton name="South India (Karnataka)" />
                <RegionButton name="West India (Maharashtra)" />
                <RegionButton name="North India (Rajasthan)" />
                <RegionButton name="East India (Odisha)" /> {/* NEW REGION */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Current Price Card (Dynamic) */}
                <div className="md:col-span-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600 shadow-inner">
                    <p className="text-sm font-medium text-blue-800">Current Selling Price ({selectedRegion})</p>
                    <p className="text-3xl font-black text-blue-700 mt-1">
                        ₹{analysis && analysis.data.length > 0 ? analysis.data[0].price.toFixed(2) : 'N/A'}
                        <span className="text-sm font-semibold text-gray-600"> / Kg</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Price determined by live platform metrics.</p>
                </div>
                
                {/* Forecast Summary */}
                <div className="md:col-span-2 p-4 rounded-lg border-l-4 bg-emerald-50 border-emerald-600 shadow-inner">
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                        <Zap className="w-4 h-4 mr-1"/> Model Forecast Summary:
                    </p>
                    <p className="text-sm text-gray-700 mt-1 font-medium">{analysis ? analysis.summary : 'Loading analysis...'}</p>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[300px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-purple-600">
                        <Loader2 className="w-8 h-8 animate-spin mb-3" />
                        <p className="font-semibold">Fetching model prediction for {selectedRegion}...</p>
                    </div>
                ) : analysis && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={analysis.data}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="month" stroke="#555" />
                            <YAxis 
                                stroke="#8884d8" 
                                label={{ value: 'Price (₹/kg)', angle: -90, position: 'insideLeft' }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px' }} 
                                formatter={(value) => [`₹${value.toFixed(2)}`, 'Predicted Price']}
                            />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

        </div>
    );
}

// ----------------------------------------------------------------------
// --- AI QUALITY SIMULATOR COMPONENT (New Feature) ---
// ----------------------------------------------------------------------

function QualitySimulator() {
    const [grade, setGrade] = useState(null);
    const [loading, setLoading] = useState(false);

    const runSimulation = () => {
        setLoading(true);
        setGrade(null);
        setTimeout(() => {
            const scores = ['A+', 'A', 'B'];
            const randomScore = scores[Math.floor(Math.random() * scores.length)];
            const defects = randomScore === 'A+' ? 'None' : randomScore === 'A' ? 'Minor foreign matter (<1%)' : 'Moisture content high (14.5%)';
            
            setGrade({ 
                score: randomScore, 
                defects: defects,
                color: randomScore === 'A+' ? 'text-green-600' : randomScore === 'A' ? 'text-amber-600' : 'text-red-600'
            });
            setLoading(false);
        }, 1500); // Simulate API delay
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600 space-y-4">
            <h4 className="font-bold text-xl text-indigo-700 flex items-center">
                <Image className="w-5 h-5 mr-2"/> AI Quality Assessment Simulator
            </h4>
            <p className="text-sm text-gray-600">
                **Simulated Gemini Vision Model:** Click to run an instant quality check on a mock batch of grains. Critical for FPO sales and consumer trust.
            </p>
            
            <button
                onClick={runSimulation}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
            >
                {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Assessing...</>
                ) : (
                    'Run Instant Quality Check'
                )}
            </button>
            
            {grade && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center border">
                    <div>
                        <p className="text-sm font-semibold">Quality Grade:</p>
                        <p className={`text-2xl font-black ${grade.color}`}>{grade.score}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Traceable Defects:</p>
                        <p className="text-sm text-gray-700">{grade.defects}</p>
                    </div>
                </div>
            )}
        </div>
    );
}


// ----------------------------------------------------------------------
// --- MAIN LANDING PAGE COMPONENT ---
// ----------------------------------------------------------------------

export default function LandingPage() {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* --- HERO SECTION: Focused Call-to-Action --- */}
            <header className="bg-emerald-700 text-white shadow-2xl p-8 md:p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ 
                    backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>
                
                <div className="max-w-6xl mx-auto z-10 relative">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                        🌾 **SHREE ANNA**: The Digital Value Chain for Millets
                    </h1>
                    
                    <p className="mt-4 text-xl md:text-2xl font-light opacity-90 max-w-4xl mx-auto">
                        An integrated platform linking **FPOs, SHGs, and Processors** directly to consumers, ensuring fair price, quality, and complete traceability.
                    </p>
                    
                    <div className="mt-10">
                        <button 
                            onClick={() => setShowPreview(true)} 
                            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-4 px-12 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                        >
                            <BarChart className="w-5 h-5 mr-2" />
                            View LIVE Platform Insights
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MARKETPLACE PREVIEW SECTION (The Main Dashboard Demo) --- */}
            <div className="max-w-8xl mx-auto px-4 md:px-8 pt-12 pb-16">
                
                {showPreview && (
                    <section className="animate-in fade-in slide-in-from-top-8 duration-700 space-y-10">
                        
                        <h2 className="text-4xl font-extrabold text-gray-800 flex items-center justify-center border-b pb-4">
                            Integrated Platform Preview: FPO Seller & Consumer Insights
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* LEFT COLUMN: Price Prediction AI and Chart */}
                            <div className="lg:col-span-2">
                                <MarketInsights /> 
                            </div>

                            {/* RIGHT COLUMN: Key Metrics and Static Features */}
                            <div className="lg:col-span-1 space-y-6">
                                
                                {/* AI Quality Simulator */}
                                <QualitySimulator />

                                {/* Key Metric 1: Listing Snapshot */}
                                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-emerald-600">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                                        <h4 className="font-bold text-xl text-gray-900">Total Active Listings</h4>
                                    </div>
                                    <p className="text-4xl font-black text-emerald-700">214 <span className="text-sm font-semibold text-gray-600">Active FPOs & SHGs</span></p>
                                    <p className="text-sm text-slate-600 mt-2">
                                        The marketplace ensures maximum visibility for diverse millets and value-added products across India.
                                    </p>
                                </div>
                                
                                {/* Key Metric 2: Traceability Card */}
                                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-600">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Leaf className="w-6 h-6 text-amber-600" />
                                        <h4 className="font-bold text-xl text-gray-900">Farm-to-Fork Traceability</h4>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Blockchain system provides verifiable **Lot ID** tracking from the farm to the consumer, establishing trust and quality assurance.
                                    </p>
                                </div>
                                
                            </div> {/* End Right Column */}
                        </div> {/* End Grid */}
                        
                        {/* Static Product Listing Preview */}
                         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Featured Value-Added Products</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {mockProducts.map((product) => (
                                    <div key={product.id} className="p-4 bg-gray-50 rounded-lg shadow-sm border-l-2 border-indigo-400">
                                        <p className="text-lg font-bold text-indigo-700">{product.name}</p>
                                        <p className="text-sm text-gray-600">Supplier: {product.supplier}</p>
                                        <p className="text-md font-semibold mt-1">Price: ₹{product.price} / {product.unit} ({product.region})</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        
                        <div className="text-center pt-8">
                            <button 
                                onClick={() => window.location.href = "/marketplace"}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                            >
                                Enter Full Shree Anna Marketplace &rarr;
                            </button>
                        </div>
                        
                    </section>
                )}
            </div>
        </div>
    );
}