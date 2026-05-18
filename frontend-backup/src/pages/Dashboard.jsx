import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  FileText, 
  Mail, 
  Trash2, 
  LogOut, 
  Crown,
  Clock,
  Edit
} from 'lucide-react';
import { selectCurrentUser, logout } from '../store/authSlice';
import PDFDownloadButton from '../components/PDFDownloadButton';
import StripeCheckout from '../components/StripeCheckout';
import { Toaster, toast } from 'react-hot-toast';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('resumes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [resumesRes, coverLettersRes] = await Promise.all([
          axios.get(`/api/users/${user.userId}/resumes`, config),
          axios.get(`/api/users/${user.userId}/cover-letters`, config)
        ]);
        setResumes(resumesRes.data.data);
        setCoverLetters(coverLettersRes.data.data);
      } catch (err) {
        toast.error('Failed to load your documents');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    const deleteToast = toast.loading('Deleting...');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (type === 'resume') setResumes(resumes.filter(r => r._id !== id));
      else setCoverLetters(coverLetters.filter(c => c._id !== id));
      toast.success('Deleted successfully', { id: deleteToast });
    } catch (err) {
      toast.error('Delete failed', { id: deleteToast });
    }
  };

  const filteredResumes = resumes.filter(r => 
    (r.personal?.title || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLetters = coverLetters.filter(c => 
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-forge-ink">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-forge-ink text-slate-900 dark:text-slate-100">
      <Toaster />
      
      {/* Sidebar */}
      <aside className="w-72 glass fixed h-full z-20 flex flex-col p-6 border-r border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Crown className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-bold">CareerForge</h2>
        </div>

        <div className="flex-1 space-y-2">
           <button 
             onClick={() => setActiveTab('resumes')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'resumes' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
           >
             <FileText className="w-5 h-5" />
             My Resumes
           </button>
           <button 
             onClick={() => setActiveTab('letters')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'letters' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
           >
             <Mail className="w-5 h-5" />
             Cover Letters
           </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
           <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.email}</p>
                <span className="text-[10px] uppercase font-black text-primary-600">{user?.subscriptionTier} Plan</span>
              </div>
           </div>
           
           {user?.subscriptionTier === 'free' && (
             <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-2xl mb-6 text-slate-900 shadow-lg shadow-amber-500/20">
                <p className="text-xs font-black uppercase mb-1">Go Professional</p>
                <p className="text-[10px] font-medium opacity-90 mb-3">Get unlimited templates & AI features</p>
                <StripeCheckout userId={user.userId} email={user.email} priceId="price_standard_monthly" />
             </div>
           )}

           <button 
             onClick={() => dispatch(logout())}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
           >
             <LogOut className="w-5 h-5" />
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-black tracking-tight mb-2">Welcome back!</h1>
            <p className="text-slate-500 dark:text-slate-400">You have {resumes.length} resumes and {coverLetters.length} cover letters.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="form-input !py-2 !pl-10 !text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <a href="/" className="btn-primary !py-2 !px-4">
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </a>
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-400">{activeTab === 'resumes' ? 'Your Resumes' : 'Cover Letters'}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {activeTab === 'resumes' ? (
                filteredResumes.map(resume => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={resume._id} 
                    className="group glass dark:bg-slate-800/40 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[1/1.2] bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
                       <div className="w-[80%] h-[90%] bg-white rounded-t shadow-lg p-4 scale-90 group-hover:scale-95 transition-transform">
                          <div className="h-4 w-1/2 bg-slate-100 rounded mb-2" />
                          <div className="h-2 w-full bg-slate-50 rounded mb-1" />
                          <div className="h-2 w-[80%] bg-slate-50 rounded" />
                       </div>
                       <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                          <a href={`/?id=${resume._id}`} className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform">
                            <Edit className="w-5 h-5" />
                          </a>
                          <PDFDownloadButton resumeData={resume} className="!p-3 !bg-primary-600 !text-white !rounded-full !shadow-none hover:scale-110 transition-transform" />
                       </div>
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg truncate w-40">{resume.personal?.title || 'Untitled'}</h4>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                           <Clock className="w-3 h-3" />
                           {new Date(resume.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(resume._id, 'resume')}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                filteredLetters.map(letter => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={letter._id} 
                    className="glass dark:bg-slate-800/40 rounded-3xl p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                      </div>
                      <button onClick={() => handleDelete(letter._id, 'cover-letter')} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-xl mb-1">{letter.companyName}</h4>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-6">{letter.jobDescription}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400">{new Date(letter.createdAt).toLocaleDateString()}</span>
                       <button className="text-primary-600 font-bold text-sm hover:underline">View Letter</button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
