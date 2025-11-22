import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

interface Card {
  id: number;
  content: string;
  type: 'EQUATION' | 'ANSWER';
  val: number; // To check match
  isFlipped: boolean;
  isMatched: boolean;
}

interface Props {
  onBack: () => void;
}

export const MemoryView: React.FC<Props> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    // Pick 6 random equations
    const equations = [];
    for (let i = 0; i < 6; i++) {
      const num1 = Math.floor(Math.random() * 9) + 2; // 2 to 10
      const num2 = Math.floor(Math.random() * 9) + 2;
      equations.push({ num1, num2, res: num1 * num2 });
    }

    let newCards: Card[] = [];
    equations.forEach((eq, idx) => {
      // Equation Card
      newCards.push({
        id: idx * 2,
        content: `${eq.num1} × ${eq.num2}`,
        type: 'EQUATION',
        val: eq.res,
        isFlipped: false,
        isMatched: false,
      });
      // Answer Card
      newCards.push({
        id: idx * 2 + 1,
        content: `${eq.res}`,
        type: 'ANSWER',
        val: eq.res,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    newCards = newCards.sort(() => Math.random() - 0.5);
    setCards(newCards);
    setFlippedCards([]);
    setIsLocked(false);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the card
    const updatedCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(updatedCards);
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      checkForMatch(newFlipped, updatedCards);
    }
  };

  const checkForMatch = (flippedIds: number[], currentCards: Card[]) => {
    const card1 = currentCards.find(c => c.id === flippedIds[0]);
    const card2 = currentCards.find(c => c.id === flippedIds[1]);

    if (card1 && card2 && card1.val === card2.val) {
      // Match!
      setTimeout(() => {
        const matchedCards = currentCards.map(c => 
          flippedIds.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c
        );
        setCards(matchedCards);
        setFlippedCards([]);
        setIsLocked(false);

        if (matchedCards.every(c => c.isMatched)) {
          setGameWon(true);
        }
      }, 500);
    } else {
      // No Match
      setTimeout(() => {
        const resetCards = currentCards.map(c => 
          flippedIds.includes(c.id) ? { ...c, isFlipped: false } : c
        );
        setCards(resetCards);
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto h-full flex flex-col animate-pop-in">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft /> Exit
        </Button>
        <div className="bg-white/50 px-4 py-2 rounded-xl font-bold text-blue-800 border-2 border-white backdrop-blur">
          Moves: {moves}
        </div>
      </div>

      <h2 className="text-3xl font-black text-center text-white drop-shadow-md mb-6 font-display tracking-wide">
         Memory Match! 🧠
      </h2>

      {gameWon ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl border-4 border-white animate-pop-in">
           <Sparkles size={64} className="text-yellow-400 animate-spin mb-4" />
           <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
             You Won!
           </h2>
           <p className="text-xl text-gray-600 mb-8">Awesome memory! It took you {moves} moves.</p>
           <Button variant="primary" size="lg" onClick={initializeGame}>
             <RefreshCw className="mr-2" /> Play Again
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 flex-1 content-center">
          {cards.map((card) => (
            <div key={card.id} className="aspect-square perspective-1000">
              <div
                onClick={() => handleCardClick(card.id)}
                className={`
                  w-full h-full relative preserve-3d transition-transform duration-500 cursor-pointer
                  ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
                `}
                style={{ transformStyle: 'preserve-3d', transform: (card.isFlipped || card.isMatched) ? 'rotateY(180deg)' : 'rotateY(0)' }}
              >
                {/* Back of Card */}
                <div 
                  className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-md border-2 border-blue-300 flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                   <span className="text-4xl opacity-50">❓</span>
                </div>

                {/* Front of Card */}
                <div 
                  className={`
                    absolute w-full h-full backface-hidden rounded-xl shadow-xl flex items-center justify-center border-4
                    ${card.isMatched ? 'bg-green-100 border-green-400' : 'bg-white border-yellow-400'}
                  `}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                   <span className={`font-black ${card.type === 'EQUATION' ? 'text-xl md:text-3xl text-gray-700' : 'text-3xl md:text-5xl text-blue-600'}`}>
                     {card.content}
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};