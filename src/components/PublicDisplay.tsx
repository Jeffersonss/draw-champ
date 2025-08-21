import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Users } from 'lucide-react';
import { Tournament, Club } from './AdminPanel';
import { gsap } from 'gsap';

interface PublicDisplayProps {
  tournament: Tournament;
  onClubSelect?: (clubId: string, position: { group: number; slot: number }) => void;
}

interface DrawPosition {
  group: number;
  slot: number;
  club?: Club;
}

const PublicDisplay = ({ tournament, onClubSelect }: PublicDisplayProps) => {
  const [drawPositions, setDrawPositions] = useState<DrawPosition[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<HTMLDivElement>(null);
  const clubNameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize draw positions based on tournament format
    const positions: DrawPosition[] = [];
    
    if (tournament.format === 'groups') {
      for (let g = 1; g <= (tournament.groups || 4); g++) {
        for (let s = 1; s <= (tournament.clubsPerGroup || 4); s++) {
          positions.push({ group: g, slot: s });
        }
      }
    } else {
      // Knockout format - create bracket positions
      const totalClubs = tournament.totalClubs;
      const rounds = Math.log2(totalClubs);
      
      for (let i = 1; i <= totalClubs; i++) {
        positions.push({ group: 1, slot: i }); // All in one "group" for knockout
      }
    }
    
    setDrawPositions(positions);
  }, [tournament]);

  useEffect(() => {
    // Animate cards entrance with stagger
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current, 
        { y: 50, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)" 
        }
      );
    }
  }, [drawPositions]);

  const handleClubDraw = async (club: Club) => {
    if (isAnimating) return;
    
    setSelectedClub(club);
    setIsAnimating(true);

    // Find empty position
    const emptyPosition = drawPositions.find(pos => !pos.club);
    if (!emptyPosition) return;

    // Full screen animation
    if (animationRef.current && clubNameRef.current) {
      const timeline = gsap.timeline();
      
      // Show overlay
      timeline.fromTo(animationRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5 }
      );
      
      // Animate club name letters
      const letters = clubNameRef.current.children;
      timeline.fromTo(letters, 
        { 
          y: 100, 
          opacity: 0, 
          scale: 0.5,
          rotation: -15
        }, 
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotation: 0,
          duration: 0.8, 
          stagger: 0.1, 
          ease: "elastic.out(1, 0.5)" 
        }
      );

      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Exit animation
      timeline.to(letters, {
        y: -100,
        opacity: 0,
        scale: 1.2,
        rotation: 15,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.in(1.7)"
      });

      timeline.to(animationRef.current, {
        opacity: 0,
        duration: 0.3
      });

      // Update position
      const updatedPositions = drawPositions.map(pos => 
        pos === emptyPosition ? { ...pos, club } : pos
      );
      setDrawPositions(updatedPositions);

      // Highlight the card
      const cardIndex = drawPositions.indexOf(emptyPosition);
      if (cardsRef.current[cardIndex]) {
        gsap.fromTo(cardsRef.current[cardIndex],
          { scale: 1 },
          { 
            scale: 1.05, 
            duration: 0.3, 
            yoyo: true, 
            repeat: 1,
            ease: "power2.inOut"
          }
        );
      }
    }

    setIsAnimating(false);
    setSelectedClub(null);
    
    onClubSelect?.(club.id, { group: emptyPosition.group, slot: emptyPosition.slot });
  };

  const getGroupTitle = (groupNumber: number) => {
    if (tournament.format === 'groups') {
      return `Grupo ${String.fromCharCode(64 + groupNumber)}`;
    } else {
      return 'Chaveamento';
    }
  };

  const getGroupColor = (groupNumber: number) => {
    const colors = [
      'border-l-blue-500',
      'border-l-green-500', 
      'border-l-red-500',
      'border-l-purple-500',
      'border-l-orange-500',
      'border-l-pink-500',
      'border-l-teal-500',
      'border-l-indigo-500'
    ];
    return colors[(groupNumber - 1) % colors.length];
  };

  const groupedPositions = drawPositions.reduce((groups, position) => {
    if (!groups[position.group]) {
      groups[position.group] = [];
    }
    groups[position.group].push(position);
    return groups;
  }, {} as Record<number, DrawPosition[]>);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/38f26f6c-b0b7-42ef-a08f-ea5521a8588f.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-8 championship-card mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-championship-primary" />
            <h1 className="text-3xl font-bold text-championship-primary">
              {tournament.name || 'Sorteio do Campeonato'}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {tournament.clubs.length}/{tournament.totalClubs} clubes
            </span>
            <span>
              {tournament.format === 'groups' 
                ? `${tournament.groups} grupos de ${tournament.clubsPerGroup} clubes`
                : `Mata-mata com ${tournament.totalClubs} clubes`
              }
            </span>
          </div>
        </div>

        {/* Groups/Brackets */}
        <div className="grid gap-6 max-w-7xl mx-auto">
          {Object.entries(groupedPositions).map(([groupNum, positions]) => (
            <div 
              key={groupNum}
              ref={el => { if (el) cardsRef.current[parseInt(groupNum)] = el; }}
              className={`championship-card ${getGroupColor(parseInt(groupNum))}`}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold text-championship-primary">
                  {getGroupTitle(parseInt(groupNum))}
                </h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {positions.map((position, index) => (
                  <div 
                    key={`${position.group}-${position.slot}`}
                    className="p-4 bg-white/50 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/70"
                  >
                    {position.club ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={position.club.logo}
                          alt={position.club.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{position.club.name}</h3>
                          <p className="text-sm text-gray-600">Posição {position.slot}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-16 text-gray-400">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <p className="text-sm">Aguardando sorteio</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Available Clubs for Draw */}
        {tournament.clubs.some(club => !drawPositions.some(pos => pos.club?.id === club.id)) && (
          <div className="championship-card mt-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-championship-primary">
              Clubes Disponíveis para Sorteio
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tournament.clubs
                .filter(club => !drawPositions.some(pos => pos.club?.id === club.id))
                .map((club) => (
                  <button
                    key={club.id}
                    onClick={() => handleClubDraw(club)}
                    disabled={isAnimating}
                    className="p-4 bg-championship-gradient text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-semibold">{club.name}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Animation Overlay */}
      {selectedClub && (
        <div 
          ref={animationRef}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <div className="text-center">
            <div className="mb-8">
              <img
                src={selectedClub.logo}
                alt={selectedClub.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 animate-glow-pulse"
              />
            </div>
            <div 
              ref={clubNameRef}
              className="text-4xl md:text-6xl font-bold text-white"
            >
              {selectedClub.name.split('').map((letter, index) => (
                <span 
                  key={index} 
                  className="inline-block mr-1"
                  style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicDisplay;