import { A, useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { useJournalContext, pb } from "../context/JournalContext";

export default function SignIn() {
    
    let credentials: HTMLInputElement;
    let password: HTMLInputElement;
    
    const navigate = useNavigate();

    const {setAuth} = useJournalContext();

    const [user, setUser] = createSignal({
        credentials: null,
        password: null,
    })

    const [isInvalid, setInvalid] = createSignal(false);

    function validate () {
        setInvalid(false);
        setUser({
            credentials: credentials.value,
            password: password.value
        })
        if (!user().credentials || !user().password) {
            setInvalid(true);
            return false;
        }

        return true;
    }

    async function signInUser () {
        if (validate()) {
            const authData = await pb.collection('users').authWithPassword(
                user().credentials,
                user().password,
            );
            
            // after the above you can also access the auth data from the authStore
            console.log(pb.authStore.isValid);
            console.log(pb.authStore.token);
            console.log(pb.authStore.model.id);

            setAuth(pb.authStore.isValid);
            navigate("/", {replace: true});
        } 
    }

    return (
        <div class="py-6 px-5 text-center flex flex-col">
            <h2 class="text-center">Sign In</h2>
            <form class="mx-auto py-6 px-5 text-center flex flex-col gap-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    signInUser();
                }}>
                    <div class="flex gap-3">
                        <label for="credentials" class="">Username or Email</label>
                        <input ref={credentials} id="credentials" name="credentials" type="text"
                            class="border" required/>
                    </div>

                    <div class="flex gap-3">
                        <label for="password" class="">Password</label>
                        <input ref={password} id="password" name="password" type="password"
                            class="border" classList={{["border-red-500"] : isInvalid()}} required/>
                    </div>

                    <Show when={isInvalid()}>
                        <p class="text-lg text-red-500">Confirm Password is different from Password</p>
                    </Show>

                    <button type="submit" class="bg-blue-400 text-white px-3 py-1 rounded-md">Submit</button>
            </form>
        </div>
    )
}