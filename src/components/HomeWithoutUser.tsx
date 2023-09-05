import { SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';


export function HomeWithoutUser() {

    return (
        <div className='container mt-20'>
            <h1 className='font-bold text-5xl'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-pink-700'>Encodeo</span><br />
                Crack The Code
            </h1>
            <p className='mt-8 text-xl font-medium'>Crack the code and compete to win! 🤩<br />
                Get ready with ENCODEO to decode a series of challenging ciphers  for a chance to win the ultimate cash prize. 🤓🧠🥇</p>
            <SignInButton>
                <Button className='my-6 px-5 py-2 border-primary border-2' variant="outline" >
                    Sign in
                </Button>
            </SignInButton>
        </div>
    );
}

export default HomeWithoutUser