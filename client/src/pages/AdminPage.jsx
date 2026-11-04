import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Users,
  Lock,
  Cpu,
  Activity,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import api from '../services/api';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const { play } = useAudio();

  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics', 'rooms', 'puzzles', 'users'
  const [loading, setLoading] = useState(true);

  // New Room Modal state
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomTheme, setNewRoomTheme] = useState('haunted-mansion');
  const [newRoomTagline, setNewRoomTagline] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomDifficulty, setNewRoomDifficulty] = useState('medium');

  // New Puzzle Modal state
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [newPuzzleTitle, setNewPuzzleTitle] = useState('');
  const [newPuzzleType, setNewPuzzleType] = useState('cipher');
  const [newPuzzleDiff, setNewPuzzleDiff] = useState('medium');
  const [newPuzzleInstr, setNewPuzzleInstr] = useState('');
  const [newPuzzleSolution, setNewPuzzleSolution] = useState('');

  const loadAdminData = async () => {
    try {
      const [statsRes, roomsRes, puzRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/rooms'),
        api.get('/api/admin/puzzles'),
        api.get('/api/admin/users')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (roomsRes.success) setRooms(roomsRes.rooms || []);
      if (puzRes.success) setPuzzles(puzRes.puzzles || []);
      if (usersRes.success) setUsersList(usersRes.users || []);
    } catch (err) {
      toast.error('Failed to load admin systems.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Create Room Handler
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      play('click');
      const res = await api.post('/api/admin/rooms', {
        title: newRoomTitle,
        theme: newRoomTheme,
        tagline: newRoomTagline,
        description: newRoomDesc,
        difficulty: newRoomDifficulty,
        stages: [
          {
            stageNumber: 1,
            name: 'Antechamber Breaching',
            lore: 'Primary security checkpoint. Bypass the external locking mechanism.',
            hotspots: [],
            puzzles: []
          }
        ]
      });

      if (res.success) {
        toast.success(`Chamber "${res.room.title}" constructed!`);
        setShowRoomModal(false);
        setNewRoomTitle('');
        setNewRoomTagline('');
        setNewRoomDesc('');
        loadAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create room.');
    }
  };

  // Delete Room Handler
  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Decommission this escape room permanently?')) return;
    try {
      play('click');
      await api.delete(`/api/admin/rooms/${id}`);
      toast.success('Room decommissioned.');
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error('Failed to delete room.');
    }
  };

  // Create Puzzle Handler
  const handleCreatePuzzle = async (e) => {
    e.preventDefault();
    try {
      play('click');
      let solutionObj;
      if (newPuzzleType === 'cipher') {
        solutionObj = { answer: newPuzzleSolution.trim().toUpperCase() };
      } else if (newPuzzleType === 'keypad') {
        solutionObj = { code: newPuzzleSolution.trim() };
      } else {
        solutionObj = { key: newPuzzleSolution.trim() };
      }

      const res = await api.post('/api/admin/puzzles', {
        title: newPuzzleTitle,
        type: newPuzzleType,
        difficulty: newPuzzleDiff,
        instructions: newPuzzleInstr,
        rewardPoints: 300,
        config: {
          cipherText: 'ENCRYPTED',
          prompt: 'Decrypt secret key'
        },
        solution: solutionObj
      });

      if (res.success) {
        toast.success(`Puzzle "${res.puzzle.title}" programmed!`);
        setShowPuzzleModal(false);
        setNewPuzzleTitle('');
        setNewPuzzleInstr('');
        setNewPuzzleSolution('');
        loadAdminData();
      }
    } catch (err) {
      toast.error('Failed to create puzzle.');
    }
  };

  // Delete Puzzle Handler
  const handleDeletePuzzle = async (id) => {
    if (!window.confirm('Delete this puzzle from the central registry?')) return;
    try {
      play('click');
      await api.delete(`/api/admin/puzzles/${id}`);
      toast.success('Puzzle deleted.');
      setPuzzles((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete puzzle.');
    }
  };

  // Toggle User Role Handler
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'player' : 'admin';
    try {
      play('click');
      const res = await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      if (res.success) {
        toast.success(`Updated role to ${newRole}`);
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to change user role.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-20 font-mono text-rose-400 text-xs">
        RESTRICTED PROTOCOL: ADMINISTRATOR CREDENTIALS REQUIRED.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Admin Command Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-950 text-rose-300 border border-rose-500/50 font-bold">
                ROOT SUPERUSER ACCESS
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-100 mt-1">
              Mainframe Control Terminal
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Live escape room monitoring, dynamic puzzle engine CMS, and operative management.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs">
          {[
            { id: 'metrics', label: 'Metrics', icon: Activity },
            { id: 'rooms', label: 'Chambers', icon: Lock },
            { id: 'puzzles', label: 'Puzzles CMS', icon: Cpu },
            { id: 'users', label: 'Operatives', icon: Users }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  play('click');
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                  activeTab === tab.id
                    ? 'bg-rose-900/80 text-rose-200 border border-rose-500/50 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-center">
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">USERS</div>
              <div className="text-xl font-bold text-slate-100 mt-1">{stats?.totalUsers || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">CHAMBERS</div>
              <div className="text-xl font-bold text-cyan-400 mt-1">{stats?.totalRooms || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">PUZZLES</div>
              <div className="text-xl font-bold text-purple-400 mt-1">{stats?.totalPuzzles || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">ACTIVE GAMES</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{stats?.activeSessionsCount || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">ESCAPES</div>
              <div className="text-xl font-bold text-amber-400 mt-1">{stats?.escapedCount || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">SUCCESS RATE</div>
              <div className="text-xl font-bold text-rose-400 mt-1">{stats?.escapeRate || 0}%</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROOMS MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-heading text-lg font-bold text-slate-100">Escape Chambers CMS</h2>
            <button
              onClick={() => setShowRoomModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-heading font-semibold tracking-wider transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>CONSTRUCT NEW CHAMBER</span>
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider pb-3">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Theme</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Stages</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">{room.title}</td>
                    <td className="py-3 px-4 text-purple-300">{room.theme}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                        {room.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan-400">{room.stages?.length || 3} Stages</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PUZZLES CMS */}
      {activeTab === 'puzzles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-heading text-lg font-bold text-slate-100">Interactive Puzzles CMS</h2>
            <button
              onClick={() => setShowPuzzleModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-heading font-semibold tracking-wider transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>PROGRAM NEW PUZZLE</span>
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider pb-3">
                  <th className="py-3 px-4">Puzzle Title</th>
                  <th className="py-3 px-4">Engine Type</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Decrypted Solution Key</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {puzzles.map((puz) => (
                  <tr key={puz._id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">{puz.title}</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">{puz.type}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                        {puz.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-amber-300 font-mono">
                      {JSON.stringify(puz.solution)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeletePuzzle(puz._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        title="Delete Puzzle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OPERATIVES MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-slate-100 pb-2">Enlisted Operatives Directory</h2>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider pb-3">
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Permission Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList.map((usr) => (
                  <tr key={usr._id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-slate-200">{usr.username}</td>
                    <td className="py-3 px-4 text-slate-400">{usr.email}</td>
                    <td className="py-3 px-4 text-cyan-400">LVL {usr.level || 1}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          usr.role === 'admin'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleUserRole(usr._id, usr.role)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700 transition"
                      >
                        {usr.role === 'admin' ? 'Demote to Player' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ROOM MODAL */}
      <AnimatePresence>
        {showRoomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-rose-500/50 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-heading text-lg font-bold text-slate-100">Construct Escape Chamber</h3>
                <button onClick={() => setShowRoomModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Chamber Title</label>
                  <input
                    type="text"
                    required
                    value={newRoomTitle}
                    onChange={(e) => setNewRoomTitle(e.target.value)}
                    placeholder="e.g. Orbital Space Station Lockdown"
                    className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-rose-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Theme</label>
                    <select
                      value={newRoomTheme}
                      onChange={(e) => setNewRoomTheme(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                    >
                      <option value="haunted-mansion">Haunted Mansion</option>
                      <option value="secret-laboratory">Secret Laboratory</option>
                      <option value="cyber-prison">Cyber Prison</option>
                      <option value="ancient-temple">Ancient Temple</option>
                      <option value="bank-heist">Bank Heist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Difficulty</label>
                    <select
                      value={newRoomDifficulty}
                      onChange={(e) => setNewRoomDifficulty(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={newRoomTagline}
                    onChange={(e) => setNewRoomTagline(e.target.value)}
                    placeholder="Catchy mission synopsis"
                    className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Mission Lore Briefing</label>
                  <textarea
                    required
                    rows={3}
                    value={newRoomDesc}
                    onChange={(e) => setNewRoomDesc(e.target.value)}
                    placeholder="Detailed storyline for operatives..."
                    className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl font-heading text-xs font-bold tracking-wider shadow-lg"
                >
                  CONSTRUCT CHAMBER
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE PUZZLE MODAL */}
      <AnimatePresence>
        {showPuzzleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-heading text-lg font-bold text-slate-100">Program Interactive Puzzle</h3>
                <button onClick={() => setShowPuzzleModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePuzzle} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Puzzle Title</label>
                  <input
                    type="text"
                    required
                    value={newPuzzleTitle}
                    onChange={(e) => setNewPuzzleTitle(e.target.value)}
                    placeholder="e.g. Sub-Level Hex Override"
                    className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Engine Type</label>
                    <select
                      value={newPuzzleType}
                      onChange={(e) => setNewPuzzleType(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                    >
                      <option value="cipher">Rotary Caesar Cipher</option>
                      <option value="keypad">Digital Keypad Code</option>
                      <option value="wire_cut">Wire Cut Relay</option>
                      <option value="pattern_grid">Neural Pattern Grid</option>
                      <option value="slider">Analog Sliders</option>
                      <option value="chemical_lab">Chemical Lab Titration</option>
                      <option value="memory_match">Memory Glyph Match</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Difficulty</label>
                    <select
                      value={newPuzzleDiff}
                      onChange={(e) => setNewPuzzleDiff(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Instructions for Operatives</label>
                  <textarea
                    required
                    rows={2}
                    value={newPuzzleInstr}
                    onChange={(e) => setNewPuzzleInstr(e.target.value)}
                    placeholder="Clear instructions on how to solve..."
                    className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Server Solution Key (Answer)
                  </label>
                  <input
                    type="text"
                    required
                    value={newPuzzleSolution}
                    onChange={(e) => setNewPuzzleSolution(e.target.value)}
                    placeholder="e.g. 2049 or RAVEN"
                    className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-heading text-xs font-bold tracking-wider shadow-lg"
                >
                  PROGRAM PUZZLE
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
