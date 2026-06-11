import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  Search, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Menu,
  X,
  Lock,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  Check,
  Shield,
  Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

const API_URL = "/api/reminders";
const AUTH_URL = "/api/auth";
const USER_URL = "/api/users";

// --- COMPONENTS ---

const Navbar = ({ user, missedCount, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "My Reminders", path: "/dashboard" },
    { name: "Notifications", path: "/notifications", badge: missedCount },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-xl font-bold tracking-tighter">REMIND.</Link>
        <div className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              {link.name}
              {link.badge > 0 && <span className="ml-2 bg-primary text-white px-1.5 py-0.5 rounded-full text-[10px]">{link.badge}</span>}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/profile" className="hidden sm:flex items-center gap-2 bg-secondary px-3 py-1 rounded-full border border-border hover:border-primary/50 transition-colors">
          <UserIcon size={14} className="text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">{user?.username}</span>
        </Link>
        <button onClick={onLogout} className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-primary">
          <LogOut size={18} />
        </button>
        <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium"
              >
                {link.name}
                {link.badge > 0 && <span className="ml-2 bg-primary text-white px-2 py-0.5 rounded-full text-xs">{link.badge}</span>}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- PAGES ---

const LoginPage = ({ onLogin }) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${AUTH_URL}/login`, { identity, password });
      onLogin(res.data.user, res.data.token);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 auth-bg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bento-card bg-white shadow-xl">
        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-center">Welcome back</h1>
        <p className="text-muted-foreground text-sm mb-8 text-center">Manage your personal reminders and notifications.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Username or Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="input-primary pl-10" value={identity} onChange={(e) => setIdentity(e.target.value)} required placeholder="your_name or email@domain.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-primary pl-10 pr-10" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-2">Sign In</button>
        </form>
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          New here? <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
        </div>
      </motion.div>
    </div>
  );
};

const DropdownDateTimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("calendar");
  const date = value ? new Date(value) : new Date();

  // Date Helpers
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();
  const days = Array.from({ length: daysInMonth(currentYear, currentMonth) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth(currentYear, currentMonth) }, (_, i) => i);

  const handleDateSelect = (d) => {
    const newDate = new Date(date);
    newDate.setDate(d);
    onChange(newDate.toISOString());
    setView("time");
  };

  const handleTimeChange = (type, val) => {
    const newDate = new Date(date);
    if (type === "h") newDate.setHours(val);
    else newDate.setMinutes(val);
    onChange(newDate.toISOString());
  };

  const formattedValue = value ? new Intl.DateTimeFormat('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  }).format(new Date(value)) : "Select date & time";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 text-sm font-semibold text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all flex items-center gap-3"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          <Clock size={16} />
        </div>
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{formattedValue}</span>
        <ChevronRight size={14} className={`ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-border rounded-2xl shadow-2xl z-[120] p-5 overflow-hidden"
            >
              <div className="flex gap-2 p-1 bg-secondary/30 rounded-lg mb-4">
                <button 
                  type="button"
                  onClick={() => setView("calendar")}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${view === 'calendar' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
                >
                  Date
                </button>
                <button 
                  type="button"
                  onClick={() => setView("time")}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${view === 'time' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
                >
                  Time
                </button>
              </div>

              <div className="min-h-[220px]">
                {view === "calendar" ? (
                  <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                      <span className="text-xs font-bold text-foreground">
                        {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)}
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[9px] font-bold text-muted-foreground py-2">{d}</div>
                      ))}
                      {emptyDays.map(i => <div key={`e-${i}`} />)}
                      {days.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleDateSelect(d)}
                          className={`aspect-square flex items-center justify-center text-[10px] font-medium rounded-full transition-all ${d === currentDay ? 'bg-primary text-white font-bold' : 'hover:bg-secondary text-foreground'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <input 
                          type="number" min="0" max="23" 
                          value={date.getHours()} 
                          onChange={(e) => handleTimeChange("h", parseInt(e.target.value))}
                          className="w-16 bg-secondary/50 border border-border rounded-xl py-3 text-center text-xl font-bold text-foreground outline-none focus:border-primary/50"
                        />
                        <label className="text-[9px] font-bold text-muted-foreground uppercase">Hours</label>
                      </div>
                      <span className="text-2xl font-bold text-muted-foreground">:</span>
                      <div className="flex flex-col items-center gap-2">
                        <input 
                          type="number" min="0" max="59" 
                          value={date.getMinutes()} 
                          onChange={(e) => handleTimeChange("m", parseInt(e.target.value))}
                          className="w-16 bg-secondary/50 border border-border rounded-xl py-3 text-center text-xl font-bold text-foreground outline-none focus:border-primary/50"
                        />
                        <label className="text-[9px] font-bold text-muted-foreground uppercase">Minutes</label>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-primary text-white text-[10px] font-bold uppercase py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const SignupPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
  const [usernameStatus, setUsernameStatus] = useState({ available: true, suggestions: [] });
  const [isChecking, setIsChecking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordRequirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "At least one number", regex: /[0-9]/ },
    { label: "At least one special character", regex: /[^A-Za-z0-9]/ },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.regex.test(formData.password));

  useEffect(() => {
    if (!formData.username || formData.username.length < 3) {
      setUsernameStatus({ available: true, suggestions: [] });
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${AUTH_URL}/check-username/${formData.username}`);
        setUsernameStatus(res.data);
      } catch (err) {
        console.error("Username check failed", err);
      } finally {
        setIsChecking(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!usernameStatus.available) return toast.error("Please choose an available username");
    if (!isPasswordValid) return toast.error("Password does not meet security requirements");
    try {
      const res = await axios.post(`${AUTH_URL}/register`, formData);
      onLogin(res.data.user, res.data.token);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 auth-bg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bento-card bg-white shadow-xl">
        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-center">Get Started</h1>
        <p className="text-muted-foreground text-sm mb-8 text-center">Join Remind to stay on top of your schedule.</p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
            <input className="input-primary" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex justify-between">
              Username 
              <div className="flex items-center gap-1">
                {isChecking && <span className="animate-spin h-2 w-2 border border-primary border-t-transparent rounded-full"></span>}
                {!isChecking && formData.username.length >= 3 && (
                  usernameStatus.available ? 
                  <span className="text-green-500 text-[8px] font-bold">AVAILABLE</span> : 
                  <span className="text-primary text-[8px] font-bold">TAKEN</span>
                )}
              </div>
            </label>
            <div className="relative">
              <input 
                className={`input-primary transition-all ${!usernameStatus.available && formData.username.length >= 3 ? 'border-primary/50 ring-1 ring-primary/10' : ''}`} 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})} 
                required 
                placeholder="your_unique_name"
              />
              {!isChecking && !usernameStatus.available && (
                <AlertCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
              )}
              {!isChecking && usernameStatus.available && formData.username.length >= 3 && (
                <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
            
            <AnimatePresence>
              {!usernameStatus.available && usernameStatus.suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/50">
                    <span className="text-[8px] text-muted-foreground font-bold uppercase py-1">Suggestions:</span>
                    {usernameStatus.suggestions.map(s => (
                      <button key={s} type="button" onClick={() => setFormData({...formData, username: s})} className="text-[9px] bg-secondary/30 border border-border px-2 py-0.5 rounded-full hover:border-primary hover:text-primary transition-all font-medium">{s}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
            <input type="email" className="input-primary" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="email@example.com" />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-primary pl-10 pr-10" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                placeholder="••••••••" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <div className="pt-2 space-y-1.5">
              {passwordRequirements.map((req, i) => {
                const isMet = req.regex.test(formData.password);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${isMet ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                      {isMet && <Check size={8} className="text-white" />}
                    </div>
                    <span className={`text-[9px] font-medium transition-colors ${isMet ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isChecking || (!usernameStatus.available && formData.username.length >= 3) || !isPasswordValid}
            className="btn-primary mt-4 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            {isChecking ? "Checking availability..." : "Create Account"}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          Already a member? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ reminders, user, fetchReminders, onDelete, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeReminders = reminders
    .filter(r => r.userId === user?.id && r.status === 'pending')
    .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

  const resetForm = () => {
    setTitle(""); setMessage(""); setScheduledTime(""); setEditingReminder(null); setIsModalOpen(false);
  };

  const openEdit = (r) => {
    setEditingReminder(r); setTitle(r.title); setMessage(r.message);
    // Convert UTC from server back to local time for the input
    const localDate = new Date(r.scheduledTime);
    const tzOffset = localDate.getTimezoneOffset() * 60000;
    const formattedDate = new Date(localDate.getTime() - tzOffset).toISOString().slice(0, 16);
    setScheduledTime(formattedDate);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure time is sent in UTC ISO format for production reliability
      const utcTime = new Date(scheduledTime).toISOString();

      if (editingReminder) {
        await axios.put(`${API_URL}/${editingReminder._id}`, { title, message, scheduledTime: utcTime });
        toast.success("Reminder updated");
      } else {
        await axios.post(API_URL, { userId: user.id, title, message, scheduledTime: utcTime });
        toast.success("Reminder set successfully");
      }
      resetForm(); fetchReminders();
    } catch (err) { 
      toast.error("Could not save reminder");
      console.error(err); 
    }
  };

  const handleDeleteWithToast = async (id) => {
    try {
      await onDelete(id);
      toast.success("Reminder deleted");
    } catch (err) {
      toast.error("Failed to delete reminder");
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground">My Reminders</h1>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 border border-primary/10 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[8px] font-bold text-primary uppercase tracking-tighter">Syncing</span>
              </motion.div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Hello, {user?.name}. Stay on top of your schedule.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
          <div className="relative group w-full sm:w-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none">
              <Search size={15} />
            </div>
            <input 
              ref={searchRef}
              placeholder="Search reminders..." 
              className="w-full bg-white border border-border rounded-xl pl-11 pr-12 py-2.5 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all shadow-sm group-hover:shadow-md" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchTerm ? (
                <button onClick={() => setSearchTerm("")} className="p-1 hover:bg-secondary rounded-md text-muted-foreground transition-colors">
                  <X size={14} />
                </button>
              ) : (
                <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 border border-border rounded bg-secondary/50 text-[9px] font-bold text-muted-foreground/60">
                  <Command size={10} /> K
                </div>
              )}
            </div>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center justify-center gap-2.5 group w-full sm:w-auto h-[44px] px-6">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            <span className="font-bold tracking-tight">New Reminder</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bento-card bg-white animate-pulse border-border/40 min-h-[180px] flex flex-col">
              <div className="flex justify-between mb-6">
                <div className="w-24 h-5 bg-secondary/50 rounded-lg" />
                <div className="w-8 h-8 bg-secondary/50 rounded-full" />
              </div>
              <div className="w-3/4 h-7 bg-secondary/50 rounded-lg mb-3" />
              <div className="w-full h-4 bg-secondary/50 rounded-lg mb-2" />
              <div className="w-2/3 h-4 bg-secondary/50 rounded-lg mt-auto" />
            </div>
          ))
        ) : activeReminders.length === 0 ? (
          <div className="col-span-full py-28 text-center border border-dashed border-border/60 rounded-xl bg-secondary/5">
            <Calendar className="mx-auto mb-4 text-muted-foreground opacity-20" size={48} />
            <p className="text-muted-foreground font-medium">No reminders scheduled for this period.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 text-primary text-xs font-bold uppercase tracking-widest hover:underline">+ Create your first alert</button>
          </div>
        ) : (
          activeReminders.map(r => (
            <motion.div layout key={r._id} className="bento-card group bg-white hover:shadow-lg transition-all border-border/60">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary tracking-widest uppercase bg-primary/5 px-2 py-1 rounded">
                  <Clock size={12} />
                  {new Date(r.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-secondary rounded-md transition-colors"><Edit3 size={14} /></button>
                  <button onClick={() => handleDeleteWithToast(r._id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-md transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{r.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{r.message}</p>
              <div className="mt-auto flex justify-between items-center text-[10px] font-mono text-muted-foreground pt-4 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>{new Date(r.scheduledTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>ACTIVE</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white border border-border rounded-2xl p-8 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-2xl"></div>
              <h2 className="text-2xl font-bold tracking-tighter mb-1 text-foreground">{editingReminder ? "Modify Reminder" : "New Reminder"}</h2>
              <p className="text-muted-foreground text-xs mb-8">Set a notification sequence to stay synchronized.</p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Subject</label>
                  <input className="input-primary" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Design Sync" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Note</label>
                  <textarea className="input-primary min-h-[80px] resize-none" value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="What do you want to be reminded about?" />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Scheduling Sequence</label>
                  <DropdownDateTimePicker value={scheduledTime} onChange={setScheduledTime} />
                  <div className="flex items-center gap-2 px-1 pt-2 border-t border-border/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Triple-sync active: 1d, 30m, and real-time execution.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-2 pt-4 border-t border-border/40">
                  <button type="button" onClick={resetForm} className="btn-secondary flex-1 border-none hover:bg-secondary text-muted-foreground transition-all">Discard</button>
                  <button type="submit" className="btn-primary flex-1 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {editingReminder ? "Update Reminder" : "Set Reminder"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationsPage = ({ reminders, user, onMarkRead, isLoading }) => {
  const missed = reminders
    .filter(r => r.userId === user?.id && (!r.isRead && (new Date(r.scheduledTime) < new Date() || r.status === 'triggered')))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleDismiss = async (id) => {
    try {
      await onMarkRead(id);
      toast.success("Notification dismissed");
    } catch (err) {
      toast.error("Failed to dismiss");
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tighter mb-2">Notifications</h1>
      <p className="text-muted-foreground text-sm mb-12">Missed alerts and historical logs.</p>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 p-5 border border-border rounded-xl bg-white animate-pulse">
              <div className="bg-secondary/50 w-10 h-10 rounded-full shrink-0" />
              <div className="flex-grow space-y-2">
                <div className="h-5 bg-secondary/50 rounded-lg w-1/3" />
                <div className="h-4 bg-secondary/50 rounded-lg w-full" />
              </div>
            </div>
          ))
        ) : missed.length === 0 ? (
          <div className="py-20 text-center border border-border rounded-lg bg-secondary/10">
            <CheckCircle2 className="mx-auto mb-4 text-green-500" size={32} />
            <p className="text-muted-foreground">Your notification queue is clear.</p>
          </div>
        ) : (
          missed.map(r => (
            <div key={r._id} className="flex items-center gap-6 p-5 border border-border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow group">
              <div className="bg-secondary/50 p-3 rounded-full text-primary"><AlertCircle size={20} /></div>
              <div className="flex-grow">
                <h3 className="font-semibold mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.message}</p>
                <div className="mt-2 text-[10px] font-mono text-muted-foreground">{new Date(r.scheduledTime).toLocaleString()} • {r.status.toUpperCase()}</div>
              </div>
              <button onClick={() => handleDismiss(r._id)} className="btn-secondary text-[10px] py-1.5 px-3 font-bold uppercase">Dismiss</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProfilePage = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "At least one number", regex: /[0-9]/ },
    { label: "At least one special character", regex: /[^A-Za-z0-9]/ },
  ];

  const isPasswordValid = password === "" || passwordRequirements.every(req => req.regex.test(password));

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setIsUpdatingName(true);
    try {
      const token = localStorage.getItem("remind_token");
      const res = await axios.put(`${USER_URL}/profile`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdateUser(res.data.user);
      toast.success("Name updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!isPasswordValid || password === "") return toast.error("Please meet all security requirements");
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("remind_token");
      await axios.put(`${USER_URL}/profile`, { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassword("");
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">Account Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your identity and security protocols.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PERSONAL IDENTITY */}
        <section className="bento-card bg-white shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <UserIcon size={18} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Personal Identity</h2>
          </div>
          
          <form onSubmit={handleUpdateName} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Display Name</label>
              <input 
                className="input-primary" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2 opacity-50 cursor-not-allowed">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Username (Locked)</label>
              <input className="input-primary bg-secondary/20" value={user?.username} disabled />
            </div>

            <div className="space-y-2 opacity-50 cursor-not-allowed">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Email Address (Locked)</label>
              <input className="input-primary bg-secondary/20" value={user?.email} disabled />
            </div>

            <button 
              type="submit" 
              disabled={isUpdatingName || name === user?.name}
              className="btn-primary w-full disabled:opacity-30"
            >
              {isUpdatingName ? "Syncing..." : "Update Identity"}
            </button>
          </form>
        </section>

        {/* SECURITY PROTOCOLS */}
        <section className="bento-card bg-white shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Shield size={18} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Security Protocols</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="input-primary pl-10 pr-10" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter new password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {password !== "" && (
                <div className="pt-2 space-y-1.5">
                  {passwordRequirements.map((req, i) => {
                    const isMet = req.regex.test(password);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${isMet ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                          {isMet && <Check size={8} className="text-white" />}
                        </div>
                        <span className={`text-[9px] font-medium transition-colors ${isMet ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isUpdatingPassword || password === "" || !isPasswordValid}
              className="btn-primary w-full disabled:opacity-30"
            >
              {isUpdatingPassword ? "Updating..." : "Secure Account"}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex gap-3">
              <AlertCircle size={16} className="text-primary shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                Passcodes are encrypted via AES-256 before storage. System dispatch requires manual re-authentication after security updates.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- APP ---

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("remind_user")) || null);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReminders = async (silent = false) => {
    if (!user) return;
    if (!silent) setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/all`);
      setReminders(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReminders();
      const interval = setInterval(() => fetchReminders(true), 5000); // Silent background polling
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogin = (userData, token) => {
    localStorage.setItem("remind_user", JSON.stringify(userData));
    localStorage.setItem("remind_token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setUser(null); 
    setReminders([]);
    toast.success("Signed out successfully");
  };

  const deleteReminder = async (id) => { 
    await axios.delete(`${API_URL}/${id}`); 
    fetchReminders(true);
  };

  const markRead = async (id) => { 
    await axios.patch(`${API_URL}/${id}/read`); 
    fetchReminders(true);
  };

  const handleUpdateUser = (updatedUser) => {
    localStorage.setItem("remind_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const missedCount = reminders.filter(r => r.userId === user?.id && (!r.isRead && (new Date(r.scheduledTime) < new Date() || r.status === 'triggered'))).length;

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" richColors closeButton expand={false} />
        {user && <Navbar user={user} missedCount={missedCount} onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <SignupPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard reminders={reminders} user={user} fetchReminders={() => fetchReminders(true)} onDelete={deleteReminder} isLoading={isLoading} /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <NotificationsPage reminders={reminders} user={user} onMarkRead={markRead} isLoading={isLoading} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
