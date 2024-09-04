/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "node-sql-parser";
import { BACKEND_API_URL, SUPPORTED_LANGUAGES } from "./constants";

const API = "https://emkc.org/api/v2/piston/execute";
const JDoodleClientID = "b3d068d88a066df54398f33f8f4de31d";
const JDoodleClientSecret =
  "83c6d11555325793e595e973f9f5623bc94fe8552e4b6f931d7eef0549988f2";

export function checkSqlSyntax(query: string): string {
  const parser = new Parser();

  try {
    // Parse the SQL query
    parser.astify(query);
    return "SQL query is syntactically correct!";
  } catch (error: any) {
    return `SQL query has syntax errors: ${error.message}`;
  }
}

export const compileCode = async (language: any, code: any) => {
  const proxyUrl = `${BACKEND_API_URL}/compileCode`;
  const payload = {
    script: code,
    language: language,
    versionIndex: "0", // Specify the version of the language
    clientId: JDoodleClientID,
    clientSecret: JDoodleClientSecret,
  };
  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response.json();
  } catch (error) {
    console.error("Error during compilation:", error);
    return { error: "An error occurred during compilation." };
  }
};

export const executeCode = async (language: any, sourceCode: any) => {
  const data = {
    language: language,
    version: SUPPORTED_LANGUAGES[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  };
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};
