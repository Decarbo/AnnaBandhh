import React from 'react';
import { Link } from 'react-router-dom';
import { User, Factory, ChevronRight, UserPlus, LogIn } from 'lucide-react';

export default function AuthSelection() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            
            <div className="max-w-4xl w-full bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100">
                
                <header className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Welcome to the <span className="text-emerald-700">Shree Anna Portal</span>
                    </h2>
                    <p className="mt-3 text-lg text-gray-600">
                        Please select your appropriate user profile to proceed.
                    </p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* --- 1. SELLER / PRODUCER PORTAL (FPO, SHG, Farmer) --- */}
                    <div className="p-6 rounded-xl border-2 border-amber-400 bg-amber-50 shadow-lg transition duration-300 hover:shadow-xl hover:bg-amber-100/70">
                        <User className="w-10 h-10 text-amber-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900">
                            Producer / Seller Access
                        </h3>
                        <p className="mt-2 text-gray-700 text-base">
                            For **Farmers, FPOs, and SHGs**. Manage your inventory, view real-time price predictions, track sales, and ensure full traceability compliance.
                        </p>
                        
                        <div className="mt-6 space-y-3">
                            <Link 
                                to="/login?role=seller" 
                                className="w-full flex items-center justify-center px-4 py-3 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition duration-200"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                Login to Seller Dashboard
                            </Link>
                            
                            <Link 
                                to="/signup?role=seller" 
                                className="w-full flex items-center justify-center text-sm text-amber-700 hover:text-amber-800 font-medium underline"
                            >
                                <UserPlus className="w-4 h-4 mr-1" />
                                New Producer? Sign Up Here
                            </Link>
                        </div>
                    </div>

                    {/* --- 2. BUYER / PROCESSOR PORTAL (Consumer, Startup, Processor) --- */}
                    <div className="p-6 rounded-xl border-2 border-emerald-600 bg-emerald-50 shadow-lg transition duration-300 hover:shadow-xl hover:bg-emerald-100/70">
                        <Factory className="w-10 h-10 text-emerald-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900">
                            Buyer / Processor Access
                        </h3>
                        <p className="mt-2 text-gray-700 text-base">
                            For **Startups, Processors, and Bulk Consumers**. Browse verified listings, place direct bulk orders, and access lot-specific quality certifications.
                        </p>
                        
                        <div className="mt-6 space-y-3">
                            <Link 
                                to="/login?role=buyer" 
                                className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition duration-200"
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                Login to Buyer Portal
                            </Link>

                            <Link 
                                to="/signup?role=buyer" 
                                className="w-full flex items-center justify-center text-sm text-emerald-700 hover:text-emerald-800 font-medium underline"
                            >
                                <UserPlus className="w-4 h-4 mr-1" />
                                New Buyer? Sign Up Here
                            </Link>
                        </div>
                    </div>
                </div>
                
                <footer className="mt-10 text-center text-sm text-gray-500 border-t pt-6">
                    <p>Facing issues? <a href="/support" className="text-indigo-600 hover:underline">Contact Support</a> or return to the <a href="/" className="text-indigo-600 hover:underline">Homepage</a>.</p>
                </footer>
            </div>
        </div>
    );
}