import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Plus, Trophy, Users, Settings, Play, Square, RotateCcw, Home, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface Club {
  id: string;
  name: string;
  logo: string;
}

export interface Tournament {
  name: string;
  format: 'groups' | 'knockout';
  totalClubs: number;
  groups?: number;
  clubsPerGroup?: number;
  clubs: Club[];
}

const AdminPanel = ({ onTournamentUpdate }: { onTournamentUpdate: (tournament: Tournament) => void }) => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament>({
    name: '',
    format: 'groups',
    totalClubs: 16,
    groups: 4,
    clubsPerGroup: 4,
    clubs: []
  });

  const [newClub, setNewClub] = useState({ name: '', logo: '' });
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [drawStatus, setDrawStatus] = useState<'inactive' | 'active' | 'finished'>('inactive');

  useEffect(() => {
    const saved = localStorage.getItem('championship-tournament');
    const savedStatus = localStorage.getItem('championship-draw-status');
    
    if (saved) {
      const parsedTournament = JSON.parse(saved);
      setTournament(parsedTournament);
      onTournamentUpdate(parsedTournament);
    }
    
    if (savedStatus) {
      setDrawStatus(savedStatus as 'inactive' | 'active' | 'finished');
    }
  }, [onTournamentUpdate]);

  const saveTournament = (updatedTournament: Tournament) => {
    localStorage.setItem('championship-tournament', JSON.stringify(updatedTournament));
    setTournament(updatedTournament);
    onTournamentUpdate(updatedTournament);
    toast.success('Configuração salva com sucesso!');
  };

  const handleTournamentChange = (field: string, value: any) => {
    const updated = { ...tournament, [field]: value };
    
    if (field === 'format') {
      if (value === 'knockout') {
        updated.groups = undefined;
        updated.clubsPerGroup = undefined;
      } else {
        updated.groups = 4;
        updated.clubsPerGroup = 4;
        updated.totalClubs = 16;
      }
    }
    
    if (field === 'groups' || field === 'clubsPerGroup') {
      updated.totalClubs = (updated.groups || 1) * (updated.clubsPerGroup || 1);
    }
    
    saveTournament(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewClub({ ...newClub, logo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addClub = () => {
    if (!newClub.name.trim()) {
      toast.error('Nome do clube é obrigatório');
      return;
    }

    if (tournament.clubs.length >= tournament.totalClubs) {
      toast.error(`Máximo de ${tournament.totalClubs} clubes permitido`);
      return;
    }

    const club: Club = {
      id: Date.now().toString(),
      name: newClub.name,
      logo: newClub.logo || `https://ui-avatars.com/api/?name=${newClub.name}&background=3b82f6&color=fff`
    };

    const updated = {
      ...tournament,
      clubs: [...tournament.clubs, club]
    };

    saveTournament(updated);
    setNewClub({ name: '', logo: '' });
    toast.success(`${club.name} adicionado!`);
  };

  const updateClub = () => {
    if (!editingClub || !editingClub.name.trim()) return;

    const updated = {
      ...tournament,
      clubs: tournament.clubs.map(club => 
        club.id === editingClub.id ? editingClub : club
      )
    };

    saveTournament(updated);
    setEditingClub(null);
    toast.success('Clube atualizado!');
  };

  const removeClub = (id: string) => {
    const updated = {
      ...tournament,
      clubs: tournament.clubs.filter(club => club.id !== id)
    };

    saveTournament(updated);
    toast.success('Clube removido!');
  };

  const startDraw = () => {
    if (!tournament.name.trim()) {
      toast.error('Nome do campeonato é obrigatório');
      return;
    }
    if (tournament.clubs.length !== tournament.totalClubs) {
      toast.error(`É necessário cadastrar exatamente ${tournament.totalClubs} clubes para iniciar o sorteio`);
      return;
    }
    
    setDrawStatus('active');
    localStorage.setItem('championship-draw-status', 'active');
    toast.success('Sorteio iniciado! Agora você pode ir para a tela pública.');
  };

  const finishDraw = () => {
    setDrawStatus('finished');
    localStorage.setItem('championship-draw-status', 'finished');
    toast.success('Sorteio finalizado!');
  };

  const restartDraw = () => {
    setDrawStatus('inactive');
    localStorage.setItem('championship-draw-status', 'inactive');
    localStorage.removeItem('championship-groups');
    toast.success('Sorteio reiniciado!');
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
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
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Navigation and Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Button>
          
          <Button
            onClick={() => navigate('/public')}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ver Sorteio Público
          </Button>
        </div>

        <div className="admin-header text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          </div>
          <p className="text-white/90">Configure seu campeonato e gerencie os clubes participantes</p>
          
          {/* Draw Control Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            {drawStatus === 'inactive' && (
              <Button
                onClick={startDraw}
                className="championship-button px-6"
                disabled={tournament.clubs.length !== tournament.totalClubs || !tournament.name.trim()}
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Sorteio
              </Button>
            )}
            
            {drawStatus === 'active' && (
              <div className="flex gap-4">
                <Button
                  onClick={finishDraw}
                  className="championship-button px-6"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Finalizar Sorteio
                </Button>
                <Button
                  onClick={restartDraw}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10 px-6"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
              </div>
            )}
            
            {drawStatus === 'finished' && (
              <Button
                onClick={restartDraw}
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10 px-6"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar Sorteio
              </Button>
            )}
          </div>
          
          {/* Status Indicator */}
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              drawStatus === 'inactive' ? 'bg-gray-500/20 text-gray-300' :
              drawStatus === 'active' ? 'bg-green-500/20 text-green-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              Status: {
                drawStatus === 'inactive' ? 'Inativo' :
                drawStatus === 'active' ? 'Em Andamento' :
                'Finalizado'
              }
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tournament Configuration */}
          <Card className="championship-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-championship-primary" />
                Configuração do Campeonato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="tournament-name">Nome do Campeonato</Label>
                <Input
                  id="tournament-name"
                  value={tournament.name}
                  onChange={(e) => handleTournamentChange('name', e.target.value)}
                  placeholder="Ex: Copa do Mundo 2024"
                  className="mt-1"
                  disabled={drawStatus !== 'inactive'}
                />
              </div>

              <div>
                <Label>Formato</Label>
                <Select
                  value={tournament.format}
                  onValueChange={(value) => handleTournamentChange('format', value)}
                  disabled={drawStatus !== 'inactive'}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groups">Fase de Grupos</SelectItem>
                    <SelectItem value="knockout">Mata-mata</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tournament.format === 'groups' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Número de Grupos</Label>
                      <Input
                        type="number"
                        min={2}
                        max={8}
                        value={tournament.groups}
                        onChange={(e) => handleTournamentChange('groups', parseInt(e.target.value))}
                        className="mt-1"
                        disabled={drawStatus !== 'inactive'}
                      />
                    </div>
                    <div>
                      <Label>Clubes por Grupo</Label>
                      <Input
                        type="number"
                        min={2}
                        max={8}
                        value={tournament.clubsPerGroup}
                        onChange={(e) => handleTournamentChange('clubsPerGroup', parseInt(e.target.value))}
                        className="mt-1"
                        disabled={drawStatus !== 'inactive'}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground bg-championship-subtle p-3 rounded-lg">
                    Total de clubes: {tournament.totalClubs}
                  </div>
                </>
              )}

              {tournament.format === 'knockout' && (
                <div>
                  <Label>Total de Clubes</Label>
                  <Select
                    value={tournament.totalClubs.toString()}
                    onValueChange={(value) => handleTournamentChange('totalClubs', parseInt(value))}
                    disabled={drawStatus !== 'inactive'}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 (Quartas)</SelectItem>
                      <SelectItem value="16">16 (Oitavas)</SelectItem>
                      <SelectItem value="32">32 (Primeira Fase)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Club Management */}
          <Card className="championship-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-championship-primary" />
                Gerenciar Clubes ({tournament.clubs.length}/{tournament.totalClubs})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Nome do Clube</Label>
                  <Input
                    value={editingClub?.name || newClub.name}
                    onChange={(e) => 
                      editingClub 
                        ? setEditingClub({...editingClub, name: e.target.value})
                        : setNewClub({...newClub, name: e.target.value})
                    }
                    placeholder="Nome do clube"
                    className="mt-1"
                    disabled={drawStatus === 'active'}
                  />
                </div>
                <div>
                  <Label>Logo do Clube</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-championship-primary file:text-white hover:file:bg-championship-primary-dark"
                    disabled={drawStatus === 'active'}
                  />
                </div>
                <Button
                  onClick={editingClub ? updateClub : addClub}
                  className="championship-button w-full"
                  disabled={(tournament.clubs.length >= tournament.totalClubs && !editingClub) || drawStatus === 'active'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {editingClub ? 'Atualizar' : 'Adicionar'} Clube
                </Button>
                
                {drawStatus === 'active' && (
                  <p className="text-sm text-yellow-300 text-center">
                    ⚠️ Sorteio em andamento - Edição de clubes bloqueada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clubs List */}
        {tournament.clubs.length > 0 && (
          <Card className="championship-card mt-8">
            <CardHeader>
              <CardTitle>Clubes Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tournament.clubs.map((club) => (
                  <div key={club.id} className="group-card p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{club.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingClub(club)}
                          className="h-8 w-8 p-0"
                          disabled={drawStatus === 'active'}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeClub(club.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          disabled={drawStatus === 'active'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;