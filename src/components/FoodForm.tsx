import { Index, Show, createSignal } from "solid-js";
import { useJournalContext, pb } from "../context/JournalContext";

export default function Card(props: any) {
    const {isAuth, foodCopy, setCopy, days, mutateDays} = useJournalContext();

    const [refs, setRefs] = createSignal([
        {
            name: null,
            calories: null,
            amount: null,
            protein: null,
        },
    ]);

    function addItem() {
        const r = {
            name: null,
            calories: null,
            amount: null,
            protein: null,
        }

        setRefs([...refs(), r]);
    }

    function pasteItems() {
        foodCopy().forEach((item, i) => {
            refs()[i].name.value = item.name;
            refs()[i].amount.value = item.amount;
            refs()[i].calories.value = item.calories;
            refs()[i].protein.value = item.protein;

            addItem();
        })
    }

    function hasInput(r) {
        return r.name.value && r.amount.value && r.calories.value && r.protein.value;
    }

    function sanitizeRefs() {
        return refs().filter(r => hasInput(r));
    }

    async function  addDay() {
        const items = sanitizeRefs();

        const promises = items.map(item => {
            const data = {
                "name": item.name.value,
                "food_name": "",
                "amount": item.amount.value,
                "calories": item.calories.value,
                "protein": item.protein.value
            };
            return pb.collection('foods_eaten').create(data, {'$autoCancel': false});
        })

        const records = await Promise.all(promises);

        const newDay = {
            "owner": pb.authStore.model.id,
            "foods_eaten_in_a_day": records.flatMap((record) => record.id),
            "total_calories": records.reduce((total, record) => total + record.calories, 0),
            "total_protein": records.reduce((total, record) => total + record.protein, 0)
        };
        
        const record = await pb.collection('food_journal').create(newDay);

        const day = {
            id: record.id,
            // date: record.created,
            date: new Date(record.created.slice(0, 10)).toLocaleDateString(),
            foods_eaten: records.map((food) => {
                return {
                    id: food.id,
                    name: food.name,
                    amount: food.amount,
                    calories: food.calories,
                    protein: food.protein
                };
            }),
            calories: record.total_calories,
            protein: record.total_protein
        }

        mutateDays([day, ...days()]);
        
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
                addDay();
                props.toggle();
            }}>

            <Index each={refs()}>{(r, i) =>
                <div class="flex justify-evenly gap-3 my-3">
                    <div class="flex gap-2 content-center justify-center place-content-center">
                        <label for="name">Name</label>
                        <input ref={r().name} type="text" id="name" class="px-2 outline-none border border-black"/>
                    </div>
                
                    <div class="flex gap-2 content-center">
                        <label for="amount">Amount</label>
                        <input ref={r().amount} type="text" id="amount" class="px-2 outline-none border border-black"/>
                    </div>

                    <div class="flex gap-2 content-center">
                        <label for="calories">Calories</label>
                        <input ref={r().calories} type="text" id="calories" class="px-2 outline-none border border-black"/>
                    </div>

                    <div class="flex gap-2 content-center">
                        <label for="protein">Protein</label>
                        <input ref={r().protein} type="text" id="protein" class="px-2 outline-none border border-black"/>
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