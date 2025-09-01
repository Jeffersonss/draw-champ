import { Trophy, Settings, Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/backgrounds/background.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="championship-card mb-12">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="h-16 w-16 text-championship-primary animate-bounce-in" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-championship-primary mb-6">
              Sorteio de Campeonatos
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sistema completo para gerenciar e exibir sorteios de campeonatos de futebol 
              com animações impactantes e interface profissional.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="championship-card group hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Settings className="h-12 w-12 text-championship-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-championship-primary">Painel Administrativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Configure campeonatos, cadastre clubes, defina formatos (grupos ou mata-mata) 
                  e gerencie todo o processo de sorteio.
                </p>
                <a 
                  href="/admin" 
                  className="championship-button inline-flex items-center gap-2 text-decoration-none"
                >
                  Acessar Admin
                  <ArrowRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="championship-card group hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Eye className="h-12 w-12 text-championship-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-championship-primary">Exibição Pública</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Visualize os sorteios com animações espetaculares, perfeito para transmissões 
                  e eventos ao vivo.
                </p>
                <a 
                  href="/public" 
                  className="championship-button inline-flex items-center gap-2 text-decoration-none"
                >
                  Ver Sorteio
                  <ArrowRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="championship-card">
            <h2 className="text-2xl font-bold text-championship-primary mb-6">Funcionalidades</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-championship-primary mb-2">Formatos Flexíveis</h3>
                <p className="text-sm text-muted-foreground">
                  Suporte para fase de grupos e mata-mata com configuração automática das chaves.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-championship-primary mb-2">Animações Épicas</h3>
                <p className="text-sm text-muted-foreground">
                  Efeitos visuais impressionantes usando GSAP para criar momentos emocionantes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-championship-primary mb-2">Interface Intuitiva</h3>
                <p className="text-sm text-muted-foreground">
                  Design responsivo e fácil de usar tanto para administradores quanto para o público.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
