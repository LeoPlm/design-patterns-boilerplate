import { Router, type Response } from "express";
import { parseBookCopyId, parseMemberId } from "../../domains/entities";
import type { LibraryUseCases } from "../container";

/** Réponse d'erreur uniforme : { error: { code, ... } }. */
function sendError(response: Response, status: number, body: Record<string, unknown>): void {
    response.status(status).json({ error: body });
}

/** Lit un champ string du corps JSON ; renvoie undefined si absent ou d'un autre type. */
function readString(body: unknown, key: string): string | undefined {
    if (typeof body !== "object" || body === null) return undefined;
    const value = (body as Record<string, unknown>)[key];
    return typeof value === "string" ? value : undefined;
}

/**
 * POST /members          { lastName, firstName, email }  -> 201 Member
 * POST /loans            { memberId, copyId }            -> 201 ActiveLoan
 * POST /returns          { copyId }                      -> 200 ClosedLoan
 */
export function createLibraryRoutes(useCases: LibraryUseCases): Router {
    const router = Router();

    router.post("/members", async (request, response) => {
        const result = await useCases.registerMember({
            lastName: readString(request.body, "lastName") ?? "",
            firstName: readString(request.body, "firstName") ?? "",
            email: readString(request.body, "email") ?? "",
        });

        if (result.ok) {
            response.status(201).json(result.value);
            return;
        }

        switch (result.error.code) {
            case "INVALID_INPUT":
                sendError(response, 400, { code: result.error.code, field: result.error.field });
                return;
            case "EMAIL_ALREADY_REGISTERED":
                sendError(response, 409, { code: result.error.code, email: result.error.email });
                return;
        }
    });

    router.post("/loans", async (request, response) => {
        const memberId = parseMemberId(readString(request.body, "memberId") ?? "");
        const copyId = parseBookCopyId(readString(request.body, "copyId") ?? "");
        if (memberId === undefined || copyId === undefined) {
            sendError(response, 400, { code: "INVALID_INPUT" });
            return;
        }

        const result = await useCases.borrowBook({ memberId, copyId });

        if (result.ok) {
            response.status(201).json(result.value);
            return;
        }

        switch (result.error.code) {
            case "MEMBER_NOT_FOUND":
            case "COPY_NOT_FOUND":
                sendError(response, 404, result.error);
                return;
            case "LOAN_LIMIT_REACHED":
            case "COPY_NOT_AVAILABLE":
                sendError(response, 409, result.error);
                return;
        }
    });

    router.post("/returns", async (request, response) => {
        const copyId = parseBookCopyId(readString(request.body, "copyId") ?? "");
        if (copyId === undefined) {
            sendError(response, 400, { code: "INVALID_INPUT" });
            return;
        }

        const result = await useCases.returnBook({ copyId });

        if (result.ok) {
            response.status(200).json(result.value);
            return;
        }

        switch (result.error.code) {
            case "NO_ACTIVE_LOAN":
                sendError(response, 404, result.error);
                return;
            case "COPY_NOT_FOUND":
                // Incohérence de données : un emprunt existe pour un exemplaire inconnu.
                sendError(response, 500, result.error);
                return;
        }
    });

    return router;
}
