import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/developers/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleSaveProfile = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/developers/${userId}/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">👤 Your Profile</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        {editing ? (
          <form className="space-y-4">
            <div>
              <label className="block font-bold mb-2">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Current Role</label>
              <input
                type="text"
                value={formData.current_role || ''}
                onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Company</label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSaveProfile}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Save Profile
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-2xl font-bold">{profile.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Current Role</p>
                <p className="text-lg">{profile.current_role || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Company</p>
                <p className="text-lg">{profile.company || 'Not specified'}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
