import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function TestCases(props: any) {

  return (
    <div style={{ backgroundColor: 'var(--background-primary)' }} className='w-full h-full overflow-hidden rounded'>
    <div style={{ backgroundColor: 'var(--background-title)' }} className='flex flex-row shadow-2xl text-md'>
      <div style={{ backgroundColor: 'var(--background-primary)' }} className=' p-3 tab'>Test Cases</div>
      <div className=' p-3 tab'>Custom Test Cases</div>
    </div>
    <div className=' w-full h-full max-h-fit'>
      <div style={{color: "var(--description-color)", fontFamily: "Open Sans,Helvetica,Arial,sans-serif"}} className='p-3 leading-9 w-full h-full overflow-auto max-h-max flex flex-col gap-4'>
        {props.testCases.map((t : any, idx: number) => {
          let testCase = ''
          return (
            <React.Fragment key={idx}>
              {t.map((test: any, idx2 : any) => {
                testCase += `${test[0]} : ${JSON.stringify(test[1])} \n`
              })}
              <div key={idx} style={{backgroundColor: "var(--background-title)", borderRadius: "10px"}} className=' w-full h-fit shadow-sm'>
                <CodeMirror
                  theme={props.preferedTheme}    
                  value={(testCase.substring(0, testCase.length-2))}
                  extensions={[javascript({ jsx: true })]}
                  editable={false}
                />
              </div>
            </React.Fragment>
          )
        })}

        <div className='p-5'></div>
      </div>
    </div>
</div>
  )
}
