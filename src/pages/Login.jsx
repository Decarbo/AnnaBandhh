import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../state/auth'; // Keep this import for your project
import { ArrowRight, User, Factory, LogIn, Lock, Mail } from 'lucide-react';

// Mock useAuth for single-file demo (REMOVE in your project)
const useAuth = () => ({ login: ({ username, role }) => { console.log(`Logging in ${username} as ${role}`); }, user: null }); 

export default function Login(){
    const [params] = useSearchParams();
    const initialRole = params.get('role') || '';
    
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState(''); // Added password for visual fidelity
    const [role, setRole] = React.useState(initialRole);
    
    // Original Logic Imports
    const auth = useAuth();
    const nav = useNavigate();
    
    const isSeller = role === 'seller';
    
    // --- ORIGINAL LOGIN LOGIC (UNCHANGED) ---
    const submit = (e) =>{
        e.preventDefault();
        
        // 1. Login to context
        auth.login({username, role});
        
        // 2. Determine target based on role OR username (original logic)
        const target = (role || (username.toLowerCase()==='akash'? 'seller': username.toLowerCase()==='niraj'? 'buyer' : 'seller'));
        
        // 3. Navigate
        nav(target === 'seller' ? '/farmer' : '/buyer');
    };
    // -----------------------------------------

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-3">
                        {isSeller ? <User size={32} className="text-amber-600"/> : <Factory size={32} className="text-emerald-600"/>}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Portal Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Access your Shree Anna Dashboard (Logic: 'akash' for seller, 'niraj' for buyer).
                    </p>
                </div>
                
                <form onSubmit={submit} className="mt-4 space-y-6">
                    
                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                            <Mail size={16} className="mr-2"/> Username
                        </label>
                        <input 
                            value={username} 
                            onChange={e=>setUsername(e.target.value)} 
                            placeholder={isSeller ? "E.g., akash (Seller)" : "E.g., niraj (Buyer)"} 
                            required 
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>
                    
                    {/* Password Field (For Visual Fidelity) */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                            <Lock size={16} className="mr-2"/> Password (Ignored in Demo)
                        </label>
                        <input
                            type="password"
                            required
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Role Selector (Styled Dropdown) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                             Role Selection
                        </label>
                        <select 
                            value={role} 
                            onChange={e=>setRole(e.target.value)} 
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="">Auto-detect (via Username)</option>
                            <option value="seller">Farmer / Seller</option>
                            <option value="buyer">Buyer / Processor</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button 
                            className={`w-full py-3 px-4 font-semibold rounded-lg text-white shadow-lg transition duration-300 flex items-center justify-center ${isSeller ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`} 
                            type="submit"
                        >
                            <LogIn size={20} className="mr-2"/>
                            Login to Dashboard
                            <ArrowRight size={20} className="ml-2"/>
                        </button>
                    </div>
                </form>
                
                {/* Footer Tip */}
                 <div className="mt-6 text-center text-xs text-gray-500 border-t pt-4">
                    Tip: The system will automatically detect the dashboard path based on the logic in the 'useAuth' context.
                </div>
            </div>
        </div>
    )
}