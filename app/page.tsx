"use client"

// Made By Kushagra Agarwal

import React, { useEffect, useRef, useState } from "react"

type todoType = {
  todoId : number,
  todoItem : React.JSX.Element,
  checked: boolean
}

// Seperated Checkbox, Button and TodoRow Components as per the requirements
// These can be kept in seperate files and imported here as well
// We could make a directory named "components" in root directory to store such reusable components

// Checkbox Component
const CheckBox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => {  
  return (
    <input 
      onChange={onChange}
      checked={checked}
      className="ml-2 outline-none h-4 w-4 mr-4" 
      type="checkbox" 
    />
  );
}

// Delete Button Component
const Button = ({ID, delfunc}:{ID:number, delfunc:(ID:number)=>void}) =>{
  return <span className="mr-4 ml-auto group-hover:flex hidden cursor-pointer bg-red-500 text-white px-2 rounded-md"
  onClick={()=>delfunc(ID)}
>X</span>
}

// Todo Row Component
const TodoRow = ({ID, value, checked, onChange, delfunc}:{ID:number, value:string, checked: boolean, onChange: () => void, delfunc:(id:number)=>void}) => {
  return (
    <div className="relative flex m-2 mx-4 group py-2.5 p-4 w-auto items-center text-white text-lg font-semibold bg-[#333333] rounded-md">
      <CheckBox checked={checked} onChange={onChange} />
      <div 
        onClick={onChange}  // Remove this line to disable checking on clicking the text
        className="flex-grow flex-shrink-0 overflow-hidden overflow-ellipsis w-[80%] mx-2"
      >
        <p className={`${checked?"line-through":""} w-auto`}>{value}</p>
      </div>
      {/* Delete Todo Button */}
      <Button ID={ID} delfunc={delfunc}/>
    </div>
  )
}

// Todo List Container Component
const TodoList = () => {

  // Event Handler for Input focus on pressing "/" key
  useEffect(() => {
    const TASK_INPUT = document.getElementById("TASK_INPUT");
  
    const focusEvent = (e:any) => {
      if (TASK_INPUT !== document.activeElement && e.key === "/"){ 
        e.preventDefault(); 
        TASK_INPUT?.focus();
      }
    };
    document.addEventListener("keydown", focusEvent);
    return () => document.removeEventListener("keydown", focusEvent);

  }, []);
  
  // Constants and States
  const [todos, setTodos] = useState<todoType[]>([]);
  const [task, setTask] = useState<string>("");
  const taskID = useRef<number>(0);

  // Function to Delete a TODO based on its ID
  const delfunc = (id:number) => {
    setTodos(todos=>{
      let newTodos:todoType[] = [];
      for (let todo of todos) if (todo.todoId !== id) newTodos.push(todo);
      return newTodos;
    })
  }

  // Method for handling Checked State of any TODO
  const handleCheck = (id: number) => {
    setTodos(todos => {
      return todos.map(todo => {
        if (todo.todoId === id) return { ...todo, checked: !todo.checked };
        else  return todo;
      });
    });
  };

  // Adding a New Todo with default properties and a unique ID
  const addTodo = () => {
    if (task == "") return;
    setTodos([...todos, {
      todoId : taskID.current,
      todoItem: <TodoRow ID={taskID.current++} value = {task} checked={false} onChange={() => handleCheck(taskID.current - 1)} delfunc = { delfunc } />,
      checked: false
    }])
    setTask("")
    console.log("Todo Added")
  }

  return (
    <div className="relative bg-[#1e1e1e] h-[90%] w-4/5 rounded-xl flex flex-col overflow-hidden overflysc" >

      {/* HEADER */}
      <div className="p-4 m-2 text-white flex justify-between">
        <span className="text-3xl flex items-center font-extrabold">
          <span className="m-2">Todo App </span>
          <span className="text-xs uppercase my-auto p-1 m-2 rounded-md border border-white">By Kushagra</span>
        </span>
        <span onClick={()=>{setTodos([]); taskID.current=0}} className="aboslute cursor-pointer right-0 py-2 px-3 font-semibold rounded-lg bg-red-500 flex items-center text-center">Clear</span>
      </div>

      {/* Listing Todos */}
      <div className="overflow-y-scroll mb-20 h-full scrollbar-hide">
        {
          todos.map((item, key)=>{
            return <div key={key}>
              <TodoRow ID={item.todoId} value={item.todoItem.props.value} checked={item.checked} onChange={() => handleCheck(item.todoId)} delfunc={delfunc} />
            </div>
          })
        }
      </div>

      {/* Task Input block */}
      <div className="absolute h-18 flex items-center bottom-0 bg-[#333333] p-4 pl-12 w-full">
        <input 
          id = "TASK_INPUT"
          value={task} 
          onChange={(e)=>setTask(e.target.value)} 
          onKeyDown={(e)=>{
            if (e.key==="Enter") { 
              addTodo();
            }
          }}
          className="w-full mr-4 focus:outline-none bg-transparent text-white" 
          placeholder="Add Task here..."
        />
        <div className="absolute left-4 px-1.5 py-1 text-xs my-auto text-white border-white border rounded-md">/</div>
        <button 
          className="p-2 px-4 mr-2 ml-auto bg-green-500 rounded-lg" 
          onClick={addTodo} 
        >Add</button>
      </div>

    </div>
  )
}

// Main Component
export default function Home() {
  return (
    <main className="w-full h-screen bg-gradient-to-br from-[#123456] to-green-500 flex items-center justify-center">
      <TodoList />
    </main>
  )
}
