import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    // Verify the token (optional, but good practice since this is a destructive/expensive action)
    // For now, we assume the admin page handles auth and passes a valid token.

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        return NextResponse.json({ error: "Supabase credentials not found in environment." }, { status: 500 });
    }

    // The script is in the parent directory's /scripts folder
    // Workspace: c:\Users\user\Desktop\ALLWORKS\carlink\carlinkimport
    // Script: c:\Users\user\Desktop\ALLWORKS\carlink\scripts\scrape_autopia.py
    const scriptPath = path.resolve(process.cwd(), "..", "scripts", "scrape_autopia.py");

    return new Promise((resolve) => {
        console.log(`Starting scraper: python ${scriptPath}`);

        const scraperProcess = spawn("python", [scriptPath], {
            env: {
                ...process.env,
                SUPABASE_URL: supabaseUrl,
                SUPABASE_SERVICE_KEY: serviceKey,
            },
        });

        let stdout = "";
        let stderr = "";

        scraperProcess.stdout.on("data", (data: Buffer) => {
            stdout += data.toString();
        });

        scraperProcess.stderr.on("data", (data: Buffer) => {
            stderr += data.toString();
        });

        scraperProcess.on("close", (code: number) => {
            if (code === 0) {
                resolve(NextResponse.json({ message: "Scraping completed successfully.", output: stdout }));
            } else {
                resolve(
                    NextResponse.json(
                        { error: "Scraping failed.", code, output: stdout, stderr },
                        { status: 500 }
                    )
                );
            }
        });

        // Timeout after 10 minutes to prevent hanging
        const timeout = setTimeout(() => {
            scraperProcess.kill();
            resolve(NextResponse.json({ error: "Scraping timed out." }, { status: 504 }));
        }, 600000);

        // Clear timeout if process finishes
        scraperProcess.on("close", () => clearTimeout(timeout));
    });
}
