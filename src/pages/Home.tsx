import { A } from "@solidjs/router";
import Card from "../components/Card";
import Welcome from "../components/Welcome";
import { Show } from "solid-js";
import { useJournalContext, pb } from "../context/JournalContext";

export default function Home() {
    const {isAuth} = useJournalContext();

    return (
        <div>
            <Show when={isAuth()} fallback={<Welcome/>}>
                
                <div class="grid grid-cols-3 mx-5 my-12 gap-5">
                    <Card>
                        <A href="/food-journal" class="p-3 rounded-md text-center flex flex-col gap-3 bg-blue-400 text-white">
                            <h2 class="text-xl">
                                Food Journal
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere quia illum dicta cum fuga perspiciatis?
                            </p>
                        </A >
                    </Card>
                    <Card>
                        <A href="/workout-journal" class="p-3 rounded-md text-center flex flex-col gap-3 bg-blue-400 text-white">
                            <h2 class="text-xl">
                                Workout Journal
                            </h2>
                            <p>
                                This journal is under constraction and clicking it will not do anythhing.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere quia illum dicta cum fuga perspiciatis?
                            </p>
                        </A >
                    </Card>
                    <Card>
                        <A href="/" class="p-3 rounded-md text-center flex flex-col gap-3 bg-blue-400 text-white">
                            <h2 class="text-xl">
                                Mood Journal
                            </h2>
                            <p>
                                This journal is under constraction and clicking it will not do anythhing.
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere quia illum dicta cum fuga perspiciatis?
                            </p>
                        </A >
                    </Card>
                </div>
            </Show>
        </div>
    )
}