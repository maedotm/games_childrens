export interface Game {
  id: number;
  name: string;
  description: string;
  price: number;
  color: string;
  image: string;
}

export interface CartItem {
  game: Game;
  quantity: number;
}
