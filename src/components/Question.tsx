import { Fragment, useEffect, useRef } from "react";
import Markdown from "./Markdown";
import type { CurrentQuestion } from "~/types";
// import { Loader } from "lucide-react"; 
import { Button } from "./ui/button";

import { useForm } from "react-hook-form"
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { questionSchema } from "~/lib/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";


type QuestionUIProps = {
    question: CurrentQuestion;
    handleFormSubmit: (data: z.infer<typeof questionSchema>) => Promise<void>;
    loading: boolean;
    error: string | undefined;
}

const QuestionUI = ({
    question,
    error,
    loading,
    handleFormSubmit,
}: QuestionUIProps) => {


    const inputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<z.infer<typeof questionSchema>>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            answer: ""
        }
    })

    useEffect(() => {
        if (error) {
            form.setError("answer", {
                message: error
            })
        }
    }, [error, form])

    useEffect(() => {
        inputRef.current?.focus();
        form.reset();

    }, [question?.id, question, form])



    if (!question) return null;






    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <Fragment>
            <Markdown content={question.question} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Enter the answer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} type="submit">Submit</Button>
                </form>
            </Form>
        </Fragment>
    );
};

export default QuestionUI
