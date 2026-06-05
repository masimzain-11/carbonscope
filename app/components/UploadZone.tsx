'use client'

import { useState, useRef, useCallback } from 'react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  onTrySample: () => void
}

export default function UploadZone({ onFileSelect, onTrySample }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate the file is an IFC and pass it up
  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.ifc')) {
      alert('Please upload an .ifc file (Industry Foundation Classes / BIM)')
      return
    }
    if (file.size > 200 * 1024 * 1024) {
      alert('File too large (max 200 MB). Try a smaller IFC.')
      return
    }
    onFileSelect(file)
  }

  // Drag-and-drop handlers
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Carbon<span className="text-emerald-400">Scope</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Analyze the embodied carbon of any building from its BIM file
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Powered by ICE v3 coefficients · Calculated in your browser
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-12 cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".ifc"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />

          <div className="text-center">
            {/* Icon */}
            <svg
              className={`mx-auto h-14 w-14 mb-4 transition-colors ${isDragging ? 'text-emerald-400' : 'text-slate-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <p className="text-white font-semibold text-lg mb-1">
              {isDragging ? 'Drop your IFC file' : 'Drop your IFC file here'}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Supports IFC2x3 and IFC4 · Files stay in your browser, never uploaded
            </p>
          </div>
        </div>

        {/* Try sample link */}
        <div className="text-center mt-6">
          <button
            onClick={onTrySample}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Or try with a sample concrete building →
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-12">
          Open source · <a href="https://github.com/masimzain-11/carbonscope" className="hover:text-slate-400">GitHub</a>
        </p>
      </div>
    </div>
  )
}