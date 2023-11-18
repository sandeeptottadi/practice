import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function Statement(props : any) {
  let testCase = "";
  
  return (
    <div style={{ backgroundColor: 'var(--background-primary)' }} className='w-full h-full overflow-hidden rounded'>
      <div style={{ backgroundColor: 'var(--background-title)' }} className='flex flex-row shadow-xl'>
        <div style={{ backgroundColor: 'var(--background-primary)' }} className='p-3 tab'>Problem Statement</div>
        <div className='p-3 tab'>Notepad</div>
        <div className='p-3 tab'>Editor</div>
      </div>
      <div className='p-3 leading-8 h-full overflow-auto'>
        <h1 className='text-2xl'>Valid Subsequence</h1>
        <div className='text-sm leading-7'>
          <p className='mt-4'>
            Given two non-empty arrays of integers, write a function that determines
            whether the second array is a subsequence of the first one.
          </p>
          <p className='mt-4'>
            A subsequence of an array is a set of numbers that arent necessarily adjacent
            in the array but that are in the same order as they appear in the array. For
            instance, the numbers <span>[1, 3, 4]</span> form a subsequence of the array
            <span>[1, 2, 3, 4]</span>, and so do the numbers <span>[2, 4]</span>. Note
            that a single number in an array and the array itself are both valid
            subsequences of the array.
          </p>
        </div>

        <div className='mt-4'>Sample Test Case</div>
        {props.testCases[0].map((test: any, idx2 : any) => {
          testCase += `${test[0]} : ${JSON.stringify(test[1])} \n`
        })}
          <div style={{backgroundColor: "var(--background-title)", borderRadius: "10px"}} className=' w-full h-fit shadow-sm mt-4 overflow-auto'>
          <CodeMirror
              theme={props.preferedTheme}    
              value={(testCase.substring(0, testCase.length-2))}
              extensions={[javascript({ jsx: true })]}
              editable={false}
            />
          </div>

        <div className='p-5'></div>
        </div>
      </div>
  )
}
