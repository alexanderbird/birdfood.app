import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

export function Home() {
  const location = useLocation();
  useEffect(() => {
    location.route('/search');
  }, []);
  return null;
}
