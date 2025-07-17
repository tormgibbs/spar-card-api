import type * as grpc from "@grpc/grpc-js";

export interface Card {
	rank: string;
	suit: string;
}

export interface CreateBotRequest {
	name: string;
	aggression: number;
}

export interface CreateBotResponse {
	bot_id: string;
	success: boolean;
	error: string;
}

export interface PlayCardRequest {
	bot_id: string;
	current_trick: Card[];
	hand: Card[];
}

export interface PlayCardResponse {
	played_card?: Card;
	success: boolean;
	error: string;
}

export interface StartGameRequest {
	bot_id: string;
	hand: Card[];
}

export interface StartGameResponse {
	success: boolean;
	error: string;
}

export interface GetBotDecisionRequest {
	bot_id: string;
	current_trick: Card[];
}

export interface GetBotDecisionResponse {
	suggested_card?: Card;
	success: boolean;
	error: string;
}

export interface ResetBotRequest {
	bot_id: string;
}

export interface ResetBotResponse {
	success: boolean;
	error: string;
}

export interface GetBotHandRequest {
	bot_id: string;
}

export interface GetBotHandResponse {
	hand: Card[];
	success: boolean;
	error: string;
}

export interface GameServiceClient extends grpc.Client {
	startGame(
		request: StartGameRequest,
		callback: (
			error: grpc.ServiceError | null,
			response: StartGameResponse,
		) => void,
	): grpc.ClientUnaryCall;

	createBot(
		request: CreateBotRequest,
		callback: (
			error: grpc.ServiceError | null,
			response: CreateBotResponse,
		) => void,
	): grpc.ClientUnaryCall;

	playCard(
		request: PlayCardRequest,
		callback: (
			error: grpc.ServiceError | null,
			response: PlayCardResponse,
		) => void,
	): grpc.ClientUnaryCall;

	getBotDecision(
		request: GetBotDecisionRequest,
		callback: (
			error: grpc.ServiceError | null,
			response: GetBotDecisionResponse,
		) => void,
	): grpc.ClientUnaryCall;

	resetBot(
		request: ResetBotRequest,
		callback: (
			error: grpc.ServiceError | null,
			response: ResetBotResponse,
		) => void,
	): grpc.ClientUnaryCall;

	getBotHand(
		request: GetBotHandRequest,
		callback: (
			error: grpc.ServiceError | null,
			response: GetBotHandResponse,
		) => void,
	): grpc.ClientUnaryCall;
}

export interface GameServiceConstructor {
	new (
		address: string,
		credentials: grpc.ChannelCredentials,
		options?: object,
	): GameServiceClient;
}
