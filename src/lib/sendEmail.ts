// Client helper — posts to the serverless Gmail mailer (/api/send-email).
// The Gmail app password lives ONLY on the server, never in the browser bundle.
export type EmailType = "contact" | "visitor" | "otp";

export async function sendEmail(type: EmailType, payload: Record<string, any>): Promise<void> {
    const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
    });

    if (!res.ok) {
        let message = "Failed to send email";
        try {
            const data = await res.json();
            message = data?.error || message;
        } catch {
            /* ignore */
        }
        throw new Error(message);
    }
}
