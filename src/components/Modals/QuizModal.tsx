import React, { useState } from "react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: any[];
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  questions,
}) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(questions.length).fill("")
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = e.target.value;
    setUserAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    // Implement logic to check answers and update user's progress
    // For simplicity, let's just close the modal for now
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 overflow-y-auto ${
        isOpen ? "visible" : "hidden"
      }`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"></div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quiz
                </h3>
                {currentIndex < questions.length && (
                  <>
                    <p className="text-[#000]">
                      {questions[currentIndex].question}
                    </p>
                    <div className="mt-5 mb-4">
                      <label
                        htmlFor="answer"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Your Answer
                      </label>
                      <input
                        type="text"
                        id="answer"
                        name="answer"
                        value={userAnswers[currentIndex]}
                        onChange={handleAnswerChange}
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={handlePreviousQuestion}
                        className="bg-gray-300 px-3 py-1 rounded-md"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
                {currentIndex === questions.length && (
                  <>
                    <p className="text-[#000]">Congratulations! You have completed the quiz.</p>
                    <button
                      onClick={handleFinishQuiz}
                      className="bg-green-500 text-white px-4 py-2 rounded-md mt-5"
                    >
                      Finish
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
