import path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = path.join(__dirname, "../../../shared/proto/game.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const gameProto = grpc.loadPackageDefinition(packageDefinition).game as any;

const botClient = new gameProto.GameService(
	"bot-server:50051",
	grpc.credentials.createInsecure(),
);

export default botClient;
