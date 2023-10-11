import { Index, Show, createSignal } from "solid-js";
import { useJournalContext, pb, Exercise } from "../context/JournalContext";

//TODO Figure out paste

export default function Card(props: any) {
    const {isAuth, foodCopy, setCopy, workouts, mutateWorkouts} = useJournalContext();

    const [refs, setRefs] = createSignal([
        {
            name: null,
            type: null,
            sets: null,
            reps: null,
        },
    ]);

    function addItem() {
        const r = {
            name: null,
            type: null,
            sets: null,
            reps: null,
        }

        setRefs([...refs(), r]);
    }

    function pasteItems() {
        foodCopy().forEach((item, i) => {
            refs()[i].name.value = item.name;
            refs()[i].sets.value = item.sets;
            refs()[i].type.value = item.type;
            refs()[i].reps.value = item.reps;

            addItem();
        })
    }

    function hasInput(r) {
        return r.name.value && r.sets.value && r.type.value && r.reps.value;
    }

    function sanitizeRefs() {
        return refs().filter(r => hasInput(r));
    }

    async function  addWorkout() {
        const items = sanitizeRefs();
        // console.log(items)

        const promises = items.map(item => {
            const data = {
                "name": item.name.value,
                "type": item.type.value,
                "sets": item.sets.value,
                "reps": item.reps.value
            };
            return pb.collection('exercises_done').create(data, {'$autoCancel': false});
        })

        const exRecords = await Promise.all(promises);
        // console.log(exRecords[0].id);
        // console.log(exRecords.flatMap((record) => record.id));

        const newWorkout = {
            "owner": pb.authStore.model.id,
            "exercises": exRecords.flatMap((record) => record.id),

        };
        
        const record = await pb.collection('workout_journal').create(newWorkout);

        const workout = {
            id: record.id,
            // date: record.created,
            date: new Date(record.created.slice(0, 10)).toLocaleDateString(),
            exercises: exRecords.map((exercise) => {
                return {
                    id: exercise.id,
                    name: exercise.name,
                    type: exercise.type,
                    sets: exercise.sets,
                    reps: exercise.reps
                };
            }),
        }

        mutateWorkouts([workout, ...workouts()]);
        
    }

    return (
        <div>
            <div class="flex justify-between">
                <button class="my-4 px-4 py-1 border border-black text-xl"
                    onClick={props.toggle}
                    >Back</button>
                
                <Show when={foodCopy().length !== 0} >
                    <div class="ml-auto flex gap-7">
                        <span class="text-lg flex flex-col justify-center">{`${foodCopy().length}`} items copied</span>
                        <button class="my-4 px-4 py-1 border border-black text-xl"
                            onClick={pasteItems}
                            >Paste</button>
                    </div>
                </Show>
            </div>

        <form 
            class="m-3" 
            onSubmit={(e)=>{
                e.preventDefault();
                addWorkout();
                props.toggle();
            }}>

            <Index each={refs()}>{(r, i) =>
                <div class="flex justify-evenly gap-3 my-3">
                    <div class="flex gap-2 content-center justify-center place-content-center">
                        <label for="name">Name</label>
                        <input ref={r().name} type="text" id="name" class="px-2 outline-none border border-black"/>
                    </div>
                
                    <div class="flex gap-2 content-center">
                        <label for="type">Type</label>
                        {/* <input ref={r().type} type="text" id="type" class="px-2 outline-none border border-black"/> */}
                        <select name="type" id="type"
                        ref={r().type} class="px-2 outline-none border border-black">
                            <option value="resistance">Resitance</option>
                            <option value="cardio">Cardio</option>
                        </select>
                    </div>

                    <div class="flex gap-2 content-center">
                        <label for="sets">Sets</label>
                        <input ref={r().sets} type="text" id="sets" class="px-2 outline-none border border-black"/>
                        
                    </div>

                    <div class="flex gap-2 content-center">
                        <label for="reps">Reps</label>
                        <input ref={r().reps} type="text" id="reps" class="px-2 outline-none border border-black"/>
                    </div>

                </div>
                }
            </Index>


            <div class="flex justify-center gap-5 mt-10">
                <button class="bg-blue-400 text-white text-xl px-3 py-1 rounded-md"
                onClick={(e) => {
                    e.preventDefault();
                    addItem();
                }}>+</button>
                <button type="submit" class="bg-blue-400 text-white px-3 py-1 rounded-md">Submit</button>
            </div>
        </form>

        </div>
        
    )
}