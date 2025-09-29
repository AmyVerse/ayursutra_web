import { authOptions } from "@/lib/auth";
import * as Ably from "ably";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Handle both GET and POST for Ably auth
async function handleAblyAuth(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ayursutraId = searchParams.get("ayursutraId");

    if (!ayursutraId) {
      return NextResponse.json(
        { error: "AyurSutra ID is required" },
        { status: 400 }
      );
    }

    const ablyApiKey = process.env.ABLY_API_KEY;
    if (!ablyApiKey) {
      return NextResponse.json(
        { error: "Ably API key not configured" },
        { status: 500 }
      );
    }

    const ably = new Ably.Rest(ablyApiKey);

    const tokenRequestData = await ably.auth.createTokenRequest({
      clientId: ayursutraId,
      capability: {
        [`notifications:${ayursutraId}`]: ["subscribe"],
        [`appointments:${ayursutraId}`]: ["subscribe"],
      },
    });

    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error("Ably auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleAblyAuth(request);
}

export async function POST(request: NextRequest) {
  return handleAblyAuth(request);
}
