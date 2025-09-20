"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import demo data from JSON
import demoData from "@/data/chat.json";

export default function FlashcardApp() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const nextCard = () => {
    if (currentIndex < selectedTopic.flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r bg-muted p-4">
        <h2 className="text-xl font-bold mb-4">Chat History</h2>
        <ScrollArea className="h-[calc(100vh-100px)] pr-2">
          {demoData.map((topic) => (
            <Card
              key={topic.id}
              className={`mb-2 cursor-pointer transition ${
                selectedTopic?.id === topic.id
                  ? "border-primary bg-primary/10"
                  : "hover:bg-muted-foreground/10"
              }`}
              onClick={() => handleTopicClick(topic)}
            >
              <CardHeader>
                <CardTitle className="text-sm">{topic.topicTitle}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {topic.dateCreated}
                </p>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Flashcard Viewer */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {selectedTopic ? (
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex + (showAnswer ? "-answer" : "-question")}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  className="cursor-pointer shadow-lg"
                  onClick={() => setShowAnswer((prev) => !prev)}
                >
                  <CardContent className="p-8 text-center">
                    <h2 className="text-lg font-bold mb-2">
                      {showAnswer
                        ? selectedTopic.flashcards[currentIndex].answer
                        : selectedTopic.flashcards[currentIndex].question}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {showAnswer
                        ? "Click to view Question"
                        : "Click to view Answer"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={prevCard}
                disabled={currentIndex === 0}
                variant="outline"
              >
                Prev
              </Button>
              <Button
                onClick={nextCard}
                disabled={currentIndex === selectedTopic.flashcards.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-lg">
            Select a chat topic from the sidebar to start reviewing flashcards.
          </p>
        )}
      </div>
    </div>
  );
}
