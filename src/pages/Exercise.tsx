import { useParams } from "@solidjs/router"
import { For, Show, createSignal } from "solid-js";
import { useJournalContext, pb } from "../context/JournalContext";

export default function Day() {
    const params = useParams();

    const {foodCopy, setCopy, workouts, refetchWorkouts} = useJournalContext();
    const [isEditable, setEditable] = createSignal(false);
    const [isAdding, setAddition] = createSignal(false);

    //TODO Figure out copy & paste

    let name: HTMLInputElement;
    let type: HTMLSelectElement;
    let sets: HTMLInputElement;
    let reps: HTMLInputElement;

    const workout = () => {
        if (workouts()) {
            return workouts().find(day => day.id === params.id);
        } else null
    };

    function toggleEdit () {
        setEditable(!isEditable())
    }

    function toggleAdition () {
        setAddition(!isAdding())
    }

    function resetInputs() {
        name.value = "";
        type.value = "";
        sets.value = "";
        reps.value = "";
    }

    //TODO Fix single item paste
    function pasteOne() {
        const food = foodCopy().pop();

        name.value = food.name;
        type.value = food.type;
        sets.value = food.sets;
        reps.value = food.reps;
    }
    //TODO Figure out a nice way of pasting and adding multiple items
    // function pasteAll() {
    //     const foods = [];
    //     foodCopy().forEach(item => {
    //         // pasteOne();
    //         foods.push(item);
    //         addFood();
    //     })
    // }

    function copyFood(food) {
        setCopy([...foodCopy(), food]);
        console.log(foodCopy());
    }

    async function addExercise() {
        const data = {
            "name": name.value,
            "type": type.value,
            "sets": sets.value,
            "reps": reps.value
        };
        
        const record = await pb.collection('exercises_done').create(data);
        updateWorkout(record);
        resetInputs();
    }

    async function updateWorkout(exercise) {
        const exercise_ids = [];
        workout().exercises.map(exercise => exercise_ids.push(exercise.id));
        exercise_ids.push(exercise.id);
        const data = {
            "exercises": exercise_ids,
        };
        
        const record = await pb.collection('workout_journal').update(workout().id, data);

        refetchWorkouts();
        
    }

    async function deleteExercise(exercise) {
        await pb.collection('exercises_done').delete(exercise.id);

        // const data = {
        //     "total_calories": day().calories - food.calories,
        //     "total_protein": day().protein - food.protein
        // };
        
        // const record = await pb.collection('food_journal').update(day().id, data);

        refetchWorkouts();
        
    }

    return (
        <div class="w-11/12 mx-auto">
            <div class="grid grid-cols-2 justify-end">
                <h2 class='font-bold text-center text-3xl text-blue-400 my-8 ml-auto'>Exercise View</h2>
                <button class="text-xl ml-auto" onClick={toggleEdit}>{`${isEditable() ? 'Cancel' : 'Delete Exercise'}`}</button>
            </div>
                {/* <div class="flex gap-3 ml-3 p-3">
                    <button onClick={toggleAdition}>Add Food</button>
                </div> */}
                
            
            
            <div class="w-11/12 mx-auto flex gap-3">
                <Show when={workout()} fallback={<p>Loading Workout...</p>}>
                    <div class="w-1/2 flex justify-center">
                        <div class="w-fit px-5 py-3 text-center bg-blue-400 text-white
                            flex flex-col justify-between gap-3">
                        
                            <h2>{workout().date}</h2>
                            <Show when={workout().exercises} fallback={<p>Loading Exercises...</p>}>
                                <For each={workout().exercises}>
                                    {(exercise): any => (
                                        
                                        <div class="relative border-b border-white flex justify-start"
                                        onDblClick={(e) => {
                                            e.preventDefault();
                                            copyFood(exercise);
                                        }}>
                                            <p>{exercise.name} - {exercise.sets} - {exercise.reps}</p>
                                            <Show when={isEditable()}>
                                                <button class="absolute right-0 top-0 text-red-500 rounded-md"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteExercise(exercise)
                                                    }}>
                                                    &#10005;
                                                </button>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </Show>

                            <button onClick={toggleAdition}
                                class="w-fit mx-auto px-2 py-1 border border-white">
                                {`${isAdding() ? 'Cancel' : 'Add Exercise'}`}
                            </button>

                            {/* <p>Protein: {day().protein}   Calories: {day().calories}</p> */}
                        </div>
                    </div>
                </Show>
                <Show when={isAdding()}>
                    <div class="flex flex-col gap-5">
                        <div class="flex gap-5">
                            <button onClick={pasteOne} class="border border-black px-3 py-1">Paste one item</button>
                            {/*Pasting all items is a bit convoluted*/}
                            {/* <button onClick={pasteAll} class="border border-black px-3 py-1">Paste and add all items</button> */}
                        </div>
                        <form 
                            class="mx-auto flex flex-col content-center justify-evenly gap-3" 
                            onSubmit={(e)=>{
                                e.preventDefault();
                                addExercise();
                            }}>

                            <div class="flex gap-2 content-center">
                                <label for="name">Name</label>
                                <input ref={name} type="text" id="name" class="border border-black" required/>
                            </div>

                            <div class="flex gap-2 content-center">
                                <label for="type">Type</label>
                                <select name="type" id="type"
                                ref={type} class="px-2 outline-none border border-black">
                                    <option value="resistance">Resitance</option>
                                    <option value="cardio">Cardio</option>
                                </select>
                            </div>

                            <div class="flex gap-2 content-center">
                                <label for="calories">Sets</label>
                                <input ref={sets} type="text" id="calories" class="border border-black" required/>
                            </div>

                            <div class="flex gap-2 content-center">
                                <label for="protein">Reps</label>
                                <input ref={reps} type="text" id="protein" class="border border-black" required/>
                            </div>

                            <button type="submit" class="bg-blue-400 text-white px-3 py-1 rounded-md">Add</button>
                        </form>
                    </div>
                </Show>
            </div>
        </div>
    )
}