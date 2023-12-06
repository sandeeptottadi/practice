import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Audio, Oval } from "react-loader-spinner";

export default function Output(props: {
  preferedTheme: any;
  output: any;
  error: string;
  runCode: () => {};
  expectedOutput: any;
  codeRunning: boolean;
}) {
  return (
    <div
      style={{ backgroundColor: "var(--background-primary)" }}
      className="w-full h-full rounded"
    >
      <div
        style={{ backgroundColor: "var(--background-title)" }}
        className="flex flex-row justify-between shadow-sm"
      >
        <div
          className="p-3 tab"
          style={{ backgroundColor: "var(--background-primary)" }}
        >
          Output
        </div>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => props.runCode()}
            className="bg-blue-500 h-full w-32 p-3 text-white"
          >
            Run
          </button>
          <button className="bg-green-500 h-full w-32 p-3 text-white">
            Submit
          </button>
        </div>
      </div>
      <div
        style={{
          color: "var(--description-color)",
          fontFamily: "Open Sans,Helvetica,Arial,sans-serif",
        }}
        className="p-3 leading-9 w-full h-full overflow-auto max-h-max flex flex-col gap-4"
      >
        <div className=" w-full h-full flex justify-center items-center text-slate-500 text-lg">
          {props.codeRunning ? (
            <Oval
              height={100}
              width={100}
              color="#3b82f6"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#60a5fa"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : (
            <></>
          )}

          {!props.output.length && !props.error && !props.codeRunning ? (
            <h1>Run or Submit the code when you are ready.</h1>
          ) : (
            <></>
          )}
        </div>
        {props.error ? (
          <div className=" p-3 text-red-400">{props.error}</div>
        ) : (
          <>
            {props.output.map((out: any, idx: number) => {
              return (
                <div
                  key={idx}
                  style={{ backgroundColor: "var(--background-title)" }}
                  className=" w-full p-2 pl-4 rounded shadow-sm border border-green-800"
                >
                  <div>
                    <div>
                      <strong>Test Case #{idx + 1}</strong>
                    </div>
                    <div className="output-editor-container">
                      {out[0] ? (
                        <div>
                          <div>Output : </div>
                          <CodeMirror
                            theme={props.preferedTheme}
                            value={out[0]}
                            extensions={[javascript({ jsx: true })]}
                            editable={false}
                            basicSetup={{
                              lineNumbers: false,
                              highlightActiveLine: false,
                              highlightActiveLineGutter: false,
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      {out[1] ? (
                        <div>
                          <div>Stdout : </div>
                          <CodeMirror
                            theme={props.preferedTheme}
                            value={out[1]}
                            extensions={[javascript({ jsx: true })]}
                            editable={false}
                            basicSetup={{
                              lineNumbers: false,
                              highlightActiveLine: false,
                              highlightActiveLineGutter: false,
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div className="p-5"></div>
      </div>
    </div>
  );
}
