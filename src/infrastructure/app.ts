import express, { type Express } from "express";
import { createLibraryUseCases, type LibraryUseCases } from "./container";
import { createLibraryRoutes } from "./routes/libraryRoutes";

export function createApp(useCases: LibraryUseCases = createLibraryUseCases()): Express {
    const app = express();

    app.disable("x-powered-by");
    app.use(express.json());

    app.get("/health", (_request, response) => {
        response.status(200).json({ status: "ok" });
    });

    app.use(createLibraryRoutes(useCases));

    return app;
}
