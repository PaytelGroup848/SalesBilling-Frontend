import { useAuth } from '../../context/AuthContext.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { LogOut } from 'lucide-react';

export const Header = (props) => {
  const pageTitle = props.pageTitle || '';
  const { user, logout } = useAuth();
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.name}</span>
          <Badge variant={user.role} />
        </div>
        <Button variant="ghost" onClick={logout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};
