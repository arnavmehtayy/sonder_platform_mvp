import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
import { Minigame } from '@/app/Components/Minigame';
import { experiences } from "@/classes/init_datasets";
import CurvedBackButton from '@/app/Components/BackButton';

export const FeedbackComponent = () => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === '' || emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address or leave it blank.');
      return;
    }

    if (feedback.trim() === '') {
      setErrorMessage('Please provide some feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setFeedback('');
      setEmail('');
      setIsOpen(false);
      // You might want to show a success message here
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return(
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
            Share your feedback or suggest a new topic for our interactive visuals.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your feedback here..."
          className="min-h-[100px]"
        />
        <DialogDescription>
          Optionally, include your email for updates when we incorporate your feedback.
        </DialogDescription>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (optional)"
          className={`mb-4 ${!isValidEmail(email) ? 'border-red-500' : ''}`}
        />
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting || !isValidEmail(email)}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};