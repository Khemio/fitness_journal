import { useParams } from "@solidjs/router"
import { For, Show, createSignal } from "solid-js";
import { useJournalContext, pb } from "../context/JournalContext";

export default function Day() {
    const params = useParams();

    const {foodCopy, setCopy, days, refetchDays} = useJournalContext();
    const [isEditable, setEditable] = createSignal(false);
    const [isAdding, setAddition] = createSignal(false);

    let name: HTMLInputElement;
    let calories: HTMLInputElement;
    let amount: HTMLInputElement;
    let protein: HTMLInputElement;

    const day = () => {
        if (days()) {
            return days().find(day => day.id === params.id);
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
        amount.value = "";
        calories.value = "";
        protein.value = "";
    }

    function pasteOne() {
        const food = foodCopy().pop();

        name.value = food.name;
        amount.value = food.amount;
        calories.value = food.calories;
        protein.value = food.protein;
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

    async function addFood() {
        //Multy paste attempt
        
        // const items = ;

        // const promises = items.map(item => {
        //     const data = {
        //         "name": item.name.value,
        //         "food_name": "",
        //         "amount": item.amount.value,
        //         "calories": item.calories.value,
        //         "protein": item.protein.value
        //     };
        //     return pb.collection('foods_eaten').create(data, {'$autoCancel': false});
        // })

        // const records = await Promise.all(promises);
        // console.log(records);

        const data = {
            "name": name.value,
            "food_name": "",
            "amount": amount.value,
            "calories": calories.value,
            "protein": protein.value
        };
        
        const record = await pb.collection('foods_eaten').create(data);
        updateDay(record);
        resetInputs();
    }

    async function updateDay(food) {
        const food_ids = [];
        day().foods_eaten.map(food => food_ids.push(food.id));
        food_ids.push(food.id);
        const data = {
            "foods_eaten_in_a_day": food_ids,
            "total_calories": day().calories + food.calories,
            "total_protein": day().protein + food.protein
        };
        
        const record = await pb.collection('food_journal').update(day().id, data);

        refetchDays();
        
    }

    async function deleteFood(food) {
        await pb.collection('foods_eaten').delete(food.id);

        const data = {
            "total_calories": day().calories - food.calories,
            "total_protein": day().protein - food.protein
        };
        
        const record = await pb.collection('food_journal').update(day().id, data);

        refetchDays();
        
    }

    return (
        <div class="w-11/12 mx-auto">
            <div class="grid grid-cols-2 justify-end">
                <h2 class='font-bold text-center text-3xl text-blue-400 my-8 ml-auto'>Day View</h2>
                <button class="text-xl ml-auto" onClick={toggleEdit}>{`${isEditable() ? 'Cancel' : 'Delete Food'}`}</button>
            </div>
                {/* <div class="flex gap-3 ml-3 p-3">
                    <button onClick={toggleAdition}>Add Food</button>
                </div> */}
                
            
            
            <div class="w-11/12 mx-auto flex gap-3">
                <Show when={day()} fallback={<p>Loading Day...</p>}>
                    <div class="w-1/2 flex justify-center">
                        <div class="w-fit px-5 py-3 text-center bg-blue-400 text-white
                            flex flex-col justify-between gap-3">
                        
                            <h2>{day().date}</h2>
                            <Show when={day().foods_eaten} fallback={<p>Loading Foods...</p>}>
                                <For each={day().foods_eaten}>
                                    {(food): any => (
                                        
                                        <div class="relative border-b border-white flex justify-start"
                                        onDblClick={(e) => {
                                            e.preventDefault();
                                            copyFood(food);
                                        }}>
                                            <p>{food.name} - {food.calories} - {food.protein}</p>
                                            <Show when={isEditable()}>
                                                <button class="absolute right-0 top-0 text-red-500 rounded-md"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        deleteFood(food)
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
                                {`${isAdding() ? 'Cancel' : 'Add Food'}`}
                            </button>

                            <p>Protein: {day().protein}   Calories: {day().calories}</p>
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
                                addFood();
                            }}>

                            <div class="flex gap-2 content-center">
                                <label for="name">Name</label>
                                <input ref={name} type="text" id="name" class="border border-black" required/>
                            </div>

                            <div class="flex gap-2 content-center">
                                <label for="amount">Amount</label>
                                <input ref={amount} type="text" id="amount" class="border border-black" required/>
                            </div>

                            <div class="flex gap-2 content-center">
                                <label for="calories">Calories</label>
                                <input ref={calories} type="text" id="calories" class="border border-black" required/>
                            </div>

                            <div class="flex gap-2 content-center">
                                <label for="protein">Protein</label>
                                <input ref={protein} type="text" id="protein" class="border border-black" required/>
                            </div>

                            <button type="submit" class="bg-blue-400 text-white px-3 py-1 rounded-md">Add</button>
                        </form>
                    </div>
                </Show>
            </div>
        </div>
    )
}