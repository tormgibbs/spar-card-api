import random
from typing import List, Tuple, Optional

class SparBot:
	FINAL_TRICK = 5
	CARD_ORDER = ['K', 'Q', 'J', '10', '9', '8', '7', '6']
	SUITS = ['hearts', 'diamonds', 'clubs', 'spades']

	def __init__(
		self, 
		name: str, 
		aggression: float = 0.5, 
	):
		if not isinstance(aggression, (int, float)):
			raise TypeError(f"Aggression must be a number, got {type(aggression).__name__}")
		
		if not (0 <= aggression <= 1):
			raise ValueError(f"Aggression must be between 0 and 1 (inclusive), got {aggression}")

		self.name = name
		self.aggression = aggression

		self.hand: List[Tuple[str, str]] = []
		self.tricks_played: List[List[Tuple[str, str]]] = []
		self.my_plays: List[Tuple[str, str]] = []
		self.current_trick: List[Tuple[str, str]] = []
		self.seen_cards: List[Tuple[str, str]] = []

		self.num_opponents = 0
		self.current_trick_number = 0
		self.position_in_trick = 0

	def receive_hand(self, cards: List[Tuple[str, str]]):
		if not cards:
			raise ValueError("Cannot receive an empty hand")
		
		for card in cards:
			if not isinstance(card, tuple) or len(card) != 2:
				raise ValueError(f"Invalid card format: {card}. Expected (rank, suit)")
			if card[0] not in self.CARD_ORDER:
				raise ValueError(f"Invalid card rank: {card[0]}")
			if card[1] not in self.SUITS:
				raise ValueError(f"Invalid card suit: {card[1]}")
			
		self.hand = cards.copy()

	def start_new_trick(self):
		if self.current_trick:
			self.tricks_played.append(self.current_trick.copy())
			self.seen_cards.extend(self.current_trick)
		self.current_trick = []
		self.current_trick_number += 1
		self.position_in_trick = 0
	
	def play_card(self, trick: List[Tuple[str, str]]) -> Tuple[str, str]:
		if not self.hand:
			raise ValueError("Cannot play a card when hand is empty")
		
		if not trick and self.current_trick:
			self.start_new_trick()
		
		self.current_trick = trick.copy()
		self.position_in_trick = len(trick)

		if self.current_trick_number == 0:
			self.current_trick_number = 1

		
		if len(trick) == 0:
			card = self._lead_card()
		else:
			lead_suit = trick[0][1]
			legal_cards = self._get_legal_cards(lead_suit)
			if legal_cards:
				card = self._follow_card(lead_suit)
			else:
				card = self._get_lowest_card()
		
		if card in self.hand:
			self.hand.remove(card)
			self.my_plays.append(card)
		else:
			raise ValueError(f"Attempted to play card not in hand: {card}")
		
		return card
		
	def _lead_card(self) -> Tuple[str, str]:
		if self.current_trick_number < self.FINAL_TRICK:
			if self.aggression >= 0.7:
				return max(self.hand, key=self._card_rank)
			elif self.aggression <= 0.3:
				return self._get_lowest_card()
			else:
				sorted_hand = sorted(self.hand, key=self._card_rank)
				return sorted_hand[len(sorted_hand) // 2]
		else:
			return self._get_best_winning_card()
		
	def _follow_card(self, lead_suit:str) -> Tuple[str, str]:
		legal_cards = self._get_legal_cards(lead_suit)
		if not legal_cards:
			return self._get_lowest_card()

		same_suit_in_trick = [card for card in self.current_trick if card[1] == lead_suit]
		if not same_suit_in_trick:
			return min(legal_cards, key=self._card_rank)

		highest_played = max(same_suit_in_trick, key=self._card_rank)
		beatable_cards = [card for card in legal_cards if self._card_rank(card) < self._card_rank(highest_played)]
		
		if beatable_cards:
			best = max(beatable_cards, key=self._card_rank)
			if self._has_highest_remaining_card(best[1], best[0]):
				return best
		
		return min(legal_cards, key=self._card_rank)
	
	def _get_legal_cards(self, lead_suit: str) -> List[Tuple[str, str]]:
		return [card for card in self.hand if card[1] == lead_suit]
		
	def _get_lowest_card(self) -> Tuple[str, str]:
		return min(self.hand, key=self._card_rank)
	
	def _get_best_winning_card(self, legal_cards: Optional[List[Tuple[str, str]]] = None) -> Tuple[str, str]:
		if legal_cards is None:
			legal_cards = self.hand.copy()
		
		if not legal_cards:
			raise ValueError("No legal cards available")
		
		sorted_cards = sorted(legal_cards, key=self._card_rank, reverse=True)

		for card in sorted_cards:
			if card[0] in {'6', '7'}:
				return card
			
		return max(legal_cards, key=self._card_rank)
	
	def _card_rank(self, card: Tuple[str, str]) -> int:
		try:
			return self.CARD_ORDER.index(card[0])
		except ValueError:
			raise ValueError(f"Unknown card rank: {card[0]}")
	
	def reset_for_new_game(self) -> None:
		self.hand = []
		self.seen_cards = []
		self.tricks_played = []
		self.my_plays = []
		self.current_trick = []
		self.current_trick_number = 0

	def _get_remaining_suits(self) -> dict:
		seen = set(self.seen_cards + self.my_plays)
		all_cards = {(rank, suit) for rank in self.CARD_ORDER for suit in self.SUITS}
		remaining = all_cards - seen
		suit_counts = {suit: 0 for suit in self.SUITS}
		for _, suit in remaining:
			suit_counts[suit] += 1
		return suit_counts
	
	def _has_highest_remaining_card(self, suit: str, rank: str) -> bool:
		rank_idx = self.CARD_ORDER.index(rank)
		higher_ranks = self.CARD_ORDER[:rank_idx]
		for r in higher_ranks:
			if (r, suit) not in self.seen_cards:
				return False
		return True

	@classmethod
	def build_deck(cls, shuffle: bool = True) -> List[Tuple[str, str]]:
		deck = []
		for suit in cls.SUITS:
			for rank in cls.CARD_ORDER:
				deck.append((rank, suit))
		
		if shuffle:
			random.shuffle(deck)
		
		return deck
	
	@classmethod
	def deal_hands(cls, num_players: int, cards_per_hand: int = 5) -> List[List[Tuple[str, str]]]:
		deck = cls.build_deck(shuffle=True)
		total_cards_needed = num_players * cards_per_hand

		if total_cards_needed > len(deck):
			raise ValueError(f"Not enough cards in deck. Need {total_cards_needed}, have {len(deck)}")
		
		hands = []
		for i in range(num_players):
			start_idx = i * cards_per_hand
			end_idx = start_idx + cards_per_hand
			hands.append(deck[start_idx:end_idx])

		return hands
	