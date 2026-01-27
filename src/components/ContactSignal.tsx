/**
 * ContactSignal.tsx
 *
 * Signal-verification contact form
 * - Animated waveform slider ("Apply filter")
 * - Threshold-based transmission unlock
 * - Copy email template to clipboard
 * - Keyboard accessible, reduced-motion safe
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Send, Check } from "lucide-react";
import { Reveal } from "./Reveal";

export default function ContactSignal() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [filterValue, setFilterValue] = useState(0);
  const [copied, setCopied] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const CONTACT_EMAIL = "ethan.f07w@gmail.com";

  // Convert filterValue (0-100) to alpha (-1 to 1)
  const alpha = (filterValue / 100) * 2 - 1;
  
  // Verify if alpha is in valid range [0.3, 0.5]
  const isVerified = alpha >= 0.3 && alpha <= 0.5;

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Draw waveform signal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get proper canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width || 500;
    const displayHeight = rect.height || 120;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    const centerY = displayHeight / 2;

    const draw = () => {
      // Clear
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      const amplitude = (displayHeight / 3) * (filterValue / 100 * 0.7 + 0.4);
      const frequency = 2.5 + filterValue / 100 * 3;
      const coherence = filterValue / 100;

      // Draw subtle background grid
      ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < displayWidth; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, centerY - displayHeight / 3);
        ctx.lineTo(x, centerY + displayHeight / 3);
        ctx.stroke();
      }

      // Draw noise (chaotic red signal with VARIABLE WAVELENGTH)
      if (coherence < 1) {
        ctx.strokeStyle = `rgba(220, 60, 60, 0.95)`;
        ctx.lineWidth = 3;
        ctx.beginPath();

        // Noise wavelength: at 0% filter (coherence=0), wavelength is LONG (visible large waves)
        // At 100% filter (coherence=1), wavelength becomes SHORT (fine noise)
        const noiseWavelength = 80 + (1 - coherence) * 120; // Range from 80 to 200 pixels
        const noiseFrequency = (2 * Math.PI) / noiseWavelength;

        for (let x = 0; x < displayWidth; x += 1) {
          // Generate noise with frequency that changes based on filter
          const noise = Math.sin(x * noiseFrequency + Math.random() * 0.5) * 
                       (1 - coherence) * amplitude * 2.2;
          const y = centerY + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw coherent signal (clean blue sine wave)
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.5 + coherence * 0.5})`;
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let x = 0; x < displayWidth; x += 1) {
        const signal = Math.sin((x / displayWidth) * frequency * Math.PI * 2);
        const y = centerY - signal * amplitude * coherence;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw center reference line
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(displayWidth, centerY);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion) {
      draw();
    } else {
      // Static reduced-motion display
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < displayWidth; x += 5) {
        const y =
          centerY - Math.sin((x / displayWidth) * Math.PI * 3) * (displayHeight / 4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [filterValue, prefersReducedMotion]);

  // Auto-verify if reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      setFilterValue(100);
    }
  }, [prefersReducedMotion]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!isVerified) return;
    if (!message.trim()) {
      alert("Please enter a message before sending.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || "no-email@example.com",
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTemplateCopied(true);
        setTimeout(() => setTemplateCopied(false), 3000);

        // Clear form
        setMessage("");
        setEmail("");
        setFilterValue(0);
      } else {
        alert(data.error || "Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Reveal>
      <section id="contact" className="py-20">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Verify & Connect
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Adjust the filter to verify you are human, then send your message
            </p>
          </div>

          {/* Contact Card */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Your Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message here..."
                rows={5}
                className="w-full px-4 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
              />
            </div>

            {/* Signal Canvas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Apply Filter
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-700 dark:text-zinc-300">
                    α = {alpha.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      isVerified
                        ? "text-green-600 dark:text-green-400"
                        : "text-zinc-500 dark:text-zinc-500"
                    }`}
                  >
                    {isVerified ? "✓ Human Verified" : "Adjust to verify"}
                  </span>
                </div>
              </div>

              {/* Waveform Display - properly sized canvas */}
              <div className="w-full bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700 overflow-hidden mb-4" style={{ height: "120px" }}>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block"
                  style={{ display: "block", width: "100%", height: "100%" }}
                  role="img"
                  aria-label="Signal waveform visualization"
                />
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={filterValue}
                onChange={(e) => {
                  const newValue = parseInt(e.currentTarget.value);
                  setFilterValue(newValue);
                }}
                disabled={isVerified && !prefersReducedMotion}
                className="w-full cursor-pointer accent-zinc-900 dark:accent-zinc-100 disabled:cursor-default disabled:opacity-50"
                aria-label="Signal filter slider"
              />
              {/* Alpha range caption */}
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-500 font-mono">
                <span>α ∈ [-1, 1]</span>
                <span>Valid: α ∈ [0.3, 0.5]</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <button
                onClick={handleSendEmail}
                disabled={!isVerified || isSending}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded font-medium transition-all ${
                  isVerified && !isSending
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-offset-zinc-900"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
                }`}
              >
                {templateCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : isSending ? (
                  <>
                    <Send className="w-4 h-4 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              <button
                onClick={handleCopyEmail}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                aria-label="Copy email address to clipboard"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Email Copied!" : "Copy Email"}
              </button>
            </div>
          </div>

          {/* Info */}
          <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
            Direct email: {CONTACT_EMAIL}
          </p>
        </div>
      </section>
    </Reveal>
  );
}
