import { SignUpButton } from '@clerk/nextjs';


export function HomeWithoutUser() {

    return (
        <div >
            <SignUpButton>
                Sign Up
            </SignUpButton>
        </div>
    );
}

export default HomeWithoutUser