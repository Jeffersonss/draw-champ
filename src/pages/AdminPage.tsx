import React, { useState } from 'react';
import AdminPanel, { Tournament } from '@/components/AdminPanel';

const AdminPage = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);

  return (
    <AdminPanel onTournamentUpdate={setTournament} />
  );
};

export default AdminPage;