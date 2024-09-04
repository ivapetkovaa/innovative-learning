import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Quiz.module.css";
import { BACKEND_API_URL } from "../../../utils/constants";
import Loader from "../../utils/Loader/Loader";

const Quiz = () => {
  const { courseId, resourceId } = useParams();
  const [showFinalResults, setShowFinalResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questions, setQuestions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    const loadQuiz = async () => {
      await fetch(`${BACKEND_API_URL}/courses/quiz/${resourceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setQuestions(data[0]));

      setLoading(false);
    };

    loadQuiz();
  }, []);

  const handleClick = (option: string, answer: string) => {
    if (option === answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowFinalResults(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowFinalResults(false);
  };

  return (
    <>
      {loading ? (
        <Loader width="8vw" />
      ) : (
        <div className={styles.container}>
          <nav className={styles.navigation}>
            <Link to={`/courses/${courseId}`}>Back to Course</Link>
            <h1>Quiz</h1>
            <Link to="/">Home</Link>
          </nav>
          <div className={styles["quiz-body"]}>
            {!showFinalResults && (
              <div className={styles.header}>
                <h3>
                  Question {currentQuestion + 1} out of{" "}
                  {questions.questions.length}
                </h3>
                <h3>Current Score: {score}</h3>
              </div>
            )}
            {!showFinalResults && (
              <div className={styles["quiz-card"]}>
                <h2>{questions.questions[currentQuestion].question}</h2>
                <ul className={styles.ul}>
                  {questions.questions[currentQuestion].options.map(
                    (option: any, i: number) => (
                      <li
                        onClick={() =>
                          handleClick(
                            option,
                            questions.questions[currentQuestion].answer
                          )
                        }
                        key={`${option}-${i}`}
                        className={styles.li}
                      >
                        {option}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {showFinalResults && (
              <div className={styles.final}>
                <h1>Final Result: </h1>
                <h2>
                  {score} out of {questions.questions.length} correct - (
                  {`${(score / questions.questions.length) * 100}%`})
                </h2>
                <button onClick={restartGame}>Try Again?</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
