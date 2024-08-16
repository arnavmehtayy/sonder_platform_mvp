import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";

export const FeedbackComponent = () => {
  const [feedback, setFeedback] = useState(""); // to update feedback as its being written by user
  const [email, setEmail] = useState(""); // to update email as its being written by user
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // to set error message in case where feedback is blank

  const isValidEmail = (email: string) => {
    // validating if the email string is a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === "" || emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (feedback.trim() === "") {
      setErrorMessage("Please provide some feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      // send the relevant feedback information inputted by the user to the api to POST into the databse
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, email }),
      });

      if (!response.ok) {
        // if for some reason database is not connected or otherwise throw an error.
        const errorData = await response.json();
        setErrorMessage(
          "Failed to send feedback. Please check your internet connection."
        );
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      // reset the feedback form
      setFeedback("");
      setEmail("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // The UI for the feedback form and popup
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full px-4 py-2 flex items-center space-x-2"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={20} />
          <span> Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> We want to improve for you!</DialogTitle>
          <DialogDescription>
            Share your feedback by answering the following. <br /> <br />

            1) How effective/ineffective was this in teaching Ridge Regression? <br />
2) What features did you like/dislike? and are there any that you thought were missing? <br />
3) What Topics would like to see taught in this format? <br />
4) Would you prefer this medium over traditional teaching methods such as textbooks or video lectures? Why? <br />
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your feedback here..."
          className="min-h-[100px]"
        />
        <DialogDescription>
          Include your email for updates when we incorporate your
          feedback.
        </DialogDescription>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className={`mb-4 ${!isValidEmail(email) ? "border-red-500" : ""}`}
        />
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isValidEmail(email)}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
