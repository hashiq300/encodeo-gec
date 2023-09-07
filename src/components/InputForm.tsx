
import { useRouter } from 'next/router';
import { useState } from 'react';
import { api } from '~/utils/api';

import { Button } from "./ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"


import { useForm } from "react-hook-form"
import type * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { codeSchema } from '~/lib/schema';



export function InputForm() {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
        defaultValues: {
            code: ""
        },
    })
    const router = useRouter();
    const hello = api.quiz.check.useMutation({
        onSuccess: async (data) => {
            if (data.exists) {
                await router.push(`/quiz/${data.code}`);

            }
            setLoading(false)
            form.setError("code", {
                message: "The quiz with code does not exists",
            })
        }
    })

    const checkLoading = hello.isLoading && loading;

    const onSubmit = async (values: z.infer<typeof codeSchema>) => {
        setLoading(true)
        await hello.mutateAsync({
            code: values.code
        })



    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10 mx-auto">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Enter code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={checkLoading} className='float-right' type="submit">Submit</Button>
            </form>
        </Form>
    );
}