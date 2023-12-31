"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Components/Navbar";
import Editor from "./Components/Editor";
import Statement from "./Components/Statement";
import TestCases from "./Components/TestCases";
import Output from "./Components/Output";
import AWS from "../aws";
import { githubLight, githubDark } from "@uiw/codemirror-themes-all";
import { set } from "mongoose";

export default function Practice() {
  const [preferedTheme, setPreferedTheme] = useState(githubDark);
  const [codeRunning, setCodeRunning] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setPreferedTheme(githubDark);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setPreferedTheme(githubLight);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function changeTheme(theme: "dark" | "light") {
    if (theme === "dark") {
      setPreferedTheme(githubDark);
    } else {
      setPreferedTheme(githubLight);
    }
  }

  const [isMouse1Down, setIsMouse1Down] = useState(false);
  const [isMouse2Down, setIsMouse2Down] = useState(false);
  const [isMouse3Down, setIsMouse3Down] = useState(false);
  const [code, setCode] = useState("");
  const [testCases, setTestCases] = useState([
    [
      ["array", [5, 1, 22, 25, 6, -1, 8, 10]],
      ["sequence", [1, 6, -1, 10]],
    ],
    [
      ["array", [5, 1, 22, 25, 6, -1, 8, 10]],
      ["sequence", [5, 1, 22, 25, 6, -1, 8, 10]],
    ],
    [
      ["array", [5, 1, 22, 25, 6, -1, 8, 10]],
      ["sequence", [1, 6, 10]],
    ],
  ]);

  const [output, setOutput] = useState<any>([]);
  const [expectedOutput, setExpectedOutput] = useState<any>([
    true,
    true,
    true,
    false,
    false,
    false,
  ]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleMouseMove = (e: any) => moveVertically(e);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMouse1Down, isMouse2Down, isMouse3Down]);

  function startVerticalDrag(e: any) {
    e.preventDefault();
    setIsMouse1Down(true);
  }

  function endVerticalDrag(e: any) {
    e.preventDefault();
    setIsMouse1Down(false);
  }

  function startHorizontalLeftDrag(e: any) {
    e.preventDefault();
    setIsMouse2Down(true);
  }

  function endHorizontalLeftDrag(e: any) {
    e.preventDefault();
    setIsMouse2Down(false);
  }

  function startHorizontalRightDrag(e: any) {
    e.preventDefault();
    setIsMouse3Down(true);
  }

  function endHorizontalRightDrag(e: any) {
    e.preventDefault();
    setIsMouse3Down(false);
  }

  function moveVertically(e: any) {
    e.preventDefault();
    if (!isMouse1Down && !isMouse2Down && !isMouse3Down) return;

    if (isMouse1Down) {
      const containerSize = window.innerWidth;
      const pxValue = e.screenX;
      const percentage = (pxValue / containerSize) * 100;

      let leftContainer: any = document.getElementById("left-container");
      let rightContainer: any = document.getElementById("right-container");

      if (percentage > 70) {
        setIsMouse1Down(false);
        return;
      }

      rightContainer.style.width = `calc(100% - ${e.clientX - 16}px)`;
      leftContainer.style.width = `${e.clientX - 16}px`;
    }

    if (isMouse2Down) {
      const containerHeight: any =
        document.getElementById("left-container")?.clientHeight;
      const containerWidth: any =
        document.getElementById("left-container")?.clientWidth;

      let topContainer: any = document.getElementById("left-top-container");
      let bottomContainer: any = document.getElementById(
        "left-bottom-container"
      );

      topContainer.style.height = `${e.clientY - 58}px`;
      bottomContainer.style.height = `calc(${containerHeight}px - ${topContainer.style.height} - 12px)`;

      if (e.clientX > containerWidth) {
        setIsMouse2Down(false);
      }
    }

    if (isMouse3Down) {
      const containerWidth: any =
        document.getElementById("right-container")?.clientWidth;
      const containerHeight: any =
        document.getElementById("right-container")?.clientHeight;

      let topContainer: any = document.getElementById("right-top-container");
      let bottomContainer: any = document.getElementById(
        "right-bottom-container"
      );

      topContainer.style.height = `${e.clientY - 58}px`;
      bottomContainer.style.height = `calc(${containerHeight}px - ${topContainer.style.height} - 12px)`;

      if (e.clientX > containerWidth) {
        setIsMouse2Down(false);
      }
      return;
    }
  }

  function saveCode(code: any) {
    setCode(code);
  }

  function getOutput(output: string) {
    let lastArrayLines = [];
    let openBracketsCount = 0;

    for (let i = output.length - 1; i >= 0; i--) {
      const line = output[i].trim();
      if (line === "]") {
        openBracketsCount++;
      } else if (line === "[") {
        openBracketsCount--;
        if (openBracketsCount <= 0) {
          lastArrayLines.unshift(line);
          break;
        }
      }

      lastArrayLines.unshift(line);
    }
    return lastArrayLines.join("");
  }

  async function run() {
    setError("");
    setCodeRunning(true);
    setOutput([]);
    let outputArray: any = [];

    function invokeLambda(params: any, index: number) {
      return new Promise((resolve, reject) => {
        const lambda = new AWS.Lambda();

        lambda.invoke(params, (err, data) => {
          if (err) {
            console.error("Error invoking Lambda function:", err);
            reject(err);
          } else {
            let res: any = data.Payload;
            res = JSON.parse(res);

            if (res.stderr) {
              setError(res.stderr);
              reject(res.stderr);
            }
            res = JSON.stringify(res);
            const cleanedResult = res.trim();

            try {
              const parsedOutput = JSON.parse(cleanedResult);
              let output = parsedOutput.split("\n");
              if (output[output.length - 1] === "undefined") {
                outputArray[index] = [
                  "undefined",
                  parsedOutput.replace("undefined", ""),
                ];
              } else {
                let out;
                if (
                  output[output.length - 1] === "]" ||
                  output[output.length - 1] === "}"
                ) {
                  out = getOutput(output);
                } else {
                  out = output[output.length - 1];
                }
                outputArray[index] = [out, parsedOutput];
              }
              resolve(parsedOutput);
            } catch (jsonError) {
              outputArray[index] = [cleanedResult];
              resolve(cleanedResult);
            }
          }
        });
      });
    }

    const lambdaPromises = testCases.map((testCase, index) => {
      const params = {
        FunctionName: "Test",
        Payload: JSON.stringify({
          code: code.replaceAll("'", '"'),
          funcName: "isValidSubSequence",
          testCases: testCase,
        }),
      };
      return invokeLambda(params, index);
    });

    try {
      await Promise.all(lambdaPromises);
      setOutput(outputArray);
      setCodeRunning(false);
    } catch (error) {
      setCodeRunning(false);
      console.error("Error during Lambda invocations:", error);
    }
  }

  return (
    <div
      style={{ backgroundColor: "var(--background-secondary)" }}
      className=" w-full h-screen overflow-hidden text-sm sm:text-md"
    >
      <Navbar changeTheme={(theme) => changeTheme(theme)} />
      <div
        style={{ height: "calc(100vh - 40px)", overflow: "hidden" }}
        onMouseMove={(e) => moveVertically(e)}
        className=" w-full flex flex-row p-4 "
      >
        <div
          style={{ minWidth: "30%" }}
          className="flex w-full h-full flex-col"
          id="left-container"
        >
          <div
            style={{ minHeight: "200px", height: "calc(100% - 112px)" }}
            id="left-top-container"
          >
            <Statement preferedTheme={preferedTheme} testCases={testCases} />
          </div>
          <div
            draggable={true}
            onMouseDown={(e: any) => startHorizontalLeftDrag(e)}
            onMouseUp={(e: any) => endHorizontalLeftDrag(e)}
            className=" h-3 w-full text-center justify-center items-center flex cursor-ns-resize dragger"
          >
            ・・・
          </div>
          <div
            style={{ minHeight: "100px", height: "250px" }}
            id="left-bottom-container"
          >
            <TestCases preferedTheme={preferedTheme} testCases={testCases} />
          </div>
        </div>
        <div
          draggable={true}
          onMouseDown={(e: any) => startVerticalDrag(e)}
          onMouseUp={(e: any) => endVerticalDrag(e)}
          style={{ writingMode: "vertical-lr" }}
          className=" h-full w-3 text-center flex justify-center items-center cursor-ew-resize dragger"
        >
          ・・・
        </div>
        <div
          id="right-container"
          style={{ minWidth: "30%" }}
          className=" h-full w-full flex flex-col"
        >
          <div
            style={{ minHeight: "200px", height: "calc(100% - 112px)" }}
            id="right-top-container"
          >
            <Editor
              preferedTheme={preferedTheme}
              testCases={testCases}
              saveCode={(code: any) => saveCode(code)}
            />
          </div>
          <div
            draggable={true}
            onMouseDown={(e: any) => startHorizontalRightDrag(e)}
            onMouseUp={(e: any) => endHorizontalRightDrag(e)}
            className=" h-3 w-full text-center justify-center items-center flex cursor-ns-resize dragger"
          >
            ・・・
          </div>
          <div
            style={{ minHeight: "100px", height: "250px", overflow: "hidden" }}
            id="right-bottom-container"
          >
            <Output
              codeRunning={codeRunning}
              expectedOutput={expectedOutput}
              error={error}
              preferedTheme={preferedTheme}
              output={output}
              runCode={() => run()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
