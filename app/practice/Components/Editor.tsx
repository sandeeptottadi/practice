import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function Editor(props : any) {

  const [funcName, setFuncName] = useState("isValidSubSequence");

  const [testCases, setTestCases] = useState([ "array", "sequence"]);

  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState<string>("");

  useEffect(() => {
      function makeBoilerTemplete() {
        let template : string = '';
        if(language === "javascript") {
          template += `function ${funcName}(`;
          for(let i=0;i< testCases.length;i++) {
            if(i === testCases.length-1) {
              template += `${testCases[i]}`;
              break;
            }
            template += `${testCases[i]}, `
          }
          template.substring(0, template.length-2);
          template += `) {  \n  // Write your code here \n }`
        }
        setCode(template);
      }
      makeBoilerTemplete();
  }, []);


  useEffect(() => {
    props.saveCode(code);
  }, [code, props])

  return (
    <div style={{ backgroundColor: 'var(--background-primary)' }} className='w-full h-full overflow-hidden'>
        <div style={{ backgroundColor: 'var(--background-title)' }} className='flex flex-row shadow-xl'>
          <div style={{ backgroundColor: 'var(--background-primary)' }} className=' p-3 tab'>Editor</div>
          <div className=' p-3 tab'>Editor</div>
          <div className=' p-3 tab'>Editor</div>
        </div>
        <div className=' overflow-auto w-full h-full'>
          <div style={{color: "var(--description-color)", fontFamily: "Open Sans,Helvetica,Arial,sans-serif"}} className='leading-9 text-xs h-full'>
            <CodeMirror
              theme={props.preferedTheme}    
              value={code}
              extensions={[javascript({ jsx: true })]}
              onChange={(value : any, viewUpdate: any) => {
                setCode(value);
                props.saveCode(value);
              }}
            />
            <div className='p-5' />
          </div>
        </div>
    </div>
  )
}
