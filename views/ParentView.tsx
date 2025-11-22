import React, { useState } from 'react';
import { StorageService } from '../storageService';
import { Button } from '../components/Button';
import { ArrowLeft, Lock, Unlock, Trash2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const ParentView: React.FC<Props> = ({ onBack }) => {
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const profile = StorageService.getProfile();

  const handleUnlock = () => {
    if (pin === profile.parentPin) {
      setLocked(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete ALL progress and certificates.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
         <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border-4 border-gray-200">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Lock className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Parent Gate</h2>
            <p className="text-gray-500 mb-4 text-sm">Enter PIN (Default: 1234)</p>
            
            <input 
              type="password" 
              value={pin} 
              onChange={(e) => {setPin(e.target.value); setError(false);}}
              className="w-full text-center text-3xl tracking-widest p-3 border-2 rounded-xl mb-4 outline-none focus:border-kidBlue"
              maxLength={4}
              placeholder="****"
            />
            {error && <div className="text-red-500 mb-4 font-bold">Incorrect PIN</div>}
            
            <div className="flex gap-2">
               <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
               <Button onClick={handleUnlock} className="flex-1">Unlock</Button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Exit Parent Mode
        </Button>
        <h2 className="text-3xl font-bold text-gray-800 flex-1 text-center flex items-center justify-center gap-2">
          <Unlock size={24} /> Parent Dashboard
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
         <h3 className="text-xl font-bold mb-4 border-b pb-2">Student Profile</h3>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="text-sm text-gray-500">Name</label>
             <div className="font-bold text-lg">{profile.name}</div>
           </div>
           <div>
             <label className="text-sm text-gray-500">PIN Code</label>
             <div className="font-mono text-lg">{profile.parentPin}</div>
           </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
         <h3 className="text-xl font-bold mb-4 border-b pb-2">Data Management</h3>
         <div className="flex justify-between items-center">
            <span className="text-gray-600">Reset all app data and progress</span>
            <Button variant="danger" size="sm" onClick={handleClearData}>
              <Trash2 size={16} className="mr-2" /> Reset App
            </Button>
         </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
         Note: More detailed analytics are available in the main Progress Dashboard accessible from the home screen.
      </div>
    </div>
  );
};