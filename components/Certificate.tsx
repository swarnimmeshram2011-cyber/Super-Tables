import React from 'react';
import { CertificateData } from '../types';
import { Button } from './Button';
import { Printer } from 'lucide-react';

interface Props {
  data: CertificateData | null;
  onClose: () => void;
}

export const Certificate: React.FC<Props> = ({ data, onClose }) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Controls - Hidden when printing */}
        <div className="flex justify-end gap-4 mb-4 no-print">
           <Button variant="outline" onClick={onClose}>Close</Button>
           <Button variant="primary" onClick={handlePrint}>
             <Printer size={20} /> Print / Save
           </Button>
        </div>

        {/* Certificate Area */}
        <div id="certificate-area" className="bg-white p-1">
           <div className="border-[20px] border-double border-kidYellow p-8 h-full w-full flex flex-col items-center justify-center text-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-kidBlue rounded-tl-3xl m-4"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-kidBlue rounded-tr-3xl m-4"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-kidBlue rounded-bl-3xl m-4"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-kidBlue rounded-br-3xl m-4"></div>

              {/* Header */}
              <h1 className="text-6xl font-bold text-kidBlue mb-2 font-serif tracking-wider">CERTIFICATE</h1>
              <h2 className="text-3xl text-gray-500 font-serif italic mb-8">OF ACHIEVEMENT</h2>

              <p className="text-xl text-gray-600 mb-4">This is to certify that</p>
              
              {/* Student Name */}
              <div className="text-5xl font-bold text-kidPurple border-b-4 border-gray-300 px-12 py-2 mb-8 font-handwriting min-w-[300px]">
                {data.studentName}
              </div>

              <p className="text-xl text-gray-600 mb-6">Has successfully mastered</p>

              {/* Achievement */}
              <div className="text-4xl font-bold text-kidGreen mb-8 bg-green-50 px-8 py-4 rounded-2xl border-2 border-green-200">
                {data.tableNumber === 'ALL' ? "ALL 20 Multiplication Tables!" : `The ${data.tableNumber} Times Table`}
              </div>

              {/* Badge Image (Placeholder) */}
              <div className="mb-8 relative">
                <div className="w-32 h-32 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center text-5xl shadow-lg">
                  🏆
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded shadow-md font-bold whitespace-nowrap">
                  Super Star
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex justify-between w-full mt-12 px-12">
                <div className="text-center">
                  <p className="text-lg font-bold border-t-2 border-gray-400 pt-2 px-8">{data.dateEarned}</p>
                  <p className="text-sm text-gray-500 mt-1">Date</p>
                </div>
                <div className="text-center">
                  <div className="h-8 w-48 border-b-2 border-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-500">Parent / Teacher Signature</p>
                </div>
              </div>

              <div className="mt-8 text-sm text-gray-400">Super Tables Web App</div>
           </div>
        </div>
      </div>
    </div>
  );
};
