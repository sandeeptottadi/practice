import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function Output(props: {
  preferedTheme: any,
  output: any,
  error: string,
  runCode: () => {},
  expectedOutput: any
}) {
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
          {props.error ? 
              <div className=' p-3 text-red-400'>
              {props.error}  
              </div>
          :
              <>
                {props.output.map((out: any, idx: number) => {
                  return (
                  <div key={idx} style={{backgroundColor: "var(--background-title)"}} className=' w-full p-2 pl-4 rounded shadow-sm border border-green-800'>
                    <div>
                      <div><strong>Test Case #{idx+1}</strong></div>
                      <div>
                          {out[0] ?
                            <div>
                            <div>Output : </div>
                            <CodeMirror
                              theme={props.preferedTheme}    
                              value={out[0]}
                              extensions={[javascript({ jsx: true })]}
                              editable={false}
                              contentEditable={false}
                              spellCheck={true}
                            />
                          </div>
                          :<></>}
                          {out[1] ?
                            <div>
                              <div>Stdout : </div>
                              <CodeMirror
                                theme={props.preferedTheme}    
                                value={out[1]}
                                extensions={[javascript({ jsx: true })]}
                                editable={false}
                              />
                            </div>
                          :<></>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
          }
        <div className='p-5'></div>
      </div>
    </div>
  )
}
