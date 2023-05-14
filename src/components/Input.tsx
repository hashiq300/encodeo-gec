import { TextInput, type TextInputProps, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconArrowRight, IconLoaderQuarter } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { type FormEvent, useState } from 'react';
import { api } from '~/utils/api';

export function Input(props: TextInputProps) {
    const theme = useMantineTheme();
    const [code, setCode] = useState("");
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const hello = api.quiz.check.useMutation({
        onSuccess: async (data) => {
            console.log(data)
            if (data.exists) {
                await router.push(`/quiz/${data.code}`);

            }
            setLoading(false)
            setError("The quiz with code does not exists")
        }
    })

    const checkLoading = hello.isLoading && loading;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(code)
        if (code.length !== 6) {
            setError("Enter the code")
            return;
        }
        setLoading(true)
        setError(undefined)
        await hello.mutateAsync({
            code: code
        })



    }
    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit}>
            <TextInput
                radius="sm"
                size="md"
                rightSection={
                    <ActionIcon
                        type='submit'
                        size={32}
                        radius="sm"
                        className='blue-background'
                        color={theme.primaryColor}
                        disabled={checkLoading}
                        variant="filled"
                    >
                        {checkLoading ? (
                            <IconLoaderQuarter
                                className="loader"
                                size="1.1rem"
                                stroke={1.5}
                            />
                        ) : (
                            <IconArrowRight size="1.1rem" stroke={1.5} />
                        )}
                    </ActionIcon>
                }
                minLength={6}
                maxLength={6}
                pattern="[0-9]+"
                placeholder="Enter the code"
                value={code}
                onChange={(e) => {
                    setError(undefined)
                    setCode(e.target.value)
                }}
                rightSectionWidth={42}
                error={error}
                {...props}
            />
        </form>
    );
}