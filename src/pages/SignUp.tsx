import { A, useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { useJournalContext, pb } from "../context/JournalContext";


export default function SignUp() {
    let username: HTMLInputElement;
    let email: HTMLInputElement;
    let password: HTMLInputElement;
    let confpass: HTMLInputElement;

    const navigate = useNavigate();

    const {setAuth} = useJournalContext();

    const [user, setUser] = createSignal({
        username: null,
        email: null,
        password: null,
        confpass: null,
    })

    const [isInvalid, setInvalid] = createSignal(false);

    function validate () {
        setInvalid(false);
        setUser({
            username: username.value,
            email: email.value,
            password: password.value,
            confpass: confpass.value,
        })
        if (user().password !== user().confpass) {
            setInvalid(true);
            return false;
        }

        return true;
    }

    async function signUpUser () {
        if (validate()) {
            const data = {
                "username": user().username,
                "email": user().email,
                "emailVisibility": true,
                "password": user().password,
                "passwordConfirm": user().confpass,
            };
            
            const record = await pb.collection('users').create(data);
            console.log(record.id);

            if (record.id) {
                const authData = await pb.collection('users').authWithPassword(
                    user().username,
                    user().password,
                );

                setAuth(pb.authStore.isValid);
                navigate("/", {replace: true});
            }
            
            // (optional) send an email verification request
            // await pb.collection('users').requestVerification(user().email);
        }

    }


    return (
        <div class="py-6 px-5 text-center flex flex-col">
            <h2 class="text-center">Sign Up</h2>
            <form class="mx-auto py-6 px-5 text-center flex flex-col gap-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    signUpUser();
                }}>
                    <div class="flex gap-3">
                        <label for="username" class="">Username</label>
                        <input ref={username} id="username" name="username" type="text"
                            class="border" />
                    </div>
                    <div class="flex gap-3">
                        <label for="email" class="">Email</label>
                        <input ref={email} id="email" name="email" type="email"
                            class="border" />
                    </div>
                    <div class="flex gap-3">
                        <label for="password" class="">Password</label>
                        <input ref={password} id="password" name="password" type="password"
                            class="border" classList={{["border-red-500"] : isInvalid()}}/>
                    </div>
                    <div class="flex gap-3">
                        <label for="confpass" class="">Confirm Password</label>
                        <input ref={confpass} id="confpass" name="confpass" type="password"
                            class="border" classList={{["border-red-500"] : isInvalid()}}/>
                    </div>

                    <Show when={isInvalid()}>
                        <p class="text-lg text-red-500">Confirm Password is different from Password</p>
                    </Show>

                    <button type="submit" class="bg-blue-400 text-white px-3 py-1 rounded-md">Submit</button>
            </form>
        </div>
    )
}