import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardStats from "./components/DashboardStats";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen p-6' style={{ backgroundColor: '#110A40' }}>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>Admin Dashboard</h1>
            <p className='text-zinc-400'>Manage your music catalog</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant='outline'
            className='gap-2'
          >
            <Home className='h-4 w-4' />
            Go to Home
          </Button>
        </div>

        <DashboardStats />

        <Tabs defaultValue='songs' className='space-y-6'>
          <TabsList className='bg-zinc-800 border-zinc-700'>
            <TabsTrigger value='songs'>Songs</TabsTrigger>
            <TabsTrigger value='albums'>Albums</TabsTrigger>
          </TabsList>

          <TabsContent value='songs'>
            <SongsTabContent />
          </TabsContent>

          <TabsContent value='albums'>
            <AlbumsTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
