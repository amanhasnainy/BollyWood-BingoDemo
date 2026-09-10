import { useState } from "react";
import { Star, X, CheckCircle2, MessageSquareHeart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/global/apiClient";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("accessToken");
    const payload = {
      rating,
      message: comment.trim(),
    };

    try {
      await apiClient.post("/api/v1/feedback", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch {
      // Fallback local persistence if offline/unreachable
      try {
        const existing = JSON.parse(localStorage.getItem("bollywood_bingo_feedback") || "[]");
        existing.push({
          id: Date.now(),
          ...payload,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem("bollywood_bingo_feedback", JSON.stringify(existing));
      } catch {
        // ignore
      }
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-bb-border bg-bb-surface p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 rounded-full p-1 text-bb-muted hover:bg-bb-elevated hover:text-bb-text transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bb-success/20 text-bb-success">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-bb-text">Feedback Submitted!</h3>
            <p className="mt-2 text-sm text-bb-muted">
              Thank you for helping us improve Bollywood Bingo. Have fun playing! ⭐
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-6 rounded-full bg-bb-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bb-primary-hover"
            >
              Back to Game
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bb-primary/10 text-bb-primary">
                <MessageSquareHeart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-bb-text">Customer Feedback</h3>
                <p className="text-xs text-bb-muted">Tell us about your bingo experience!</p>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-bb-muted mb-2">
                Rate your Experience
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors",
                        (hoverRating || rating) >= star
                          ? "fill-bb-gold text-bb-gold"
                          : "text-bb-border"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-bb-gold">
                  {hoverRating || rating} / 5
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-bb-muted mb-2">
                Your Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like? Any bugs or feature ideas?"
                rows={4}
                required
                className="w-full rounded-xl border border-bb-border bg-bb-elevated p-3 text-sm text-bb-text placeholder:text-bb-muted focus:border-bb-primary focus:outline-none focus:ring-1 focus:ring-bb-primary"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-bb-border px-4 py-2 text-xs font-semibold text-bb-muted hover:bg-bb-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!comment.trim() || isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-bb-primary px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-bb-primary-hover disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
