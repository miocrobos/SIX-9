/**
 * Handles the Vercel Blob upload token for PDF files.
 * Called by the client-side uploader via @vercel/blob's `upload()` helper.
 */

import { auth } from "@clerk/nextjs/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "application/pdf",
          // Word
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
          // Excel
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          // Images (cover thumbnails)
          "image/jpeg",
          "image/png",
          "image/webp",
        ],
        maximumSizeInBytes: MAX_FILE_SIZE,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ userId }),
      }),
      onUploadCompleted: async () => {
        // Metadata is persisted by the client after upload completes.
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
