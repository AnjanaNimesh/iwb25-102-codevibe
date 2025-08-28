// import { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// interface LoginFormErrors {
//   email?: string;
//   password?: string;
// }

// interface LoginResponse {
//   status: string;
//   message: string;
//   user?: {
//     email: string;
//     role: string;
//     userId: string;
//     name?: string;
//   };
// }

// export default function Login() {
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: '',
//     password: ''
//   });
  
//   const [errors, setErrors] = useState<LoginFormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginMessage, setLoginMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

//   const validateForm = (): boolean => {
//     const newErrors: LoginFormErrors = {};
    
//     // Email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     setIsLoading(true);
//     setLoginMessage(null);
    
//     try {
//       const response = await fetch('http://localhost:9093/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // Include cookies for auth_token
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password
//         }),
//       });

//       const data: LoginResponse = await response.json();
      
//       if (response.ok && data.status === 'success' && data.user) {
//         console.log('Login successful:', data.user);
//         setLoginMessage({
//           type: 'success',
//           text: `Welcome back, ${data.user.name || data.user.email}!`
//         });
        
//         // Clear form on successful login
//         setFormData({ email: '', password: '' });
        
//         // Store user data or redirect - implement based on your app's routing
//         // For example, you might want to:
//         // - Store user data in localStorage/sessionStorage (not available in artifacts)
//         // - Update a global state/context
//         // - Redirect to dashboard
//         console.log('User role:', data.user.role);
//         console.log('User ID:', data.user.userId);
        
//       } else {
//         // Handle error responses from server
//         const errorMessage = data.message || 'Login failed';
//         console.error('Login failed:', errorMessage);
//         setLoginMessage({
//           type: 'error',
//           text: errorMessage
//         });
//       }
      
//     } catch (error) {
//       console.error('Network error:', error);
//       setLoginMessage({
//         type: 'error',
//         text: 'Network error. Please check your connection and try again.'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear error when user starts typing
//     if (errors[name as keyof LoginFormErrors]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
//       <div className="max-w-md w-full space-y-8">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
//               <Lock className="h-6 w-6 text-white" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
//             <p className="mt-2 text-gray-600">Please sign in to your account</p>
//           </div>

//           {/* Form */}
//           <div className="space-y-6">
//             {/* Login Message */}
//             {loginMessage && (
//               <div className={`p-4 rounded-lg ${
//                 loginMessage.type === 'success' 
//                   ? 'bg-green-50 border border-green-200 text-green-800' 
//                   : 'bg-red-50 border border-red-200 text-red-800'
//               }`}>
//                 <p className="text-sm font-medium">{loginMessage.text}</p>
//               </div>
//             )}
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
//                     errors.email 
//                       ? 'border-red-300 bg-red-50' 
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
//                     errors.password 
//                       ? 'border-red-300 bg-red-50' 
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-600 transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//               <div className="text-sm">
//                 <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
//                   Forgot your password?
//                 </a>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
//                 isLoading
//                   ? 'bg-indigo-400 cursor-not-allowed'
//                   : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:transform active:scale-98'
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </div>

//           {/* Sign up link */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{' '}
//               <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
//                 Sign up here
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext'

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get the page user was trying to access before login
//   const from = location.state?.from?.pathname || null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const success = await login(email, password);
      
//       if (success) {
//         // Redirect to intended page or default dashboard
//         if (from) {
//           navigate(from, { replace: true });
//         } else {
//           // Will be handled by PublicRoute redirect
//           navigate('/', { replace: true });
//         }
//       } else {
//         setError('Invalid email or password');
//       }
//     } catch (error) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="text-red-600 text-sm text-center">{error}</div>
//           )}

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;











// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext'
// import { FaHeartbeat, FaTint, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { MdBloodtype } from 'react-icons/md';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get the page user was trying to access before login
//   const from = location.state?.from?.pathname || null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const success = await login(email, password);
      
//       if (success) {
//         // Redirect to intended page or default dashboard
//         if (from) {
//           navigate(from, { replace: true });
//         } else {
//           // Will be handled by PublicRoute redirect
//           navigate('/', { replace: true });
//         }
//       } else {
//         setError('Invalid email or password');
//       }
//     } catch (error) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-red-100">
//         {/* Header with Blood Drop Animation */}
//         <div className="text-center">
//           <div className="mx-auto h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
//             <FaTint className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">
//             🩸 <span className="text-red-600">LifeDrop</span>
//           </h1>
//           <h2 className="text-xl font-semibold text-gray-700 mb-1">
//             Welcome Back
//           </h2>
//           <p className="text-sm text-gray-500">
//             Sign in to save lives through blood donation
//           </p>
          
//           {/* Decorative Elements */}
//           <div className="flex justify-center items-center space-x-2 mt-4">
//             <FaHeartbeat className="text-red-400 animate-pulse" />
//             <MdBloodtype className="text-red-500" />
//             <FaHeartbeat className="text-red-400 animate-pulse" />
//           </div>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             {/* Email Input */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={isLoading}
//                 />
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                   <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   className="block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white pr-12"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
//               <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-sm font-medium">{error}</span>
//             </div>
//           )}

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
//             >
//               {isLoading ? (
//                 <div className="flex items-center space-x-2">
//                   <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   <span>Signing in...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-2">
//                   <FaTint className="h-4 w-4" />
//                   <span>Sign In</span>
//                 </div>
//               )}
//             </button>
//           </div>
//         </form>

//         <div className="flex justify-center items-center space-x-2">
//         <div className="bg-red-50 rounded-lg p-4 mb-1 w-full justify-center items-center">
//             <p className="text-sm text-gray-700">
//               New donor? Join our life-saving community!
//             </p>
//             <button
//               onClick={() => navigate('/signup')}
//               className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
//             >
//               <FaTint className="h-3 w-3" />
//               <span>Register as a Donor</span>
//             </button>
//           </div>
//           </div>

//         {/* Footer */}
//         <div className="text-center pt-4 border-t border-gray-100">
//           <p className="text-xs text-gray-500">
//             Secure access to the blood donation management system
//           </p>
          
//           {/* Sign Up Link for Donors */}
//           {/* <div className="bg-red-50 rounded-lg p-4 mb-4">
//             <p className="text-sm text-gray-700 mb-2">
//               New donor? Join our life-saving community!
//             </p>
//             <button
//               onClick={() => navigate('/signup')}
//               className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
//             >
//               <FaTint className="h-3 w-3" />
//               <span>Register as a Donor</span>
//             </button>
//           </div> */}
          
//           <div className="flex justify-center items-center space-x-4">
//             {/* <div className="flex items-center text-xs text-gray-400">
//               <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
//               System Online
//             </div> */}
//             {/* <div className="flex items-center text-xs text-gray-400">
//               <FaHeartbeat className="mr-1 text-red-400" />
//               Saving Lives 24/7
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;








import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import { FaHeartbeat, FaTint, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { MdBloodtype } from 'react-icons/md';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        // Redirect to intended page or default dashboard
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-red-100">
        
        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Header with Blood Drop Animation */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <FaTint className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🩸 <span className="text-red-600">LifeDrop</span>
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to save lives through blood donation
          </p>
          
          {/* Decorative Elements */}
          <div className="flex justify-center items-center space-x-2 mt-4">
            <FaHeartbeat className="text-red-400 animate-pulse" />
            <MdBloodtype className="text-red-500" />
            <FaHeartbeat className="text-red-400 animate-pulse" />
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaTint className="h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-center items-center space-x-2">
          <div className="bg-red-50 rounded-lg p-4 mb-1 w-full justify-center items-center">
            <p className="text-sm text-gray-700">
              New donor? Join our life-saving community!
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
            >
              <FaTint className="h-3 w-3" />
              <span>Register as a Donor</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Secure access to the blood donation management system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
