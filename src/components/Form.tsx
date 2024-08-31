import { useState,ChangeEvent, Dispatch, useEffect } from "react"
import {v4 as uuidv4} from 'uuid'
import { Activity } from "../type"
import { categories } from "../data/categories"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"

type FormProps={
    dispatch:Dispatch<ActivityActions>,
    state:ActivityState
}

export default function Form({dispatch,state}:FormProps) {
    const initialValues:Activity={
        id:uuidv4(),
        category:1,
        name:'',
        calories:0
    }
    const[activity,setActivity]=useState<Activity>(initialValues)
    useEffect(()=>{
        if(state.activeId){
            const selectedActivity = state.activities.filter(stateActivity=>stateActivity.id===state.activeId)[0]
            setActivity(selectedActivity)
        }
    },[state.activeId])
    const handleChange=(e:ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>)=>{
        const isNumberField=['category','calories'].includes(e.target.id)
        setActivity({
            ...activity,
            [e.target.id]:isNumberField? +e.target.value : e.target.value
        })
    }

    const isValidActivity=()=>{
        const{name,calories}=activity
        return name.trim() !== '' && calories > 0
    }
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        dispatch({
            type:'save-activity',
            payload:{newActivity:activity}
        })
        setActivity({
            ...initialValues,
            id:uuidv4()
        })
    }
  return (
    <form
        className="space-y-5 bg-white shadow p-10 rounded-lg"
        onSubmit={handleSubmit}
    >
        <p>Formulario</p>
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="category" className="font-bold">Categoria</label>
            <select name="" id="category"
                className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                value={activity.category}
                onChange={handleChange}
            >
                {categories.map((category)=>(
                    <option
                    key={category.id}
                    value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">Actividad:</label>
        <input type="text" 
        id="name"
        className="border border-slate-300 p-2 rounded-lg"
        placeholder="Ej. Comida, Jugo de Naranja, Ensalada, ejercicio, pesas, bicicleta"
        value={activity.name}
        onChange={handleChange}
        />
        </div>
        <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">Calorias:</label>
        <input type="number" 
        id="calories"
        className="border border-slate-300 p-2 rounded-lg"
        placeholder="Calorias. Ej. 300 o 500"
        value={activity.calories}
        onChange={handleChange}
        />
        </div>
        <input type="submit"  className="bg-gray-800 hover:bg-gray-900 font-bold uppercase text-white w-full
        cursor-pointer disabled:opacity-10"
        value={activity.category===1?'Guardar comida':'Guardar ejercicio'}
        disabled={!isValidActivity()}
        />
    </form>
  )
}
