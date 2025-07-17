import path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import type { GameServiceConstructor } from "@/types/game";

const PROTO_PATH = path.join(
  import.meta.dirname,
  "../../../shared/proto/game.proto",
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

interface GameProtoPackage {
  game: {
    GameService: GameServiceConstructor;
  };
}

const gameProto = grpc.loadPackageDefinition(packageDefinition) as unknown as GameProtoPackage;

const GRPC_HOST = process.env.GRPC_HOST || "localhost:50051"

const botClient = new gameProto.game.GameService(
  GRPC_HOST,
  grpc.credentials.createInsecure(),
);

export default botClient;
