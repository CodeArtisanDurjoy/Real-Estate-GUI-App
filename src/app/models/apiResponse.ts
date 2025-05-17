import { Listing } from './listing';
import { User } from './user';

export interface ApiResponse {
  success: boolean;
  user: User;
  message: string;
  listings: Listing[];
}
