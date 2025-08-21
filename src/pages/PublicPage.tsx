import React, { useState, useEffect } from 'react';
import PublicDisplay from '@/components/PublicDisplay';
import { Tournament } from '@/components/AdminPanel';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const PublicPage = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('championship-tournament');
    if (saved) {
      setTournament(JSON.parse(saved));
    }
  }, []);

  if (!tournament || !tournament.name) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('/lovable-uploads/38f26f6c-b0b7-42ef-a08f-ea5521a8588f.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <Card className="championship-card text-center p-8 relative z-10">
          <Trophy className="h-16 w-16 text-championship-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-championship-primary mb-2">
            Nenhum Campeonato Configurado
          </h1>
          <p className="text-muted-foreground mb-6">
            Configure um campeonato no painel administrativo para visualizar o sorteio.
          </p>
          <a 
            href="/admin" 
            className="championship-button inline-block text-center text-decoration-none"
          >
            Ir para Administração
          </a>
        </Card>
      </div>
    );
  }

  return <PublicDisplay tournament={tournament} />;
};

export default PublicPage;