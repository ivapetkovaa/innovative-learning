/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Selector from "../../../utils/Selector/Selector";

import styles from "./CodeEditor.module.css";
import {
  BACKEND_API_URL,
  CODE_SNIPPETS,
  SUPPORTED_LANGUAGES,
} from "../../../../utils/constants";
import Output from "./Output";
import { useNavigate, useParams } from "react-router-dom";

import WrongIcon from "../../../assets/wrong.svg";
import CodeIcon from "../../../assets/code.svg";
import TickIcon from "../../../assets/tick.svg";

const languageOptions = Object.entries(SUPPORTED_LANGUAGES);

const CodeEditor = () => {
  const [task, setTask] = useState<any>({});
  const { taskID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/courses/task/${taskID}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setTask(data);
      } catch (error) {
        navigate("/error");
      }
    };

    loadTask();
  }, []);

  const [code, setCode] = useState<string | undefined>("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("javascript");

  const [result, setResult] = useState<string | undefined>(undefined);
  const editorRef = useRef();

  const applyRef = (editor: any) => {
    editorRef.current = editor;
    return editor.focus();
  };

  const onSelect = (language: string) => {
    setSelectedLanguage(language);
    setCode(CODE_SNIPPETS[language]);
  };

  const check =
    result === undefined || task?.expected === undefined
      ? CodeIcon
      : result?.trim() === task.expected.trim()
      ? TickIcon
      : WrongIcon;
  const getFormat = (string: string) => {
    if (string) {
      return string.replace(/], "/g, "],\n");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.task}>
        <h2 className={styles.header}>{task.title}</h2>
        <p className={styles.description}>{task.description}</p>
        <div className={styles.expected}>
          <div className={styles.input}>
            <p className={styles["text-input"]}>Input: </p>
            <pre className={styles["expected-input"]}>
              {getFormat(task.input)}
            </pre>
          </div>
          <div className={styles.out}>
            <p className={styles["text-output"]}>Expected output: </p>
            <pre className={styles["expected-output"]}>
              {getFormat(task.expected)}
            </pre>
          </div>
        </div>
      </div>
      <div className={styles["editor-container"]}>
        <div className={styles.editor}>
          <Selector
            options={languageOptions}
            selected={selectedLanguage}
            onSelect={onSelect}
          />
          <Editor
            theme="vs-dark"
            height="70vh"
            width="40vw"
            language={selectedLanguage}
            defaultValue={CODE_SNIPPETS[selectedLanguage]}
            value={code}
            onChange={(value: string | undefined) => setCode(value)}
            onMount={applyRef}
          />
          ;
        </div>
        <div className={styles.output}>
          <Output
            editorRef={editorRef}
            selectedLanguage={selectedLanguage}
            setResult={setResult}
          />
          <div className={styles.tests}>
            <div className={styles.img}>
              <img src={check} />
            </div>
            <div className={styles.img}>
              <img src={check} />
            </div>
            <div className={styles.img}>
              <img src={check} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
