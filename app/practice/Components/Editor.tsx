import React, { useEffect, useRef, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript.js';
import { Controlled as CodeMirror } from 'react-codemirror2';

export default function Editor(props : any) {

  const editorRef = useRef<any>(null);

  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = userPrefersDark ? 'material' : 'default';

  const [funcName, setFuncName] = useState("isValidSubSequence");

  const [testCases, setTestCases] = useState([ "array", "sequence"]);

  const [language, setLanguage] = useState("javascript");


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


  const [code, setCode] = useState<string>("");

  const handleChange = (editor: any, data: any, value: string) => {
    setCode(value);
    props.saveCode(value);
  };

  useEffect(() => {
    props.saveCode(code);
  }, [])

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
              onBeforeChange={(editor, data, value) => handleChange(editor, data, value)}
              value={code}
              className='pt-3'
              options={{
                mode: 'javascript',
                theme: theme,
                lineNumbers: true,
                extraKeys: {
                  'Ctrl-Space': 'autocomplete', 
                },
              }}
              autoCursor={true}
              ref={editorRef}
            />
            <div className='p-5' />
          </div>
        </div>
    </div>
  )
}
