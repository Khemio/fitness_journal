import Card from "../components/Card";
import FoodForm from "../components/FoodForm";
import { For, Show, createSignal } from "solid-js";
import { useJournalContext, pb } from "../context/JournalContext";
import { useBeforeLeave } from "@solidjs/router";

export default function FoodJournal() {

    useBeforeLeave((e) => {
        if (isEditable() && !e.defaultPrevented) {
            e.preventDefault();
        }
    });

    const {isAuth, foodCopy, setCopy, days, mutateDays} = useJournalContext();

    const [isEditable, setEditable] = createSignal(false);
    const [addingFood, setAddition] = createSignal(false);


    function toggleEdit () {
        setEditable(!isEditable())
    }

    function toggleAdition () {
        setAddition(!addingFood())
    }

    function copyFood(day) {
        setCopy([]);
        day.foods_eaten.forEach(food => {
            setCopy([...foodCopy(), food]);
        })
    }

    function clearCopy() {
        setCopy([]);
        console.log(foodCopy());
    }

    async function deleteDay(day) {
        day.foods_eaten.map(async food => await pb.collection('foods_eaten').delete(food.id, {'$autoCancel': false}))
        
        await pb.collection('food_journal').delete(day.id);
        mutateDays(days().filter(d => d.id !== day.id));

    }

    return (
        <>
            <div class="w-11/12 mx-auto">
                <Show when={!addingFood()} fallback={<FoodForm toggle={toggleAdition}/>}>
                    <div class="flex justify-evenly">
                        <h2 class='font-bold text-center text-3xl text-blue-400 my-8 ml-auto'>Food Journal</h2>
                        <Show when={foodCopy().length === 0} fallback={
                            <div class="ml-auto flex gap-7">
                                <span class="text-lg flex flex-col justify-center">{`${foodCopy().length}`} items copied</span>
                                <button class="text-xl ml-auto" onClick={clearCopy}>Clear</button>
                            </div>
                        } >
                            <button class="text-xl ml-auto" onClick={toggleEdit}>{`${isEditable() ? 'Cancel' : 'Delete'}`}</button>
                        </Show>
                    </div>
                    
                    <div class="grid grid-cols-4 gap-5">
                        <div class="p-3 rounded-md text-center flex bg-blue-300 text-white 
                            transition-all hover:scale-105 hover:bg-blue-400"
                            onClick={toggleAdition}>
                            <button class="m-auto text-center text-5xl">
                                +
                            </button>
                        </div>
                        <Show when={days() && isAuth()} fallback={<p>Loading...</p>}>
                            <For each={days()} >
                                {(day): any => (
                                    
                                    <Card id={day.id} editable={isEditable()} journal={"food"}
                                    
                                    // onClick={(e) => {
                                    //     e.preventDefault();
                                    //     copyFood(day);
                                    // }}
                                    >
                                            <div class="relative">                                        
                                                <h2 class="text-xl mx-auto"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    copyFood(day);
                                                }}>
                                                    {day.date}
                                                </h2>
                                                <Show when={isEditable()}>
                                                    <button class="absolute right-0 top-0 text-red-600 pointer-events-auto"
                                                        onClick={(e) => {
                                                            // e.preventDefault();
                                                            deleteDay(day);
                                                        }}>
                                                        &#10005;
                                                    </button>
                                                </Show>                                            
                                                <div class="flex flex-col grow justify-between gap-5">
                                                        <Show when={day.foods_eaten} fallback={<p>Loading...</p>}>
                                                            <For each={day.foods_eaten}>
                                                                {(food): any => (
                                                                    
                                                                    <p>{food.name} - {food.calories} - {food.protein}</p>
                                                                    
                                                                )}
                                                            
                                                            </For>
                                                        </Show>
                                                    <p >Calories: {day.calories} Protein: {day.protein}</p>
                                                </div>
                                            </div>
                                        
                                    </Card>
                                )}
                            </For>
                        </Show> 
                    </div>
                </Show>
            </div>
        </>
    )
}