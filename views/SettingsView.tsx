import React, { useState } from 'react';
import { StorageService } from '../storageService';
import { Button } from '../components/Button';
import { ArrowLeft, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const SettingsView: React.FC<Props> = ({ onBack }) => {
  const [profile, setProfile] = useState(StorageService.getProfile());

  const save = (updates: Partial<typeof profile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
    
    // Apply dark mode immediately
    if (newProfile.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center mb-8">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <h2 className="text-3xl font-bold text-kidBlue flex-1 text-center">Settings</h2>
      </div>

      <div className="space-y-4">
         <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center">
           <div className="flex items-center gap-3">
             {profile.soundEnabled ? <Volume2 className="text-kidGreen" /> : <VolumeX className="text-gray-400" />}
             <span className="font-bold text-lg">Sound Effects</span>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => save({ soundEnabled: true })}
                className={`px-4 py-2 rounded-lg font-bold ${profile.soundEnabled ? 'bg-kidGreen text-white' : 'bg-gray-100'}`}
              >ON</button>
              <button 
                onClick={() => save({ soundEnabled: false })}
                className={`px-4 py-2 rounded-lg font-bold ${!profile.soundEnabled ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
              >OFF</button>
           </div>
         </div>

         <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center">
           <div className="flex items-center gap-3">
             {profile.darkMode ? <Moon className="text-kidPurple" /> : <Sun className="text-kidYellow" />}
             <span className="font-bold text-lg">App Theme</span>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => save({ darkMode: false })}
                className={`px-4 py-2 rounded-lg font-bold ${!profile.darkMode ? 'bg-kidYellow text-white' : 'bg-gray-100'}`}
              >Light</button>
              <button 
                onClick={() => save({ darkMode: true })}
                className={`px-4 py-2 rounded-lg font-bold ${profile.darkMode ? 'bg-slate-800 text-white' : 'bg-gray-100'}`}
              >Dark</button>
           </div>
         </div>

         <div className="bg-white p-4 rounded-2xl shadow">
            <label className="block font-bold mb-2">Student Name</label>
            <input 
               type="text" 
               value={profile.name}
               onChange={(e) => save({ name: e.target.value })}
               className="w-full p-3 border-2 rounded-xl outline-none focus:border-kidBlue"
            />
         </div>
      </div>
    </div>
  );
};