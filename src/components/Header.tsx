import { A, useLocation, useRouteData } from "@solidjs/router";
import { useJournalContext, pb } from "../context/JournalContext";
import { Show, createEffect, createSignal } from "solid-js";


export default function Header() {
    const {isAuth, setAuth, mutateDays, mutateWorkouts} = useJournalContext();
    const [username, setUsername] = createSignal(null);

    function getJournal() {
        const location = useLocation();
        const words = location.pathname.split('/');
        const journal = words.find(word => word.split("-").includes("journal"));

        return journal;
    }

    function clearJournals() {
        mutateDays([]);
        mutateWorkouts([]);
    }

    createEffect(() => {
        setUsername(isAuth() ? pb.authStore.model.username : null)
    })

    // pb.authStore.model ? pb.authStore.model.username : null;

    return (
        <div class="py-6 px-3 bg-blue-400 text-white ">
            <div class="w-11/12 mx-auto text-center flex justify-between">
                <div class="flex gap-5 text-center">
                    <A href="/" class="text-white text-xl flex self-end">Home</A>
                    <A href={`/${getJournal()}`} class="text-white text-xl flex self-end">Journal</A>
                </div>

                <Show when={isAuth()} fallback={<h2 class="text-2xl">Welcome to FitLife</h2>}>
                    <h2 class="text-2xl">Welcome {username()}</h2>
                    
                </Show>
                
                <Show when={!isAuth()} fallback={
                    <button class="px-3 py-1 rounded-md border border-white text-white"
                    onClick={(e) => {
                        e.preventDefault();
                        pb.authStore.clear();
                        setAuth(false);
                        clearJournals();
                    }}>Sign Out</button>
                }>
                    <div class="flex gap-5 mr-2 text-center">
                        <A  href="/signin" class="px-3 py-1 rounded-md bg-white text-blue-400">Sign In</A>
                        <A  href="/signup" class="px-3 py-1 rounded-md border border-white text-white">Sign Up</A>
                    </div>
                </Show>
            </div>
        </div>
    )
}