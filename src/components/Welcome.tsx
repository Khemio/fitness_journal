import { A } from "@solidjs/router";
import imgUrl from "../assets/test.jpg"


export default function Home() {
    console.log(imgUrl)

    return (
        <div class="h-full w-full my-5 flex flex-col content-between">
            
                <div class="w-11/12 my-5 mx-auto flex content-evenly gap-3">
                    <div class="p-3 w-2/3 flex flex-col gap-5">
                        <h1 class='font-bold text-center text-3xl text-blue-400 my-8'>Welcome</h1> 
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste explicabo provident quod impedit odio quas quo ex minima placeat! Molestiae!</p>
                        
                            <div class="text-center flex justify-center gap-7">
                                <A  href="/signin" class="px-3 py-1 rounded-md bg-blue-400 text-white">Sign In</A>
                                <A  href="/signup" class="px-3 py-1 rounded-md border border-blue-400 text-blue-400">Sign Up</A>
                            </div>
                        
                    </div>

                    <div class="p-3 w-1/2">
                        <img src={imgUrl} alt=""
                            class="border-2 border-blue-400 rounded-md"></img>
                    </div>

                    
                </div>

                <div class="w-11/12 p-3 mt-10 mx-auto">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque ut ipsum iste? Fuga atque magni alias tempore quo at nemo quasi sit ut laudantium veniam nulla obcaecati quisquam dolores sunt, praesentium nihil saepe doloribus assumenda provident soluta fugit! Ea suscipit atque iure hic, provident eum corrupti consequatur similique earum rerum modi nemo et quos neque voluptatibus non debitis quas! Voluptatem molestias a tempore esse expedita aut eius nam, harum reprehenderit pariatur officia voluptatibus neque consectetur odio nulla delectus! Repellendus qui aliquam perspiciatis, ipsum et voluptatibus sequi ipsa nisi laboriosam nobis ab tenetur accusamus corporis doloribus eligendi est magnam culpa molestiae.</p>
                </div>


            
        </div>
    )
}