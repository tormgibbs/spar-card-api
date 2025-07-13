# type: ignore
import grpc
from concurrent import futures
import game_pb2
import game_pb2_grpc
from sparbot import SparBot
import uuid

# Store multiple bots
bots = {}

class GameServiceServicer(game_pb2_grpc.GameServiceServicer):
	def CreateBot(self, request, context):
		try:
			bot_id = str(uuid.uuid4())
			bot = SparBot(name=request.name, aggression=request.aggression)
			bots[bot_id] = bot
			return game_pb2.CreateBotResponse(bot_id=bot_id, success=True, error="")
		except Exception as e:
			return game_pb2.CreateBotResponse(bot_id="", success=False, error=str(e))

	def StartGame(self, request, context):
		bot = bots.get(request.bot_id)
		if not bot:
			return game_pb2.StartGameResponse(success=False, error="Bot not found")
		try:
			cards = [(card.rank, card.suit) for card in request.hand]
			bot.receive_hand(cards)
			return game_pb2.StartGameResponse(success=True, error="")
		except Exception as e:
			return game_pb2.StartGameResponse(success=False, error=str(e))

	def PlayCard(self, request, context):
		bot = bots.get(request.bot_id)
		if not bot:
			return game_pb2.PlayCardResponse(success=False, error="Bot not found")

		try:
			current_trick = [(card.rank, card.suit) for card in request.current_trick]
			hand = [(card.rank, card.suit) for card in request.hand]
			bot.hand = hand  # Make sure to update the hand
			card = bot.play_card(current_trick)
			return game_pb2.PlayCardResponse(
					played_card=game_pb2.Card(rank=card[0], suit=card[1]),
					success=True,
					error=""
			)
		except Exception as e:
			return game_pb2.PlayCardResponse(success=False, error=str(e))

	def GetBotDecision(self, request, context):
		bot = bots.get(request.bot_id)
		if not bot:
			return game_pb2.GetBotDecisionResponse(success=False, error="Bot not found")

		try:
			current_trick = [(card.rank, card.suit) for card in request.current_trick]
			card = bot.play_card(current_trick)  # This might alter state — use with caution
			return game_pb2.GetBotDecisionResponse(
				suggested_card=game_pb2.Card(rank=card[0], suit=card[1]),
				success=True,
				error=""
			)
		except Exception as e:
			return game_pb2.GetBotDecisionResponse(success=False, error=str(e))

	def ResetBot(self, request, context):
		bot = bots.get(request.bot_id)
		if not bot:
			return game_pb2.ResetBotResponse(success=False, error="Bot not found")
		try:
			bot.reset_for_new_game()
			return game_pb2.ResetBotResponse(success=True, error="")
		except Exception as e:
			return game_pb2.ResetBotResponse(success=False, error=str(e))

	def GetBotHand(self, request, context):
		bot = bots.get(request.bot_id)
		if not bot:
			return game_pb2.GetBotHandResponse(success=False, error="Bot not found")
		try:
			hand = [game_pb2.Card(rank=card[0], suit=card[1]) for card in bot.hand]
			return game_pb2.GetBotHandResponse(hand=hand, success=True, error="")
		except Exception as e:
			return game_pb2.GetBotHandResponse(success=False, error=str(e))


def serve():
	server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
	game_pb2_grpc.add_GameServiceServicer_to_server(GameServiceServicer(), server)
	server.add_insecure_port('[::]:50051')
	print("gRPC bot server running on port 50051...")
	server.start()
	server.wait_for_termination()

if __name__ == "__main__":
	serve()
