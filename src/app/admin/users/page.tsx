'use client';

import { useState, useEffect } from 'react';
import { Search, UserCog, Shield, User } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filtered, setFiltered] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (search) {
      result = result.filter(u => 
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, users]);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
      setFiltered(data.users || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRole(userId: string, role: string) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function toggleActive(userId: string, isActive: boolean) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, is_active: !isActive }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('en-IN') : '-';

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Users</h1>
          <p className="text-stone mt-1">Manage registered users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-card border border-cream-dark">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                        <User className="w-5 h-5 text-stone" />
                      </div>
                      <div>
                        <p className="font-medium text-pine-dark">{user.full_name || 'No Name'}</p>
                        <p className="text-xs text-stone">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{user.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'super_admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role === 'super_admin' && <Shield className="w-3 h-3" />}
                      {user.role === 'admin' && <UserCog className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="px-3 py-1.5 border border-cream-dark rounded-lg text-sm focus:border-gold focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      <button
                        onClick={() => toggleActive(user.id, user.is_active)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${user.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-stone">No users found</div>}
      </div>
    </div>
  );
}
