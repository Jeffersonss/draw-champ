import React, { useState, useEffect } from 'react';
import PublicDisplay from '@/components/PublicDisplay';
import { Tournament } from '@/components/AdminPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublicPage = () => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    // Carregar dados iniciais
    const loadTournament = () => {
      const saved = localStorage.getItem('championship-tournament');
      if (saved) {
        setTournament(JSON.parse(saved));
      }
    };

    // Carregar dados iniciais
    loadTournament();

    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'championship-tournament' && e.newValue) {
        setTournament(JSON.parse(e.newValue));
      }
    };

    // Adicionar listener para o evento customizado de atualização
    const handleTournamentUpdate = () => {
      loadTournament();
    };

    // Adicionar listeners para atualizações em tempo real
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tournamentUpdate', handleTournamentUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tournamentUpdate', handleTournamentUpdate);
    };
  }, []);

  if (!tournament || !tournament.name) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* <div className="relative z-10 max-w-6xl mx-auto">
          { <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="text-blue-800 border-blue-400 hover:bg-blue-400/10"
            >
              <Home className="h-4 w-4 mr-2" />
              Página Inicial
            </Button>
          </div> }
        </div> */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('/backgrounds/background.webp')`,
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

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/backgrounds/background.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="text-blue-800 border-blue-400 hover:bg-blue-400/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Button>
        </div>
        <PublicDisplay tournament={tournament} />
      </div>
    </div>
  );
};

export default PublicPage;