import React, { useState } from 'react';
import { StorageService } from '../storageService';
import { CertificateData } from '../types';
import { Button } from '../components/Button';
import { Certificate } from '../components/Certificate';
import { ArrowLeft, Award } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const CertificatesView: React.FC<Props> = ({ onBack }) => {
  const certificates = StorageService.getCertificates();
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  return (
    <div className="p-4 h-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <h2 className="text-3xl font-bold text-kidBlue flex-1 text-center">My Awards</h2>
      </div>

      {selectedCert && (
        <Certificate data={selectedCert} onClose={() => setSelectedCert(null)} />
      )}

      {certificates.length === 0 ? (
        <div className="text-center py-20">
           <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
             <Award size={64} className="text-gray-400" />
           </div>
           <h3 className="text-2xl font-bold text-gray-600 mb-2">No certificates yet!</h3>
           <p className="text-gray-500">Complete tables in "Learn Mode" to earn them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {certificates.map((cert) => (
            <button
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="bg-white border-4 border-kidYellow p-4 rounded-xl shadow-lg hover:scale-105 transition-transform text-center relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 bg-kidRed text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                 {cert.dateEarned}
               </div>
               <Award size={48} className="text-kidYellow mx-auto mb-2" />
               <div className="font-bold text-gray-800">
                 {cert.tableNumber === 'ALL' ? 'MASTER' : `x${cert.tableNumber}`}
               </div>
               <div className="text-xs text-gray-500 mt-1">Click to Print</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};