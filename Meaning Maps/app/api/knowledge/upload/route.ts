/**
 * Exact copy of PDF Uploader's /api/upload/route.ts
 * Uses PDF_BLOB_READ_WRITE_TOKEN (private knowledge store).
 */

import { NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { auth } from "@clerk/nextjs/server"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      token:
        process.env.PDF_BLOB_READ_WRITE_TOKEN ||
        process.env.BLOB_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth()

        if (!userId) {
          throw new Error("Unauthorized: User not authenticated")
        }

        return {
          allowedContentTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_FILE_SIZE,
          tokenPayload: JSON.stringify({ userId }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("File uploaded to blob:", blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (e) {
    const message = e instanceof Error ? e.message : "An unknown error occurred"
    const status = message.includes("Unauthorized") ? 401 : 500
    console.error("Upload error", e)
    const clientMessage = status === 401 ? "Unauthorized" : "Upload failed"
    return NextResponse.json({ error: clientMessage }, { status })
  }
}
