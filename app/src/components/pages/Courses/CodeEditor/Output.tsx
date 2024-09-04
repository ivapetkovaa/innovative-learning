/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  checkSqlSyntax,
  compileCode,
  executeCode,
} from "../../../../utils/executeCode";
import styles from "./Output.module.css";
import Loader from "../../../utils/Loader/Loader";
import { useNavigate } from "react-router-dom";

const Output = (props: any) => {
  const { editorRef, selectedLanguage, setResult } = props;

  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      return;
    }
    setLoading(true);
    try {
      if (selectedLanguage !== "sql") {
        if (selectedLanguage === "c" || selectedLanguage === "cpp") {
          const result = await compileCode(selectedLanguage, sourceCode);
          setOutput(result.stderr ? result.stderr : result.output);
        } else {
          const { run: result } = await executeCode(
            selectedLanguage,
            sourceCode
          );
          setOutput(result.stderr ? result.stderr : result.output);
          setResult(result.stderr ? result.stderr : result.output);
        }
      } else {
        const result = checkSqlSyntax(sourceCode);
        setOutput(result);
      }
    } catch (e) {
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${loading && styles.loading}`}>
      {!loading && (
        <button className={styles.btn} onClick={runCode}>
          Run code
        </button>
      )}
      <div className={styles.output}>
        {loading && <Loader width="3vw" height="3vw" text="Compiling..." />}
        <p>{output ? output : 'Click "Run Code" to see the output here'}</p>
      </div>
    </div>
  );
};

export default Output;
