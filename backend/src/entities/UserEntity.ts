export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  avatar: string | null;
  created_at?: Date;
}
