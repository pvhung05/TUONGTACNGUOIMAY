import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, history, current_route } = body;

    // Default to localhost:8001 if the env var is not set
    const mlApiBaseUrl = process.env.NEXT_PUBLIC_ML_API_BASE_URL || "http://localhost:8001";
    
    const backendRes = await fetch(`${mlApiBaseUrl}/v1/chatbot/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        history: history || [],
        current_route: current_route || "/"
      }),
    });

    if (!backendRes.ok) {
      console.error("Backend error:", backendRes.status, backendRes.statusText);
      return NextResponse.json(
        { error: "Failed to communicate with AI backend." },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
