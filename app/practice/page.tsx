"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Navbar from './Components/Navbar'
import Editor from './Components/Editor'
import Statement from './Components/Statement'
import TestCases from './Components/TestCases'
import Output from './Components/Output'
import AWS from '../aws'
import { basicLight, basicLightInit, basicDark, basicDarkInit } from '@uiw/codemirror-theme-basic';

export default function Practice() {

    const [preferedTheme, setPreferedTheme] = useState(basicLightInit({
        settings: {
          caret: "#000",
          background: "#ecf0f3",
          fontFamily: 'monospace',
        }
      }))
    
      useEffect(() => {
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
        let preferedTheme = userPrefersDark ? basicDarkInit({
          settings: {
            caret: "#fff",
            background: "#0f172a",
            fontFamily: 'monospace',
          }
        }) : basicLightInit({
          settings: {
            caret: "#000",
            background: "#ecf0f3",
            fontFamily: 'monospace',
          }
        });
        setPreferedTheme(preferedTheme);
      }, [])


    const [isMouse1Down, setIsMouse1Down] = useState(false);
    const [isMouse2Down, setIsMouse2Down] = useState(false);
    const [isMouse3Down, setIsMouse3Down] = useState(false);
    const [code, setCode] = useState("");
    const [testCases, setTestCases] = useState([
        [["array", [5, 1, 22, 25, 6, -1, 8, 10]], ["sequence", [1, 6, -1, 10]]],
        [["array", [5, 1, 22, 25, 6, -1, 8, 10]], ["sequence", [5, 1, 22, 25, 6, -1, 8, 10, 12]]],
        [["array", [5, 1, 22, 25, 6, -1, 8, 10]], ["sequence", [5, 1, 22, 25, 6, -1, 8, 10, 12]]],
        [["array", [5, 1, 22, 25, 6, -1, 8, 10]], ["sequence", [5, 1, 22, 25, 6, -1, 8, 10, 12]]],
        [["array", [5, 1, 22, 25, 6, -1, 8, 10]], ["sequence", [5, 1, 22, 25, 6, -1, 8, 10, 12]]]
    ])

    const [output, setOutput] = useState<any>([]);
    const [stdOut, setStdOut] = useState<any>([]);

    useEffect(() => {
        const handleMouseMove = (e : any) => moveVertically(e);
        document.addEventListener('mousemove', handleMouseMove);
      
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
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
        if(!isMouse1Down && !isMouse2Down && !isMouse3Down) return;

        if(isMouse1Down) {
            const containerSize = window.innerWidth;
            const pxValue = e.screenX;
            const percentage = (pxValue / containerSize) * 100;
    
            let leftContainer : any = document.getElementById("left-container");
            let rightContainer : any = document.getElementById("right-container");

            if (percentage > 70) {
                setIsMouse1Down(false);
                return;
            }

            rightContainer.style.width = `calc(100% - ${e.clientX-16}px)`;
            leftContainer.style.width = `${e.clientX-16}px`;
        }

        if(isMouse2Down) {
            const containerHeight: any = document.getElementById("left-container")?.clientHeight;
            const containerWidth: any = document.getElementById("left-container")?.clientWidth;

            let topContainer : any = document.getElementById("left-top-container");
            let bottomContainer : any = document.getElementById("left-bottom-container");
            
            topContainer.style.height = `${e.clientY-58}px`;
            bottomContainer.style.height = `calc(${containerHeight}px - ${topContainer.style.height} - 12px)`;

            if (e.clientX > containerWidth) {
                setIsMouse2Down(false);
            }
        }

        if(isMouse3Down) {
            const containerWidth: any = document.getElementById("right-container")?.clientWidth;
            const containerHeight: any = document.getElementById("right-container")?.clientHeight;

            let topContainer : any = document.getElementById("right-top-container");
            let bottomContainer : any = document.getElementById("right-bottom-container");

            topContainer.style.height = `${e.clientY-58}px`;
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

    async function run() {
        
        for(let i=0;i<testCases.length;i++) {
            const lambda = new AWS.Lambda();

            const params = {
                FunctionName: 'Test',
                Payload: JSON.stringify({ code: code, funcName : 'isValidSubSequence', testCases: testCases[i] }),
            };

            console.log("Hello")
    
            await lambda.invoke(params, (err, data) => {
                if (err) {
                    console.error('Error invoking Lambda function:', err);
                } else {
                    let new_data : any = data.Payload;
                    let res : any = JSON.parse(new_data);
                    let old_output = [...output];
                    old_output.push(JSON.parse(res).result[0].output);
                    setOutput(old_output);
                    let old_stdout = [...stdOut];
                    old_stdout.push(JSON.parse(res).result[0].stdout);
                    setStdOut(old_stdout);
                }
            });
        }
    }

  return (
    <div style={{ backgroundColor: 'var(--background-secondary)' }}  className=' w-full h-screen overflow-hidden text-sm sm:text-md'>
        <Navbar />
        <div style={{ height: "calc(100vh - 40px)", overflow: "hidden" }} onMouseMove={(e) => moveVertically(e)} className=' w-full flex flex-row p-4 '>
            <div style={{minWidth: "30%"}} className='flex w-full h-full flex-col' id='left-container'>
                <div style={{ minHeight: "200px", height: "calc(100% - 112px)" }}  id='left-top-container'>
                    <Statement preferedTheme={preferedTheme} testCases={testCases} />
                </div>
                <div draggable={true} onMouseDown={(e: any) => startHorizontalLeftDrag(e)} onMouseUp={(e : any) => endHorizontalLeftDrag(e)} className=' h-3 w-full text-center justify-center items-center flex cursor-ns-resize dragger'>・・・</div>
                <div style={{ minHeight: "100px", height: "250px" }} id='left-bottom-container'>
                    <TestCases preferedTheme={preferedTheme} testCases={testCases} />
                </div>
            </div>
            <div draggable={true} onMouseDown={(e: any) => startVerticalDrag(e)} onMouseUp={(e : any) => endVerticalDrag(e)} style={{writingMode: "vertical-lr"}} className=' h-full w-3 text-center flex justify-center items-center cursor-ew-resize dragger'>・・・</div>
            <div id='right-container' style={{minWidth: "30%"}} className=' h-full w-full flex flex-col'>
                <div style={{ minHeight: "200px", height: "calc(100% - 112px)" }} id='right-top-container'>
                    <Editor preferedTheme={preferedTheme} testCases={testCases} saveCode={(code : any) => saveCode(code)} />
                </div>
                <div draggable={true} onMouseDown={(e: any) => startHorizontalRightDrag(e)} onMouseUp={(e : any) => endHorizontalRightDrag(e)} className=' h-3 w-full text-center justify-center items-center flex cursor-ns-resize dragger'>・・・</div>
                <div style={{ minHeight: "100px", height:"250px", overflow: "hidden" }} id='right-bottom-container'>
                    <Output stdOut={stdOut} output={output} runCode={() => run()} />
                </div>
            </div>
        </div>
    </div>
  )
}
