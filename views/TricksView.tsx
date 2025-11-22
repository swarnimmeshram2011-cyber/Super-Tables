import React from 'react';
import { Button } from '../components/Button';
import { ArrowLeft, Lightbulb } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const TricksView: React.FC<Props> = ({ onBack }) => {
  const tricks = [
    { title: "The 2s Pattern", desc: "Any number times 2 is just doubling it! It always ends in 0, 2, 4, 6, or 8." },
    { title: "The 5s Secret", desc: "Answers for 5 always end in 0 or 5. It's just like counting fingers on hands!" },
    { title: "The 9s Finger Trick", desc: "Hold up 10 fingers. Bend the finger of the number you are multiplying by 9. Count fingers on the left for tens, and right for ones!" },
    { title: "The 10s Rule", desc: "Just put a '0' at the end of the number. 7 x 10 = 70. Easy peasy!" },
    { title: "The 11s Mirror", desc: "For numbers up to 9, just repeat the digit! 4 x 11 = 44. It's like a mirror!" },
    { title: "Doubling for 4s", desc: "Multiply by 2, then multiply by 2 again. Double double!" },
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Back
        </Button>
        <h2 className="text-3xl font-bold text-kidPurple flex-1 text-center">Table Tricks 🪄</h2>
      </div>

      <div className="grid gap-6">
        {tricks.map((trick, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-kidYellow flex gap-4">
             <div className="bg-yellow-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <Lightbulb className="text-yellow-600" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">{trick.title}</h3>
               <p className="text-gray-600 leading-relaxed">{trick.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};