import { redirect } from 'next/navigation';

export default function Home() {
  // Redirection côté serveur vers /auth/signin
  redirect('/auth/signin');
}
