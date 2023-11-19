import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function Output(props: any) {
  return (
    <div style={{ backgroundColor: 'var(--background-primary)' }} className='w-full h-full rounded'>
      <div style={{ backgroundColor: 'var(--background-title)' }} className='flex flex-row justify-between shadow-xl'>
        <div className='p-3 tab'>Output</div>
        <div className='flex flex-row gap-4'>
          <button onClick={() => props.runCode()} className='bg-blue-500 h-full w-32 p-3 text-white'>Run</button>
          <button className='bg-green-500 h-full w-32 p-3 text-white'>Submit</button>
        </div>
      </div>
        <div style={{color: "var(--description-color)", fontFamily: "Open Sans,Helvetica,Arial,sans-serif"}} className='p-3 leading-9 w-full h-full overflow-auto max-h-max flex flex-col gap-4'>
        <div style={{backgroundColor: "var(--background-title)"}} className=' w-full p-2 pl-4 rounded shadow-sm'>
          <div>
            {props.error ? 
            <div className=' p-3 text-red-400'>
            {props.error}  
            </div>
          :
              <>
              <div><strong>Test Case #1</strong></div>
              {props.output ?
              <>
              <strong>Output : </strong>
              <CodeMirror
                theme={props.preferedTheme}    
                value={props.output}
                extensions={[javascript({ jsx: true })]}
                editable={false}
              />
              </>
              :<></>
            }
            {props.stdOut ?
              <div>
                <strong>Stdout : </strong>
                <CodeMirror
                theme={props.preferedTheme}    
                value={props.stdOut}
                extensions={[javascript({ jsx: true })]}
                editable={false}
              />
              </div>
            : <></>} 
              </>
          }
          </div>
        </div>
        <div className='p-5'></div>
      </div>
    </div>
  )
}
