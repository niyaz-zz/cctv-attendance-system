"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, RotateCcw, Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface FaceRegistrationProps {
  existingFaceData?: string
  existingAvatar?: string
  onFaceRegistered: (faceData: string, avatar: string) => void
}

export function FaceRegistration({ existingFaceData, existingAvatar, onFaceRegistered }: FaceRegistrationProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(existingAvatar || null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>("")
  const [isSaved, setIsSaved] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setError("")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCapturing(true)
    } catch (err) {
      setError("Unable to access camera. Please check permissions and try again.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }, [stopCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setCapturedImage(result)
        }
        reader.readAsDataURL(file)
      } else {
        setError("Please select a valid image file.")
      }
    }
  }, [])

  const handleSave = useCallback(() => {
    if (capturedImage) {
      // In a real application, you would process the image for face recognition here
      // For now, we'll just save the image data
      onFaceRegistered(capturedImage, capturedImage)
      setIsSaved(true)
      setError("")
      setTimeout(() => setIsSaved(false), 3000)
    }
  }, [capturedImage, onFaceRegistered])

  const handleRemove = useCallback(() => {
    setCapturedImage(null)
    onFaceRegistered("", "")
    setIsSaved(false)
    setError("")
  }, [onFaceRegistered])

  const handleReset = useCallback(() => {
    setCapturedImage(null)
    stopCamera()
    setError("")
    setIsSaved(false)
  }, [stopCamera])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Face Registration
          </CardTitle>
          <CardDescription>
            Capture or upload a photo for facial recognition. Ensure the face is clearly visible and well-lit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Camera View */}
          {isCapturing && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play()
                    }
                  }}
                />
                <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-full"></div>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={capturePhoto} size="lg">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Captured/Uploaded Image */}
          {capturedImage && !isCapturing && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={capturedImage || "/placeholder.svg"} alt="Captured face" />
                  <AvatarFallback>Face</AvatarFallback>
                </Avatar>
              </div>
              {isSaved && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Face data saved successfully! You can now save the employee details.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex gap-2 justify-center">
                {!isSaved ? (
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                    <Check className="mr-2 h-4 w-4" />
                    Save Face Data
                  </Button>
                ) : (
                  <Button onClick={handleRemove} variant="destructive">
                    <X className="mr-2 h-4 w-4" />
                    Remove Face Data
                  </Button>
                )}
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isCapturing && !capturedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={startCamera} variant="outline" className="h-24 flex-col bg-transparent">
                <Camera className="h-8 w-8 mb-2" />
                <span>Use Camera</span>
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="h-24 flex-col">
                <Upload className="h-8 w-8 mb-2" />
                <span>Upload Photo</span>
              </Button>
            </div>
          )}

          {/* Existing Face Data */}
          {existingFaceData && !capturedImage && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Current registered face:</p>
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={existingFaceData || "/placeholder.svg"} alt="Registered face" />
                  <AvatarFallback>Face</AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}
